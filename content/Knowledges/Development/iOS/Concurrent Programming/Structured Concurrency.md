---
title: Structured Concurrency
thumbnail: ''
draft: false
tags:
- concurrency
- structured-concurrency
- task
- async-let
- task-tree
- cancellation
- task-group
created: 2023-09-22
---

Task를 알아보면서 많은 삽질을 했으니, 이제 다시한번 WWDC 영상을 봐본다.

# Intro

![](ConcurrentProgramming_11_StructuredConcurrency_0.jpg)

예전의 프로그래밍 언어는 control flow가 상하로 왔다갔다했었다. 이런 코드는 흐름을 읽는 것을 방해했다. 하지만 요즘은 구조화된 프로그래밍 방법을 통해 이를 쉽게 읽을 수 있다. 이러한 것이 가능하게 된 것은, block을 사용했기 때문이다. block 안에서는 변수가 살아있고, 그 scope를 벗어나게 되는 경우 변수는 사라진다. 이런 static scope와 structured programming 방법은, 변수의 life time과 제어문을 이해하기 쉽게 만들었다.

이렇게 structured programming 방식은 이미 우리에게 상당히 익숙하다. 하지만 요즘의 program은 비동기, concurrent code가 많아졌다. 이런 부분에 있어서 structured 한 방식으로 처리하는 것이 매우 어려웠다.

# Structured Concurrency

그럼 비동기, concurrent 코드에 structured한 방식을 도입했을 때, 얼마나 직관적인지 확인해보자.

````swift
func fetchThumbnails(for ids: [String],
                     completion handler: @escaping ([String: UIImage]?, Error?) -> Void) {
    guard let id = ids.first else {
        return handler([:], nil)
    }

    let request = thumbnailURLRequest(for: id)
    URLSession.shared.dataTask(with: request) { data, response, error in
        guard let response = response, let data = data else { // ❎: Error 처리를 사용할 수 없음
            return handler(nil, error)
        }

        // check response...
        UIImage(data: data)?.prepareThumbnail(of: thumbSize) { image in
            guard let image = image else {
                return handler(nil, ThumbnailFailedError())
            }

            fetchThumbnails(for: Array(ids.dropFirst())) { thumbnails, error in // ❎ loop 사용 불가
                // add image..
            }
        }
    }
}
````

* Error 처리라는 structured 방식을 사용할 수 없음
* 네트워크 처리를 통해 데이터를 받아올 때, loop와 같은 structured 방식을 사용할 수 없음

그럼 async/await을 통해 변경된 것을 살펴보자.

````swift
func fetchThumbnails (for ids: [String]) async throws -> [String: UIImage] {
    var thumbnails: [String: UlImage] = [:]
    for id in ids {
        let request = try await thumbnailURLRequest(for: id)
        let (data, response) = try await URLSession.shared.data(for: request)
        try validateResponse(response)
        guard let image = await UIImage (data: data)?.byPreparingThumbnail (ofSize: thumbSize) else {
            throw ThumbnailFailedError()
        }
        thumbnails[id] = image
    }
    return thumbnails
}
````

여기까지는 이전글에서 본 async/await과 동일하다. 그런데 만약 thumbnail 이미지를 수천장 받아야 한다면 이 코드는 좋지 못하다. await에서 비동기 처리가 끝날 때까지 기다리기 때문이다.

# Task

* Code를 Concurrent하게 실행시키 위한 새로운 비동기 방식
* **Tasks들은 효율적이고, 안전하다고 판단되는 경우에 자동으로 Parallel하게 동작함**
* Task는 Swift와 깊게 통합되어 있기 때문에 compiler가 concurrency 버그를 어느정도 탐지해줌
* async function을 단순히 호출하는 것으로 Task가 생기는 것이 아니다. 명시적으로 Task내부에 해당 함수를 넣어주어야 한다.

# Async-let tasks

![](ConcurrentProgramming_11_StructuredConcurrency_1.jpg)

단순하게 데이터를 동기적으로 받아오는 방식을 생각해보면 위와 같다.

![](ConcurrentProgramming_11_StructuredConcurrency_2.jpg)

하지만 우리는 데이터가 받아오는 시간동안에 다른 작업을 처리하고 싶다. 이럴 경우 `async let`을 사용하면 된다. 이를 사용하기 위해서는 뒤의 호출하는 함수(`URLSession.shared.data(~)`)가 async 함수여야 한다. Concurrent Binding 평가 방식에 대해 이해해보자.

