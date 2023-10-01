---
title: Protocol
thumbnail: ''
draft: false
tags:
- swift
- protocol
- protocol-oriented-programming
- POP
created: 2023-09-30
---

Protocol의 경우 POP라는 개념으로 Apple에서 밀어주는? 개념이다. 

# Protocol

* 어떤 작업/기능을 위한 method, property의 interface 정의시 사용
* class, struct, enum에 채택되며 그때 해당 type은 요구 사항을 구현 해야 함
* 이를 구현한 경우, type이 protocol을 준수한다고 함

# Objective-C에 비해 나아진 점

* type처럼 사용 가능
* protocol extension을 이용하여 default implementation 가능
  * 준수하는 모든 type이 추가작업 없이 확장 기능을 가짐
* protocol 기반 프로그래밍을 POP라 부름

````swift
protocol SomeProtocol {
var mustBeSettable: Int { get, set }
var doesNotNeedToBeSettable: Int { get }
}
````

# Protocol Type

* 모든 type과 동일한 동작 가능
  * return type 가능
  * property로 사용 가능
  * container(array, dictionary etc)의 element로 사용 가능

# Inheritance

* 기존 존재하는 다른 protocol을 상속받아 확장 가능
* **class와 달리 multiple inheritance 가능**

# Class-only Protocol

* class에서만 사용가능하도록 제약 가능
  ````swift
  protocol SomeClassOnlyProtocol: AnyObject, SomeInheritedProtocol {
      // statement
  }
  ````

# Protocol Composition

* 두개 이상 protocol을 만족하는 type을 정의할 수 있음
  ````swift
  protocol Named {
      var name: String { get }
  }
  
  protocol Aged {
      var age: Int { get }
  }
  
  struct Person: Named, Aged {
      var name: String
      var age: Int
  }
  
  func withHappyBirthday(to celebrator: Named & Aged) {
      // statement
  }
  ````

# `is`, `as` 연산자의 의미

* `is`
  * protocol conform시 True
* `as`
  * `as?`
  * protocol conform하지 않으면 nil
* `as!`
  * protocol conform하지 않으면 runtime error

# Optional Protocol Requirement

* Objective-C에서 처럼 Optional 정의 가능
* 단, Objective-C class 상속 받은 class만 채택가능
* `@objc` attribute 사용하여 선언
* `@objc optional var ...`
* `@objc optional func ...`

# Protocol Constraint

* protocol을 conform할 수 있는 타입에 대한 제약을 걸 수 이씅ㅁ
* `where` 사용

````swift
protocol RandomBAckgroundColorView where Self: UIView {
	// statement
}
````

# Protocol Extension

 > 
 > Default function

````swift
extension RandomNumberGenerator {
	func randomBool() -> Bool {
	  return random() > 0.5
	}
}
````

 > 
 > Default Value

````swift
extension CounterDataSource {
	var fixedIncrement: Int {
	  return 0
	}
}
````

* extension으로 default value를 구현해두면, 필요시에만 추가 구현하도록 처리가 가능
* 경우에 따라서 `optional`을 대체할 수 있음
  * `@objc` attribute 지울 수 있음

# Constraint 추가

* 확장시 제약을 걸 수 있음

* `where` 사용

* protocol 자체 기능 (내부에 구현되어 있는)만 이용해서 기능 확장 해야함

* 기존에 그 protocol을 준수하는 모든 type이 확장된 기능을 가지게 됨
  
  ````swift
  extension Collection where Element: Equatable {
      func allEqual() -> Bool {
    	  for element in self {
    		  if element != self.first {
    			  return False
    		  }
    	  }
      }
  }
  ````
