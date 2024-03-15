---
title: Chain of Responsibility
thumbnail: ''
draft: false
tags:
- oop
- design-pattern
- chain-of-responsibility
created: 2023-09-26
---

GoF의 디자인 패턴, 책임연쇄 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-14-ChainOfResponsibility)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 여러개의 책임들을 동적으로 연결해서 순차적으로 실행하는 패턴
* 메시지를 보내는 객체와 받아 처리하는 객체들 간의 결합도를 낮추는 패턴
* 기능을 클래스별로 분리하여 구현하도록 함
* 각각의 클래스에서 자신의 책임만을 최적화할 수 있음

# 예시

![](DesignPattern_16_ChainOfResponsibility_0.png)

* 두 예시 모두 순차적으로 자신이 맡은 책임만 수행하고 다음으로 넘긴다.

![](DesignPattern_16_ChainOfResponsibility_1.png)

# GoF책에서 나오는 책임연쇄 패턴 Code

* 원래의 모양대로 적어보긴 했으나, `setNext`자체를 실행시킬 수 없다.
* 밑에서 설명하겠으나, 개인적으로 이 예시는 좋지 않다고 생각한다.

## Handler

````swift
//
//  Handler.swift
//  ChainOfResponsibility
//
//  Created by Choiwansik on 2023/01/16.
//

import Foundation

internal protocol Handler {

    var nextHandler: Handler? { get set }

    mutating func setNext(handler: Handler) -> Handler

    func run(url: URL)

    func process(url: URL)

}

extension Handler {

    internal mutating func setNext(handler: Handler) -> Handler {
        self.nextHandler = handler
        return handler
    }

    internal func run(url: URL) {
        self.process(url: url)

        if let nextHandler {
            nextHandler.run(url: url)
        }
    }

}

````

## ProtocolHandler

````swift
//
//  ProtocolHandler.swift
//  ChainOfResponsibility
//
//  Created by Choiwansik on 2023/01/16.
//

import Foundation

internal class ProtocolHandler: Handler {

    internal func process(url: URL) {
        if let scheme = url.scheme {
            print("Protocol: \(scheme)")
        } else {
            print("No Protocol")
        }
    }

    internal var nextHandler: Handler?

}

````

## DomainHandler

````swift
//
//  DomainHandler.swift
//  ChainOfResponsibility
//
//  Created by Choiwansik on 2023/01/16.
//

import Foundation

internal class DomainHandler: Handler {

    internal func process(url: URL) {
        if let host = url.host {
            print("Domain: \(host)")
        } else {
            print("No Domain")
        }
    }

    internal var nextHandler: Handler?

}

````

## PortHandler

````swift
//
//  PortHandler.swift
//  ChainOfResponsibility
//
//  Created by Choiwansik on 2023/01/16.
//

import Foundation

internal class PortHandler: Handler {

    internal func process(url: URL) {
        if let port = url.port {
            print("Port: \(port)")
        } else {
            print("No Port")
        }
    }

    internal var nextHandler: Handler?

}

````

## main

````swift
//
//  main.swift
//  ChainOfResponsibility
//
//  Created by Choiwansik on 2023/01/16.
//

import Foundation

internal func 기존의위키피디아에서나오는책임연쇄패턴() {
    var protocolHandler: Handler = ProtocolHandler()
    var domainHandler: Handler = DomainHandler()
    var portHandler: Handler = PortHandler()

    protocolHandler
        .setNext(handler: domainHandler)
        .setNext(handler: portHandler)

    protocolHandler.run(url: URL(string: "https://naver.com"))

    // Swift에서는 return 값이 immutable이라 변경할 수 없다!!
    // 애초에 위와 같이 작성하는 것도 문제가 있다고 본다.
}

기존의위키피디아에서나오는책임연쇄패턴()
````

# 올바른 책임 연쇄 패턴

* 굳이 `setNext()`같은 것을 사용해야 하는가?
  * 관리 객체를 하나 두고, 거기서 다음으로만 넘겨주면 되지 않는가?
  * 연쇄를 꼭 클래스가 처리하도록 해야 하는가? 책임을 나누는게 관리측면에서 좋지 않은가?
* 자기 자신을 리턴하는 플루언트 인터페이스 방식도 아니다.
* 오히려 혼란을 가중시키는 방법.
* 연쇄적으로 연결되어 책임을 수행, 그리고 그 책임을 격리하여 나누는 것이 본질적으로 원하는 것이라면,
* 굳이 위와 같이 구현하지 않아도 같은 역할을 수행할 수 있다.
* [Chain Of Responsibility](https://velog.io/@wansook0316/Chain-Of-Responsibility)글을 통해 변경된 방식을 확인하자.

# 활용성

* 요청을 처리할 수 있는 객체 집합이 동적으로 정의되어야 할때

# 결과

* 객체간 행동의 결합도가 낮아진다.
  * 다른 객체가 어떻게 요청을 처리하는지 몰라도 된다.
  * 그냥 넘기고, 누군가가 처리할 것이라는 것만 확신하면 된다.
* 책임을 나눠가질 수 있다.
  * 단계별로 처리해야 한다면, 그 단계별로 클래스를 나누어 책임을 분산할 수 있다.
* 메시지 수신이 보장되지는 않는다.

# 관련 패턴과 차이점

* [Strategy](Strategy.md): 어떻게 동작하는 방법을 분리
* [Command](Command.md): 어떤 동작을 분리
* [Chain of Responsibility](Development/Design%20Patterns/Chain%20of%20Responsibility.md): 메시지 수신과 송신을 분리

# 생각해볼 점

* next로 동작하는 방식이 좋아보이지는 않는다.
* 굳이 저렇게 구현하지 않아도 될 듯하다.
* 패턴에 매몰되지 말자.

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 16. Chain of Responsibility](https://www.youtube.com/watch?v=FAHEWQD6EVE&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=15)
* [DesignPattern-14-ChainOfResponsibility](https://github.com/wansook0316/DesignPattern-14-ChainOfResponsibility)
* [Chain of Responsibility](Development/Object%20Oriented%20Programming/Chain%20of%20Responsibility.md)
