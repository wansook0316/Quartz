---
title: About Dependency Injection
thumbnail: ''
draft: false
tags:
- ios
- boost-camp
- dependency-injection
- DI
created: 2023-10-04
---


 > 
 > 다양한 의존성 주입 방법을 고려하고, 최종적으로 ViewController에 생성자 주입 방식을 통해 컴파일 타임에 주입 여부를 판단할 수 있도록 변경하였습니다.

![](Pasted%20image%2020231004195753.png)

* 초기에 작성한 의존성 주입이라고 착각한 코드입니다.
* 내부에서 생성을 하고 있기 때문에, 인터페이스를 분리한 이유가 전혀 없는 코드입니다.

![](Pasted%20image%2020231004195805.png)

* 메소드로 해당 내부 프로퍼티에 주입하는 방식으로 변경했습니다.
* 하지만 여전히 해당 메서드가 호출되는지 컴파일 타임에 확인할 수 없다는 문제가 발생했습니다.

![](Pasted%20image%2020231004195819.png)

* 이에 생성자를 통해 주입하는 방식을 시도했습니다.
* 하지만, 사용하는 다른 개발자가, 단순 생성을 했을 시, 뷰모델 주입이 필수적인지 알 수 없습니다.
* 이를 fatal error로 막았으나, 여전히 컴파일 타임에 알 수 없다는 점은 동일합니다.

![](Pasted%20image%2020231004195835.png)

* 최종적으로, Coder를 통해 생성하는 경우 자체를 컴파일 타임에 막기 위해 `available` 태그를 추가했습니다.

![](Pasted%20image%2020231004195849.png)

* 결과적으로, DIViewController라는 요소를 만들고, ViewModel이 필요한 경우 해당 VC를 상속하여 구현했습니다.
* 제네릭을 사용하여 어떤 타입이든 가능하도록 하였습니다.
* 스토리 보드를 사용한 경우, iOS13 이후 부터는 아래와 같은 방식으로 사용이 가능합니다.

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

````swift
let storyboard = UIStoryboard(name: "Main", bundle: nil)
let viewModel = storyboard.instantiateInitialViewController { coder -> RoomListViewController in
    let viewModel = DefaultRoomListViewModel(usecase: RoomListUseCase(repository: RoomListRepository(service: FirebaseService.shared)))
    return .init(coder: coder, viewModel: viewModel) ?? RoomListViewController(viewModel: viewModel)
}
````

* 결과적으로, ViewController를 생성 시점에 의존성 주입을 하는 방식을 도입하여, 컴파일 타임에 주입 여부를 확인할 수 있도록 변경하였습니다.

## 의존성 주입의 방법과 의사결정 과정

* 의존성 주입의 방식에는 크게 4가지가 있다.
* 프로퍼티 주입 & 메서드 주입
  * 메서드를 사용해서, 혹은 프로퍼티를 적용해서 의존성을 주입하는 방법이다.
* 생성자 주입
  * 생성자만 보고 의존성을 파악할 수 있게 된다.
  * A와 B가 서로 알아야 하는 경우 문제가 발생한다.
  * 이럴 경우 생성자 주입 방식으로 서로의 의존성을 주입하는 것이 불가능하여, 메서드 혹은 프로퍼티 주입 방식을 쓰는 것이 보다 깔끔한 방법일 수 있다.
  * 가장 깔끔한 방식이나 까다로울 수 있다.
* 서비스 로케이터 패턴 (안티 패턴)
  * 모든 의존성을 알고 있는 locator 객체가 있고, 이 해당 객체에 요청하여 의존성을 해결하는 방법이다.
    * 생성자만 보고, 의존성을 파악할 수 없다는 단점이 있다.
    * 또한 locator 자체에 의존하게 된다.
    * 해당 클래스에서 요청을 하는 형태이기 때문에 외부에서 mock 객체를 갈아끼워 넣어서 테스트하는 것이 불가능해 졌다.
    * 따라서 안티 패턴이다.

이중, 우리 프로젝트의 경우 서로 의존성을 주입해야 하는 상황이 발견되지 않기 때문에, 생성자 주입 방식을 도입하는 것이 가장 합리적인 판단이라고 생각한다.
