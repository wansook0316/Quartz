---
title: Mediator
thumbnail: ''
draft: false
tags: null
created: 2023-09-26
---

GoF의 디자인 패턴, 중재자 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-18-Mediator)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 객체들 간의 복잡한 관계를 중재자라는 것을 두어 매우 효과적으로 단순화시킨다.

# 예시

![](DesignPattern_20_Mediator_0.png)

* 에어컨, 문, 창문, 보일러가 있다고 하자.
* 문, 창문이 열려 있다면 닫고 에어컨을 틀어야 한다.
* 보일러를 틀고 싶다면 문, 창문을 닫고 틀어야 한다.
* 환기를 하고 싶다면 문, 창문을 둘다 열어야 한다.
* 이렇게 객체간의 연결된 작업이 필요할 경우, 상태 관리가 어려워진다.

![](DesignPattern_20_Mediator_1.png)

* 이럴 경우 객체들 사이에 중재자를 두어, 해당 객체로만 요청을 하도록 하여 상태를 관리한다.

![](DesignPattern_20_Mediator_2.png)

# Code

* 코드를 github에 올려두었으나, 크게 도움되지 않는 것 같아 첨부하지 않는다.
* 궁금하다면 찾아가보자.
* 다만, 해당 코드는 정말 좋지 않다.

# 활용성

* 실제로 만들어보니 크게 도움이 안되는 것 같다.

# 생각해볼 점

* 커플링이 너무 심해진다. (init에서 받음)
* 특정 함수에서 하나이상의 동작(mediator로 전달)을 하게 되니, 동작을 이해하기 쉽지 않다.
* 무한 루프가 돌 가능성이 높아진다.
* 해당 패턴은 중간자를 두어 책임을 나눈다는 것에 방점을 두면 좋으나,
* 구현 방식을 위와 같이 하면 망한다. 절대 하지 말자.
* 단방향 흐름이 제일 좋다.

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 12. Mediator](https://www.youtube.com/watch?v=ZvyxRzma1UY&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=12)
* [DesignPattern-18-Mediator](https://github.com/wansook0316/DesignPattern-18-Mediator)
