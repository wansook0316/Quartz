---
title: Command
thumbnail: ''
draft: false
tags:
- oop
- design-pattern
- command
created: 2023-09-26
---

GoF의 디자인 패턴, 명령 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-15-Command)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 하나의 명령을 객체화한 패턴
* 객체는 전달할 수 있고, 보관할 수 있다.
* 즉, **명령(기능)을 전달하고 보관**할 수 있게 된다.
* Batch 실행, Undo/Redo, 우선순위가 높은 명령을 먼저 실행 과 같은 것들이 가능하다.

# 예시

![](DesignPattern_17_Command_0.png)

# Code

## Command

````swift
//
//  Command.swift
//  Command
//
//  Created by Choiwansik on 2023/01/16.
//

import Foundation

internal protocol Command {

    func run()

//    func undo() 필요하다면 구현하면 됨
    
}

````

## EnterCommand

````swift
//
//  EnterCommand.swift
//  Command
//
//  Created by Choiwansik on 2023/01/16.
//

import Foundation

internal class EnterCommand: Command {

    internal func run() {
        (0...4).forEach { _ in print() }
    }

}

````

## PrintCommand

````swift
//
//  PrintCommand.swift
//  Command
//
//  Created by Choiwansik on 2023/01/16.
//

import Foundation

internal class PrintCommand: Command {

    internal init(content: String) {
        self.content = content
    }

    internal func run() {
        print(self.content)
    }

    private let content: String

}

````

## TabCommand

````swift
//
//  TabCommand.swift
//  Command
//
//  Created by Choiwansik on 2023/01/16.
//

import Foundation

internal class TabCommand: Command {

    internal init(times: Int) {
        self.times = times
    }

    internal func run() {
        (0..<self.times).forEach { _ in print("    ", terminator: "") }
    }

    private let times: Int

}

````

## DecorationCommand

````swift
//
//  DecorationCommand.swift
//  Command
//
//  Created by Choiwansik on 2023/01/16.
//

import Foundation

internal class DecorationCommand: Command {

    internal func run() {
        print("======================================")
    }

}

````

## CommandGroup

````swift
//
//  CommandGroup.swift
//  Command
//
//  Created by Choiwansik on 2023/01/16.
//

import Foundation

internal class CommandGroup: Command {

    internal func add(command: Command) {
        self.commands.append(command)
    }

    internal func run() {
        self.commands.forEach { $0.run() }
    }

    private var commands = [Command]()
    
}

````

## main

````swift
//
//  main.swift
//  Command
//
//  Created by Choiwansik on 2023/01/16.
//

import Foundation

internal func main() {

    // 하나씩 테스트 해보기

    let enterCommand: Command = EnterCommand()
    enterCommand.run()

    let tabCommand: Command = TabCommand(times: 3)
    tabCommand.run()

    let printCommand: Command = PrintCommand(content: "출력해주세요.")
    printCommand.run()

    let decorationCommand: Command = DecorationCommand()
    decorationCommand.run()

    // 기존에 만들었던 객체를 재사용해보기 (print)

    let tabCommand2: Command = TabCommand(times: 6)
    tabCommand2.run()
    printCommand.run()

    // Command Group을 통해 Batch로 만들기

    let commandGroup = CommandGroup()
    commandGroup.add(command: enterCommand)
    commandGroup.add(command: tabCommand)
    commandGroup.add(command: printCommand)
    commandGroup.add(command: decorationCommand)

    commandGroup.run()

}

main()

````

# 동기

* 메뉴가 있는 어떤 프로그램을 생각해보자.
* 닫기 버튼은 메뉴에도 있고, X버튼을 눌러도 내려간다.
* 이렇게 다른 동작에 대해 같은 처리를 해야할 필요가 있다.
* 이럴 경우 "동작" 자체(혹은 요청)를 묶어주면 좋다.
* 또한 여러 명령을 복합적으로 처리해야할 때도 있다.
* 이런 경우도 생각하여 위에서 묶은 "명령"을 다시 묶어주는 객체도 있으면 좋겠다.

# 활용성

* 수행할 동작을 객체로 매개변수화 하고자 할 때
  * Callback과 같이 어떤 동작을 등록해야할 필요가 있다.
  * Command 패턴은 이와 같이 동작을 객체 지향 방식으로 나타낸 것이라 생각하면 되겠다.
* 실행 취소 기능을 지원하고 싶을 때
  * 상태를 관리하는 Group과 같은 객체를 만들 수 있기 때문에 되돌리는 것도 가능하다.
* 변경과정에 대한 로깅을 지원하고 싶을 때
  * Command 객체에 `load()`, `store()`와 같은 연산을 지원하면 저장소에 저장했다가 불러오는 것도 가능해진다.
  * 시스템이 갑자기 종료(워드 같은 거)되었을 시 복구하고 싶다면 해당 패턴을 고려해보자.

# 다른 이름

* Action
* Transaction

# 결과

1. 연산을 호출하는 객체와 수행방법을 구현하는 객체를 분리한다.
1. 복합 명령을 만들 수 있다.
1. 새로운 Command 객체를 추가하기 쉽다.

# 생각해볼 점

* 결국 Command 는 어떤 동작을 캡슐화 한 것으로 생각할 수 있겠다.
  * 그래서 행동 패턴에 들어간 것일 듯
* 그리고 그 Command라고 감싸진 덕분에, 이 동작들을 유연하게 엮고, 반대로 처리할 수 있게 된다.
* 결국 캡슐화가 가장 중요한 화두라는 생각이 든다.
* 동작을 나누는 것에서 "무엇"에 대해 초점을 맞춘 것이 명령 패턴이다.
  * "어떻게"는 전략 패턴
* `IBAction`으로 특정 동작 자체를 넘겨 바인딩하는 방식이 명령 패턴일 듯 하다.
  * 이벤트가 왔을 시 처리될 동작 자체를 캡슐화(함수화)해서 넘기기 때문

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 20. Command](https://www.youtube.com/watch?v=sYIB1VrN1ik&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=20)
* [DesignPattern-15-Command](https://github.com/wansook0316/DesignPattern-15-Command)
