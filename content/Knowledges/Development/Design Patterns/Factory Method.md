---
title: Factory Method
thumbnail: ''
draft: false
tags:
- factory-method
- oop
- design-pattern
created: 2023-09-26
---

GoF의 디자인 패턴, 팩토리 메서드 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-04-FactoryMethod)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 객체 생성을 위한 패턴
* 객체 생성에 필요한 과정을 템플릿 처럼 정해놓고, 각 구현을 따로하는 방식으로 다양성을 확보
* 구체적으로 생성할 클래스를 유연하게 정할 수 있음
* **생성에 있어 필요한 인터페이스와 구현을 분리함**
  * 인터페이스가 구현을 전혀 몰라도 됨
  * Package(framwork) 단위로 나누어 분리 후 개발가능
  * 협업의 효율 증대
  * 시스템 기능 확장에도 용이(interface 채택후 구현)
* Virtual Constructor(가상 생성자)라고도 불린다.

# 예시

![](DesignPattern_06_FactoryMethod_0.jpg)

* Factory: Object 생성에 있어 필요한 절차를 정해줌
* Object: 생성될 Object를 동일한 타입으로 처리할 수 있도록 함
* WeaponFactory: 구현체, **각 무기의 생성 개수의 제약을 처리함**
* Sword, Shield, bow: 구현체
* [코드](https://github.com/wansook0316/DesignPattern-04-FactoryMethod)

# 활용성

* 어떤 클래스가 자신이 생성해야 하는 객체의 클래스를 예측할 수 없을 때
  * Weapon는 Weapon인데 어떤 Weapon를 생성하는지에 대해서는 모르거나 몰라도 되는 경우
* 생성할 객체를 기술하는 책임을 서브클래스가 지정했으면 할 때
  * 실제로 Weapon에 대한 책임은 구현체가 담당함
* 객체 생성의 책임을 몇 개의 보조 서브클래스 가운데 하나에게 위임하고, 
  * 이얘기는 생성의 책임을 서브클래스에 주겠다는 것
* 어떤 서브클래스가 위임자인지에 대한 정보를 국소화시키고 싶을 때
  * 생성을 담당하는 클래스를 분리하여 관련 코드를 응집도 높게 관리하고 싶다는 것
  * 만약 이러한 방법이 없다면 생성에 관한 코드는 여기저기 흩어져 있을 것이기 때문

# 참여자

* Product(`Object`)
  * 팩토리 메서드가 생성하는 객체의 인터페이스를 정의
* ConcreteProduct(`Sword`, `Shield`, `Bow`)
  * Product 추상 클래스에 정의된 인터페이스를 구현
* Creator(`Factory`)
  * Product 타입의 객체를 반환하는 팩토리 메서드를 선언
  * 외부에서 사용하는 공통 함수에 대해서는 기본 구현이 들어감(`create(with name: String)`)
* ConcreteCreator(`WeaponFactory`): 팩토리 메서드를 구현

# 협력 방법

* Creator는 자신의 subclass를 통해 실제 필요한 팩토리 메서드를 구현하고, 적절한 ConcreteProduct 인스턴스를 반환함

# 결과

## 장점

1. 인터페이스와 구현의 분리로 유연성 확보
   * 정의한 어떠한 ConcreteProduct 클래스와도 동작 가능
1. 서브 클래스(구현체)에 대한 hook 메서드를 제공
   * 즉, 재정의를 통해 응용성이 높아짐을 의미
   * Hook: 추상 클래스에 들어있는 기본 행동을 정의하는 메서드, 재정의 가능
1. 병렬적인 클래스 계통을 연결하는 역할을 담당
   * 병렬적 클래스 계통: 클래스가 자신의 책임을 분리된 다른 클래스에 위임할 때 발생
   * 즉, 생성의 책임을 분리하는 팩토리 메서드는 병렬적 클래스 계통이 발생한다고 볼 수 있음. 그리고 이 때 유용함
   * 단적인 예로 키노트와 같은 애플리케이션에서 선, 글씨를 조작하는 상황을 생각해보겠음
   * 각각의 Figure(선, 글씨)에 대한 마우스 조작(더블 클릭, 드래그, 우클릭 등)은 정해져있으나, 그에 대한 동작은 다를 것임
   * 이런 경우, 각 Figure에 대한 Manipulator를 쌍으로 두는 것이 바람직 함
   * 이 때, 이 Manipulator를 생성하는 책임을 팩토리 메서드로 구현했다고 가정해보자.
   * 그렇다면 Figure의 클래스 계통이 커지면 Manipulator의 클래스 계통 역시 커지는, 병렬적 클래스 계통이 발생하게 됨
   * 이 때, Manipulator에 팩토리 메서드를 적용했기 때문에 이 사이를 연결하는 역할을 담당하게 됨

![](DesignPattern_06_FactoryMethod_1.png)

## 단점

1. ConcreteProduct가 한개 밖에 없는 팩토리인데 Creator를 구현하는 팩토리를 만들어야 하는가?

# 관련 패턴과 차이점

* [Abstract Factory](Abstract%20Factory.md) 패턴은 이 팩토리 메서드를 이용해서 구현할 때가 많음
* 팩토리 메서드는 [Template Method](Template%20Method.md) 패턴에서도 사용될 때가 많음

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 10. Factory Method](https://www.youtube.com/watch?v=_GCiJAFU2DU&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=18)
* [DesignPattern-04-FactoryMethod](https://github.com/wansook0316/DesignPattern-04-FactoryMethod)
