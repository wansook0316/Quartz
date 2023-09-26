---
title: Bridge
thumbnail: ''
draft: false
tags: null
created: 2023-09-26
---

GoF의 디자인 패턴, 가교 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-08-Bridge)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 기능과 구현의 분리를 통해 시스템의 확장성과 유지보수성을 높이는 패턴
* 기존 시스템에 새로운 기능을 추가해도 어떠한 변경도 없이 추가가 가능하다.
* 특정 상황에 따라 달라져야 하는 구현을, 인자와 같은 형태로 받아서 동작을 요청하여 확장성을 제고하는 방법
* 두개의 개념이 독립적으로 확장되면서 서로에게 연관이 있는 경우 생각해볼만 함

# 설명

* 기능 계층
  * 새로운 기능을 위한 메서드를 추가할 수 있는 클래스들
* 구현 계층
  * 이미 정해진 인퍼페이스에 대한 구현 클래스들

이 두 계층 사이에 다리를 놓는 것과 같은 방식의 패턴을 가교 패턴이라 한다.

# 예시

![](DesignPattern_10_Bridge_0.jpg)

## 첫번째

* `Draft`는 아직 출간되지 않은 글을 말함
* 해당 `Draft`를 출력하기 위해 `Display` interface를 채택하고 있는 구현체를 받음
* `Draft` 구현체는 이 `Display` 구현체에 요청하여 실질적으로 출력을 요청함
* 만약 다른 방식으로 출력하고 싶다면, `Display` 를 채택한 다른 구현체를 넣어버리면 됨
* 이러한 점에서 **구현이 독립되어 있다는 점**을 알 수 있음

````swift
    let draft = Draft(title: "비트코인은 무엇인가",
                      author: "최완식",
                      contents: ["사토시", "사카모토", "암호화폐"])

    // 출력을 담당하는 구현체를 넣어줌
    let simpleDisplay = SimpleDisplay()

    // 실질적인 구현은 Display가 하고 있음
    draft.describe(display: simpleDisplay)

    // 다른 방식으로 출력하고 싶다면 다르게 구현한 녀석을 넣어주면 됨
    let captionDisplay = CaptionDisplay()

    draft.describe(display: captionDisplay)
````

## 두번째

* 이 상황에서 요구사항이 추가되었을 때 어떻게 되는지 보자.
* `Publication` 객체는 `Draft`를 상속받아 출판사, 가격을 가지고 있으며, 이를 출력해야 한다.
* 그러면서 기존의 Draft가 가지는 기능은 유지해야 한다.
* Draft의 기능은 핵심이고, 추가적으로 달라붙는 것은 부가적이라 생각해보자.
* 이런 경우, Draft에 맞춰져 있는 기능은 그대로 둔 상태에서, 부가적인 부분만 출력할 때 넣어주면 된다.

````swift
    // Publication
    let publication = Publication(title: "나도 책 쓸 수 있다",
                                  author: "최완식",
                                  contents: ["야", "너도", "책 쓸 수 있어"],
                                  publisher: "동아출판",
                                  cost: 39000)

    // display 객체도 재활용이 가능하다.
    publication.describe(display: captionDisplay)

````

````swift
internal class Publication: Draft {

    internal let publisher: String
    internal let cost: Int

    internal init(title: String,
                           author: String,
                           contents: [String],
                           publisher: String,
                           cost: Int) {
        self.publisher = publisher
        self.cost = cost

        super.init(title: title,
                   author: author,
                   contents: contents)
    }

    private func describePublicationInfo() {
        print("# \(self.publisher)  $ \(cost)")
    }

    // 기본 Draft의 기능은 똑같이 유지하면서, 해당 클래스가 가지는
    // 추가적인 특징만을 넣었음
    internal override func describe(display: Display) {
        super.describe(display: display)

        self.describePublicationInfo()
    }
}
````

# 다른 이름

* Handle/Body(핸들/구현부)

# 동기

* 하나의 추상적 개념(`Display`)이 여러가지 구현(`SimpleDisplay`)으로 나올 경우 대부분은 상속을 사용한다.
* 하지만 상속은 충분한 융통성을 가지기 어렵다.
* **상속은 구현과 추상적 개념을 영구적으로 종속시키기 때문이다.**
* 그렇기 때문에 추상적 개념과 구현을 분리하여 수정, 확장하기 어렵다.

