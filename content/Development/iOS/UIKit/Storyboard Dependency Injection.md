---
title: Storyboard Dependency Injection
thumbnail: ''
draft: false
tags:
- swift
- dependency-injection
- DI
- storyboard
- service-locator-pattern
created: 2023-10-01
---

아무 생각없이 코딩하다가(~~...~~) 의존성 주입을 그냥 property 주입으로 하고 있었다. 당연히 Storyboard면 안되지 않았었나? 하는 무지성 코드질을 하다 지적받고 떠올랐다.. 과거의 내가 이미 그짓거리를 공부했다는 것을!

블로그 이전하면서 다시 정리해둬야 겠다는 생각을 했다. 역시 참 잘 잊어버린다..

# Trial & Error in Dependency Injection

일단 의존성 주입에 어떤 방식이 있는지 부터 알아보자. 단계별로 시행착오를 겪었던 것을 나열해보겠다. 그 과정에서 어떤 점이 좋고 나쁜지에 대해 이해하는 것이 중요하다. 처음 배울 때 했던 추억까지 같이 정리해보겠다.

# Bad Way

처음에 한 방법이다. 그 당시에 나는 의존성 주입이 뭔지도 몰랐던 것 같다. 그냥 로직을 분리하기만 하면 다라 생각했다. 하지만 이런식의 접근은 정말 단순히 "분리"에만 의미를 두었을 뿐, 기존 코드와 달라지는 것이 없다. 이렇게 하면 빵점이다.

# Property & Method Injection

![](UIKIt_15_StoryBoard_Dependency_Injection_0.png)

이제부터 그나마 injection이라 부를 수 있는 수준의 방법이다. 외부에서 사용하고자 하는 객체를 생성하고 이를 밀어넣어 최종 객체를 만들어 낸다. 이 때, property injection은 말그대로 instance의 property에 접근해서 넣어버리는 것을 말한다. method는 method로 이를 감싸는 것을 말한다.

차이가 있다면, property injection의 경우 property의 access control을 `internal`로 열어두어야 한다는 점이다. 반대로 method injection은 property의 access는 `private`하게 둘 수 있다. 하지만 함수 길이가 길어진다. 그래서 이 부분은 개인의 판단에 맡겨야 한다.

그럼 이 방식의 단점에 대해 생각해보자. 일단 **컴파일 타임에 주입 여부 확인이 불가**하다. 이게 맹점인데, 사실 개발자는 컴파일 타임에 대부분 잡혀주면 땡큐다. 런타임에 에러나면 아우 머리아프다.. 그래서 이 방식이 마음에 안들었었다.

# Service Locator Pattern

그 다음에는 이녀석이 있다. 결론 부터 말하면 이녀석은 Anti Pattern이다. 아직 제대로 공부해보지 못해 내 언어로 이해되지는 않았다. 추구 Tech Talk 게시글에서 만나보게 될거다. 

간단하게 말해보자면, 모든 의존성을 알고 있는 Locator 객체에 의존성 주입을 의존하는 (?) 방법이다. 말이 참.. 쉽게 말하면 이 녀석한테 "야야 나 의존성좀 해결해야 하는데, 뭐로 넣어야 하냐?" 라고 물어보면 이녀석이 답을 알려주는 거다. 그렇다 약간의 싱글톤과 같은 냄새.. 전역 객체다.

일단 해당 방법을 사용했을 때, 직관적으로 발생하는 문제들은 다음과 같은 것들이 있다.

1. 생성자만 보고 의존성을 파악할 수 없다.
1. Locator에 의존하게 된다.
1. Class에서 요청을 하는 형태이기 때문에, 외부에서 mock 객체를 갈아 끼워서 테스트 하는 것이 불가하다.

# Initialization Injection

![](UIKIt_15_StoryBoard_Dependency_Injection_1.png)

가장 마음에 드는 방식이다. 생성자만 보고 의존성을 파악할 수 있다. 다만, A, B 두개 이상의 객체가 서로를 알아야 하는 상황이라면 문제가 발생한다. 이런 경우는 Property & Method injection을 사용하는 것이 깔끔할 수 있다.

````swift
let a = A(b: )
let b = B(a: )

// ..? 진행할 수가 없다. 순환이다..

let a = A()
let b = B()
a.b = b
b.a = a

// Property & Method injection이 깔끔하다.
````

샛길로 빠졌다. 일단 위의 사진의 경우는 Code로만 injection을 한다는 가정에서 진행한 것이다. 하지만 이렇게 하면 Compile Time에 injection을 확인할 수 없다.

