---
title: Memento
thumbnail: ''
draft: false
tags: null
created: 2023-09-26
---

GoF의 디자인 패턴, 메멘토 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-19-Memento)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 객체의 상태를 기억해두었다가 필요할 때 기억해둔 상태로 객체를 되돌린다.
* 객체에 상태에 대한 기억은 다른 객체에서도 읽기 전용으로 접근
* 객체의 상태에 대한 **기억 생성은 오직 해당 객체만이 할 수 있다.**
* 객체의 스냅샷을 저장해두는 패턴

# 예시

![](DesignPattern_21_Memento_0.png)

# Code

## Walker

````swift
//
//  Walker.swift
//  Memento
//
//  Created by Choiwansik on 2023/02/07.
//

import Foundation

internal class Walker {

    internal init(current: Coordinate, target: Coordinate) {
        self.current = current
        self.target = target
    }

    internal func walk(with action: String) {
        self.actionList.append(action)

        if action == "UP" {
            self.current.addY(diff: +1)
        } else if action == "RIGHT" {
            self.current.addX(diff: +1)
        } else if action == "DOWN" {
            self.current.addY(diff: -1)
        } else if action == "LEFT" {
            self.current.addX(diff: -1)
        }
    }

    internal func createMemento() -> Memento {
        Memento(coordinate: self.current, actionList: self.actionList)
    }

    internal func restore(with memento: Memento) {
        self.current = memento.coordinate
        self.actionList = memento.actionList
    }

    internal var remainingDistance: Double {
        let xSquare = pow(Double((self.current.x - self.target.x)), 2.0)
        let ySquare = pow(Double((self.current.y - self.target.y)), 2.0)
        return sqrt(Double(xSquare) + Double(ySquare))
    }

    internal var description: String {
        self.actionList.map { "\($0)" }.joined(separator: " ")
    }

    private var current: Coordinate
    private let target: Coordinate
    private var actionList = Array<String>()

}

extension Walker {

    internal class Memento {
        internal init(coordinate: Coordinate, actionList: Array<String>) {
            self.coordinate = coordinate
            self.actionList = actionList
        }

        internal let coordinate: Coordinate
        internal let actionList: Array<String>
    }

}

internal struct Coordinate {

    private(set) var x: Int
    private(set) var y: Int

    internal mutating func addX(diff: Int) {
        self.x += diff
    }

    internal mutating func addY(diff: Int) {
        self.y += diff
    }

}

````

## main

````swift
//
//  main.swift
//  Memento
//
//  Created by Choiwansik on 2023/02/07.
//

import Foundation

internal func main() {

    let start = Coordinate(x: 0, y: 0)
    let destination = Coordinate(x: 10, y: 10)

    let walker = Walker(current: start, target: destination)
    let actions = ["UP", "RIGHT", "DOWN", "LEFT"]

    var minDistance = Double.greatestFiniteMagnitude
    var memento: Walker.Memento?

    while true {
        let action = actions[Int.random(in: 0..<actions.count)]

        walker.walk(with: action)

        let remainDistance = walker.remainingDistance
        print(remainDistance)

        if remainDistance == .zero {
            break
        }

        // 거리가 작아지면 저장함
        if minDistance > remainDistance {
            minDistance = remainDistance
            memento = walker.createMemento()
        // 거리가 커지는 경우 이전 상태를 불러옴
        } else if let memento {
            walker.restore(with: memento)
        }
    }

    print("walker's path: \(walker.description)")

}

main()
````

# 활용성

* 어떤 객체의 상태에 대한 스냅샷을 저장한 후 나중에 이 상태로 복구해야 할 때
* 상태를 얻는데 필요한 직접적인 인터페이스를 두면 그 객체의구현 세부사항이 드러나는 경우
  * 캡슐화가 깨짐

# 결과

* 캡슐화된 경계를 유지할 수 있다.
  * 결국 메멘토 객체는 해당 객체 내부에서 처리하게 되므로 내부 구현 사항은 숨겨진다.
  * 사용도 넣어줌으로써 처리되니 캡슐화 보호된다.
* 상태 저장에 대한 책임을 분리할 수 있다.
  * Walker는 받아서 넣어줄 뿐이다.
* 많은 양의 정보 저장, 빈번하게 상태 대체할 경우 비용이 높아질 수 있다.
  * 계속해서 저장하고 덮어써야 하기 때문에 연산량은 증대될 수 있다.
* 메멘토 객체를 받고 관리하는 객체 (`main`)는 이 객체를 만들고 관리하는데 필요한 비용을 알 수 없다.
  * 단순히 만들어서 사용만 한다면, 객체 내부 모든 상태값 복사 등의 비용을 알지못하고 처리하게 된다.

# 생각해볼 점

* Swift에서 객체 아카이빙 하는 것이 이와 비슷 (`NSCoding`)
* NSObject에 대해 아카이빙할 때도 해당 객체 안에서 정의해주었어야 함
* 완벽히 매칭되지 않을 수는 있지만 비슷하다고 생각

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 13. Memento](https://www.youtube.com/watch?v=l8SfShTTiNY&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=13)
* [DesignPattern-19-Memento](https://github.com/wansook0316/DesignPattern-19-Memento)
