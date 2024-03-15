---
title: Property
thumbnail: ''
draft: false
tags:
- property-wrapper
- swift
- property
- property-observer
- didset
- willset
created: 2023-09-30
---

간단하게 property는 member 변수이다. 그런데 Swift에는 다양한 종류의 property가 존재한다. 사실 어떻게 보면 활용방법? 테크닉에 가깝겠다. 어떻게 property를 관리하는 지 안다면, 실제 코드를 간결하고 읽기 좋게 유지할 수 있다. 그럼 출발해보자.

# Property의 종류

* 역할에 따른 분류
  * 인스턴스 프로퍼티
  * 타입 프로퍼티
* 종류
  * 저장 프로퍼티
  * 연산 프로퍼티
    * `var`로만 선언 가능
    * 읽기 전용 구현은 가능 - `get` 블록을 작성
    * 쓰기 전용 구현은 불가능

위의 4가지가 섞여서 존재할 수 있다. 즉 4가지의 가능성이 존재.

* 인스턴스 저장 프로퍼티
* 타입 저장 프로퍼티
* 인스턴스 연산 프로퍼티
* 타입 연산 프로퍼티

# Property의 특징

* 구조체, 클래스, 열거형 내부에 구현이 가능
* 열거형에는 연산 프로퍼티만 구현 가능
* 읽기 쓰기 모두가능하게 하려면 `get` 블럭과 `set` 블럭 모두 구현
  * 읽기 전용으로 만들고 싶으면 `get`만 구현
* `set`에서 암시적 매개변수 newValue를 사용할 수 있음

````swift
struct Student {
    // 인스턴스 저장 프로퍼티
    var name: String = ""
    var `class`: String = "Swift"
    var koreanAge: Int = 0
    
    // 인스턴스 연산 프로퍼티
    var westernAge: Int {
        get {
            return koreanAge - 1
        }
        set(inputValue) {
            koreanAge = inputValue + 1
        }
    }
    
    // 타입 저장 프로퍼티
    static var typeDescription: String = "학생"
    
    // 읽기 전용 타입 연산 프로퍼티
    // 읽기 전용이 default라 적지 않으면 읽기전용이라고 판단함
    static var selfintroduction: String {
        return "학생타입입니다."
    }
}
````

* 인스턴스 저장 프로퍼티는 일반적이니 패스
* 인스턴스 연산 프로퍼티는, 특정값을 받아서 다른 저장 인스턴스의 값을 설정해줘야 한다거나 다른 프로퍼티로 부터 연산을 통해 해당 프로퍼티의 값이 도출될 때 주로 사용
* 타입 저장 프로퍼티는 기존에 알고 있던 타입 프로퍼티
* 타입 연산 프로퍼티 역시 비슷하다.
* 이러한 방법을 사용하면 기존의 introduce와 같은 함수를 읽기 프로퍼티를 사용하여 대체하는 것도 가능

````swift
// 인스턴스 생성
var wansik: Student = Student()
wansik.name = "wansik"
wansik.koreanAge = 20

// 인스턴스 저장 프로퍼티 사용
print(wansik.name) // wansik

// 인스턴스 연산 프로퍼티 사용
print(wansik.westernAge) // 19

// 타입 저장 프로퍼티 사용
print(Student.typeDescription) // 학생

// 타입 연산 프로퍼티 사용
print(Student.selfintroduction) // "학생타입입니다."
````

# Property Observers

* 프로퍼티 감시자를 사용하면 프로퍼티 값이 변경될 때, 원하는 동작을 수행할 수 있음
* 값이 변경되기 직전에 willSet 블럭이, 변경 직후 didSet 블럭이 호출됨
* **변경되려는 값이 기존 값과 같더라도 항상 동작**
* `willSet` 블럭에서 암시적 매개변수 `newValue`를 사용 가능
* `didSet` 블럭에서는 `oldValue`를 사용 가능
* 프로퍼티 감시자는 **연산 프로퍼티에서 사용 불가**
* 함수, 메서드, 클로저, 타입 등의 지역/전역 변수에 모두 사용 가능

