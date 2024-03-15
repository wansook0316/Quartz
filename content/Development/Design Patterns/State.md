---
title: State
thumbnail: ''
draft: false
tags:
- state
- oop
- design-pattern
created: 2023-09-26
---

GoF의 디자인 패턴, 상태 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-20-State)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 상태를 객체화 한 패턴
* 조건절을 효과적으로 줄여주는 패턴

# 예시

* 어떤 프로그램에서의 동작이 독립적이지 않다면 어떻게 될까?
* 즉, 이전 상태에 다음 동작의 결과가 영향을 미치는 종속 사건이라면?
* 서기, 걷기, 뛰기, 앉기의 4가지 동작이 있다고 하자.
* 다음 동작을 실행한 결과는 이전 상태가 어떤 상태냐에 따라 다른 결과를 가져온다고 해보자.
* 이럴 경우 4\*4로 16가지의 경우의 수가 나온다.
* 만약 조건문을 쓴다면 16개를 분기쳐주어야 한다.
* 이런 경우 상태 패턴을 사용하면 좋다.

![](DesignPattern_22_State_0.png)

* 핵심은 **내가 온 상태에서 다음으로 상태를 전이시키는 책임을 State가 갖는다는 것이다.**
* 즉, 상태는 자신으로부터 다음 상태로 전환되었을 때의 처리를 담당해야 한다.

# Code

## main

````swift
//
//  main.swift
//  State
//
//  Created by Choiwansik on 2023/02/13.
//

import Foundation

internal func main() {

    let player = Player(speed: 0)
    player.update(state: StandUpState(player: player))

    while true {
        print("플레이어 상태: \(player.state?.description ?? "")")
        print("속도: \(player.speed) km/h")
        print("1: 서기, 2: 앉기, 3: 걷기, 4: 뛰기, 5: 종료")
        print("")

        let input = readLine()
        guard let first = input?.components(separatedBy: " ").first,
              let command = Int(first) else {
            return
        }

        switch command {
        case 1:
            player.state?.standUp()
        case 2:
            player.state?.sitDown()
        case 3:
            player.state?.walk()
        case 4:
            player.state?.run()
        default:
            print("종료합니다.")
            return
        }
    }

}

main()

````

## Player

````swift
//
//  Player.swift
//  State
//
//  Created by Choiwansik on 2023/02/13.
//

import Foundation

public class Player {

    private(set) var speed: Int
    private(set) var state: State?

    internal init(speed: Int) {
        self.speed = speed
    }

    internal func update(state: State) {
        self.state = state
    }

    internal func update(speed: Int) {
        self.speed = speed
    }

    internal func talk(message: String) {
        print("플레이어: \(message)")
    }

}

````

## State

````swift
//
//  State.swift
//  State
//
//  Created by Choiwansik on 2023/02/13.
//

import Foundation

internal protocol State: Loggable {

    init(player: Player)

    func standUp()
    func sitDown()
    func walk()
    func run()

    var player: Player { get }

}

internal protocol Loggable {

    var description: String { get }

}

````

## StandUpState

````swift
//
//  StandUpState.swift
//  State
//
//  Created by Choiwansik on 2023/02/13.
//

import Foundation

internal class StandUpState: State {

    required internal init(player: Player) {
        self.player = player
    }

    internal func standUp() {
        self.player.talk(message: "언제 움직일꺼야?")
    }

    internal func sitDown() {
        self.player.update(state: SitDownState(player: self.player))
        self.player.talk(message: "앉으니 편하고 좋아요")
    }

    internal func walk() {
        self.player.update(speed: 5)
        self.player.update(state: WalkState(player: self.player))
        self.player.talk(message: "걷기는 제2의 생각하기다..")
    }

    internal func run() {
        self.player.update(speed: 10)
        self.player.update(state: RunState(player: self.player))
        self.player.talk(message: "갑자기 뛴다고?")
    }

    internal let player: Player

}

extension StandUpState: Loggable {

