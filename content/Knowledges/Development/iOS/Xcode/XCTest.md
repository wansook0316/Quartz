---
title: XCTest
thumbnail: ''
draft: false
tags:
- swift
- ios
- test
- testing
- unit-test
- assert
- expectation
- async
- test-double
- mocking
- stub
created: 2023-10-02
---

Test라는 과정은 사실 공학 어디에서든 등장하는 개념이다. 작업에 의존도가 있고, 복잡한 과정으로 넘어갈 수록 이전 단계의 오류는 치명적이기 때문이다. 이를 관리하는 방법이 Test라 할 수 있다. 소프트웨어에서 역시 이러한 개념이 적용된다. 어떤 것인지, 왜 필요한지, 어떻게 할 수 있는지 알아보자.

# Unit Test 예시

![](Pasted%20image%2020231002133729.png)

1. URLRequest 준비
1. Task 생성
1. 서버와 통신
1. Response parsing
1. View Update
   ![](https://user-images.githubusercontent.com/37871541/153569946-aaa0ddf7-aa75-4e98-8b3a-1022eca46d28.png)

일반적인 이러한 시나리오에서 Unit test가 가능한 모듈은 request를 준비하는 과정, 그리고 response를 파싱하는 과정이다. 

![](Pasted%20image%2020231002133737.png)

Integration Test의 경우, 일련의 과정을 한꺼번에 확인하는 것을 말한다.

![](Pasted%20image%2020231002133743.png)

마지막으로 End-to-End Test(UI Test)는 실제 UI까지 전체적으로 보는 것을 맗한다.

# 왜 필요할까?

 > 
 > 사람은 실수하니까

* 사람의 실수를 방지하기 위한 것들
  * Swift Compiler: Language Type을 위해
  * SwiftLint: Validation을 위해
  * Code Review: code quality를 위해
  * Test: 유지보수를 위해
* 자동화된 Test의 강점
  * 소스코드의 기본 동작 검증
  * 리팩토링에 유리
  * Usecase를 확인할 수 있음 (Documentation 대체)
  * Interface 설계를 강요함
    * Testability 확보하기 위해 설계를 고민해야 함
* 하지만 100% 버그 없는 코드를 보장해주지는 않는다. 보완할 뿐.

# XCTestCase

* 하나의 Test Target에 XCTestCase를 상속받은 여러개의 Test Class가 존재한다.
* Test Class 별 여러 Test Case method가 있다.

![](Pasted%20image%2020231002133757.png)

처음 Target을 만들고 적용하면, 다음과 같은 클래스가 하나 만들어진다.

````swift
import XCTest
@testable import ExampleApp

class ExampleAppTests: XCTestCase {
    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testExample() throws {
        // This is an example of a functional test case.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
    }

    func testPerformanceExample() throws {
        // This is an example of a performance test case.
        self.measure {
            // Put the code you want to measure the time of here.
        }
    }
}
````

* `setUpWithError()`, `tearDownWithError()`: 각 test case실행 전 후 각각 실행된다.
  * `setUpWithError()` → `testA()` → `tearDownWithError()`
    * `setUpWithError()` 와 `tearDownWithError()` 는 Xcode12에서 새로 소개됨. 
    * 기존 버전 Xcode에서 사용하던 `setUp()`, `tearDown()` 도 사용가능
* `test*()` : test 로 시작하는 메소드가 test case가 된다.
  * 하나의 Test Case에는 일반적으로 하나의 `XCTAssert*` 가 존재해야 한다.
  * `XCTAssert*` 가 존재하지 않으면 해당 Test case는 성공으로 처리된다.
* `@testable import`
  * import된 모듈의 internal 접근이 가능해 진다. (일반적인 import에서는 public 만 가능)
  * fileprivate, private 은 여전히 접근할 수 없다.

# Assertion

 > 
 > 모든 Test case는 특정 조건(condition)으로 요약할 수 있다.

````swift
XCTAssert(result == expected, "결과와 예측이 같아야 함")
````

다양한 `Assertion` 함수가 존재한다. 실패시 어떤 이유로 실패했는지 좀더 명확하게 알 수 있다. 위 예시처럼 message를 사용하는 것도 방법이다.

|category|function name|
|--------|-------------|
|Equality|`XCTAssertEqual`, `XCTAssertNotEqual`|
|Truthiness|`XCTAssertTrue`, `XCTAssertFalse`|
|Nullability|`XCTAssertNil`, `XCTAssertNotNil`|
|Comparison|`XCTAssertLessThan`, `XCTAssertGreaterThan`, <br />
`XCTAssertLessThanOrEqual`, `XCTAssertGreaterThanOrEqual`|
|Erroring|`XCTAssertThrowsError`, `XCTAssertNoThrow`|
|Speacial|`XCTFail` : 항상 실패<br />
`XCTUnwrap`: expression이 nil이면 실패, nil이 아니면 unwrapped value 반환|

## 작성 방법

* Given
  * 어떠한 상황에서
* When
  * 어떤 행동을 취할 때
* Then
  * Assertion
  * 결과를 확인해라

````swift
func testSplit_useDefaultSeparator_splitWords_Success() throws {
    // Given
    let text = "기본 파라미터 테스트"

    // When (use default separator: space)
    let result = try? split(text)

    // Then
    XCTAssertNotNil(result)
    XCTAssertEqual(result, ["기본", "파라미터", "테스트"])
}
````

# Expectation

 > 
 > 비동기 동작의 테스트 작성

````swift
func asyncFunction(with completion: @escaping (Int) -> Void) {
    let someParallelTask = {
        // write code
    }
    DispatchQueue.global().async {
        let result = someParallelTask()
        DispatchQueue.main.async {
            completion(result)
        }
    }
}
````

특정 함수 실행시, global queue에서 동작 실행 후, main에서 화면을 업데이트한다고 가정한 completion code를 실행시킨다고 생각해보자. 어떻게 테스트할 수 있을까?

````swift
func test_asyncFunction() {
    var result = 3.6
    asyncFunction { result = $0 } // 계산 후 값을 반영
    XCTAssertEqual(result, 3.6) // 결과와 예상 값 비교
}
````

이렇게 작성했다면, 실패한다. `@escaping closure`의 실행 시점을 호출 시점에 알 수 없기 때문이다. completion이 호출되기 전 테스트가 종료된다.

## XCTestExpectation

````swift
func test_asyncFunction_with_expectation() {
    var result = 3.6
    let expectation = expectation(description: "asyncFunction")
    asyncFunction { calculatedResult in 
        result = calculatedResult
        expectation.fulfill() // 나 결과 받았어!!
    }

    wait(for: [expectation], timeout: 2) // 해당 스레드를 기다려줘! 2초 이후에는 time아웃!
    XCTAssertEqual(result, 3.6)
}
````

`XCTestExpectation`은 주의사하잉 있는데, 현재와 같은 흐름으로 짜는 것이 best practice이다. 즉, 비동기 task안에서 `fullfill` 호출하고, `wait`로 기다려주고, `XCTAssert`로 error, condition 확인하는 순서로 하는 것이 좋다. 

또 수행시간 자체를 테스트하는 목적이라면 timeout을 test 실패 신호로 잡는 것은 괜찮지만, 이 자체를 해당 test case의 실패 신호로 잡는 것은 좋지 못하다. 해당 함수는 함수의 동작 결과를 비교하기 위한 것이기 때문이다.

## Other Expectations

* `XCTKVOExpectation`
  * Observing하는 keyPath의 값이 `expectedValue`가 같아진 경우
  * 등록한 Handler를 만족하면 자동으로 fulfill
* `XCTNSPredicateExpectation`
  * Predicate 조건을 만족하면 자동으로 fulfill
* `XCTNSNotificationExpectation`
  * 특정 Notification이 post되면 자동으로 fulfill

# Test Double (대역)

 > 
 > 자동화된 테스트에서 Production 객체 대신 테스트를 위해 더 간단하게 동작하는 객체를 사용하는 경우

이런 방법을 사용하게 되면 복잡도를 줄이고, 독립적으로 코드 검증이 가능하게 한다. 

## Fake

 > 
 > Production 용은 아니나 동작이 구현된 객체

보통 Production 코드의 간략화된 버전으로 되어 있다.

* In-memory로 구현한 database
  * 실제 database와 관련이 없기 때문에, 요청 응답 시간 등의 외부적 요소의 영향 없이 테스트가 가능하다.

## Stub

 > 
 > 미리 정의된 데이터를 들고 있다가 테스트 중 요청에 따라 그 값을 응답하는 객체

실제 DB나 네트워크에 접근하지 않고, 상황에 맞는 데이터를 전달한다. 

## Mock

 > 
 > 수신된 요청을 기록하는 객체

Mock에 예상된 action이 수행되었는지 검증하는 방식으로 사용한다. 예를 들어 함수 호출시 count되는 flag를 달아서, 해당 flag값을 확인한 것.

실제 코드를 수행하기 싫거나 의도된 코드가 실제 수행되었는지 검증할 때 사용한다. 실제 이메일이 발송되었는지 확인하는 것은 어렵기 때문에, 해당 메소드가 호출되었는지 (count)확인하는 정도로 사용한다.

## Command Query Separation

 > 
 > Logic과 Effect를 분리하여 구현해야 한다. (Bertrand Meyer "Object Oriented Software Construction")

````swift
func averageGrades(sudent: Student) -> Double
````

시스템의 상태를 변경하지 않고 결과를 리턴하는 method를 Query라 한다. 해당 메서드는 사이드 이펙트가 없이 값을 리턴한다. 이와 같은 Query 형태의 메서드를 **Stub**을 사용하여 Test Double할 수 있다. 즉, 값을 들고 있다가 응답하여 test할 수 있다.

````swift
func sendRemiderEmail(sudent: Student)
````

Command는 어떤 action을 수행하여 시스템의 상태를 바꾸면서, 값을 리턴하지 않는 경우를 말한다. 위의 예시의 경우 리턴하지 않고, 시스템의 상태를 변경하고 있다. 이런 경우는 **Mock**을 사용하여 테스트할 수 있다.

# Tips

* 초기화를 잘한다.
  * `setUp()`, `tearDown()`에서 초기화를 잘해주어야 한다.
  * class level의 상태는 과정중에 계속 유지되기 때문에 원치않은 결과가 나올 수 있다.
  * 실행 순서에 의존적인 경우, 원하는 결과가 나오지 않을 수 있다. TC는 독립적이어야 한다.
* 디버깅 잘하기
  * **Given**의 가정을 잘 확인한다.
  * **Then**에서 의도한 결과를 정확히 반영하고 있는지 확인한다.
  * **Test BreakPointer** Break poiunt를 달 수 있는데, 여기서 test Failure Breakpoint를 선택한다.
    * 테스트 실패 지점에 자동으로 breakpoint를 걸어준다.
* 임시 테스트 (Pragmatic Programming)
  * 디버깅 하면서 테스트 케이스를 만들어서 해보는 경우가 있다. 
  * 이런 경우 정식 테스트 코드로 만들어 두어야 한다.
* 테스트 코드 조직화
  * 예시
  ````
  Test Target
  ⎣ Cases
      ⎣ Group 1
          ⎣ Tests 1
          ⎣ Tests 2
      ⎣ Group 2
          ⎣ Tests
  ⎣ Mocks
  ⎣ Helper Classes
  ⎣ Helper Extension
  ````

* Xcode
  * 실행 순서 randomize 옵션이 있다.
    * Xcode > Edit Scheme > Test > Info > Options > Randomize execution order
  * Code Coverage
    * 테스트 코드가 검증한 코드 범위를 reporting 해준다.
    * Xcode > Edit Scheme > Test > Optinos > Code Coverage

# Reference

* [Testing in Xcode](https://developer.apple.com/videos/play/wwdc2019/413/)
* [Test Double - Martin Fowler](https://martinfowler.com/bliki/TestDouble.html)
* [Test Double - xUnit Patterns   ](http://xunitpatterns.com/Test%20Double.html)
* [Mocks Aren't Stubs - Martin Fowler  ](https://martinfowler.com/articles/mocksArentStubs.html) 
* [Command Query Separation - Marin Fowler](https://martinfowler.com/bliki/CommandQuerySeparation.html)
* [iOS Test-Driven Development by Tutorials](https://www.raywenderlich.com/books/ios-test-driven-development-by-tutorials/v1.0)

* [Engineering For Testability (WWDC17)](https://developer.apple.com/videos/play/wwdc2017/414/)

* [Testing tips & tricks (WWDC18)](https://developer.apple.com/videos/play/wwdc2018/417)

* [Testing in Xcode (WWDC19)](https://developer.apple.com/videos/play/wwdc2019/413/)

* [Write tests to fail (WWDC20)](https://developer.apple.com/videos/play/wwdc2020/10091/)
