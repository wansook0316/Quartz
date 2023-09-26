---
title: Prototype
thumbnail: ''
draft: false
tags: null
created: 2023-09-26
---

GoF의 디자인 패턴, 원형 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-05-Prototype)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 원형이 되는(prototypical) 인스턴스를 사용하여 생성할 객체의 종류를 명시하고, 이를 복사해서 새로운 객체를 생성하는 패턴
  * 즉, **실행중에** 생성된 객체로 다른 객체를 생성하는 패턴
  * 생성된 객체 내부에 `copy()` 메서드를 통해 생성
* Prototype으로 만든 객체의 상태를 변경해도 원본 객체의 상태는 변경되지 않음
  * Deep copy
* 새로운 클래스를 추가하지 않고도 새로운 특징을 가지는 객체를 만들어낼 수 있는 경우 용이하게 사용가능
  * Rectangle == Group(line * 4, point * 4)
  * Triangle == Group(line * 3, point * 3)
  * 이미 만들어진 line, point 객체를 copy하여 group에 넣어 표현 가능
  * 만약 팩토리 방식을 사용한다면 이 모든 것을 정의해두고 만들어야 함, 즉, 서브클래스 개수가 많아짐
  * 즉, **유연성을 보장하는 패턴중 하나임**
* Composite, Decorator 패턴을 매우 많이 사용한 무거운 설계인 경우 Prototype을 적용하여 더 좋게 만들 수 있다.
* 객체 초기화 비용이 아주 비쌀 경우 overhead를 줄여준다.
  * DB에서 값을 읽어와서 초기화해야 하는데 항상 같은 값이 보장되는 경우 인스턴스를 즉시 복사하여 객체를 만들어 냄
* 같은 타입의 여러 객체가 거의 유사한 데이터를 가지고 있는 사용 경우를 최적화
  * 코드양이 줄어들 것임

# 예시

![](DesignPattern_07_Prototype_0.jpg)

* Prototype: 객체로부터 새로운 객체를 생성하게 하기 위한 interface
* Shape: Point, Line, Group의 상위 interface
* Group: Shape을 여러개 포함하고 있으며, 이를 기반으로 모양을 만듦
  * \*: 0~개의 값을 가질 수 있음을 의미
  * 사각형 도형을 Group을 통해 만드는 것을 보여줄 예정
  * 구체적인 사각형 클래스가 없음에도 기존의 point, line 객체를 조합해서 생성할 것
* [코드](https://github.com/wansook0316/DesignPattern-05-Prototype)
  * Class > Pattern 폴더 안에 있는 내용을 위와 같이 구현함

# 활용성

* 제품의 생성, 복합, 표현 방법에 독립적인 제품을 만들고자 할 때 사용
* 인스턴스화할 클래스를 런타임에 지정할 때
* 제품 클래스 계통과 병렬적으로 만드는 팩토리 클래스를 피하고 싶을 때
  * 팩토리 메서드 패턴을 사용해서 처리하고 싶지 않을 때
  * 병렬적 구성으로 하면 클래스가 너무 많이 생김
* 클래스의 인스턴스 들이 서로 다른 상태 조합중에 어느 하나일 때
  * 위의 예시에서 Rect은 line 4개의 Group으로 치환할 수 있음

# 참여자

* Prototype(`Prototype`)
* ConcretePrototype(`Point`, `Line`, `Group`)
* Client(`main` 함수)

# 협력 방법

* client는 prototype에 `clone()` 메서드를 호출한다.

# 결과

## 장점

1. 런타임에 새로운 product를 추가하고 삭제할 수 있다. == 유연하다.
   * 런타임에 `clone()` 호출하여 장난치기
1. 값들을 다양화하여 새로운 객체를 만든다. == 동적 성격을 띈다.
   * Point clone후 값 변경
1. 구조를 다양화함으로써 새로운 객체를 만든다.
   * line을 Group에 추가하여 모든 종류의 다각형 생성 가능
1. 서브 클래스의 수를 줄인다.
   * 팩토리 메서드 패턴을 사용했다면 생성할 모든 종류의 다각형에 대해 타입 명시해야함

## 단점

1. `clone()` 메서드를 구현해야 한다.
   * 이미 잘 만들어져있는 클래스에 이를 추가적으로 구현하기 어려울 수 있다.
   * 죄다 복사해서 리턴해야하기 때문이다.

# 관련 패턴과 차이점

* 추상 팩토리 패턴은 경쟁적인 관계에 놓여있다.
* 하지만 함께 사용될 수도 있다.
* 추상 팩토리 패턴에서 원형 집합을 저장하고 있다가 필요한 시점에 복제하여 원하는 제품을 만들어서 반환할 수도 있기 때문이다.
* 복합체 패턴, 장식자 패턴을 많이 사용해야 하는 설꼐에서 원형 패턴을 사용하면 유용할 수 있다.

# 생각해 볼 점

* 사실 이 Prototype 패턴은, 실질적으로 만들어서 사용할 일이 적다.
* 그 이유는, 이미 대부분의 언어에서 이와 같은 방식을 채택해놓은 것이 많기 때문

## NSCopying

* Swift에서는 위의 Prototype 패턴이 어디에서 사용되었을까?
* `NSCopying`이다.
* 코드에서 Class > NSCopying 내부에 구현해두었다.
* 살펴보면, 코드는 바꾼게 거의 없다.
* 즉, 이미 Prototype 패턴이 적용된 것
* 그리고 가장 처음으로 구현한 것에서는 NSObject를 상속받은 상태에서 시작했는데, 
* 그렇게되면 이미 NSCopying을 채택한 상태에서 시작하기 때문에 사실 맨처음 구현은 중복 구현이다.

## Struct

* 이보다 좋은 방식은 struct를 사용하는 것이다.
* 사실 위와 같이 Prototype 패턴이 사용된 이유는, Class를 기본적으로 사용했기 때문이라 생각한다.
* struct의 경우 `copy` 메서드를 사용할 필요도 없이 복사되는 것이 기본이다.
  * 할당
  * 반환
  * 인자
* 다만 무분별하게 항상 복사된다면 이는 분명한 메모리 낭비이다.
* 그렇기 때문에 나온 개념이 copyOnWrite.
* 실제로 변화가 발생한 시점에 복사를 수행함으로써 메모리를 최대한 아낀다.

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 17. Prototype](https://www.youtube.com/watch?v=UPv8u9ndqAs&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=17)
* [DesignPattern-05-Prototype](https://github.com/wansook0316/DesignPattern-05-Prototype)
* [프로토타입 패턴](https://ko.wikipedia.org/wiki/%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85_%ED%8C%A8%ED%84%B4)
