---
title: Flyweight
thumbnail: ''
draft: false
tags:
- flyweight
- oop
- design-pattern
created: 2023-09-26
---

GoF의 디자인 패턴, 플라이급 패턴에 대해 알아본다.

해당 글은, [다음의 코드](https://github.com/wansook0316/DesignPattern-12-Flyweight)를 기반으로 이해하는 것이 편리합니다.

# 핵심 요약

* 플라이급 - 가볍고 민첩한 복싱 선수의 체급을 의미
* 어떤 객체를 사용하기 위해 **매번 생성하지 않고 한번만 생성함**
* 다시 필요해지는 경우 이전에 생성된 객체를 재사용
* 객체 생성시 많은 자원이 소모되는 경우 적은 자원으로 필요한 객체를 재사용할 수 있음

# 예시

![](DesignPattern_14_Flyweight_0.png)

* `Digit`
  * 0~9 의 숫자를 화면에 표시
  * 화면에 표시 == 픽셀로 화면에 그려야 함
  * 많은 양의 메모리를 사용한다고 가정
  * 이 때 사용하는 데이터는 `0.txt`와 같은 형태로 저장되어 있다고 하자.
  * 생성시 파일을 읽고 데이터를 읽어 출력한다.
  * 이렇기 때문에 모든 내용을 메모리에 모두 적재해야 한다는 점에서 메모리 사용량이 많다.
* `DigitFactory`
  * 바깥 쪽에서 원하는 숫자를 넘기면 반환
  * Digit 객체를 미리 생성해두지 않고, 처음 요청 받을시 한번만 생성
  * 동일한 요청을 받으면 그대로 리턴
* `Number`
  * 긴 숫자값을 화면에 출력

## 추가 예시

* Number class를 생성시 434331의 값을 가지고 생성하라고 했다고 가정하자.
* 그렇다면 각 숫자에 해당하는 숫자를 화면에 표시하기 위해 Digit 인스턴스를 사용해야 한다.
* 그렇다면 4, 3과 같이 반복되는 숫자에 대해서 각각에 해당하는 Digit 인스턴스를 가져야할까?
* 이럴 경우 Flyweight 패턴을 이용하여 이미 생성된 객체중 1, 3, 4 객체 3개만 사용하면 된다.

# 코드

## Main

````swift
//
//  main.swift
//  Flyweight
//
//  Created by Choiwansik on 2023/01/02.
//

import Foundation

internal func main() {
    let number = Number(integer: 434331)
    number.print()
}

main()

````

## Number

````swift
//
//  Number.swift
//  Flyweight
//
//  Created by Choiwansik on 2023/01/02.
//

import Foundation

internal class Number {

    internal init(integer: Int) {
        let string = String(integer)

        let factory = DigitFactory()

        (0..<string.count)
            .map { (offset: Int) -> String in
                let index = string.index(string.startIndex, offsetBy: offset)
                return String(string[index])
            }
            .compactMap { Int($0) }
            .forEach {
                self.digitList.append(factory.digit(of: $0))
            }
    }

    internal func print() {
        self.digitList.forEach {
            $0.print()
        }
    }

    private var digitList = [Digit]()
}

````

## DigitFactory

````swift
//
//  DigitFactory.swift
//  Flyweight
//
//  Created by Choiwansik on 2023/01/02.
//

import Foundation

internal class DigitFactory {

    internal func digit(of integer: Int) -> Digit {
        // 0-9 이외의 값이 들어오는 경우는 시간상 제외함

        if let digit = self.pool[integer],
           digit != nil {
            return digit!
        } else {
            let digit = Digit(filename: "\(integer).txt")
            self.pool[integer] = digit
            return digit
        }
    }

    private var pool = Dictionary(uniqueKeysWithValues: zip(0...9, [Digit?].init(repeating: nil, count: 10)))
}

````

## Digit

````swift
//
//  Digit.swift
//  Flyweight
//
//  Created by Choiwansik on 2023/01/02.
//

import Foundation

internal class Digit {

    internal init(filename: String) {
        self.data = TextReader.read(filename: filename)
    }

    internal func print() {
        Swift.print(self.data)
    }

    private var data = ""

}

````

## 결과

````swift
   #
  ##
 # #
#####
   #
 ###
    #
 ###
    #
 ###
   #
  ##
 # #
#####
   #
 ###
    #
 ###
    #
 ###
 ###
    #
 ###
    #
 ###
  #
  #
  #
  #
  #
````

# 동기

* 객체 중심으로 설계하는 것은 많은 효과를 얻을 수 있지만, 구현 비용이 높을 경우가 있을 수도 있다.
* 문자 편집기 같은 것을 생각할 때, 화면에 실제로 표현되기 위한 데이터를 계속해서 생성해서 사용한다면 비용이 많이 든다.

# 활용성

* 응용 프로그램이 대량의 객체를 사용해야 할 때
* 객체의 수가 너무 많아져 저장 비용이 높아질 때
* 대부분의 객체 상태를 부가적인 것으로 만들 수 있을 때
* 객체의 많은 부분을 적은 수의 공유 객체로 대체할 수 있을 때

# 구조

![](DesignPattern_14_Flyweight_0.png)

# 참여자

* FlyWeight(`Digit`)
* FlyWeightFactory(`DigitFactory`)
* Number(`client`)

# 협력 방법

* `client`는 `Flyweight` 인스턴스를 `FlyWeightFactory`에 요청하여 사용한다.

# 결과

* 장점
  * 공유 객체 사용을 통해 메모리 절약
  * 인스턴스 개수 줄일 수 있음
  * 본질적 상태(숫자는 10개 - 10개만 있으면 됨)를 줄일 수 있음
* 단점
  * 런타임 비용 증가
  * 부가적 상태(숫자를 의미하는 것 이외의 상태 - `Number`와 같은 것, 색상 등등)를 연산해야 함

# 구현

* 공유 하여 사용할 것이기 때문에 **본질적 상태로 만드는 것이 중요하다.**
* 부가적인 상태는 제외하고 연산을 통해 처리한다.
* 공유 객체를 관리할 녀석을 만든다.

# 생각해볼 점

* 늦은 생성 (lazy Initialzation)은 언어 차원에서 지원해주는 것이 보다 좋다고 느꼈다.
* 그리고 컴파일러 단에서 최적화가 일어날 수도 있다.
* 값이 초기에 생성되는 경우에만 넣는 개념 자체를 처리하는 방법은 **굳이 패턴을 사용하지 않아도 가능하다.**
* dictionary를 사용하여 명확하게 들어온 경우에만 생성하는 방법도 있다.
* 해당 패턴은 개념에 대해서는 이해하되, 어떠한 구현 방법에 매몰되지 않는 것이 좋다.
* 성능이 높아진 것도 해당 패턴의 중요성이 줄어드는데 역할을 했다.
* 다만, 공유된 상태가 필요할 경우 **본질적, 부가적인 상태를 나누는 것은 의미가 있어 보인다.**

# Reference

* [GoF의 디자인 패턴 - 재사용성을 지닌 객체지향 소프트웨어의 핵심요소](http://www.yes24.com/Product/Goods/17525598)
* [GoF의 Design Pattern - 8. Flyweight](https://www.youtube.com/watch?v=tYEg5vYJgQ4&list=PLe6NQuuFBu7FhPfxkjDd2cWnTy2y_w_jZ&index=8)
* [DesignPattern-12-Flyweight](https://github.com/wansook0316/DesignPattern-12-Flyweight)
