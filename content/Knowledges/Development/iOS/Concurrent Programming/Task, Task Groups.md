---
title: Task, Task Groups
thumbnail: ''
draft: false
tags: null
created: 2023-09-22
---

Task와 TaskGroup은 무엇일까? 그리고 Apple이 말하는 Structured Concurrency는 무엇일까?

# Calling Asynchronous Functions in Parallel

앞의 글에서 보았듯이 `await` 키워드를 사용하면, 다음코드로 넘어가기 전에 호출자는 해당 작업을 마치는 것을 기다린다.(suspend) 

````swift
let firstPhoto = await downloadPhoto(named: photoNames[0])
let secondPhoto = await downloadPhoto(named: photoNames[1])
let thirdPhoto = await downloadPhoto(named: photoNames[2])

let photos = [firstPhoto, secondPhoto, thirdPhoto]
show(photos)
````

위와 같은 코드를 작성한다면, 3개의 사진이 다운로드 될 때까지 기다리게 된다. 이러한 접근 방법에는 단점이 있는데, 동시에 여러 사진을 다운로드 받을 수 있음에도 불구하고, 한번에 하나의 코드를 대기한다는 것이다. 우리가 하고 싶은 건, 3장의 사진을 받아오는 행위를 병렬적으로 수행하는 것이다.

````swift
async let firstPhoto = downloadPhoto(named: photoNames[0])
async let secondPhoto = downloadPhoto(named: photoNames[1])
async let thirdPhoto = downloadPhoto(named: photoNames[2])

let photos = await [firstPhoto, secondPhoto, thirdPhoto]
show(photos)
````

동시에 수행하기 위해서는, `downloadPhoto` 함수 앞에 `await`를 붙여, 해당 함수의 동작을 기다리도록 하지 않고, 해당 값을 받아줄 변수 앞에 `async`를 붙여 해결할 수 있다. `async let` 구문을 사용하면, 각각의 행위를 독립적으로 다른 스레드에서 동작하도록 할 수 있다. 최종적으로 받는 결과는 모두 담겨야 하기 때문에, `photos` 변수를 받을 때 앞에 `await`를 받아서 처리하면 된다.

* 비동기 함수의 실행 결과가 상하위 코드에 의존적인 경우(결과를 받아 순차적으로 진행해야 하는 경우) `await`를 추가하여 결과를 대기할 수 있다.
* 비동기 함수를 병렬적으로 동작하고 싶을 경우 `async let`을 사용하자. 이럴 경우 Parallel하게 동작시킬 수 있다.
* `await`, `async let` 모두 동작하고 있는 스레드를 suspend하고 다른 코드를 수행하는 것을 허용한다.

# Tasks and Task Groups

**`Task`는 프로그램의 특정 부분을 비동기적으로 동작하게 할 수 있는 work의 단위다.** 모든 asynchronous 코드는 Task의 부분으로 작동한다. 위에서 보았던 `async let`은, 내부적으로 child를 만들어주는 행위와 같다. DispatchQueue에서 DispatchGroup을 만든 것처럼 Task도 Group으로 관리할 수 있다. `Task`를 사용하면 특정 코드의 동작을 capsule화 하여 독립적으로 동작하는, 병렬성까지 활용할 수 있다.

Task는 위계 질서를 가진다. Task Group안에 있는 각각의 Task는 같은 부모 task를 가진다. 그리고 그 각각의 task도 자식 task를 가진다. 이렇게 task들은 굉장히 명백한 관계를 가지는데, 그렇기 때문에 이를 **structured concurrency**라 부른다. **structured concurrency**의 핵심 아이디어는, **Task는 부모 Task의 scope를 벗어날 수 없다는 것이다. 이는 Task Group에도 적용된다. (추가되는 Child Task가 상위 scope를 벗어날 수 없다는 얘기)**

# Task Group

