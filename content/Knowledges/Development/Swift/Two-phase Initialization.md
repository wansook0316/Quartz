---
title: Two-phase Initialization
thumbnail: ''
draft: false
tags:
- two-phase-initialization
- swift
- class
created: 2023-09-30
---

이전 글에서 초기화를 알아보았다. 그런데 그 과정에서 Two Phase Initialization이라는 생소한 단어를 보았다면 잘 왔다. Swift는 상속 과정에서 모든 instance의 property의 값이 보장되기 위한 방법으로 2단계 초기화 방법을 사용한다. 예시를 기반으로 작성했으니 쉽게 이해가 가능할 것이다. 생각보다 별 것 없으니 겁먹지 말자. 쉽게 이해하고 싶다면 모든 property의 초기화를 보장하기 위한 방법이라는 것을 염두에 두고 글을 읽자. 그럼 시작해보자.

# 초기화 호출과정 따라가기

````swift
class drink {
    var size: String
    
    init() {
//        self.describe() // 내부 속성이 초기화되지 않았기 때문에 사용불가
        self.size = "Tall"
        self.describe()
        print("2단계")
        print("self 가능")
    }
    
    func describe() {
        print("Drink!")
    }
}

class Coffee: drink {
    var price: Int
    
    override init() { // 역할 : 해당 클래스 인스턴스의 모든 속성값이 설정되어 있는지 체크
        // 그래서 init을 먼저 호출하면 안됨..
        self.price = 5700
        super.init()
        self.size = "sdgsd"
    }
    
    convenience init(size: String, price: Int) {
        print("1단계 시작")
        print("self 불가능")
        self.init() // 순서 바꾸면 작동 안함 : 지정 생성자를 먼저 타고 올라가야 self 접근 가능..
        self.size = size
        self.price = price
    }
}

let coffee = Coffee(size: "tall", price: 5600)
````

호출되는 과정을 따라가 보도록 하겠다.

* 1단계
  * coffee 인스턴스가 생성된다.
    * convinience 생성자이므로, 해당 인스턴스의 지정 생성자를 먼저 호출한다.
      * 이 단계에서 순서를 변경하면 컴파일 에러
  * coffee의 지정 생성자가 호출된다.
    * 지정 생성자는 먼저, **자기 자신만이 가지고 있는 property를 먼저 초기화한다.**
      * 이 단계에서 순서를 변경하면 컴파일 에러
    * super 클래스의 프로퍼티를 변경하면 컴파일 에러
  * 상위 클래스(drink)의 생성자를 호출한다.
    * 상위 클래스에서는 또, 자기 자신만이 갖는 프로퍼티를 모두 초기화 한다.
      * 즉, 메모리에 할당 받는다.
    * 이 단계에서 메서드 호출이 불가하다(컴파일 단계에서 막아둠)
      * 이 이유는 메서드의 경우, 모든 프로퍼티가 세팅된 상태에서 사용하는 것이 옳은 방향이기 때문이다.
  * 상위 클래스에서 모든 생성자에서 프로퍼티를 초기화 한다.
* 2단계
  * 이제 모든 프로퍼티가 초기화 되어 각각의 인스턴스에서 self로 접근이 가능하다.
  * 다시 상위 클래스에서 하위 클래스의 작업 흐름을 따라가면서 값을 업데이트 한다.
  * coffee 인스턴스의 경우 이제 지정 생성자에서 `size`를 변경할 수 있다.
  * 다음으로 편의 생성자에서 coffee인스턴스의 프로퍼티를 변경할 수 있다.

해당 방법을 확인하기 위해서는 break point를 걸고 debugger에서 `po self`와 같은 명령어를 통해 접근이 가능한지 확인할 수 있다.

# 규칙

위의 방법을 이해했다면 앞으로 나오는 규칙은 사실 당연하게 이해할 수 있다.

1. 지정 생성자에서는 현재 클래스에서 정의한 저장 프로퍼티의 초기값을 가진 후에 super.init을 호출해야 한다. : 안전성 체크를 위함 인듯. 하위 클래스에서 먼저 잘한다음에 상위로 가자 이런 의미

* 하위 클래스 -> 상위 클래스로 초기화가 이루어짐: 메모리 할당이 이루어짐
* 마지막은 최상단 클래스에서 초기화가 이루어짐
* 즉, 서브클래스의 크기는 super 클래스로 가기전에 알고 있음

2. 지정 생성자는 상속 받은 property값을 넣기전에 super class init을 호출해야 함

* 보면, 그렇지 않으면 상위 클래스에서 사용하는 프로퍼티가 초기화되지 않았기 때문에 반영이 안될 가능성이 있음

3. 편의 생성자에서 값을 할당하기 전에, 지정 생성자를 호출해야 함

* 이것도 원리상으로 보면, designated로 프로퍼티의 값을 할당하기 때문에, 해당 함수를 호출하지 않고 값을 변경할 수 없음. 왜냐면 초기화가 안되어 있으니까

4. 1단계가 끝나기 전에 메서드 호출을 하지 못한다.

* 인스턴스의 초기값으로 init을 한뒤에 메서드 호출이 가능하다. 그렇지 않을 경우 쓰레기값을 뱉을 수 있기 때문이다.

# 결론

* 1단계: designated 생성자를 통해 해당 인스턴스가 사용하는 속성을 초기화하고 메모리에 할당한다.
  * 이 과정에서 subclass -> superclass로 이동하며,
  * subclass에서 사용하는 프로퍼티의 초기값을 무조건 설정해야 한다.
  * super 클래스에서 사용하는 값도 모두 초기화가 된다.
  * 즉 초기값으로 모두 init하는 과정임
* 2단계: 상위, 혹은 subclass에서 사용하는 속성값에 접근하여 원하는 값으로 변경한다.
  * 이제야 self에 접근할 수 있다. 접근한 상태에서 프로퍼티의 값을 변경한다.

# 사용 이유

* 안전하게 init되는 것을 보장하기 위해 사용하는 방법으로 보인다.
* 하위 클래스에서 사용하는 속성이 있는지 확인, 메모리 할당하고 위로 보냄
* 이 방식으로 재귀적으로 상위까지 탐색하고, 모든 메모리가 할당되는 것이 보장됨
* 보장된 후에 self를 사용할 수 있도록 하여, 잘못된 사용을 방지함

# Reference

* [Initialization](https://docs.swift.org/swift-book/LanguageGuide/Initialization.html)
* [iOS init 2부](https://hcn1519.github.io/articles/2019-02/swift-init-class-deep)
* [\[iOS\] NSObject / isa / Selector](https://you9010.tistory.com/229)
* [isa](https://developer.apple.com/documentation/objectivec/id/1418809-isa)
