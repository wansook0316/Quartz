---
title: Communicate with RIB
thumbnail: ''
draft: false
tags:
- RIBs
- listener
created: 2023-10-01
---

# RIB과 통신하기

생성시에 어떠한 흐름으로 동작하는지 알았다면, 이번에는 RIB간의 소통을 알아볼 차례다. 일단 위에서 하위 RIB의 `Interactor`가 `Listener`라는 Protocol의 요소를 채우고, 상위 RIB의 `Interactor`가 이를 채택하고 있다고 했던 것을 기억해보자.

````swift
// OffGameInteractor
protocol OffGameListener: AnyObject {
    func startGame(with gameBuilder: GameBuildable)
}

// GameInteractor
public protocol GameListener: AnyObject {
    func gameDidEnd(with winner: PlayerType?)
}

// LoggedInInteractor
protocol LoggedInInteractable: Interactable, OffGameListener, GameListener {
    var router: LoggedInRouting? { get set }
    var listener: LoggedInListener? { get set }
}

final class LoggedInInteractor: Interactor, LoggedInInteractable {

    // MARK: - OffGameListener
    func startGame(with gameBuilder: GameBuildable) {
        router?.routeToGame(with: gameBuilder)
    }

    // MARK: - GameListener
    func gameDidEnd(with winner: PlayerType?) {
        router?.routeToOffGame(with: games)
    }

}
````

이해를 돕기 위해 하나의 위치에 여러 파일에 있던 Listener들을 가져왔다. 또 실제 tutorial과는 약간은 다를지 모른다. 하지만 위와 같은 방식으로 동작한다. 하위 RIB에서 통신하고 싶은 것들이 있다면 `Listener`에 정의하고, 이를 상위 RIB의 `Interactable` Protocol이 채택하도록 하고, 결과적으로 이 `Interactable` 프로토콜을 `Interactor`가 준수하도록 하여 통신을 가능하도록 한다.

![](TechTalks_16_RIBS_6.png)

그럼 그림을 통해 따라가면서 머릿속에 구체화작업을 해보자. Child RIB에서 로그인 버튼을 눌렀고, Another RIB에 있는 화면이 띄워져야 하는 상황이다. 

1. Child RIB의 View에서 Interaction이 일어난다. `PresentableListener`를 준수하고 있는 `Interactor`에 있는 method를 호출한다. 
1. Interactor는 해당 요청은 상위 RIB에서 처리해야 하므로 `Listener` Protocol을 준수하고 있는 부모 RIB의 `Interactor` 구현체에 요청한다.
1. Parent RIB의 `Interactor`는 이를 준수하고 있기 때문에 요청을 받아 처리한다.
1. 로직을 수행한 후, Router에게 하위 RIB으로 가야한다고 알린다.
1. Router는 Child RIB을 detach한다. (이 때, Child RIB을 만들었을 때 받은 router 객체를 넣어 해제한다.)
1. View에 현재 보여지고 있는 화면을 dismiss 해야 한다고 요청한다.
1. Another RIB을 만들고 Attach한다.
1. 이 때, 동적 의존성이 필요하다면 `build()` 함수의 인수로 넣어 보낸다.
1. Another RIB의 Builder는 component를 만들고, View를 만든다.
1. 만든 View를 Interactor에 주입하고 Router도 만든다.
1. Router는 생성되는 시점에 View의 present를 호출한다.