````swift
func getFavoriteIds(for user: User) async -> [UUID] {
    return await network.fetchUserFavorites(for: user)
}

func fetchFavorites(user: User) async -> [Movie] {
    // fetch Ids for favorites from a remote source
    let ids = await getFavoriteIds(for: user)

    // load all favorites concurrently
    return await withTaskGroup(of: Movie.self) { group in
        var movies = [Movie]()
        movies.reserveCapacity(ids.count)

        // adding tasks to the group and fetching movies
        for id in ids {
            group.addTask {
                return await self.getMovie(withId: id)
            }
        }

        // grab movies as their tasks complete, and append them to the `movies` array
        for await movie in group {
            movies.append(movie)
        }

        return movies
    }
}
````

[withTaskGroup(of:returning:body:)](https://developer.apple.com/documentation/swift/withtaskgroup(of:returning:body:))를 사용하면 taskGroup을 사용할 수 있다. 첫번째 인자는 이 TaskGroup을 통해 반환하는 결과 타입을 적어준다. 내부에서는 group의 `addTask` 메서드를 통해 Task를 추가하여 Concurrent하게 동작하도록 한다. `addTask`를 통해 추가하면, 그와 동시에 concurrent하게 수행된다.

여기서 주목할 만한 부분은, `addTask`시 weak하게 `self`를 capture하지 않았다는 것이다. 그 이유는, **모든 task의 동작을 모두 기다린 이후에 return하기 때문에 `self`의 존재 scope가 `withTaskGroup`으로 제한되기 때문이다.** 이 부분이 이해가지 않을 수 있는데, 아래를 계속해서 읽어보자.

그런데, 이상한 점이 있다. concurrent하게 동작하는 결과들을 모두 수집하지도 않았는데 그 다음 코드를 보면, group을 loop를 돌고 있다. 이 때 AsyncSequence에서 본 `for try await` 구문을 사용하고 있다. 이 구문을 사용할 수 있으려면, `group`이 AsyncSequence이어야 한다. `group`은 `TaskGroup` Type인데, 실제로 AsyncSequence인지 확인해보자.

````swift
/// ==== TaskGroup: AsyncSequence ----------------------------------------------
@available(macOS 10.15, iOS 13.0, watchOS 6.0, tvOS 13.0, *)
extension TaskGroup : AsyncSequence { 
    ...
}
````

실제로 내부 코드를 살펴보면, TaskGroup이 AsyncSequence를 채택하고 있음을 확인할 수 있다. 그리고 그 아래에 적힌 주석을 읽어보자.

````
A type that provides an iteration interface over the results of tasks added to the group.
The elements returned by this iterator appear in the order that the tasks *completed*, not in the order that those tasks were added to the task group.

그룹에 추가된 작업 결과에 대해 반복 인터페이스를 제공하는 유형입니다.
이 반복자에 의해 반환된 요소는 태스크 그룹에 추가된 순서가 아니라 태스크 *완료됨* 순서로 나타납니다.

This iterator terminates after all tasks have completed. After iterating over the results of each task, it's valid to make a new iterator for the task group, which you can use to iterate over the results of new tasks you add to the group.

이 반복기는 모든 작업이 완료된 후 종료됩니다. 각 태스크의 결과를 반복한 후 태스크 그룹에 대해 새 반복기를 만드는 것이 유효합니다. 이 반복기를 사용하여 그룹에 추가하는 새 태스크의 결과를 반복할 수 있습니다.
````

즉, group에 task가 추가되면 concurrent하게 동작이 수행된다. 이 동작의 수행 결과는 task를 추가된 순서대로 반환되지 않는다. AsyncSequence는 concurrent하게 동작하는 코드에 대해 \*\*결과가 반환된 순서대로 iterator가 동작하여 다음 요소를 넘겨준다. **

TaskGroup이 AsyncSequence를 채택하고 있기 때문에, `addTask`로 추가한 동작에 대한 결과를 받을 때마다 for loop에서 처리한다는 사실은 알았다. 그렇다면 모든 task가 모두 처리되었다는 되었다는 것은 어떻게 아는가? 즉, group에 10개의 원소가 return 되어야 하고, 이 원소가 모두 반환되어 `for await` 내부 동작을 모두 처리한 후에야 `movies`가 return 되어야 하는데 이를 어떻게 알 수 있을까?

이는 앞에서 본 [AsyncSequence](https://velog.io/@wansook0316/AsyncSequence)에서 그 실마리를 찾을 수 있다. AsyncSequence는 내부적으로 iterator를 갖는데, 여기서 모든 next 원소를 반환했다면 `nil`을 리턴한다. 그리고 이 `nil`을 기반으로 해당 loop가 종료되었음을 확인할 수 있다. 해당 링크의 **How it works** 절을 보면 loop를 어떻게 compiler가 처리하는지 알 수 있다.

# Example

여기까지 읽으면 혼란스러울 수 있다. 간단하게 정리해보겠다.

* Task와 TaskGroup은 계층 구조를 갖는다. 이를 structed concurrency라 한다.
* structed concurrency에서 하위 task는 상위 task의 동작 제어를 받는다. 또한 해당 스코프의 범위를 벗어날 수 없다.
* TaskGroup의 경우 AsyncSequence를 채택하고 있다. `addTask`로 추가된 녀석들은 반환 순서대로 group stream으로 주입된다.
* `addTask`로 추가된 `Task`들이 모두 종료되면 내부적으로 Iterator가 nil을 반환하고, for loop은 종료된다.
* AsyncSeqeunce에서와 마찬가지로 `for (try) await in` 구문에서 `break`, `continue` 등은 사용가능하다.

그렇다면 실제로 그러한지 코드로 살펴보자.

````swift
struct Data {
    let id: Int
}

Task {
    let results = await withTaskGroup(of: Data.self) { group -> [Data] in
        let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        var datum = [Data]()

        for number in list {
            group.addTask {
                let result = await self.doSomething(with: number)
                print("Task Completed")
                return Data(id: result)
            }
        }
        print("For loop Completed")

        for await data in group {
            datum.append(data)
        }

        return datum
    }
    print("After task group called")
    print("results: \(results)")
}

func doSomething(with number: Int) async -> Int {
    let randomTime = Int.random(in: 1...3)
    sleep(UInt32(randomTime))
    print("number \(number) calculated")
    return number
}
````

결과는 당혹스러웠다.

````
For loop Completed
number 1 calculated
Task Completed
number 2 calculated
Task Completed
number 3 calculated
Task Completed
number 4 calculated
Task Completed
number 5 calculated
Task Completed
number 6 calculated
Task Completed
number 7 calculated
Task Completed
number 8 calculated
Task Completed
number 9 calculated
Task Completed
number 10 calculated
Task Completed
After task group called
results: [Concurrency.Data(id: 1), Concurrency.Data(id: 2), Concurrency.Data(id: 3), Concurrency.Data(id: 4), Concurrency.Data(id: 5), Concurrency.Data(id: 6), Concurrency.Data(id: 7), Concurrency.Data(id: 8), Concurrency.Data(id: 9), Concurrency.Data(id: 10)]
````

task가 추가된 경우, 해당 작업 스레드에 sleep을 걸었다. 위에서 task의 반환 순서로 결과가 들어가고, 이를 처리한다고 했기 때문에, 변칙적으로 숫자가 나올 것을 예상했으나 결과는 순차적으로 나왔다. 이는 Sync OperationQueue와 같은 구조에 task들이 들어간 결과와 같다. 이에 관련 문제를 찾아보았다.

# TaskGroup != Parallelism, == Concurrency

[Is there an equivalent of DispatchQueue.concurrentPerform() with the new async/await?](https://developer.apple.com/forums/thread/682080?page=1#678137022)에서 실마리를 찾을 수 있었다.

````
There are no parallelism APIs with Swift concurrency that you can use that have the same behaviour of concurrentPerform. 
One noteworthy distinction is that concurrentPerform in dispatch is not an asynchronous operation 
- the caller thread participates in the operation and will block until all the operations in the concurrentPerform are completed.

concurrentPerform과 동일한 동작을 하는 Swift 동시성을 가진 병렬 API는 없습니다. 한 가지 주목할 만한 차이점은 concurrentPerform in dispatch는 비동기 작업이 아니라는 점입니다. 즉, 호출자 스레드가 작업에 참여하고 concurrentPerform의 모든 작업이 완료될 때까지 차단됩니다.

A TaskGroup might feel like a tempting solution but it provides structured concurrency not parallelism. 
The dispatch equivalent for a TaskGroup would be to queue.async a bunch of work items to a concurrent queue 
and group the work items together with a DispatchGroup. 
It does not semantically provide you with the notion that the DispatchGroup is for a parallel compute workload, 
which is what concurrentPerform does.

````

즉, Task Group은 Parallellism 으로 동작하지 않고 Concurrency라는 것이다. 내부적으로는 `DispatchQueue.async`에서 처리하는 방식과 비슷하게 처리된다는 것으로 확인된다.

여기서 `concurrentPerform`은 명시적으로 Parallelism을 처리하는 함수다. 이러한 API를 더이상 제공하지 않으며, 일반적으로 우리가 사용하는 API는 모두 Concurrency라는 점을 명확히 하고 있다.

# 문제 해결

문제는 `sleep` function에 있었다.

````swift
struct Data {
    let id: Int
}

Task {
    let results = await withTaskGroup(of: Data.self) { group -> [Data] in
        let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        var datum = [Data]()

        for number in list {
            group.addTask {
                let result = await self.doSomething(with: number)
                print("Task Completed")
                return Data(id: result)
            }
        }
        print("For loop Completed")

        for await data in group {
            datum.append(data)
        }

        return datum
    }
    print("After task group called")
    print("results: \(results)")
}

func doSomething(with number: Int) async -> Int {
    let randomTime = Int.random(in: 1...3)
    try? await Task.sleep(nanoseconds: UInt64(randomTime * 1_000_000_000)) ✅
    print("number \(number) calculated")
    return number
}
````

````
For loop Completed
number 3 calculated
Task Completed
number 7 calculated
Task Completed
number 9 calculated
Task Completed
number 10 calculated
Task Completed
number 5 calculated
Task Completed
number 2 calculated
Task Completed
number 1 calculated
Task Completed
number 4 calculated
Task Completed
number 6 calculated
Task Completed
number 8 calculated
Task Completed
After task group called
results: [Concurrency.Data(id: 3), Concurrency.Data(id: 7), Concurrency.Data(id: 9), Concurrency.Data(id: 10), Concurrency.Data(id: 5), Concurrency.Data(id: 2), Concurrency.Data(id: 1), Concurrency.Data(id: 4), Concurrency.Data(id: 6), Concurrency.Data(id: 8)]
````

그렇다면 `Thread.sleep()`과 `Task.sleep()`은 무엇이 다른가?

# Thread.sleep vs. Task.sleep

가장 큰 차이는, `Thread.sleep()`는 Thread를 **Block**하고, `Task.sleep()`는 Thread가 아닌 Task를 Suspend한다는 점이다. Suspend하는 경우 다른 작업의 경우 해당 Thread에서 계속 진행할 수 있다.

## 차이점 확인하기

````swift
let start = Date.timeIntervalSinceReferenceDate
DispatchQueue.concurrentPerform(iterations: 100) { _ in
  Thread.sleep(forTimeInterval: 1)
}
let end = Date.timeIntervalSinceReferenceDate
print(String(format: "Duration: %.2fs", end-start))

// Duration: 9.00s
````

`concurrentPerform` 메서드는 Apple에서 제공하는 Parallelism API이다. 100개의 반복 동작을 수행하고, 각각의 thread에서 1초간 sleep 해본다고 해보자. 아, 그리고 이 `concurrentPerform` 메서드는 시스템에서 제공할 수 있는 maximum core수에 맞춰서 thread를 생성한다. ([출처](https://trycombine.com/posts/thread-task-sleep/)) 그렇기 때문에 해당 메서드를 실행했을 경우 더 많은 스레드를 만들어 실행하지 않는다.

위의 결과를 보면 약 16 * 9 = 11.1, 11개 정도의 스레드가 생성되어 작업을 수행했다는 것을 확인할 수 있다.

````swift
let start = Date.timeIntervalSinceReferenceDate
await withThrowingTaskGroup(of: Void.self, body: {
    for _ in 0 ..< 100 {
        $0.addTask {
            try await Task.sleep(nanoseconds: 1_000_000_000)
        }
    }
})
let end = Date.timeIntervalSinceReferenceDate
print(String(format: "Duration: %.2fs", end-start))

// Duration: 1.05s
````

이번에는 Task에 sleep을 걸었을 경우다. Task의 동작만 suspend했기 때문에 다른 동작을 수행할 수 있게 된다.

# Task들은 Concurrent Queue로 들어가는가?

다시 가다듬고 무엇이 궁금한지 정리해보았다.

1. Task는 Parallel하게 동작하지 않는가? 
1. 결국 Task역시 이전의 GCD, OperationQueue의 동작을 wrapping 하는 친구라 생각한다.
1. 그렇다면 이 Task가 어느 Thread, Queue에 들어갔는지 디버깅을 해보자.

그래서 위의 코드에 Break Point를 걸어 어떻게 동작하는지 살펴보았다. 이 때 변화하는 Thread를 간략하게 나타내보았다.

````swift
Task {
    print("Thread: \(Thread.current.debugDescription)") ✅
    let results = await withTaskGroup(of: Data.self) { group -> [Data] in
        let list = (1...10).map { $0 }
        var datum = [Data]()

        for number in list {
            group.addTask {
                print("In AddTask Thread: \(Thread.current.debugDescription)") ✅
                let result = await self.doSomething(with: number)
                print("After doSomething Thread: \(Thread.current.debugDescription)") ✅✅✅
                print("Task Completed")
                return Data(id: result)
            }
        }
        print("For loop Completed")

        for await data in group {
            datum.append(data)
        }

        return datum
    }
    print("After task group called")
    print("results: \(results)")
}

private func doSomething(with number: Int) async -> Int {
    print("In doSomething Thread: \(Thread.current.debugDescription)") ✅
    let randomTime = Int.random(in: 1...2)
    try? await Task.sleep(nanoseconds: UInt64(randomTime * 1_000_000_000))
    print("number \(number) calculated")
    return number
}
````

![](ConcurrentProgramming_08_TaskTaskGroups_0.png)

먼저 `withTaskGroup`을 실행하는 시기에는 main thread 였다. 그리고 child task의 경우 sub thread에서 처리되고 있었다. 하지만 이 task 내부에서 다른 async 함수의 결과를 대기하는 부분에서 동작하는 thread가 달라졌다. 내부적으로 async 프로세스 역시 다른 task를 만들어 다른 thread로 넘겨주는 행위이기 때문으로 생각된다.

이 때, main thread가 한가했기 때문에 이 곳으로 동작을 넘겨 처리하는 것을 볼 수 있다. 신기한 것은 이 다음이었는데, 이렇게 await로 동작이 완료되어 결과가 반환되었음에도 불구하고 `doSomething`을 처리한 후 돌아왔을 때의 Thread는 sub thread로 돌아오지 않았다. (✅✅✅ 표시) 이 부분은 내부적으로 어떻게 동작하는지 파악하기 어려웠다.

# Concurrency는 어떻게 동작하는가

위의 작업을 하면서, 알게된 사실은 TaskGroup의 경우 **Serial Queue**에서 동작한다는 사실이다. Concurrent Queue가 아니다. 즉 Parallel이 동작하지 않는다.

![](ConcurrentProgramming_08_TaskTaskGroups_1.png)

즉, 위와 같이 동작한다. 

해당 그림은 WWDC 2017의 Modernizing Grand Central Dispatch Usage 에 있던 그림이라고 한다. 찾아보니 해당 영상이 삭제된 것인지 확인할 수 없었다. [GCD 제대로 쓰기](https://windroamer.wordpress.com/2017/08/06/gcd-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%93%B0%EA%B8%B0/) 글을 참고하면 더 자세한 내용을 확인할 수 있다.

# 마무리

험난했지만, 앞에서 정리한 내용을 벗어나지는 않았다.

* Task와 TaskGroup은 계층 구조를 갖는다. 이를 structed concurrency라 한다.
* structed concurrency에서 하위 task는 상위 task의 동작 제어를 받는다. 또한 해당 스코프의 범위를 벗어날 수 없다.
* TaskGroup의 경우 AsyncSequence를 채택하고 있다. `addTask`로 추가된 녀석들은 반환 순서대로 group stream으로 주입된다.
* `addTask`로 추가된 `Task`들이 모두 종료되면 내부적으로 Iterator가 nil을 반환하고, for loop은 종료된다.
* AsyncSeqeunce에서와 마찬가지로 `for (try) await in` 구문에서 `break`, `continue` 등은 사용가능하다.
* Task는 Concurrency를 만족한다. Parallelism을 만족하지 않는다. 즉, 특정 연산 주체(코어)를 빠르게 번갈아가면서 처리한다.
* `concurrentPerform`과 같은 API는 없다. (병렬 연산)
* 병렬 연산을 하려면 `async let`을 사용하여 독립적인 Task를 동작하는 것으로서 가능케 할 수 있다.
* `Thread.sleep()`은 Blocking, `Task.sleep()`은 Suspend이다.

Apple이 말하는 Structued Concurrency는 Task가 계층 구조를 이루고, 하위 Task는 상위 Task를 벗어날 수 없다는 것이 핵심 아이디어이다. `TaskGroup`에 `addTask`를 하게 되면 특정 스레드의 serial queue에 들어간 뒤 concurrent하게 동작하여 결과를 내놓는다. group은 asyncSequence를 채택하고 있어 모든 sub task의 결과를 받은 뒤에 `for await in` loop를 처리할 수 있다.

# Reference

* [Explore structured concurrency in Swift](https://developer.apple.com/videos/play/wwdc2021/10134/)
* [Protect mutable state with Swift actors](https://developer.apple.com/videos/play/wwdc2021/10133/)
* [Concurrency](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)
* [TaskGroup](https://developer.apple.com/documentation/swift/taskgroup)
* [Running tasks in parallel with Swift Concurrency’s task groups](https://www.donnywals.com/running-tasks-in-parallel-with-swift-concurrencys-task-groups/)
* [withTaskGroup(of:returning:body:)](https://developer.apple.com/documentation/swift/withtaskgroup(of:returning:body:))
* [Is there an equivalent of DispatchQueue.concurrentPerform() with the new async/await?](https://developer.apple.com/forums/thread/682080?page=1#678137022)
* [GCD 제대로 쓰기](https://windroamer.wordpress.com/2017/08/06/gcd-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%93%B0%EA%B8%B0/)
* [The difference between Thread.sleep() and Task.sleep()](https://trycombine.com/posts/thread-task-sleep/)
* [concurrentPerform(iterations:execute:)](https://developer.apple.com/documentation/dispatch/dispatchqueue/2016088-concurrentperform)
