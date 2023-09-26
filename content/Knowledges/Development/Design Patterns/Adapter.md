---
title: Adapter
thumbnail: ''
draft: false
tags: null
created: 2023-09-26
---

GoF의 디자인 패턴, 적응자 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-07-Adapter)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 일상속에서 사용하는 Adapter처럼, 특정 인터페이스를 원하는 인터페이스로 변경해주는 역할을 함
* 이전 클래스의 interface를 그대로 둔 채로, 변환하여 다른 쪽에서도 인터페이스를 변경하지 않고 사용할 수 있음
* 클래스의 인터페이스를 사용자가 기대하는 인터페이스 형태로 적응시킴
* 서로 일치하지 않는 인터페이스를 갖는 클래스를 함께 동작시킴

# 예시

![](DesignPattern_09_Adapter_0.jpg)

* 사용자는 반려 동물을 키운다 (사용한다)
* 그런데 우리가 이전에 만들어놓았던 Tiger라는 클래스가 있다.
* 이녀석 역시 새롭게 만든 animal interface에 소속시키고 싶다.
* 그러자고 Tiger를 변경하자니 일이 너무 커진다.

![](DesignPattern_09_Adapter_1.jpg)

* 이런 경우 Adapter 패턴을 사용할 수 있다.
* `TigerAdapter`라는 구조체를 하나 만들고 `Animal`을 채택한다.
* `TigerAdapter` 내부에는 Tiger 인스턴스를 가지고 있다.
* 이를 기반으로 원하는 인터페이스에 맞는 값을 세팅해주면 끝!
* [코드](https://github.com/wansook0316/DesignPattern-07-Adapter)

# 다른 이름

* Wrapper

# 활용성

* 기존 클래스를 사용하고 싶은데 인터페이스가 맞지 않을 때
* 이미 만든 것을 재사용하고자 하나, 이 재사용 가능한 **라이브러리를 수정할 수 없을 때**
* 책에서는 다중 상속을 사용하는 예를 말하고 있으나, 현재로서는 객체에 대해서만 적용하는 것을 기반으로 생각해야 한다.
  * 죽음의 다이아몬드 문제

# 참여자

* Target(`Animal`)
* Client(`User`)
* Adaptee(`Tiger`)
* Adapter(`TigerAdapter`)

# 협력 방법

* 사용자는 적응자에 해당하는 클래스 인스턴스에 연산을 호출한다.
* 적응자는 해당 요청을 수행하기 위해 적응 대상자의 연산을 호출한다.

# 관련 패턴과 차이점

* 가교(Bridge) 패턴과 유사하다.
* 하지만 사용 목적이 다르다.
* 적응자 패턴: 존재하는 객체의 인터페이스를 변경
* 가교 패턴: 구현과 추상 개념을 분리, 그 결과로 확장성을 높히기 위함
* 장식자 패턴: 인터페이스 변경 없이 새로운 행동 추가 가능토록함
* 프록시 패턴: 다른 객체에 대한 대리인 역할을 수행, 하지만 인터페이스 변경 책임은 없음

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 5. Adapter](https://www.youtube.com/watch?v=kAnoWt7Uato&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=4)
* [DesignPattern-07-Adapter](https://github.com/wansook0316/DesignPattern-07-Adapter)
* [어댑터 패턴](https://ko.wikipedia.org/wiki/%EC%96%B4%EB%8C%91%ED%84%B0_%ED%8C%A8%ED%84%B4)
