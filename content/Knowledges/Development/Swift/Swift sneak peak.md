---
title: Swift sneak peak
thumbnail: ''
draft: false
tags:
- Optional
- swift
- value-type
- reference-type
created: 2023-09-30
---

처음에 Swift 공부할 때는 정말 아무것도 몰라서, 힘들었던 경험이 있다. 좋은 기회로 한번더 정리할 시간이 생겼다. 다시한번 전체적으로 훑는 시리즈를 만들어본다. 먼저, Swift가 어떤 언어적 특징을 갖는지, 기본 문법은 어떤지 알아보는 시간을 가지려 한다.

# Swift의 특징

* 강타입 언어
* let 사용을 늘려야 함
  * Value 타입이 존재
* Optional
  * 값의 부재 가능성을 항상 염두에 두어야 함
* 네이밍에 신경 쓴다.
  * 명확한 사용을 권장한다.
    * remove(x) : x라는 값을 지우라는 것인가? x번째 인덱스를 지우라는 것인가?
    * remove(at :x)
  * mutatating/nonmutating 메소드 쌍을 일관되게 이름을 지정
    * reference로 변경하는 경우 동사형
    * return 하는 경우 ed, ing

# Constant & Variable

* let
  * constant
  * 변경 불가
* var
  * variable
* let 사용 권장
  * 디버깅 용이
    * 확인 포인트 줄어듦
  * 가독성 향상

# Swift의 Type

value, reference type이 존재한다.

||Value Type|Reference Type|
|::|:---------|:-------------|
|다른 변수에 대입|<p>값 자체가 복사됨</p> <p>별도의 instance가 생성</p>|<p>reference가 대입됨</p><p> 두 변수가 동일한 instance 를 가르키게 됨</p>|
|member값의 변경|해당 type이 var로 선언되면 변경가능하나 let으로 선언 되면 변경 불가능.|해당 type이 대입된 상태에 상관없이 member값은 변경 가능|
|해당되는 요소|enum / struct|class / function|
|대표적인 것|String, Array, Dictionary 등|Class 로 선언된 객체, Singleton, Manager ...|

## Value Type

* Struct, Enum
* 선언시 참조하는 변수/상수 외에 참조 불가
* 대입되는 경우 복사됨
  * `let a = TempStruct()`
  * `let b = a` 라 할 경우 참조가 아니고 복사됨
* argument로 넘어갈 경우 복사됨
* return 시 복사됨
* 사본 수정해도 원본에 영향이 없음
* 실제 코드 짤 때, Struct로 만들고 값을 넘기다가 부작용이 일어나는 경우도 있음(Class의 동작 기대한 경우)
* Copy On Write
  * 하지만 매번 복사하는 것은 아님
  * 컴파일러가 복사본의 변경 유무를 판단하여 기존 값을 재사용할지 새로 만들지 판단함

## Reference Type

* class, function
* 선언 이외에 다른 곳에서 참조가 가능한 type
* 대입되는 경우 참조됨
* argument로 넘어가도 참조됨
* return되어도 참조됨
* 참조하는 변수에서 변경하면 모든 참조된 곳에서 변경됨

## Value 타입의 장점

* 보통은 Value type은 stack에 저장되기 때문에 dereference 과정이 필요없음
* dereference
  * reference type은 stack에 heap에 저장된 포인터를 저장해두기 때문에 (여러 곳에서 참조하기 위함) 다시 heap 공간으로 가서 값을 읽어야 함
  * 결국 2번 가야한다는 뜻
* 따라서 더 빠름
* Mutability 제어가 더 강력함
* class로 만들 것을 struct로 만든다면, member값도 변경이 불가함
  ````swift
  class A {
      var variable: Int
      
      init(variable: Int) {
          self.variable = variable
      }
  }
  
  struct B {
      var variable: Int
  }
  
  let temp1 = A(variable: 10)
  let temp2 = B(variable: 20)
  
  temp1 = A(variable: 20) // Impossible
  temp2 = B(variable: 30) // Impossible
  
  temp1.variable = 100 // Possible
  temp2.variable = 400 // Impossible
  ````

* 보다 함수형 프로그래밍 개념에 맞는 코딩이 가능

# Basic Grammar

* Type Alias
  * 새로운 이름 부여 가능
  * `typealias SampleRate = UInt16`

## Numbers