1. 이전 상태에서 Child Task를 만든다.
1. Child Task안에서 `async let`으로 async 함수를 호출한다.
1. Parent Task(이전 상태에서 사용하던 Task)를 위해 `result`에 placeholder를 할당한다.
1. 실제 동작(`URLSession.shared.data()`)은 Child Task에서 수행한다.
1. Parent Task는 네트워크 결과를 기다리지 않고 진행한다.
1. 하지만 실제로 Parent Task가 다운로드된 값을 필요로 한다면, `await`를 통해 child Task의 동작을 대기할 수 있다.
1. 만약 Error를 던지는 async 함수라면, try를 통해 받아주면 된다.

## Apply to Thumbnail fetching code

````swift
func fetchOneThumbnail(withId id: String) async throws -> UIImage {
    let imageReq = imageRequest(for: id), metadataReq = metadataRequest(for: id)
    let (data, _) = try await URLSession.shared.data(for: imageReq) ✅
    let (metadata, _) = try await URLSession.shared.data(for: metadataReq) ✅

    guard let size = parseSize(from: metadata), ✅
          let image = await UIImage(data: data)?.byPreparingThumbnail(ofSize: size) else { ✅
            throw ThumbnailFailedError()
          }
    return image
}

func fetchOneThumbnail(withId id: String) async throws -> UIImage {
    let imageReq = imageRequest(for: id), metadataReq = metadataRequest(for: id)
    async let (data, _) = URLSession.shared.data(for: imageReq) // ✅: Child Task가 생성됨
    async let (metadata, _) = URLSession.shared.data(for: metadataReq) // ✅: Child Task가 생성됨

    guard let size = parseSize(from: try await metadata), ✅
          let image = try await UIImage(data: data)?.byPreparingThumbnail(ofSize: size) else { ✅
            throw ThumbnailFailedError()
          }
    return image
}
````

`async let`을 사용하여, 각 task의 동작을 실제 받는 곳에서 대기하도록 수정했다. 위에서 설명한 바와 같이, `async let`을 사용하면 데이터의 할당까지 대기하지 않고, 실제 사용하는 시점에 대기하여 받는 방식으로 처리하여 보다 효율적인 처리가 가능하다.

# Task Tree

`async let`을 사용하게 되면, 결국에 compiler는 Child task를 만들어서 처리하게 된다. 이 과정에서 Child task들은 Task Tree라는 위계 질서의 한 부분이다.

이 Task Tree는 Structured Concurrency에서 중요한 부분이다. 이 Tree는 단순히 구현을 위해 존재하는 것이 아니며, cancellation, priority, task-local 변수들에 영향을 미친다.

![](ConcurrentProgramming_11_StructuredConcurrency_3.jpg)

`async let`와 같은 structured task를 사용하게 되면, 현재 동작하고 있는 function의 task의 child가 되어 동작한다. 그리고 이 child task의 life cycle은 parent의 scope에 갇힌다.

**Parent Task는 본인이 가진 Child Task들의 동작이 모두 종료되어야 비로소 종료될 수 있다.** 이 규칙은 "비정상적인 제어 흐름"에도 적용되어 하위 작업이 대기하는 것을 방지한다. 비정상적인 제어 흐름을 살펴보자.

# Cancellation Propagates

````swift
func fetchOneThumbnail(withId id: String) async throws -> UIImage {
    let imageReq = imageRequest(for: id), metadataReq = metadataRequest(for: id)
    async let (data, _) = URLSession.shared.data(for: imageReq) 
    async let (metadata, _) = URLSession.shared.data(for: metadataReq) // ❓ 

    guard let size = parseSize(from: try await metadata), // 💣 Error 발생
          let image = try await UIImage(data: data)?.byPreparingThumbnail(ofSize: size) else {
            throw ThumbnailFailedError()
          }
    return image
}
````

이 코드에서는 data를 넣기 전에, `metadata`를 먼저 `await`하고 있다. 그런데, 이 단계에서 Error를 던진다면 어떻게 해야 할까? 일단은 해당 함수가 비정상적인 동작을 했기 때문에 바로 throw를 하고 종료하는 것이 맞다.

그런데, 위에서 ❓은 여전히 동작하고 있다. **Parent Task는 본인이 가진 Child Task들의 동작이 모두 종료되어야 비로소 종료될 수 있다.** 라는 규칙은 Task Tree에서 모두 적용되기 때문에, 최악의 경우 data를 받을 수 없다면 무한정 대기하는 상황이 펼쳐질 수도 있다.