![](UIKIt_15_StoryBoard_Dependency_Injection_2.png)

그래서 이렇게 접근 못하도록 막으면, 비로소 초기화 시기에 의존성 주입을 강제하면서 행복한 상황을 만들 수 있다.

![](UIKIt_15_StoryBoard_Dependency_Injection_3.png)

더 나아가면, 코드로만 하면 이렇게 추상화 해서 사용하면 더 편하다.

하지만 우리가 해야 하는 것은 Storyboard를 사용하면서 initializer로 injection을 하고 싶은 것이다! 어떻게 하지!

# Storyboard?!

기존에 사용하던 친구는 이런 녀석이었다.

````
func instantiateInitialViewController() -> UIViewController?
````

그래서 실제 코드를 보면,

````swift
guard let controller = UIStoryboard(name: "Folder").instantiateInitialViewController() as? FolderViewController else {
    return
}

controller.viewModel = FolderViewModel()
````

이런식으로 처리했다. Bundle에서 로드한 후에 property & Method 주입이 최선이었다! 그런데 iOS 13부터 새로운 API가 제공되었다.

# New APIs!

![](UIKIt_15_StoryBoard_Dependency_Injection_4.png)

여기서 하위 3인방이 iOS 13부터 새로생긴 API이다! 여기서 가장 관심이 가는 녀석은 이녀석이다.

````swift
@MainActor func instantiateViewController<ViewController>(identifier: String, creator: ((NSCoder) -> ViewController?)? = nil) -> ViewController where ViewController : UIViewController
````

저 `@MainActor`는 뭐지..? 추후 알아보자. 일단은 identifier와 coder를 받아 ViewController를 리턴하는 클로저를 제공하면 내가 원하는 ViewController를 주는 녀석이다. identifier는 storyboard에서 특정 VC를 클릭했을 때 정할 수 있는 문자열을 말한다. 

![](UIKIt_15_StoryBoard_Dependency_Injection_5.png)

바로 이녀석이다. 왜 이녀석이 있으면 Storyboard를 사용함에도 의존성 주입이 가능할까?

# Dependency Injection with Storyboard

````swift
import UIKit

class FolderViewController {
    var viewModel: T

    init(viewModel: T) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil) // code로 VC를 생성하는 경우 nib, bundle 모두 불필요
    }

    init?(coder: NSCoder, viewModel: T) {
        self.viewModel = viewModel
        super.init(coder: coder)
    }

    @available(*, unavailable, renamed: "init(coder:viewModel:)")
    required init?(coder: NSCoder) {
        fatalError("Invalid way of decoding this ViewController")
    }
}
````

일단 이렇게 coder와 viewModel 둘다 받을 수 있게 만들어 두자. 그리고 실제 이녀석을 instance화 하는 곳에서 다음과 같이 사용하자.

````swift
let storyboard = UIStoryboard(name: "Main", bundle: nil)
let viewModel = storyboard.instantiateInitialViewController { coder -> FolderViewController in
    let viewModel = DefaultRoomListViewModel()
    return .init(coder: coder, viewModel: viewModel) ?? FolderViewController(viewModel: viewModel)
}
````

아아 드디어 우리가 원하는 목표를 달성했다! 여기서 generic까지 추가하여 사용한다면, 다음과 같이 되겠다.

````swift
import UIKit

class DefaultDIViewController<T>: DefaultViewController {
    var viewModel: T

    init(viewModel: T) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil) // code로 VC를 생성하는 경우 nib, bundle 모두 불필요
    }

    init?(coder: NSCoder, viewModel: T) {
        self.viewModel = viewModel
        super.init(coder: coder)
    }

    @available(*, unavailable, renamed: "init(coder:viewModel:)")
    required init?(coder: NSCoder) {
        fatalError("Invalid way of decoding this ViewController")
    }
}
````

# Reference

* [UIStoryboard](https://developer.apple.com/documentation/uikit/uistoryboard)
* [instantiateInitialViewController()](https://developer.apple.com/documentation/uikit/uistoryboard/1616213-instantiateinitialviewcontroller)
* [instantiateViewController(identifier:creator:)](https://developer.apple.com/documentation/uikit/uistoryboard/3213989-instantiateviewcontroller)
* [서비스 로케이터는 안티패턴이다](https://edykim.com/ko/post/the-service-locator-is-an-antipattern/)