* Integers
  * 통상적으로 Int, UInt 사용
    * Int는...
      * 32Bit Platform: Int32
      * 64Bit Platform: Int64
      * CPU가 한번에 처리하는 데이터 최소단위 크기
      * 프로그램 카운터의 크기
        * 32bit = 4byte의 주소공간 표현 가능
        * 2^32 = 4GB
        * 따라서 메모리 공간은 4GB가 한계였음
  * 명확하게 크기를 정해야 하는 껴우
    * Int8, Int16, Int32, Int64
    * UInt8, UInt16, UInt32, UInt64
  * bounds 확인
    * UInt8.min, UInt8.max
* Floating-Point Numbers
  * Float(32bit)
  * Double(64bit)
* Type Inference
  * 컴파일러가 값 유추해줌
  * 하지만 Type 명시시, 컴파일 시간 줄일 수 있음
  * 경우에 따라서(소통해야 하는 경우) 명시해야 함
* Numeric Literals
  * prefix
    * Dicimal: 123
    * Binary: 0b1001
    * Octal: 0o771
    * Hexadecimal: 0xAC33
  * 지수 표현
    * `let a = 3.44e2`
    * `let b = 2.14e-2`
  * Big Number
    * 큰 숫자의 경우 읽기 쉽게 중간에 `_`를 넣을 수 있음
    * `let milion = 1_000_000`
* Numeric Type Conversion
  * Swift는 강타입 언어이기 때문에 Type이 다를시 연산 불가
  * Int 변수를 Double로 변경시 `Double(a)`와 같이 사용함
    * 이 때, 이 작업은 **Casting이 아님**
    * Double과 같은 자료형은 Swift에서 Struct로 구성되어 있고, Int를 받아 Double 구조체를 생성하는 것임
  * 같은 Integer(UInt, Int)여도 크기가 다르다면 Conversion해야 함

## Booleans

* 1과 True는 다른 Type임
* 역시 구조체임

## Tuple

* 여러개 값을 하나의 복합 값으로 표현
  ````swift
  let http404Error = (404, "Not Found")
  let (statusCode, message) = http404Error
  let (code, _) = http404Error
  
  let http200 = (code: 200, message: "OK")
  let code = http200.code
  let message = http200.message
  ````

## Any, AnyObject, nil

* Any
  * Swift의 모든 타입을 지칭하는 키워드
  * 중요한 점은 예를 들어 Any 타입의 변수안에 Double형 변수를 넣어두었다 하더라도
  * 다른 Double 변수에 이 변수를 직접적으로 할당할 수 없다는 것이다.
  * 꼭 형변환을 해줘야 한다.
* AnyObject
  * 모든 클래스 타입을 지칭하는 프로토콜
  * 프로토콜은 추후에 알아보자.
  * AnyObject는 클래스의 인스턴스만 받아먹기 때문에, 다른 인스턴스를 사용하면 에러가 난다.
* nil
  * '없음'을 의미
  * `Any`, `AnyObject`에 값을 할당할 수 없다!!!!!!!!!!

## Optional

* 값이 존재하지 않을 수 있을 때 사용
* 값이 없는 경우 `nil` 사용
* Explicit Optional
  * `let a: Int? = 3`
  * 값을 상자안에 담는 모양
    * 비어있을 수도 들어있을 수도 있음
* Implicit Optional
  * `let a: Int! = 3`
  * 값을 상자에 담으나, 들어있다고 가정하는 상태
  * 값이 있다고 가정하고 사용하기 때문에, 만약 없을 경우 런타임 에러
  * 가능하면 사용하지 않는 것을 권장

### Unwrapping 방법

* 값이 상자안에 들어있다면, 이를 꺼내서 사용해야 함
* 꺼내는 방법으로는 크게 2가지가 있음
* Optional Binding
  * 상자를 여는 방법
  * `if let`
    * 조건 만족하지 않을 경우 Early Exit이 필요할 경우
  * `guard let`
    * 조건을 만족하지 않더라도 진행되어야 하는 경우
* Force unwrapping
  * 상자를 부수고 값을 가져옴
  * 값의 존재가 확실할 경우 사용
  * 값이 있다고 가정했기 때문에 없을 경우 런타임 에러
  * `let a = b! + 10`

## Assert

* Debugging을 위해 넣는 문
* 특정 함수의 결과 자체가 원하는 결과와 맞는지 확인하기 위함
* 보통 Test 코드에서 자주 사용함