![](ConcurrentProgramming_11_StructuredConcurrency_4.jpg)

이러한 비정상 적인 exit에 대해 Swift는 자동적으로 대기하지 않은 task(data)를 canceled로 마킹한다. 그리고 함수를 탈출하기 전에 cancel된 task를 기다린다. 엥 이게 무슨말인가.

![](ConcurrentProgramming_11_StructuredConcurrency_5.jpg)

cencel로 처리하는 것과 task를 stop하는 것은 동치가 아니다. cancel한다는 것은 Task에게 "야야, 니가 결과 받아와도 그거 나 안쓸거야"라고 말하는 것과 같다. 실제로는 task가 canceled되면, cancel 명령을 받은 task의 모든 subtask들이 자동적으로 cancel된다. 즉, propagate된다는 말이다. 

![](ConcurrentProgramming_11_StructuredConcurrency_6.jpg)

가장 하위에 있는 task부터 cancel되어 finish 판정을 받으면, 상위로 결과가 올라온다. 그렇게 최종적으로 `fetchOneThumbnail` 함수가 종료된다.

이 알고리즘이 structured concurrency의 근본이다. 이렇게 빡빡하게 짜놓았기 때문에, ARC가 메모리의 수명을 자동으로 관리하는 방법과 마찬가지로 task의 life cycle이 새는 것을 방지한다. 

정리해보자.

* Task는 cancelled시에 즉시 Stop하지 않는다.
* SubTask들에게 Cancel명령이 전파된다.
* 이렇기 때문에 코드에서 명시적으로 cancellation에 대해 체크하고, 적절한 방법으로 실행을 중지해야 한다. 이는 코드짤 때 Cancel에 대해 항상 숙지하고 있어야 한다는 말이다.

# Task Cancellation

````swift
func fetchThumbnails(for ids: [String]) async throws -> [String: UIImage] {
    var thumbnails: [String: UIImage] = [:]
    for id in ids {
        try Task.checkCancellation() // ✅ Cancel 되었다면 Error를 던진다.
        thumbnails[id] = try await fetchOneThumbnail(withID: id)
    }
    return thumbnails
}
````

이번에는 하나의 Thumbnail만 받는 것이 아니고, 모든 Thumbnail을 받아오도록 함수를 구성했다. 해당 함수가 특정 Task 내부에서 불렸고, 이 Task가 cancel되었다면, 우리는 더이상 필요없는 thumbnail을 받고 싶지 않을 것이다. 그래서 loop 문 안에 `Task.checkCancellation()`함수를 추가하여 cancel되었을 시 error를 던치게 했다.

````swift
func fetchThumbnails(for ids: [String]) async throws -> [String: UIImage] {
    var thumbnails: [String: UIImage] = [:]
    for id in ids {
        if Task.isCancelled { break } // ✅
        thumbnails[id] = try await fetchOneThumbnail(withID: id)
    }
    return thumbnails
}
````

혹은 cancel 여부를 판단하여 loop문을 탈출하는 방법도 있다. 이렇게하면, 부분적으로 발생한 결과만 return할 수 있다. 만약 이렇게 처리한다면, 사용하는쪽에서 일부 결과만 return될 수 있다고 확실히 알고 있어야 한다. 만약 그렇게 하지 않는다면 사용하는 쪽에서 완성된 result만 받을 것이라 생각하여 `fatalError`가 날 수 있다.

# Group Tasks

````swift
func fetchThumbnails(for ids: [String]) async throws -> [String: UIImage] {
    var thumbnails: [String: UIImage] = [:]
    for id in ids {
        thumbnails[id] = try await fetchOneThumbnail(withID: id) // ✅
    }
    return thumbnails
}

func fetchOneThumbnail(withId id: String) async throws -> UIImage {
    let imageReq = imageRequest(for: id), metadataReq = metadataRequest(for: id)
    async let (data, _) = URLSession.shared.data(for: imageReq)
    async let (metadata, _) = URLSession.shared.data(for: metadataReq)

    guard let size = parseSize(from: try await metadata), // ✅
          let image = try await UIImage(data: data)?.byPreparingThumbnail(ofSize: size) else { // ✅
            throw ThumbnailFailedError()
          }
    return image
}
````

