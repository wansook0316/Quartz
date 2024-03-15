---
title: Proxy
thumbnail: ''
draft: false
tags:
- oop
- design-pattern
- proxy
- copy-on-write
- eagar-loading
- lazy-loading
created: 2023-09-26
---

GoF의 디자인 패턴, 프록시 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-13-Proxy)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* Proxy: 대리인
* 작업의 실행을 대리인을 통해 실행하도록 하는 패턴
* A라는 작업을 B라는 대리인을 통해 보통 성능적 이점을 얻기 위해 사용
* 이 과정에서 캐싱을 통해 처리한다면 캐싱 프록시,
* 가상적으로 성능을 높혔다면 가상 프록시라 부름
* 하지만 핵심은, **대리인을 통해 어떠한 이점을 얻고 싶을 때, 이러한 패턴을 사용한다고 생각하면 됨**

# 구조

![](DesignPattern_15_Proxy_0.png)

* `ScreenDisplay`: 어떠한 데이터를 읽어 화면에 출력하는 개체
  * 데이터를 화면에 출력하기 까지 대기시간이 걸린다고 가정
* `BufferDisplay`: `ScreenDisplay`의 역할을 대체하여 어떠한 이점을 얻기 위해 만든 Proxy
  * `ScreenDisplay` 개체를 내부적으로 가지고서 논리적으로 성능을 높힘 - "가상" 프록시
* `Display`: 화면에 출력하기 위해 필요한 함수 인터페이스
  * 하나의 타입으로 처리 가능

# 시간이 오래걸리는 경우 예

## main

````swift
//
//  main.swift
//  Proxy
//
//  Created by Choiwansik on 2023/01/10.
//

import Foundation

internal func main() {
    let display = ScreenDisplay()

    display.print(content: "안녕")
    display.print(content: "난 완숙이야")
    display.print(content: "난 개발자야")
    display.print(content: "근데 난 반숙이 더 좋더라")
    display.print(content: "계란은 후라이가 더 맛있어")
    display.print(content: "스크램블은 버터를 꼭 빼줘")
    display.print(content: "그럼 안녕")
}

main()


````

## Display

````swift
//
//  Display.swift
//  Proxy
//
//  Created by Choiwansik on 2023/01/10.
//

import Foundation

internal protocol Display {
    func print(content: String)
}

````

## ScreenDisplay

````swift
//
//  ScreenDisplay.swift
//  Proxy
//
//  Created by Choiwansik on 2023/01/10.
//

import Foundation

internal class ScreenDisplay: Display {

    internal func print(content: String) {
        // content라는 문자열을 화면에 표시하려면 상당한 시간이 소요된다고 가정
        Thread.sleep(forTimeInterval: 0.5)

        Swift.print(content)
    }

}

````

## 결과

````
안녕
난 완숙이야
난 개발자야
근데 난 반숙이 더 좋더라
계란은 후라이가 더 맛있어
스크램블은 버터를 꼭 빼줘
그럼 안녕
Program ended with exit code: 0
````

* 한줄씩 천천히 출력됨
* 이는 ScreenDisplay의 `print(content:)` 메서드가 출력을 위해 준비시간이 오래걸리기 때문임
* 이를 해결하기 위해서는 출력할 데이터를 최대한 모아서 print 메서드를 최소한으로 호출해주면 됨

# Proxy를 통한 해결

## main

````swift
//
//  main.swift
//  Proxy
//
//  Created by Choiwansik on 2023/01/10.
//

import Foundation

internal func main() {
//    notUsingProxy()
    usingProxy()
}

internal func notUsingProxy() {
    let display: Display = ScreenDisplay()

    display.print(content: "안녕")
    display.print(content: "난 완숙이야")
    display.print(content: "난 개발자야")
    display.print(content: "근데 난 반숙이 더 좋더라")
    display.print(content: "계란은 후라이가 더 맛있어")
    display.print(content: "스크램블은 버터를 꼭 빼줘")
    display.print(content: "그럼 안녕")
}

internal func usingProxy() {
    let display: Display = BufferDisplay(bufferSize: 5)

    display.print(content: "안녕")
    display.print(content: "난 완숙이야")
    display.print(content: "난 개발자야")
    display.print(content: "근데 난 반숙이 더 좋더라")
    display.print(content: "계란은 후라이가 더 맛있어")
    display.print(content: "스크램블은 버터를 꼭 빼줘")
    display.print(content: "그럼 안녕")

    guard let bufferDisplay = display as? BufferDisplay else {
        return
    }

    bufferDisplay.flush()
}

