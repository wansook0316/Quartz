---
title: Interpreter
thumbnail: ''
draft: false
tags: null
created: 2023-09-26
---

GoF의 디자인 패턴, 해석자 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-16-Interpreter)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 문법에 맞춰 작성된 스크립트를 해석
* 해석된 구문을 정해진 규칙대로 실행하는 패턴

# 예시

````
Script: BEGIN FRONT LOOP 2 BACK RIGHT END BACK END

쉽게 보기
BEGIN               // 스크립트 시작
    FRONT           // [명령] 앞으로 가기

    LOOP 2          // 반복문 시작, 반복 횟수
        BACK        // [명령] 뒤로 가기
        RIGHT       // [명령] 오른쪽으로 가기
    END             // 스크립트 끝

    BACK            // [명령] 뒤로 가기
END                 // 스크립트 끝
````

* Expression: BEGIN FRONT LOOP 2 BACK RIGHT END BACK END 에서 표현된 각 한 단어
* Context: Expression을 정해진 문법에 맞춰 해석된 결과

![](DesignPattern_18_Interpreter_0.png)

* `Context`: 스크립트에서 결과를 가져옴
* `Expression`: 스크립트를 구성하는 각 구문을 처리
* `BeginExpression`: `BEGIN` 구문을 처리하는 Expression
* `CommandListExpression`: 여러개의 `CommandExpression`을 가질 수 있음
* `CommandExpression`: 실제 실행할 수 있는 명령에 대한 구문 (`LOOP`, `BACK` etc)을 나타내는 인터페이스
  * `LoopCommandExpression`: 반복문 루프를 처리하는 구문
  * `ActionCommandExpression`: `FRONT`, `BACK`, `RIGHT`, `LEFT`의 동작을 처리하는 구문

# Code

## main

````swift
import Foundation

internal func main() {

    let script = "BEGIN FRONT LOOP 2 BACK RIGHT END BACK LOOP 4 BACK FRONT LEFT END LEFT END"

    let context = Context(script: script)
    let expression = BeginExpression()

    if expression.parse(context: context) {
        print(expression.description)
    }

}

main()

````

* script를 받아 context에 넣어 이를 분석한다.
* 실제 파서의 기능이 구분된 expression에 이 context를 타고타고 넘기면서 분석을 진행한다.
* 시작은 BeginExpression이 될 것이므로, 여기에 분석된 Context를 넣어 파싱 기능을 동작시킨다.

## Context

````swift
import Foundation

internal class Context {

    private(set) var currentKeyword: String?

    internal init(script: String) {
        self.tokenizer = Tokenizer(script: script)
        self.readNextKeyword()
    }

    internal func readNextKeyword() {
        self.currentKeyword = self.tokenizer.nextToken
    }

    private let tokenizer: Tokenizer

}

internal class Tokenizer {

    internal init(script: String) {
        self.tokens = script.components(separatedBy: .whitespaces)
    }

    internal var nextToken: String? {
        guard self.tokens.isEmpty == false else {
            return nil
        }

        return self.tokens.removeFirst()
    }

    private var tokens: [String]

}

````

* `Context`는 실제 문자열을 토큰으로 나눠주는 토크나이저를 갖는다.
* `Context`는 외부에서 쉽게 다음 토큰을 얻기 위한 Wrapping 클래스라 생각하면 되겠다.

## Expression

````swift
import Foundation

internal protocol Expression: Loggable {

    func parse(context: Context) -> Bool
    
    func run() -> Bool

}

internal protocol KeywordAcceptable {

    static func isValid(keyword: String) -> Bool

}

internal protocol Loggable {

    var description: String { get }

}
````

* 실제 파서의 기능이 담길 인터페이스이다.
* 기능이 담겨있기 때문에 Command 패턴의 일종이라 보아도 무방하다.
* `parse`는 `Context`를 받아 자신이 처리할 수 있는지 확인하고,
* 그에 맞는 하위 expression을 만드는 책임을 갖는다.
* `run`은 만들어진 다음 expression들에 대해 동작을 실행하고 전파하는 역할을 한다.
* `KeywordAcceptable`은 파서 기능중에 구문과 즉각 대응되는 Expression에 대해 이를 정의해주기 위해 만들었다.

## BeginExpression

````swift
import Foundation

internal class BeginExpression: Expression {

    internal func parse(context: Context) -> Bool {
        // 내 키워드가 맞는지 확인
        guard let keyword = context.currentKeyword,
              Self.isValid(keyword: keyword) else {
            return false
        }

        // 하위 Expression 생성
        self.expression = CommandListExpression()

        // 다음으로 넘기기 전 Context 후처리
        context.readNextKeyword()
        guard let expression else {
            return false
        }
        return expression.parse(context: context);
    }

    internal func run() -> Bool {
        guard let expression else {
            return false
        }
        return expression.run()
    }

    private var expression: CommandListExpression?

}

extension BeginExpression: KeywordAcceptable {

    internal static func isValid(keyword: String) -> Bool {
        keyword == "BEGIN"
    }

}

extension BeginExpression: Loggable {

    internal var description: String {
        "BEGIN " + "[" + (self.expression?.description ?? "") + "]"
    }

}

````

## CommandListExpression

````swift
import Foundation

internal class CommandListExpression: Expression {