`fetchThumbnails` 함수에서는 ids를 돌면서 하나의 Thumbnail을 가져온다. 그리고 그 안에서 `async let` 구문을 통해서 두개의 Child Task를 만들고, 이 Child Task의 모든 동작이 완성된 경우 return하여 `thumbnails[id]`에 반영된다.

그런데, 이렇게 되면 Concurrency를 제대로 사용하고 있지 못하고 있는 것이다. 하나의 thumbnail을 가져오는 것은 분명 독립적인 Task인데, for loop을 돌면서 해당 작업을 `await`하고 있기 때문이다. 어떻게 하면 이 역시도 Concurrent하게 동작하게 할 수 있을까?

````swift
func fetchThumbnails(for ids: [String]) async throws -> [String: UIImage] {
    var thumbnails: [String: UIImage] = [:]
    try await withThrowingTaskGroup(of: Void.self) { group in
        for id in ids {
            group.addTask {
                thumbnails[id] = try await fetchOneThumbnail(withID: id) // ✅
            }
            
        }
    }
    return thumbnails
}
````

![](ConcurrentProgramming_11_StructuredConcurrency_7.jpg)

여기서 이전 글에서 배웠던 TaskGroup을 사용하면 된다. `addTask` 함수를 통해 동작하는 scope를 Task로 넣게되면, Concurrent하게 동작한다.

![](ConcurrentProgramming_11_StructuredConcurrency_8.jpg)

하지만, 이렇게 하면 문제가 발생한다. Compiler가 data race issue가 발생할 수 있다고 친히 알려준다. 즉, 공유 자원에 접근하고 있어 문제가 발생할 수 있다는 것이다. **data race 상태를 Compiler가 체크해준다.**

# Data-race Safety

Task를 만들 때마다, Task를 수행하는 Work는 새로운 Closure type인 `@Sendable` Closure 이다. `@Sendable` closure의 Body는 lexical context 안에서 mutable variable을 captuing하는 것을 제한한다. 왜냐하면, Task가 실행되는 동안 capturing된 변수들이 변할 수 있기 때문이다. (그냥 특정 함수를 실행해서 결과만 나오는 경우는 문제가 없다.)

그렇다면, Task안에 넣는 값들은, 공유하는데 있어 안전해야 한다는 말이다. 예를 들어, Value type으로 만들어진 구조체들(Int, String), 또는 애초에 multi thread 환경을 감안하고 설계한 녀석들(**Actor**, 제대로 설계한 class)이 있겠다.

그렇다면 위의 코드를 어떻게 변경해야 할까?

````swift
func fetchThumbnails(for ids: [String]) async throws -> [String: UIImage] {
    var thumbnails: [String: UIImage] = [:]
    try await withThrowingTaskGroup(of: (String, UIImage).self) { group in // ✅
        for id in ids {
            group.addTask {
                return (id, try await fetchOneThumbnail(withID: id)) // ✅
            }
        }
        for try await (id, thumbnail) in group { 🅾️
            thumbnails[id] = thumbnail
        }
    }
    return thumbnails
}
````

이렇게 변경해주면 된다. task에서는 값만 만들어서 return하고, 그 모든 결과를 받아서 최종적으로 `thumbnails`에 반영해주면 된다. 앞전 글에서 TaskGroup은 `AsyncSequence`를 채택하고 있기 때문에 바로 `for (try) await` 구문을 사용할 수 있다.

TaskGroup은 지금까지 설명한 structured concurrency를 대부분 따르지만, 구현에 있어 `async let`과 약간의 차이점이 있다. 🅾️ 부분을 보자. TaskGroup에 들어간 Child Task가 대부분 잘 동작했지만, 특정 부분에서 Error가 발생했다. 이런 경우, TaskGroup에 들어간 모든 Task는 암묵적으로 cancel되고, 결과를 await한다. 여기까지는 `async let`에서 throw를 던질 때, 같은 depth에 있는 다른 Task를 Cancel하는 것과 유사하다.

차이점은, 이 Cancel이 상위로 전파되는지 여부에 있다. 상위 Task의 cancellation은 무조건적이지 않다. 이런 방식은 TaskGroup을 사용해서 fork-join 방식을 표현하는 것을 쉽게 만들어준다. 또 수동적으로 group안에 들어간 모든 task의 작업을 `cancelAll()` 메서드를 통해 처리할 수도 있다.

 > 
 > fork-join pattern: 어떤 계산 작업을 할 때 "여러 개로 나누어 계산한 후 결과를 모으는 작업"

# Unstructured Tasks

