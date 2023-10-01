---
title: Initializer
thumbnail: ''
draft: false
tags:
- swift
- class
- struct
- two-phase-initialization
- required
created: 2023-09-30
---

Swift에서 Struct, Class, Enum을 초기화할 수 있는 Initializer에 대해서 알아보자.  이 부분에서 class 초기화는 다른 언어의 초기화 과정과 약간 다른 부분이 있다. 해당 내용은 좀 길어질 수 있어 다음 포스팅으로 넘겼다. 이번에는 Value type, Reference type의 초기화 과정에 대해 개괄적이 내용을 알아보는 것을 목적으로 한다. 그럼 시작하자.

# outline

* class, struct, enum 사용 가능
* stored property 초기화 및 instance 사용 위한 초기화
* initailier라는 method 사용
* return value 없음
  * Objective-C의 경우 있음
* class의 경우 init, deinit을 쌍으로 가짐
* Optional Property의 경우 반드시 초기화할 필요 없음
  * nil로 초기화
* Constant(`let`) Property는 initialization 과정에서 반드시 초기화 되어야 함
  * 이후 변경 불가
* struct의 경우, init을 따로 정의하지 않으면 자동으로 memberwise initializer가 만들어짐
* failable initializer
  * `init?`으로 사용가능함
  * 잘못된 parameter나 외부 resource가 존재하지 않는 경우
  * override 해서 non-failable initializer로 만들 수 있음
    ````swift
    class Document {
        var name: String?
        init() {}
        init?(name: String) {
            if name.isEmpty { return nil }
            self.name = name
        }
    }
    
    class AutomaticallyNamedDocument: Document {
        override init(name: String) {
            super.init()
            if name.isEmpty {
                self.name = "[untitled]"
            } else {
                self.name = name
            }
        }
    }
    ````

* Closure를 통한 default property value setting이 가능함
  * class, struct 가능
  ````swift
  class SomeClass {
      let someProperty: SomeType = {
          // setting
          return someValue
      }
  }
  ````

# Value Type Initialization

````swift
struct Size {
    var width = 0.0, height = 0.0
}

let a = Size(width: 3, height: 4)
let b = Size(width: 10)

print(a.width, a.height)
print(b.width, b.height)
````

* Struct의 경우 자동으로 memberwise initailizer를 갖는다.
* 이게 뭐냐
  * 커스텀 생성자를 지정하지 않았을 경우에 지가 알아서 만들어주는 것
  * 처음에 값을 지정해줬을 때에도 동작,
  * 이미 값을 지정해줬다면 특정 프로퍼티만 초기화하는 것도 가능

````swift
struct Point {
    var x = 0.0, y = 0.0
}

struct Rect {
    var origin = Point() // 0.0, 0.0
    var size = Size()
    
    // init() {}
    init(origin: Point, size: Size) {
        self.origin = origin
        self.size = size
    }

    init(center: Point, size: Size) {
        let originX = center.x - size.width/2
        let originY = center.y - size.height/2
        self.init(origin: Point(x: originX, y: originY), size: size)
    }
}
````

* 위에서는 명시된 생성자가 없을 떄, 프로퍼티가 선언되어 있어 `Size()`도 생성이 되었지만
* 지금과 같은 경우 init을 명시적으로 작성했다면, 추가적으로 선언되지 않는다.
  * 즉 `Rect()`는 생성되지 않는다는 것
  * 만약 사용하고 싶다면 추가적으로 선언해주어야 한다.

# Class Initialization

* 모든 stored property는 initilization과정에서 초기화되어야 함

* 상속 관계의 모든 superclass도 마찬가지

* 이러한 상속 관계에서 역시 모든 property를 초기화하는 것을 보장하기 위해 두가지 형태의 initializer를 가짐
  
  * Designated initializer
    * Primary initializer
    * 모든 property를 초기화 시키는 역할을 함
    * Superclass의 property를 초기화하기 위해 super의 init을 사용
    * 모든 class는 하나 이상의 지명 생성자를 가짐
    * 보통 1개임
  ## Convenience initializer
  
  * Secondary initializer
  * 일부 property에서 default값을 사용할 때 사용
  * 내부에서 designated intializer를 호출함
  * 특정 usecase에서 사용될 객체를 생성할 때 사용
    ````swift
    convenience init(parameters) {
        //statements
    }
    ````

## Delegation Rule

![](Swift_08_Initializer_Deinitializer_0.png)

* Designated initializer는 반드시 위 super의 designated initializer를 호출해야함
* convinience initializer는 반드시 그 class의 다른 initializier를 호출해야 함
* convenience intializer는 최종적으로 designatied initializer를 호출하는 형태어야 함

## Two-Phase Initialization

* Phase 1
  * initializer 호출됨
  * 새로운 instance를 위한 memory가 alloc됨
    * memory 초기화는 아직임
  * designated intiailizer가 모든 stored property에 대한 초기화 진행
  * designated initializer가 super class의 initializer를 호출
  * root class까지 반복 호출
  * 모든 stored property가 초기화되고 phase 1 종료
* Phase 2
  * root class로부터 역으로 수행
  * 모든 class는 instance를 customizer할 수 있음
  * self에 access하고, property 수정하고, instance method 호출 가능
* 보다 자세한 설명은 다음 글에 작성하도록 하겠음
* 이렇게 하는 이유는, 모든 stored property를 초기화하고, 그 다음에 값을 변경하도록 하기 위함임

## require initializer

* 모든 subclass들이 구현해야 하는 initializer
* `required` 사용
* overriding시에도 `required` 사용해야 함