````swift
struct Money {
    // 프로퍼티 감시자 사용
    var currencyRate: Double = 1100 {
        willSet(newRate) {
            print("환율이 \(currencyRate)에서 \(newRate)으로 변경될 예정입니다")
        }
        didSet(oldRate) {
            print("환율이 \(oldRate)에서 \(currencyRate)으로 변경되었습니다")
        }
    }
    
    // 매개 변수를 암시적으로 newValue, oldValue를 갖는다.
    var dollar: Double = 0 {
        willSet {
            print("\(dollar)달러에서 \(newValue)달러로 변경될 예정입니다")
        }
        didSet {
            print("\(oldValue)달러에서 \(dollar)달러로 변경되었습니다")
        }
    }
    
    // 연산 프로퍼티
    var won: Double {
        get {
            return dollar * currencyRate
        }
        set {
            dollar = newValue / currencyRate
        }
        // get, set과 함께 사용이 불가함
//        willSet {
//            print("원화의 값이 \(won)으로 변경될 예정입니다.")
//        }
//        didSet {
//            print("원화의 값이 \(won)으로 변경되었습니다.")
//        }
    }
}

var moneyInMyPocket = Money()

// 환율이 1100.0에서 1150.0으로 변경될 예정입니다
moneyInMyPocket.currencyRate = 1150.0
// 환율이 1100.0에서 1150.0으로 변경되었습니다

//0.0달러에서 10.0달러로 변경될 예정입니다
moneyInMyPocket.won = 11500
//0.0달러에서 10.0달러로 변경되었습니다

print(moneyInMyPocket.dollar) // 10
````

# Property Wrappers

* **property 저장 방법 코드와 property 관리 코드를 구분**
* property set, get할 때 공통적으로 적용되는 반복코드를 관리할 수 있음
  * 데이터 저장전 스레드 체크
* struct, enum, class 선언 앞에 `@propertyWrapper`를 붙이고 `wrappedValue` 정의하면 됨
* 특정 데이터의 boundary를 정할 수 있음
  ````swift
  @propertyWrapper struct TwelveOrLess {
      private var number = 0
      var wrappedValue: Int {
          get { return number }
          set { number = min(newValue, 12) }
      }
  }
  
  struct SmallRectangle {
      @TwelveOrLess var height: Int
      @TwelveOrLess var width: Int
  }
  ````

* Initializer를 통해 value 초기화 가능
  ````swift
  @propertyWrapper struct SmallNumber {
      private var maximum: Int
      private var number: Int
      
      var wrappedValue: Int {
          get { return number }
          set { number = min(newValue, maximum) }
      }
      
      init() {
          self.maximum = 12
          self.number = 0
      }
      
      init(maximum: Int) {
          self.maximum = maximum
          self.number = 0
      }
      
      init(wrappedValue: Int, maximum: Int) {
          self.maximum = maximum
          self.number = min(wrappedValue, maximum)
      }
  }
  
  struct ZeroRectangle {
      @SmallNumber(wrappedValue: 5, maximum: 10) var height: Int // custom initializer를 사용한 초기화
      @SmallNumber(maximum: 10) var width: Int = 5 // 값 할당과 custom initializer를 섞어서 사용함
  }
  ````

* Projected Value
  * `projectValue`를 사용하면 `wrappedValue`를 다른 방법으로 드러낼 수 있음
  * `$`를 통해 접근이 가능함
    ````swift
    @propertyWrapper struct SmallNumber {
        private var number = 0
        
        var projectedValue = false
        var wrappedValue: Int {
            get { return number }
            set {
                if newValue > 12 {
                    number = 12
                    projectedValue = true
                } else {
                    number = newValue
                    projectedValue = false
                }
            }
        }
    }
    
    struct SizedRectangle {
        @SmallNumber var height: Int
        @SmallNumber var width: Int
        
        mutating func resize(to size: Size) -> Bool {
            switch size {
                case .small:
                    height = 10
                    width = 20
                case .large:
                    height = 100
                    width = 100
            }
            return $height || $width // True or False || True or False
        }
    }
    ````