    internal var description: String {
        "제자리에 서있음"
    }
    
}

````

## SitDownState

````swift
//
//  SitDownState.swift
//  State
//
//  Created by Choiwansik on 2023/02/13.
//

import Foundation

internal class SitDownState: State {

    required internal init(player: Player) {
        self.player = player
    }

    internal func standUp() {
        self.player.update(state: StandUpState(player: self.player))
        self.player.talk(message: "일어나자..")
    }

    internal func sitDown() {
        self.player.talk(message: "얼마나 오래 앉아 있을 생각이야")
    }

    internal func walk() {
        self.player.update(state: StandUpState(player: self.player))
        self.player.talk(message: "앉아서 어떻게 걷니 일단 일어나자.")
    }

    internal func run() {
        self.player.update(state: StandUpState(player: self.player))
        self.player.talk(message: "앉아서 어떻게 뛰니 일단 일어나자.")
    }

    internal let player: Player

}

extension SitDownState: Loggable {

    internal var description: String {
        "앉아있음"
    }

}

````

## WalkState

````swift
//
//  WalkState.swift
//  State
//
//  Created by Choiwansik on 2023/02/13.
//

import Foundation

internal class WalkState: State {

    required internal init(player: Player) {
        self.player = player
    }

    internal func standUp() {
        self.player.update(speed: 0)
        self.player.update(state: StandUpState(player: self.player))
        self.player.talk(message: "멈춰")
    }

    internal func sitDown() {
        self.player.update(speed: 0)
        self.player.update(state: SitDownState(player: self.player))
        self.player.talk(message: "걷다가 앉다니 엉덩이 까진다.")
    }

    internal func walk() {
        self.player.talk(message: "그래 계속 걷자.")
    }

    internal func run() {
        self.player.update(speed: 20)
        self.player.update(state: RunState(player: self.player))
        self.player.talk(message: "걷다가 뛰면 속도가 확 오르지!")
    }

    internal let player: Player

}

extension WalkState: Loggable {

    internal var description: String {
        "걷는 중"
    }

}

````

## RunState

````swift
//
//  RunState.swift
//  State
//
//  Created by Choiwansik on 2023/02/13.
//

import Foundation

internal class RunState: State {

    required internal init(player: Player) {
        self.player = player
    }

    internal func standUp() {
        self.player.update(speed: 0)
        self.player.update(state: StandUpState(player: self.player))
        self.player.talk(message: "뛰다가 섰더니 무릎이 아파")
    }

    internal func sitDown() {
        self.player.update(speed: 0)
        self.player.update(state: SitDownState(player: self.player))
        self.player.talk(message: "뛰다가 앉으라고? 엉덩이 다까졌다.")
    }

    internal func walk() {
        self.player.update(speed: 8)
        self.player.update(state: WalkState(player: self.player))
        self.player.talk(message: "속도를 줄일게")
    }

    internal func run() {
        self.player.update(speed: self.player.speed + 2)
        self.player.talk(message: "더 빨리 뛰라는 소리지?")
    }

    internal let player: Player

}

extension RunState: Loggable {

    internal var description: String {
        "뛰는 중"
    }

}

````

# 활용성

* 객체의 행동이 상태에 따라 달라질 수 있다.
* 객체의 상태에 따라 런타임에 행동이 변경되어야 한다.
* 특정 연산에 분기 조건이 너무 많을 경우

# 결과

1. 상태에 따른 행동을 모을 수 있다. 그리고 이를 별도의 객체로 관리할 수 있다.
1. 상태 전이를 명확하게 만든다.
   * 상태의 변화가 원자적으로 바뀐다.
1. 상태 객체는 공유될 수 있다.
   * 같은 객체를 이곳 저곳으로 넘길 수 있다.

# 생각해볼 점

* TCP 연결 프로토콜에 적용했었음

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 22. State](https://www.youtube.com/watch?v=XNwAfxaqWEc&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=23)
* [DesignPattern-21-State](https://github.com/wansook0316/DesignPattern-21-State)
