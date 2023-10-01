---
title: RIB Structure
thumbnail: ''
draft: false
tags:
- RIBs
- architecture
- dependency-injection
- DI
created: 2023-10-01
---

# 간단한 구조

![](TechTalks_16_RIBS_0.png)

일단 RIB의 구조는 위와 같다.

* 노란색 직사각형: RIB 내부에서 사용하는 Protocol
* 빨간색 직사각형: RIB 외부와 통신하기 위해 사용하는 Protocol
* 둥근 직사각형: Class

둥근 직사각형 (Router, Builder, Interactor, View) 근처에 있는 Protocol은 해당 파일 내에 작성되게 되어 근처에 배치하였다. 이제 요소 하나하나에 대해 간단하게 설명해보겠다.

# Builder

![](TechTalks_16_RIBS_1.png)

해당 RIB이 가지는 의존성을 받고, `build()` method를 통해 동적으로 적용되어야 하는 의존성을 받영하고 내부 Component를 생성하고 의존성을 주입하는 역할을 담당한다. 우리가 앱을 만들 때, View tree를 따라서 해당 로직들이 위치했었다. 최종적으로 보이는 화면은 이전에 방문했던 View들에 대해 의존성을 갖고서 만들어지게 된다. 이런 의존성을 담당하는 것이 Builder이다.

그런데 의존성에는 정적 의존성, 동적 의존성 두가지 분류가 존재한다. 정적 의존성은 단순히 특정 component를 생성하는데 있어 외부 요소나 계산된 결과가 필요없이도 만들어질 수 있는 경우다. 예를 들어, A화면에서 B화면으로 이동하는데 있어 A가 가지고 있는 정보 그대로를 넣어주는 것으로 끝난다면 이 경우 정적 의존성을 가진다 할 수 있을 것이다. 그럼 동적 의존성은 무엇일까? 특정 action의 결과를 기반으로 다른 component가 생성되어야 하는 경우를 말한다. 예를 들어, A 화면에서 사용자 정보를 받고 이를 기반으로 B화면이 만들어져야 한다면, 이는 A화면에 submit이 된 이후에 해당 값을 같이 넣어주어 B를 만들어야 할 것이다. 이런 경우를 동적 의존성을 가진다라 할 수 있을 것이다.

Builder에서는 정적 의존성의 경우 `component`를 통해 넣어주고, 동적 의존성의 경우 `build()` 함수의 인수로 넣어줌으로서 이를 가능케한다. `build()` 함수에서 실제로 RIB의 구성요소가 모두 생성되고 의존성이 주입되기 때문에, 이 시점에 넣어서 처리하는 것이 가능하다.

Builder instance 자체는 추후 설명할 Router가 가지고 있다. 잠깐 설명하면, Router는 정적 의존성이 주입된 Builder instance를 생성시 가지고 있다가, Interactor가 하위 RIB을 생성하라는 명령을 받는 시점에 하위 Builder의 `build()` 함수를 호출한다.

## Component

Builder에 동적 의존성을 넣어주는 요소이다. 하위 RIB의 Builder는 `self.dependency`를 통해 상위 RIB의 dependency에 접근할 수 있다. (정적 의존성) 하지만 해당 Type은 하위 RIB에서 사용하는 `ChildDependency`라는 Protocol로 interface를 분리해서 관리하고 있기 때문에, 상위 dependency 구현체에 막 접근해서 사용은 불가능하다. 만약 사용하고 싶다면 `ChildDependency`에 내가 사용하고 싶은 변수를 정의해야 접근 가능하다.

````swift
// 상위 RIB
protocol RootBuildable: Buildable {
    func build() -> LaunchRouting
}

final class RootBuilder: Builder<RootDependency>, RootBuildable {

    override init(dependency: RootDependency) {
        super.init(dependency: dependency)
    }

    func build() -> LaunchRouting {
        let viewController = RootViewController()
        let component = RootComponent(dependency: dependency,
                                      rootViewController: viewController)
        let interactor = RootInteractor(presenter: viewController)

        // 하위 RIB의 Builder를 생성할 때, Builder가 가지고 있는 dependency를 넣어준다.
        let loggedInBuilder = LoggedInBuilder(dependency: component) 
        
        // 상위 RIB의 Router에서 하위 RIB의 Builder를 가지고 있다.
        let router = RootRouter(interactor: interactor,
                                viewController: viewController,
                                loggedInBuilder: loggedInBuilder) 
                                

        return (router, interactor)
    }
}

// 하위 RIB: 이해를 돕기 위한 Protocol과 생성자만 가져옴, 자세한 사항은 Tutorial 진행

protocol LoggedInDependency: Dependency {
    var loggedInViewController: LoggedInViewControllable { get }
}

final class LoggedInBuilder: Builder<LoggedInDependency>, LoggedInBuildable {

    // 생성될 때 상위 RIB의 dependency를 받았으나, interface가 LoggedInDependency이기 때문에 접근이 제한된다.
    override init(dependency: LoggedInDependency) {
        super.init(dependency: dependency)
    }

}
````

