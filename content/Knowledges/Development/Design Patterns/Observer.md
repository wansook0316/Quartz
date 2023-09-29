---
title: Observer
thumbnail: ''
draft: false
tags:
- publish-subscribe
- pub-sub
- design-pattern
- observer
- oop
created: 2023-09-26
---

GoF의 디자인 패턴, 감시자 패턴에 대해 알아본다.

# 핵심 요약

 > 
 > 객체 사이에 일 대 다 의존 관계를 정의해두어, 어떤 객체의 상태가 변할 때, 그 객체에 의존성을 가진 다른 객체들이 변화를 통지받고 자동으로 갱신될 수 있게 만든다.

* 종속자, 게시-구독(Publish-Subscribe)라 불린다.
* swift [Combine](Combine.md)이 이 형태라 생각하면 된다.
* [Notification To Combine](Notification%20To%20Combine.md) 에서 사용하는 Notification도 같은 형태다.

# 예시

![](Observer.drawio.png)

# Code

````swift
//
//  main.swift
//  Observer
//
//  Created by Choiwansik on 2023/09/26.
//

import Foundation

internal func main() {
    let diceGame: DiceGame = FairDiceGame()

    let player1: Player = EvenBettingPlayer(name: "완식")
    let player2: Player = OddBettingPlayer(name: "최완식")
    let player3: Player = OddBettingPlayer(name: "완숙이")

    diceGame.add(player: player1)
    diceGame.add(player: player2)
    diceGame.add(player: player3)

    (0..<5).forEach { _ in
        diceGame.play()
        print()
    }
}

main()

````

````swift
//
//  Player.swift
//  Observer
//
//  Created by Choiwansik on 2023/09/26.
//

import Foundation

public class Player {

    public init(name: String) {
        self.name = name
    }

    public func update(diceNumber: Int) {

    }

    public let name: String

}

````

````swift
//
//  OddBettingPlayer.swift
//  Observer
//
//  Created by Choiwansik on 2023/09/26.
//

import Foundation

public class OddBettingPlayer: Player {

    override public init(name: String) {
        super.init(name: name)
    }

    override public func update(diceNumber: Int) {
        if diceNumber % 2 == 1 {
            print("\(self.name)가 이김!")
        }
    }

}

````

````swift
//
//  EvenBettingPlayer.swift
//  Observer
//
//  Created by Choiwansik on 2023/09/26.
//

import Foundation

public class EvenBettingPlayer: Player {

    override public init(name: String) {
        super.init(name: name)
    }

    override public func update(diceNumber: Int) {
        if diceNumber % 2 == 0 {
            print("\(self.name)가 이김!")
        }
    }

}

````

````swift
//
//  DiceGame.swift
//  Observer
//
//  Created by Choiwansik on 2023/09/26.
//

import Foundation

public class DiceGame {

    public func add(player: Player) {
        self.players.append(player)
    }

    public func play() {
        
    }

    public var players = [Player]()

}

````

````swift
//
//  FairDiceGame.swift
//  Observer
//
//  Created by Choiwansik on 2023/09/26.
//

import Foundation

public class FairDiceGame: DiceGame {

    override public func play() {
        guard let diceNumber = (1...6).randomElement() else {
            return
        }

        print("주사위 던짐 \(diceNumber)")

        var iter = self.players.makeIterator()
        while let player = iter.next() {
            player.update(diceNumber: diceNumber)
        }

    }
    
}

````

````
주사위 던짐 4
완식가 이김!

주사위 던짐 6
완식가 이김!

주사위 던짐 5
최완식가 이김!
완숙이가 이김!

주사위 던짐 2
완식가 이김!

주사위 던짐 5
최완식가 이김!
완숙이가 이김!
````

# 활용성

* 어떤 추상 개념이 두 가지 양상을 갖고, 하나가 다른 하나에 종속적일 때.
* 한 객체에 가해진 변경으로 다른 객체를 변경해야 하고, 프로그래머들은 얼마나 많은 객체들이 변경되어야 하는지 몰라도 되는 경우.

# 참여자

* Subject(`DiceGame`)
  * 감시자들을 알고 있는 주체.
  * 감시자들을 붙일 수 있는 인터페이스가 정의되어야 함
* Observer(`Player`)
  * 주체에 변화를 관심있어 하는 친구들에게 필요한 인터페이스 정의
* ConcreteSubject(`FairDiceGame`)
* ConcreteObserver(`OddBettingPlayer`, `EvenBettingPlayer`)

# 생각해볼 점

1. Subject와 Observer 클래스 간에는 추상적인 결합만이 존재한다.
   * 인터페이스로만 얽혀있을 뿐이다.
1. Broadcast 방식의 교류를 가능하게 한다.
   * 이 패턴에서 주체자는 구체적인 수신자를 알 필요가 없다.
   * 그냥 등록된애한테 다 뿌리고 끝이다.
   * 받는쪽에서 무시할지 받을지를 결정한다.
1. 예측하지 못한 정보를 갱신할 수 있다.
   - 감시자들끼리 서로 연결되어 있다고 하자.
   - 정보 갱신자체의 비용이 큰 상황일 때, 한 정보가 변경되었을 때 연결된 모든 주체들은 하위 감시자들에게 또 수정을 가하게 할 수 있다.
   - 이 수정은 불필요할 수도 있고, 내가 원하는 정보가 아닐 수도 있다.
   - 즉, 변경의 이유에 대한 것을 유추하는 것이 어렵다.

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [DesignPattern-20-Observer](https://github.com/wansook0316/DesignPattern-20-Observer)
* [GoF의 Design Pattern - 11. Observer](https://www.youtube.com/watch?v=4WO95iHQTx8&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=11)