    internal func parse(context: Context) -> Bool {
        var result: Bool = true

        while true {
            guard let keyword = context.currentKeyword else {
                result = false
                break
            }

            guard keyword != "END" else {
                context.readNextKeyword()
                break
            }

            guard let command = self.determineCommand(with: keyword),
                  command.parse(context: context) else {
                result = false
                break
            }

            self.commands.append(command)
        }

        return result
    }

    internal func run() -> Bool {
        for command in self.commands {
            guard command.run() else {
                return false
            }
        }

        return true
    }

    // 원래는 다른 방식으로 하는게 좋은데 그냥 대충 함
    private func determineCommand(with keyword: String) -> CommandExpression? {
        let command: CommandExpression?

        if LoopCommandExpression.isValid(keyword: keyword) {
            command = LoopCommandExpression(keyword: keyword)
        } else if ActionCommandExpression.isValid(keyword: keyword) {
            command = ActionCommandExpression(keyword: keyword)
        } else {
            command = nil
        }

        return command
    }

    private var commands = [CommandExpression]()

}

extension CommandListExpression: Loggable {

    internal var description: String {
        self.commands.map { $0.description }.joined(separator: " ")
    }

}

````

## CommandExpression

````swift
import Foundation

internal protocol CommandExpression: Expression, KeywordAcceptable {

    var keyword: String { get }
        
}

````

* Command의 경우에는 항상 키워드와 대응되는 기능을 가질 수 밖에 없다.
* 그렇기에 항상 키워드를 가질 수 있도록 했다.

## LoopCommandExpression

````swift
import Foundation

internal class LoopCommandExpression: CommandExpression {

    internal let keyword: String
    internal var count: Int?

    internal init(keyword: String) {
        self.keyword = keyword
    }

    internal func parse(context: Context) -> Bool {
        guard Self.isValid(keyword: self.keyword) else {
            return false
        }

        context.readNextKeyword()
        guard let count = context.currentKeyword else {
            return false
        }
        self.count = Int(count)

        context.readNextKeyword()
        guard context.currentKeyword != nil else {
            return false
        }

        self.expression = CommandListExpression()
        guard let expression else {
            return false
        }
        return expression.parse(context: context)
    }

    internal func run() -> Bool {
        guard let count, let expression else {
            return false
        }

        for _ in (0..<count) {
            guard expression.run() else {
                return false
            }
        }

        return true
    }

    private var expression: CommandListExpression?

}

extension LoopCommandExpression: KeywordAcceptable {

    internal static func isValid(keyword: String) -> Bool {
        
        keyword == "LOOP"
    }

}

extension LoopCommandExpression: Loggable {

    internal var description: String {
        "LOOP(\(self.count ?? 0))" + "{" + (self.expression?.description ?? "") + "}"
    }

}

````

## ActionCommandExpression

````swift
import Foundation

internal class ActionCommandExpression: CommandExpression {

    internal let keyword: String

    internal init(keyword: String) {
        self.keyword = keyword
    }

    internal func parse(context: Context) -> Bool {
        guard Self.isValid(keyword: self.keyword) else {
            return false
        }

        context.readNextKeyword()

        guard context.currentKeyword != nil else {
            return false
        }

        return true
    }

    internal func run() -> Bool {
        print("cmd: \(self.keyword)")

        return true
    }

}

extension ActionCommandExpression: KeywordAcceptable {

    internal static func isValid(keyword: String) -> Bool {
        ["FRONT", "BACK", "LEFT", "RIGHT"].contains(keyword)
    }

}

extension ActionCommandExpression: Loggable {

    internal var description: String {
        self.keyword
    }

}

````

## 결과

````
BEGIN [FRONT LOOP(2){BACK RIGHT} BACK LOOP(4){BACK FRONT LEFT} LEFT]
cmd: FRONT
cmd: BACK
cmd: RIGHT
cmd: BACK
cmd: RIGHT
cmd: BACK
cmd: BACK
cmd: FRONT
cmd: LEFT
cmd: BACK
cmd: FRONT
cmd: LEFT
cmd: BACK
cmd: FRONT
cmd: LEFT
cmd: BACK
cmd: FRONT
cmd: LEFT
cmd: LEFT
````

# 활용성

* ADT(Abstract Syntax Tree)로서 특정 언어의 문장을 표현하고자 할때 사용하면 좋다.
  * 정의할 언어의 문법이 간단할 경우
  * 효율성을 고려할 필요가 없을 경우

# 결과

* 장점
  1. 문법의 변경과 확장이 쉽다.
  1. 문법의 구현이 용이하다
* 단점
  1. 복잡한 문법은 관리하기 어렵다.

# 생각해볼 점

* 파서에 국한되어 사용하기 좋아보이는 패턴이다.
* 이걸 패턴이라 할 수 있는지도 약간 의문이 든다.
* Command 패턴의 응용이라고 보는 것이 더 좋을 듯
* 파서와 같은 역할을 하는 무언가를 만들어야 한다면 한번쯤 생각해 볼만 하다.
* **컴파일러 구현에 널리 사용된다고 한다.**

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 23. Interpreter](https://www.youtube.com/watch?v=RVZz_kLWdFM&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=24)
* [DesignPattern-16-Interpreter](https://github.com/wansook0316/DesignPattern-16-Interpreter)
