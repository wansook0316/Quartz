---
title: AsyncStream
thumbnail: ''
draft: false
tags: null
created: 2023-09-22
---

AsyncSequence를 공부하다 후반에 나온 AsyncStream을 이해하지 못해 문서를 읽어본다.

# AsyncStream

이전 글에서 AsyncSequence를 Custom하게 만드는 방법까지 알아보았다. 하지만 Apple에서는 기존 로직을 converting하는데 있어 다른 방법을 제안하는데, 그녀석이 `AsyncStream`이다.

````swift
public struct AsyncStream<Element> {
    ...
}
extension AsyncStream : AsyncSequence {
    ...
}
````

일단 우리가 이전에 알아본 `AsyncStream`을 준수하고 있다는 것을 확인할 수 있다. 그렇다면, 이 친구는 AsyncSequence를 만들어주면서 다른 추가적인 method가 들어간 녀석이 아닐까? 맞다.

# Example

이해하기 위해 Zedd님의 예시 코드를 가져왔습니다.

````swift
let digits = AsyncStream<Int> { continuation in
    for digit in 1...10 {
        continuation.yield(digit)
    }
    continuation.finish()
}
Task {
    for await digit in digits {
        print(digit) // 1, 2... 10
    }
}
````

이렇게 하면 AsyncStream을 만들 수 있다. 이전에 비해 상대적으로 쉽게 AsyncStream을 만들 수 있다. 그런데 내부적으로 동작하는 방식을 모르겠다.

# AsyncStream.init

일단 AsyncStream의 생성자가 이상하다. 생성시에 closure를 받고 있다.

````swift
init(
    _ elementType: Element.Type = Element.self,
    bufferingPolicy limit: AsyncStream<Element>.Continuation.BufferingPolicy = .unbounded,
    _ build: (AsyncStream<Element>.Continuation) -> Void
)
````

실제로 보면, 기본 인자를 두개 받고, 마지막에 build라는 변수로 closure를 받고 있다. 

1. `elementType`
   * AsyncStream이 생산하는 Type을 정의한다.
1. `bufferingPolicy`
   * concurrent하게 생산한 아이들을 모아둘 버퍼의 크기를 정한다.
1. `build`
   * 어떤 방식으로 수확(yield)할지에 대한 방법을 정의한다. 해당 클로저는 continuation 인스턴스를 받는데, 이걸로 스트림에 주입하고 종료할 수 있다.

buffer? 어떻게 버퍼로 동작하는지 궁금하여 아래의 코드를 구성했다.

````swift
let stream = AsyncStream<Int>(Int.self,
                              bufferingPolicy: .bufferingNewest(5)) { continuation in
   for i in 0..<10 {
        continuation.yield(i)
    }
    continuation.finish()
}

Task {
    // Call point:
    for await random in stream {
        print ("\(random)") // 10개중 현재시점으로 부터 가장 근방에 발생한 5개의 원소만 가져온다. (5, 6, 7, 8, 9)
    }
}
````

해당 동작 방식을 통해 어느정도 어떻게 동작하는지 유추해볼 수 있을 것 같다. build로 넣은 클로저는 다른 thread에서 동작하게 하고, 결과를 특정 buffer에 받은 뒤, 

# AsyncStream.Continuation

 > 
 > A mechanism to interface between synchronous code and an asynchronous stream.

* Producing Element
  * yield method를 사용해서 생성한 type의 instance를 stream에 제공하라고 문서에 나와있다. 
* Finishing the Stream
  * stream 주입이 모두 끝나면, finish method를 사용하여 stream을 종료하라고 한다.

# AsyncThrowingStream

AsyncStream이 AsyncSequence를 쉽게 만들어주는 친구라면, 이전 글에서 보았듯 throw를 처리하는 녀석도 쉽게 만들 수 있어야 한다. 이를 쉽게 만들어주는 친구가 요녀석이다.

````swift
enum CustomError: Error {
    case fiveError
}

let digits = AsyncThrowingStream<Int, Error> { continuation in // AsyncThrowingStream.Continuation ✅ AsyncStream.Continuation ❎
    for _ in 1...10 {
        let digit = Int.random(in: 1...10)
        if digit == 5 {
            continuation.finish(throwing: CustomError.fiveError)
        }
        continuation.yield(digit)
    }
    continuation.finish()
}

Task {
    do {
        for try await digit in digits {
            print ("\(digit)")
        }
    } catch {
        print(error)
    }
}

// 10
// 7
// 9
// 7
// fiveError
````

# onTermination

두 타입 모두, stream이 termination 되는 시점에 continuation에 `onTermination` 콜백을 지정할 수 있다. (`AsyncStream.Continuation.Termination`, `AsyncThrowingStream.Continuation.Termination`)

````swift
let digits = AsyncStream(Int.self) { continuation in
    continuation.onTermination = { termination in
        switch termination {
        case .finished:
            print("producing finished")
        case .cancelled:
            print("producing cancelled")
        @unknown default:
            fatalError()
        }
    }

    for _ in 1...10 {
        let digit = Int.random(in: 1...10)
        if digit == 5 {
            continuation.onTermination?(.cancelled)
        }
        print("produced: ", digit)
        continuation.yield(digit)
    }
    print("before producing finish")
    continuation.finish()
    print("after producing finish")
}

Task {
    do {
        for try await digit in digits {
            print ("stream: \(digit)")
        }
    } catch {
        print(error)
    }
}

produced:  8
producing cancelled
producing finished
produced:  5
produced:  9
produced:  5
produced:  3
produced:  7
produced:  9
produced:  6
produced:  7
produced:  4
before producing finish
after producing finish
stream: 8
````

위의 동작을 했을 때, `onTermination`을 호출하면 동작이 멈추는 것으로 이해했는데 그러지는 않는 듯 하다. 

 > 
 > This means that you can perform needed cleanup in the cancellation handler.

공식 문서에 나온 표현으로 미루어 짐작해보았을 때, 해당 스트림이 finish 되거나 cancel될 때 발생하는 동작을 규정하는 듯 하다. 만약 digit이 5인 경우 동작 수행을 종료하고 싶다면, `break` 문등을 추가하여 만드는 것이 맞는 듯하다.

추후에 공부하면서 알게 된 것인데, 여기서 onTerminate의 cancel은 structured concurrency와 관련이 있는 듯 하다. 추후 글에서 알아보도록 하자.

# Reference

* [AsyncStream / AsyncThrowingStream (feat. RxSwift + Concurrency)](https://zeddios.tistory.com/1341)
* [AsyncStream](https://developer.apple.com/documentation/swift/asyncstream)
* [AsyncStream.Continuation](https://developer.apple.com/documentation/swift/asyncstream/continuation)
  * [yield(\_:)](https://developer.apple.com/documentation/swift/asyncstream/continuation/yield(_:))
  * [finish()](https://developer.apple.com/documentation/swift/asyncstream/continuation/finish())
  * [onTermination](https://developer.apple.com/documentation/swift/asyncstream/continuation/ontermination)
  * [AsyncStream.Continuation.Termination](https://developer.apple.com/documentation/swift/asyncstream/continuation/termination)
