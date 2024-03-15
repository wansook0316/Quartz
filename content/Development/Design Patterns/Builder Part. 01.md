---
title: Builder Part. 01
thumbnail: ''
draft: false
tags:
- builder
- oop
- design-pattern
created: 2023-09-26
---

GoF의 디자인 패턴, 두번째 빌더 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-02-Builder-first)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

 > 
 > 복잡한 구성의 객체를 효과적으로 생성하는 패턴

* 두가지 경우에 자주 사용됨
  1. 생성시 지정해야 하는 인자가 많을 때
  1. 객체 생성시 여러단계를 순차적으로 거칠 때
     * 단계의 순서를 결정해두고 각 단계를 다양하게 구현할 수 있도록 함
* 이 글에서는 첫번째 경우를 주로 설명함
* 일단 예시를 먼저보고, 종합한 내용을 다음글에서 정리하는 것을 목표로 함

# 예시

![](DesignPattern_04_Builder-01_0.png)

* 첫번째 예시의 경우, 생성시 지정하는 인자가 많을 경우에 사용한다 했다.
* 즉, 특정 클래스의 인스턴스를 만들때 많은 인자가 필요한 경우를 말한다.
* 그렇다면 Builder를 쓴다면 이러한 점에서 우위를 갖는다는 것인데, 실제 코드를 보며 확인해보자.
* [Source Code](https://github.com/wansook0316/DesignPattern-02-Builder-first)

````swift
internal func Car와CarBuilder호출방식차이확인하기() {
    print("+++ Car와 CarBuilder 호출방식 차이 확인하기 +++")
    
    // initializer를 사용해서 처리하기
    let car1 = Car(brandName: "Ford Mustang",
                  engine: "V8",
                  airbag: true,
                  color: "red",
                  isSelfDrivingAvailable: false,
                  isSexy: false)
    print(car1.description)
    
    // Builder를 사용해서 처리하기
    let car2 = CarBuilder()
        .brandName("Tesla")
        .engine("Electric motor")
        .airbag(true)
        .color("black")
        .isSelfDrivingAvailable(true)
        .isSexy(false)
        .build()
    
    print(car2.description)
}
````

* Car는 6개의 인자를 받는다.
* 이런 경우 Builder를 사용하게 되면 method chaining을 통해 처리할 수 있다.

````swift
internal func CarBuilder가재사용에용이한이유알아보기() {
    print("+++ CarBuilder가 재사용에 용이한 이유 알아보기 +++")
    
    let teslaDefault = CarBuilder()
        // .brandName("Tesla")
        .engine("Electric motor")
        .airbag(true)
        .color("black")
        .isSelfDrivingAvailable(true)
        .isSexy(false)
    
    let modelS = teslaDefault
        .brandName("model S")
        .build()
    
    let model3 = teslaDefault
        .brandName("model 3")
        .build()
    
    let modelX = teslaDefault
        .brandName("model X")
        .build()
    
    let modelY = teslaDefault
        .brandName("model Y")
        .build()
    
    print(modelS.description)
    print(model3.description)
    print(modelX.description)
    print(modelY.description)
}

````

* 그럼 method chaining은 왜 좋을까?
* 위의 예시는 다른 것들은 대부분 같은 상황에서 차 brand 이름만 다른 경우를 만드는 예시이다.
* 기본 값은 모두 같게 만들되, 이 같은 부분이 반영된 builder를 가져와 바로바로 생산해버릴 수 있다.
* 생성자를 사용했다면 계속해서 중복된 코드가 만들어졌을 것이다.

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 19. Builder (1/2)](https://www.youtube.com/watch?v=_GCiJAFU2DU&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=18)
* [GoF의 Design Pattern - 19. Builder (2/2)](https://www.youtube.com/watch?v=sg_6GWRBRas&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=19)
* [Github: DesignPattern: Builder-01](https://github.com/wansook0316/DesignPattern-02-Builder-first)