main()


````

## BufferDisplay

````swift
//
//  BufferDisplay.swift
//  Proxy
//
//  Created by Choiwansik on 2023/01/10.
//

import Foundation

internal class BufferDisplay: Display {

    internal init(bufferSize: Int) {
        self.bufferSize = bufferSize
    }

    internal func print(content: String) {
        self.buffer.append(content)

        if self.buffer.count == self.bufferSize {
            self.flush()
        }
    }

    internal func flush() {
        if self.screen == nil {
            self.screen = ScreenDisplay()
        }

        let lines = self.buffer.joined(separator: "\n")
        Swift.print(lines)

        self.buffer.removeAll()
    }

    private var buffer = [String]()
    private let bufferSize: Int
    private var screen: ScreenDisplay?

}
````

* `ScreenDisplay`를 사용하지 않고 대리자인 `BufferProxy`를 사용하여 속도를 높임
* 다만 5개씩 처리한다는 점 때문에 마지막에 명시적으로 `flush`를 호출해주어야 함

# 동기

* 캡슐화의 관점에서 보았을 때, 내부 개체의 생성과 초기화 같은 부분을 클라이언트 쪽에서는 모르는 것이 좋다.
* 하지만 객체 생성과 초기화에 있어 많은 시간이 소요된다면, 클라이언트에서 이를 제어하고 싶을 수 있다.
  * 사용하지도 않는 이미지를 로드해두는 경우
* 이럴 경우 Proxy라는 대리인 개체를 만들어, 객체 생성 타이밍을 제어할 수 있도록 하면 지저분한 코드가 사라진다.
  * 객체 생성의 책임을 Proxy가 담당하기 때문에.
* 예를 들어, 직접 이미지 로드를 해서 클라이언트에서 사용하는 것이 아니고,
* 중간에 프록시 개체를 두고, 이를 통해 접근함으로써 실제 사용시점을 명확히 해두는 것.

# 활용성

* Remote Proxy
  * 서로 다른 주소 공간에 존재하는 객체를 가리키는 대표 객체로, 로컬환경에 위치
  * 아마 자체적으로 개체를 선택하기 위한 목적인 듯 함
* Virtual Proxy
  * imageProxy
  * 요청이 있을 경우에만 고비용 객체를 생성
  * 캐싱이 들어갈 수도?
* Protection Proxy
  * 원래 객체에 대한 실제 접근을 제어
  * 객체별로 접근 제어 권한이 다를 경우 사용
* Smart reference(Smart Pointer)
  * 참조 횟수를 저장하다가 더는 참조가 없을 경우 객체를 자동으로 없앰
  * 처음 참조되는 시점에 Persistence에서 memory로 로드함
  * 객체 접근 전에 다른 객체가 접근할 것을 고려하여 lock을 걺

# 결과

* 프록시 패턴을 사용하면, 특정 객체에 접근할 때 추가적인 통로를 제공하게 됨
* 이 통로에서는 어떤 목적을 이루느냐에 따라 책임을 가짐
  * 원격: 객체가 다른 주소 공간에 있는 것을 숨길 수 있음
  * 가상: 객체 생성에 대한 처리의 최적화
  * 보호/스마트: 객체 접근에 따른 추가적인 관리(메모리, 권한, 생성과 삭제)
* Copy on write
  * 실제 변경(혹은 쓰기)가 일어난 경우에만 값을 복사함
  * 이걸 가능하게 하려면 원본에 대한 참조 개수를 관리해야 함
    * 만약 변경이 일어났다면 다음과 같은 작업을 해야하기 때문
      1. 복사
      1. 원본의 참조 카운트 -1
      1. 변경된 값을 갖고 싶은 변수에 1번 항목을 할당
  * 객체의 크기가 크면 클수록 해당 작업은 복사 비용을 현격하게 줄여줌

# 생각해볼 점

* Copy on write는 Proxy Pattern이다.
* Proxy는 lazy, eager loading과 관련이 있다.
* 각 상황에 맞도록 처리해야지 무조건적으로 프록시 패턴이 좋은 것은 아니다.
* 패턴 자체를 아는 것보다, 문제 상황이 무엇인지, 어떻게 적용하는 것이 현 프로젝트에 좋은지를 고민하는 것이 더 좋다고 생각한다.

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 14. Proxy](https://www.youtube.com/watch?v=NoRPG06c48U&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=13)
* [DesignPattern-13-Proxy](https://github.com/wansook0316/DesignPattern-13-Proxy)
* [Proxy](Development/Object%20Oriented%20Programming/Proxy.md)