`async let`, `TaskGroup`은 structured concurrency에 대한 설명이었다. 하지만 프로그램을 짜다보면, 이렇게 구조화된 방법으로만 task를 수행하지 않는 경우도 있다. 이런 부분에서 Swift는 유연성을 제공한다.

Parent Task가 없는 경우도 있다. 그저 동기 코드에서 비동기 코드를 한번 실행하고 싶을 수 있다. 

혹은 특정 Task의 lifecycle이 특정 범위를 넘어서 존재하고 싶을 수도 있다. 예를 들어, Object를 활성화하는 A method의 응답을 기반으로 Task를 실행시키고, Object를 비활성화하는 B method의 응답으로 Task를 cancel하고 싶을 수 있다.

````swift
@MainActor
class MyDelegate: UICollectionViewDelegate {
    func collectionView(_ view: UICollectionView,
                        willDisplay cell: UICollectionViewCell,
                        forItemAt item: IndexPath) {
        let ids = getThumbnailIDs(for: item)
        let thumbnails = await fetchThumbnails(for: ids) // ❎ 'await' in a function that does not support concurrency
        display(thumbnails, in: cell)
    }
}
````

이런 경우는 AppKit과 UIKit에서 delegate object를 구현하면서 자주 발생한다. 

예를 들어, collectionView가 있고, 아직 collectionView의 dataSource api를 사용하지 못한다고 하자. 이 상황에서 일단은 thumbnail을 네트워크에서 요청하려고 위와 같이 적었다. 하지만, collectionViewDelegate method는 `async`하지 않기 때문에 위처럼 compile error가 난다.

````swift
@MainActor
class MyDelegate: UICollectionViewDelegate {
    func collectionView(_ view: UICollectionView,
                        willDisplay cell: UICollectionViewCell,
                        forItemAt item: IndexPath) {
        let ids = getThumbnailIDs(for: item)
        Task {
            let thumbnails = await fetchThumbnails(for: ids)
            display(thumbnails, in: cell)    
        }
    }
}
````

이런 경우 Task로 감싸서 `collectionView`의 scope를 벗어나, `DispatchQueue.main.async`와 같은 동작을 하도록 할 수 있다. 이렇게 하면 `collectionView`의 scope 밖에서 main thread에 해당 작업이 들어가고, 수행된다. 이렇게 처리하는 경우의 장점은 다음과 같다.

1. 상위 작업의 actor isolation과 priority를 상속받는다.
1. Lifetime이 어떠한 scope에도 국한되지 않는다.
1. 어디서든 실행가능하다. 심지어 async하지 않은 함수에서도
1. 수동으로 cancel하고 await할 수 있다.

````swift
@MainActor
class MyDelegate: UICollectionViewDelegate {
    var thumbnailTasks: [IndexPath: Task<Void, Never>] = [:]

    func collectionView(_ view: UICollectionView,
                        willDisplay cell: UICollectionViewCell,
                        forItemAt item: IndexPath) {
        let ids = getThumbnailIDs(for: item)
        thumbnailTasks[item] = Task {
            defer { thumbnailTasks[item] = nil } // 일단 화면에 보여줬으면 Task는 필요없음. cancel하기 위해 필요한 것
            let thumbnails = await fetchThumbnails(for: ids)
            display(thumbnails, in: cell)    
        }
    }
}
````

예를 들어, scroll 된 경우, 해당 Task를 cancel해버릴 수 있다. 이렇게 할 경우, data race 문제가 발생한다고 생각할 지도 모르겠다. 하지만 delegate class는 현재 main actor이고, 그렇기 때문에 만든 Task는 그 특징을 모두 상속받는다. 따라서 main thread에서 syuc 하게 동작하여 병렬적으로 동작할 수 없다. main actor로 선언되었기 때문에 안전하게 저장 프로퍼티에 접근하여 값을 변경할 수 있다.

````swift
@MainActor
class MyDelegate: UICollectionViewDelegate {
    var thumbnailTasks: [IndexPath: Task<Void, Never>] = [:]

    func collectionView(_ view: UICollectionView,
                        willDisplay cell: UICollectionViewCell,
                        forItemAt item: IndexPath) {
        let ids = getThumbnailIDs(for: item)
        thumbnailTasks[item] = Task {
            defer { thumbnailTasks[item] = nil } // 일단 화면에 보여줬으면 Task는 필요없음. cancel하기 위해 필요한 것
            let thumbnails = await fetchThumbnails(for: ids)
            display(thumbnails, in: cell)
        }
    }