![](DesignPattern_10_Bridge_1.png)

* 화면에 다양한 요소를 그릴 수 있는 Window 클래스를 생각해보자.
* A, B, C 플랫폼 모두 결국 Window 클래스 내부에서 그리고자하는 행위는 동일하다.
* 하지만 구현은 다를 수 있다.
* 이러한 점에서 상속을 사용해보자.
* 초기 `AWindow`, `BWindow`, `CWindow`를 만드는데는 큰 문제가 안생긴다.
* 그런데, 만약 `IconWindow`라는게 생겼다.
* 일단 이녀석도 Window니, Window를 상속해서 만들었다.
* 그런데, `A`, `B` 모두에서 사용가능해야 한다는 점을 깨달았다.
* 이렇게 되면 IconWindow를 상속해서 각각의 플랫폼에 맞는 구현을 처리할 수 밖에 없다.
* `IconWindow`이외에 다른 녀석들도 막 추가된다면 어떨까? 지옥이 시작된다.
* 즉, **특정한 구현이 발생한다. 코드가 플랫폼에 종속된다.**
* 윈도우 구현만 종속적이면 되는데, 나머지 코드까지 종속되게 된다.

![](DesignPattern_10_Bridge_2.png)

* 이런 경우, 구현체를 넣어 해결하는 방식을 사용할 수 있다.
* 즉, 왼쪽에 위치한 기능 계층에서는 공통된 기능에 대해 넣고,
* 실질적으로 동작은 구현체를 넣어 동작을 돌려버리는 것이다.
* 잘 보면, `IconWindow`의 경우 `Drawborder`라는 함수가 있는데, 이 실질 동작은
* `WindowImp`의 구현체를 받아 처리하고 있다. 각 플랫폼에 맞는 구현체를 넣으면 끝나는 것이다.
* 즉, 각 플랫폼에 따라 달리 만들어져야 하는 구현 부분을 `WindowImp`로 추상화하여 분리함으로서 유연성을 확보했다.

# 활용성

* 추상적 개념과 구현 사이의 지속적인 종속 관계를 피하고 싶을 때
  * 런타임에 구현 방법을 선택 (예시: Display 방식 변경 가능)
* 추상적 개념과 구현 모두가 독립적으로 서브 클래싱을 통해 확장되어야 할 때
  * Window도 새로운 component 추가를 위해 확장되어야 함
  * 새로운 플랫폼에 따라 다른 구현이 필요하여 확장해야 함
  * **각각에 대해 독립적인 확장이 가능**
* 추상적 개념에 대한 구현 내용을 변경하는 것이 다른 관련 프로그램에 영향을 주지 않아야 할 때
  * `Publication`이 생길 때, 다른 부분의 코드 변경이 없었음

# 참여자

* Abstraction(`Document`): 추상적 개념에 대한 인터페이스 제공
* RefinedAbstraction(`Draft`): 추상적 개념에 대한 인터페이스 구현
* Implementor(`Display`): 구현 클래스에 대한 인터페이스 제공
* Concreteimplementor(`SimpleDisplay`, `CaptureDisplay`): Implementor 인터페이스 구현, 실질적인 구현 내용

# 협력 방법

* Abstraction 클래스가 사용자의 요청을 Implementor객체에 전달한다.
  * 예시의 경우 인자로 받아 요청을 전달했음

# 결과

1. 인터페이스와 구현 분리
   * 어떤 방식의 구현을 택할 것인지 런타임에 결정 가능!
1. 확장성 제고
   * Abstraction과 Implementor를 독립적으로 확장할 수 있다.
1. 구현 세부 사항을 사용자에게서 숨기기

# 관련 패턴과 차이점

* 추상 팩토리: 특정 Bridge를 생성하고 복합할 수 있도록 사용 가능
* 적응자: 관련 없는 클래스들이 함께 동작하게 하기 위해 특화된 패턴, 클래스 설계가 끝나고 사용됨
* 가교: 설계 초기 단계에 추상화 및 구현이 독립적으로 다양화되도록 만들 때 쓰인다.

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 6. Bridge](https://www.youtube.com/watch?v=IJ96VeNPTyM&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=5)
* [DesignPattern-08-Bridge](https://github.com/wansook0316/DesignPattern-08-Bridge)
* [Bridge pattern](https://en.wikipedia.org/wiki/Bridge_pattern)