이렇게 상위 RIB의 dependency를 Builder가 가지고 있음에도 불구하고, 만약 동적 의존성이 필요하다면 이 방법으로는 부족하다. 이를 위해 만들어진 것이 Component이다. 하위 RIB이 만들어질 때, 상위 RIB의 Router에서 instance로 가지고 있는 하위 RIB의 `build()` 함수를 호출하게 되는데, 이 때, 동적으로 발생한 값(의존성)을 `build(player1, player2)`와 같은 형식으로 넣어준다. 그리고 하위 RIB에서는 해당 값을 받아 Component를 생성하여 의존성을 해결한 RIB 내부 요소를 만든다.

````swift
// 이해를 위해 구체 사항은 제외하고 핵심만 가져왔다.

// 상위 RIB은 Interactor의 요청에 따라 Router에서 하위 RIB을 build한다.
final class RootRouter: LaunchRouter<RootInteractable, RootViewControllable>, RootRouting {

    func routeToLoggedIn(withPlayer1Name player1Name: String, player2Name: String) {
        
        // build에 동적으로 반영되어야 하는 값이 필요한 경우 넣어 보낸다.
        let loggedIn = loggedInBuilder.build(withListener: interactor, 
                                             player1Name: player1Name, 
                                             player2Name: player2Name)
        attachChild(loggedIn.router)
    }
}
// MARK: - Builder

protocol LoggedInBuildable: Buildable {
    func build(withListener listener: LoggedInListener, player1Name: String, player2Name: String) -> (router: LoggedInRouting, actionableItem: LoggedInActionableItem)
}

final class LoggedInBuilder: Builder<LoggedInDependency>, LoggedInBuildable {

    func build(withListener listener: LoggedInListener, player1Name: String, player2Name: String) -> LoggedInRouting {

        // build 함수 안에서 Component를 생성하여 새로운 의존성 요소를 만든다.
        let component = LoggedInComponent(dependency: dependency,
                                          player1Name: player1Name,
                                          player2Name: player2Name)
        let interactor = LoggedInInteractor(games: component.games)
        interactor.listener = listener

        let offGameBuilder = OffGameBuilder(dependency: component)
        let router = LoggedInRouter(interactor: interactor,
                                    viewController: component.loggedInViewController,
                                    offGameBuilder: offGameBuilder)
        return (router, interactor)
    }

}
````

실제 Component는 이렇게 생겼다.

````swift
final class LoggedInComponent: Component<LoggedInDependency> {

    fileprivate var loggedInViewController: LoggedInViewControllable {
        return dependency.loggedInViewController
    }

    fileprivate var games: [Game] {
        return shared {
            return [RandomWinAdapter(dependency: self), TicTacToeAdapter(dependency: self)]
        }
    }

    internal let player1Name: String
    internal let player2Name: String

    init(dependency: LoggedInDependency, player1Name: String, player2Name: String) {
        self.player1Name = player1Name
        self.player2Name = player2Name
        super.init(dependency: dependency)
    }
}
````

여기서 주목할 점은, component의 변수를 처리하는 방식이다. 실제로 사용하는 변수만 적고, 접근 제어자를 통해 명시적으로 변수 사용을 관리하는 것이 좋다.

# Interactor

![](TechTalks_16_RIBS_2.png)

Interactor는 RIB의 Business logic이 담기는 곳이다. 세개의 Protocol을 기본으로 갖는다.

1. Listener의 경우 상위 RIB과 통신하기 위한 Interface이다. 해당 Listener는 상위 RIB의 Interactor가 채택하고 있다.
1. Routing의 경우 Router에 요청하기 위한 것들이 나열되어 있다.
1. Presentable의 경우 View에 요청하기 위한 것들이 나열되어 있다.

# View

![](TechTalks_16_RIBS_3.png)

View는 View와 View Controller 모두를 가리킨다. 다른 아키텍쳐 패턴에서 처럼 View는 멍청하다. 단순히 그리는 용도로만 사용한다. View에서 변경된 사항을 알리기 위해서 `PresentableListner`를 채택한 곳으로 메시지를 보낸다. 기본적으로는 Interactor가 그 역할을 한다.

# Router

![](TechTalks_16_RIBS_4.png)

Router는 Interactor의 요청을 받아 RIB을 Attach, Detach하는 역할을 담당한다. `Interactable`은 Interactor가 채택하는 Protocol로, 하위 RIB의 Interactor의 Listener, Router가 Interactor에 요청해야 하는 요소들을 모두 채택하고 있다.

`ViewControllable`은 View 요소의 transition에 관련된 것들을 정의한 Protocol이다. RIB Attach, Detach시 발생하는 transition을 처리하기 위해 가지고 있으며, 해당 Protocol은 View가 준수하고 있다.

````swift
protocol LoggedInInteractable: Interactable, OffGameListener, GameListener {
    var router: LoggedInRouting? { get set }
    var listener: LoggedInListener? { get set }
}

protocol LoggedInViewControllable: ViewControllable {
    func replaceModal(viewController: ViewControllable?)
}

final class LoggedInRouter: Router<LoggedInInteractable>, LoggedInRouting {

    // MARK: - LoggedInRouting

    func cleanupViews() {
        if currentChild != nil {
            viewController.replaceModal(viewController: nil)
        }
    }

    func routeToOffGame(with games: [Game]) {
        detachCurrentChild()
        attachOffGame(with: games)
    }

    func routeToGame(with gameBuilder: GameBuildable) {
        detachCurrentChild()

        let game = gameBuilder.build(withListener: interactor)
        self.currentChild = game
        attachChild(game)
        viewController.replaceModal(viewController: game.viewControllable)
    }
    ...
}

````
