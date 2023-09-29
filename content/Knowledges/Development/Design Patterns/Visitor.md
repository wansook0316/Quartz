---
title: Visitor
thumbnail: ''
draft: false
tags:
- oop
- visitor
- design-pattern
created: 2023-09-26
---

GoF의 디자인 패턴, 전략 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-23-Visitor)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 데이터 구조와 데이터 처리를 분리해주는 패턴
* 데이터 처리 방식을 기존의 소스 코드 변경 없이 새로운 클래스 추가만으로 확장 가능함
* 데이터 구조는 Composite Pattern을 사용함

# 예시

![](DesignPattern_25_Visitor_0.png)

# Code

## main

````swift
//
//  main.swift
//  Visitor
//
//  Created by Choiwansik on 2023/02/21.
//

import Foundation

internal func main() {
    let list1 = ItemList()
    list1.add(unit: Item(value: 10))
    list1.add(unit: Item(value: 20))
    list1.add(unit: Item(value: 30))

    let list2 = ItemList()
    list2.add(unit: Item(value: 40))
    list2.add(unit: Item(value: 50))
    list2.add(unit: list1)

    let list3 = ItemList()
    list3.add(unit: Item(value: 60))
    list3.add(unit: list1)
    list3.add(unit: list2)

    let sum = SumVisitor()
    let avg = AvgVisitor()

    list1.accept(visitor: sum)
    list1.accept(visitor: avg)
    print("List1 SUM: \(sum.value)")
    print("List1 AVG: \(avg.value)")

    list2.accept(visitor: sum)
    list2.accept(visitor: avg)
    print("List2 SUM: \(sum.value)")
    print("List2 AVG: \(avg.value)")

    list3.accept(visitor: sum)
    list3.accept(visitor: avg)
    print("List3 SUM: \(sum.value)")
    print("List3 AVG: \(avg.value)")

}

main()


````

````swift
List1 SUM: 60
List1 AVG: 20.0
List2 SUM: 210
List2 AVG: 26.25
List3 SUM: 480
List3 AVG: 28.235294117647058
````

## Unit

````swift
//
//  Unit.swift
//  Visitor
//
//  Created by Choiwansik on 2023/02/21.
//

import Foundation

internal protocol Unit {

    func accept(visitor: Visitor)
    
}

````

## Item

````swift
//
//  Item.swift
//  Visitor
//
//  Created by Choiwansik on 2023/02/21.
//

import Foundation

internal struct Item: Unit {

    internal let value: Int

    internal func accept(visitor: Visitor) {
        visitor.visit(unit: self)
    }
    
}

````

## ItemList

````swift
//
//  ItemList.swift
//  Visitor
//
//  Created by Choiwansik on 2023/02/21.
//

import Foundation

internal class ItemList: Unit {

    internal func add(unit: Unit) {
        self.list.append(unit)
    }

    internal func accept(visitor: Visitor) {
        self.list.forEach { visitor.visit(unit: $0) }
    }

    private(set) var list = Array<Unit>()

}

````

## Visitor

````swift
//
//  Visitor.swift
//  Visitor
//
//  Created by Choiwansik on 2023/02/21.
//

import Foundation

internal protocol Visitor {

    func visit(unit: Unit)
    
}

````

## SumVisitor

````swift
//
//  SumVisitor.swift
//  Visitor
//
//  Created by Choiwansik on 2023/02/21.
//

import Foundation

internal class SumVisitor: Visitor {

    internal var value: Int {
        self.sum
    }

    internal func visit(unit: Unit) {
        if let item = unit as? Item {
            sum += item.value
        } else {
            unit.accept(visitor: self)
        }
    }

    private(set) var sum: Int = .zero

}

````

## AvgVisitor

````swift
//
//  AvgVisitor.swift
//  Visitor
//
//  Created by Choiwansik on 2023/02/21.
//

import Foundation

internal class AvgVisitor: Visitor {

    internal var value: Double {
        Double(self.sum) / Double(self.count)
    }

    internal func visit(unit: Unit) {
        if let item = unit as? Item {
            self.sum += item.value
            self.count += 1
        } else {
            unit.accept(visitor: self)
        }
    }

    private(set) var sum = 0
    private(set) var count = 0
}

````

# 활용성

* 객체 구조와 처리로직을 분리하여 유지보수와 확장성을 향상시킬 수 있다.
* 객체 구조는 동일하나, 연산을 추가하고 싶을 때

# 생각해볼 점

* 코드의 복잡성이 증가될 수 있다.
* 구조를 바꾸지 않고 새로운 동작을 추가할 수 있으나, 객체 요소가 Visitor 인터페이스에 의존하게 된다.

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 24. Visitor](https://www.youtube.com/watch?v=QC8Q5MWB-mQ&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=25)
* [DesignPattern-24Visitor](https://github.com/wansook0316/DesignPattern-24Visitor)