    func collectionView(_ view: UICollectionView,
                        didEndDisplay cell: UICollectionViewCell, // collectionView에서 지워진 경우
                        forItemAt item: IndexPath) {
        thumbnailTasks[item]?.cancel()
    }
}
````

collectionView에서 지워졌는데, 현재 thumbnail을 받아오고 있다면, 이 경우에는 Task를 cancel해야 한다.

# Detached tasks

보다 강한 유연성을 위해 만들어진 task이다. 

* unstructured task이다.
  * 즉, lifetime이 scoping되지 않는다.
  * 수동적으로 cancel, await 가능하다.
* 하지만, 해당 Task가 위치한 context에서 어떠한 것도 상속받지 않는다.
  * 즉, 독립적으로 작동한다.
  * priority와 traits를 제어할 수 있다.

thumbnail을 server에서 받아오고, 이를 local disk cache에 저장하는 예시를 들어보자. caching 작업은 main thread에서 일어날 필요가 없다.

````swift
@MainActor
class MyDelegate: UICollectionViewDelegate {
    var thumbnailTasks: [IndexPath: Task<Void, Never>] = [:]

    func collectionView(_ view: UICollectionView,
                        willDisplay cell: UICollectionViewCell,
                        forItemAt item: IndexPath) {
        let ids = getThumbnailIDs(for: item)
        thumbnailTasks[item] = Task {
            defer { thumbnailTasks[item] = nil } 
            let thumbnails = await fetchThumbnails(for: ids)

            Task.detached(priority: .background) { // ✅
                writeToLocalCache(thumbnails)
            }

            display(thumbnails, in: cell)
        }
    }
}
````

저장의 경우, 우선순위도 낮고, main thread에서 동작할 필요가 없으니, 이런 경우 `detached` 를 사용하면 유용하게 처리할 수 있다.

그런데, 만약 background로 처리해야 하는 다양한 task가 있다면 어떻게 처리해야 할까? 일일히 `Task.detached` 를 통해서 처리해주어야 할까? 

````swift
@MainActor
class MyDelegate: UICollectionViewDelegate {
    var thumbnailTasks: [IndexPath: Task<Void, Never>] = [:]

    func collectionView(_ view: UICollectionView,
                        willDisplay cell: UICollectionViewCell,
                        forItemAt item: IndexPath) {
        let ids = getThumbnailIDs(for: item)
        thumbnailTasks[item] = Task {
            defer { thumbnailTasks[item] = nil } 
            let thumbnails = await fetchThumbnails(for: ids)

            Task.detached(priority: .background) {
                withTaskGroup(of: Void.self) { group in
                    group.async { writeToLocalCache(thumbnails) }
                    group.async { log(thumbnails) }
                    group.async { ... }
                }
            }

            display(thumbnails, in: cell)
        }
    }
}
````

이와 같이 TaskGroup을 사용하면 좋다. 이렇게 하면, 일일히 Task를 만들어 관리했을 때 발생하는 하나씩 cancel해야하는 문제를 해결할 수 있다. 내부적으로 group으로 묶여있기 때문에 상위에서 cancel하면 전파되기 때문이다. 또 상위의 특성을 모두 inherit하기 때문에 중복되는 코드도 적어진다.

# Flavors of tasks

지금까지 모두 알아본 것을 정리해보자. 이걸 보고 머리에 들어왔다면 다 이해한 것이다.

||Launched by|Launchable from|Lifetime|Cancellation|Inherits from origin|
|--|-----------|---------------|--------|------------|--------------------|
|`async-let` tasks|`async-let` ~|`async` functions|scoped to statement|automatic|priority <br> task-local values|
|Group tasks|`group.async`|`withTaskGroup`|scoped to task group|automatic|priority <br> task-local values|
|Unstructured tasks|`Task`|anywhere|unscoped|via `Task`|priority <br> task-local values <br> actor|
|Detached tasks|`Task.detached`|anywhere|unscoped|via `Task`|nothing|

성능에 대한 좋은 글이 있어 첨부한다. [Swift Concurrency에 대해서](https://engineering.linecorp.com/ko/blog/about-swift-concurrency/)

# Reference

* [Explore structured concurrency in Swift](https://developer.apple.com/videos/play/wwdc2021/10134)
* [Swift Concurrency에 대해서](https://engineering.linecorp.com/ko/blog/about-swift-concurrency/)
