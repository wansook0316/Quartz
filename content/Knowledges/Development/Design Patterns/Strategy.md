---
title: Strategy
thumbnail: ''
draft: false
tags: null
created: 2023-09-26
---

GoF의 디자인 패턴, 전략 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-21-Strategy)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 실행 중에 기능을 변경해야 하는 경우 사용

# 예시

![](DesignPattern_23_Strategy_0.png)

# Code

## main

````swift
//
//  main.swift
//  Strategy
//
//  Created by Choiwansik on 2023/02/13.
//

import Foundation

internal func main() {
    let printer = SumPrinter()

    printer.printValue(with: SimpleSumStrategy(), n: 10)

    printer.printValue(with: GaussSumStrategy(), n: 10)
}

main()


````

## SumPrinter

````swift
//
//  SumPrinter.swift
//  Strategy
//
//  Created by Choiwansik on 2023/02/13.
//

import Foundation

internal class SumPrinter {

    internal func printValue(with strategy: SumStrategy, n: Int) {
        print("1에서 \(n)까지의 합")
        print(strategy.calculate(with: n))
    }

}

````

## SumStrategy

````swift
//
//  SumStrategy.swift
//  Strategy
//
//  Created by Choiwansik on 2023/02/13.
//

import Foundation

internal protocol SumStrategy {

    func calculate(with n: Int) -> Int

}

````

## SimpleSumStrategy

````swift
//
//  SimpleSumStrategy.swift
//  Strategy
//
//  Created by Choiwansik on 2023/02/13.
//

import Foundation

internal class SimpleSumStrategy: SumStrategy {

    internal func calculate(with n: Int) -> Int {
        (1...n).reduce(.zero, +)
    }

}

````

## GaussSumStrategy

````swift
//
//  GaussSumStrategy.swift
//  Strategy
//
//  Created by Choiwansik on 2023/02/13.
//

import Foundation

internal class GaussSumStrategy: SumStrategy {

    internal func calculate(with n: Int) -> Int {
        (n+1)*n / 2
    }

}
````

# 활용성

* 알고리즘의 변형이 필요할 때 (여러개 일 때)

# 결과

* 장점
  * 조건문을 없앨 수 있다.
  * 서브클래싱을 사용하지 않을 수 있다.
  * 알고리즘의 자사용이 가능하다.
  * 구현의 선택이 가능하다.
* 단점
  * 클라이언트는 서로 다른 전략들에 대해 이해해야 한다. (장단점에 대해)
  * Strategy와 Context 사이의 의사소통 오버헤드가 생긴다. 결합도가 높아질 수 있다.
  * 객체수가 증가한다.

# 생각해볼 점

* 최적화가 필요한 부분에 대해 이런 패턴을 사용하면 좋을 것 같다.
* 알고리즘의 장단점이 명확하다면, 구현체를 두 개 두고 상황에 따라 선택하도록 만들면 좋겠다.

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 3. Strategy](https://www.youtube.com/watch?v=Wao5HiXM_Cg&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=3)
* [DesignPattern-22-Strategy](https://github.com/wansook0316/DesignPattern-22-Strategy)
