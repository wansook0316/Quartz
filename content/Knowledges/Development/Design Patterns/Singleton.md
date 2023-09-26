---
title: Singleton
thumbnail: ''
draft: false
tags: null
created: 2023-09-26
---

GoF의 디자인 패턴, 싱글톤 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-06-Singleton)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 다른 클래스에서 접근할 수는 있느나, 생성은 하지 못하게 만드는 패턴
* 오직 하나의 클래스 인스턴스만 제공하고, 전역적인 접근점을 제공함
* swift에서는 `static let`으로 쉽게 처리할 수 있으나, 다른 언어의 경우 instance의 개수를 1개로 보장해주는 방법이 요구됨

# 예시

![](DesignPattern_08_Singleton_0.png)

* 특별한 것은 없다.

````swift
internal class King {

    internal static let shared: King = King()

    private init() { }

    internal func say() {
        print("왕은 하나뿐이야..!")
    }
    
}
````

# 활용성

* 클래스의 인스턴스가 오직 하나여야 함을 보장하고, 잘 정의된 접근점으로 모든 사용자가 접근할 수 있도록 해야할 때
* 그러면서 서브클래싱으로 확장도 될 수 있어야 하며, 사용자는 코드 수정없이 해당 서브클래스 인스턴스를 사용할 수 있어야 할 때

# 참여자

* Singleton(`King`)

# 협력 방법

* 사용자는 Singleton class에 정의된 `instance()` 연산으로 유일하게 생성되는 단일체 인스턴스에 접근한다.
* swift의 경우 일반적으로 `shared`로 정의한 정적 변수로 접근한다.

# 결과

1. 유일하게 존재하는 인스턴스로의 접근을 통제
1. 전역 변수 대비 namespace를 좁히기 때문에 좋다.
1. 연산 및 표현의 변경을 허용한다. 상속이 가능하기 대문이다.
1. 인스턴스의 개수를 변경하기 자유롭다.
   * 기본적으로 `instance()`와 같은 연산으로 하나의 인스턴스를 보장받는다.
   * 여러개가 필요하다면 인스턴스의 개수만 변경해주고 생성된 인스턴스로 접근하도록 구현만 수정해주면 된다.
1. 클래스 연산을 사용하는 것보다 유연한 방법이다.
   * 단적인 예로 swift에서 사용하는 방법은 클래스 정적 변수를 사용해서 접근하는 방식이다.
   * 이럴 경우 인스턴스의 개수를 여러개로 변경하는 것이 어렵다.

# 관련 패턴과 차이점

* 많은 패턴이 싱글톤으로 구현 가능함
* 추상 팩토리, 빌더, 원형 패턴 등등

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 7. Singleton](https://www.youtube.com/watch?v=kAnoWt7Uato&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=4)
* [DesignPattern-06-Singleton](https://github.com/wansook0316/DesignPattern-06-Singleton)
* [싱글턴 패턴](https://ko.wikipedia.org/wiki/%EC%8B%B1%EA%B8%80%ED%84%B4_%ED%8C%A8%ED%84%B4)
