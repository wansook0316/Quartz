---
title: Behind the Scenes Part. 02
thumbnail: ''
draft: false
tags:
- concurrency
- async
- await
- actor
- actor-hopping
- mutual-exclusion
- actor-reentrancy
- actor-reprioritization
created: 2023-09-22
---

앞에서는 Swift concurrency가 어떻게 동작하는지 확인했다. 이번에는 Swift concurrency를 채택할 때 주의해야 하는점, 그리고 Actor를 통한 Synchronization에 대해 알아보자.

# Adoption of Swift Concurrency

이번에는 Swift Concurrency를 사용하면서 고려해야 할 사항들에 대해 알아보자.

## Performance

앞에서 Concurrency를 사용할 때 발생하는 추가 memory과 관련된 cost에 대해 알아보았다. 이러한 점은 여전히 적용되며, Concurrency를 도입하여 얻을 수 있는 비용이 코드의 관리 비용을 넘는 경우에만 이를 도입해야 한다.

````swift
async let isThumbnailView = userDefaults.bool(forKey: "ViewType")

if await isThumbnailView {

} else {

}
````

위와 같이 userDefaults에서 단순히 값을 일어오는데 있어서 굳이 async하게 task를 만들어서 처리할 필요는 없다. task를 만들어서 처리하는 비용이, task를 만드는 비용보다 크지 않기 때문이다. 그렇기 때문에 apple에서는 Instruments system을 통해 Swift concurrency를 채택했을 때 얻을 수 있는 성능 지표들을 확인해보는 것을 추천한다.

## Notion of Atomicity around await

 > 
 > `await`에 걸쳐 lock을 걸지 않는다.

Swift는 `await` 이전에 실행되었던 thread와 이후에 실행되는 코드의 thread가 같은 것을 보장해주지 않는다. 이는 앞에서 `await` 근방에서 어떻게 코드가 동작하는지를 근간으로 한다. **`await`는 코드에서 작업이 자발적으로 취소될 수 있기 때문에, 작업의 원자성이 깨졌음을 명확하게 나타내는 지점이라 할 수 있다.** 그렇기 때문에, 그 급방에서 **lock**을 걸면 안된다. 다시 해당 thread로 돌아온다는 보장이 없기 때문이다.

 > 
 > thread에 특화된 데이터는 await에 걸쳐 보존되지 않는다.

이 역시 마찬가지이다. `await` 다음 동작하는 thread 보장이 되지 않기 때문에 인접성을 가정하고 작성한 코드는 재검토가 필요하다.

 > 
 > Runtime contract를 보존해야 한다. 즉, thread가 계속해서 앞으로 전진할 수 있도록 해주어야 한다.

thread의 개수를 제한하고, 각 task에서 continuation을 통해 동작을 나아가게 하는 만큼, 이 관리는 중요하다. 즉, Cooperative한 thread pool을 사용가능하도록 해야한다는 것이다.

|✅ <br> Safe primitives|⚠️ <br> Caution required|🛑 <br> unsafe primitives|
|:----------------:--|:------------------:----|:------------------:---|
|`await`, <br> Actors, <br> Task groups|동기 코드에서 사용하는 <br> `os_unfair_lock`, <br> `NSLock`|`DispatchSemephore`, <br> `pthread_cond`, <br> `NSCondition`,  <br>
`pthread_rw_loc`, <br> ...|
|**Compiler 강제**|Compiler 보조 없음|Compiler 보조 없음|
||잘 알려진 critical section 주변에서 동기 코드로 사용할 경우 안전, 하지만 위험성 있음|이 경우는 Swift runtime에 dependency 정보를 숨기기 때문에 안전하지 않다.|

Task boundary를 넘어 await하는 불안전한 원시 타입을 사용하지 마라. 특히 semaphore나 불안전한 원시타입을 통해 구조화되지 않은 task를 만드는데 사용하지 마라.

````swift
func updateDatabase(_ asyncUpdateDatabase: @Sendable @escaping () async -> Void) {
    let semaphore = DispatchSemaphore(value: 0)

    Task {
        await asyncUpdateDatabase()
        semaphore.signal()
    }

    semaphore.wait()
}
````

딱 deadlock 발생하기 좋은 코드다. Task가 들어간 특정 thread에서 unblock하기 전까지 특정 thread가 무한 대기할 수 있다. 이렇게 되면 runtime contract를 위반한 것이다. 다음 작업을 이어나갈 수 없도록 만들었기 때문이다.

# Synchronization via Actor

이전에 알아본 Actor는 concurrent한 접근에 대해 mutable state를 어떻게 actor가 방어하는지에 대해서 알아보았다. Actor가 상호배제를 보장한다는 것을 기억해보자.

## Mutual exclusion

앞에서 사용했던 `databaseQueue`에 넘겼던 동작을 생각해보자.

````swift
databaseQueue.sync { updateDatabase(articles, for: feed) } // 1️⃣
databaseQueue.async { /* background work */ } // 2️⃣
````

|Comparison|1️⃣ <br >Locks, <br> Serial Queue sync { ...}|2️⃣  <br>  Serial Queue async (... }|3️⃣ <br> Actors using cooperative pool|
|:--------:|:----------------------------------:----|:------------------------------:----|:--------------------------------:----|
|No contention (the queue is not already running)|✅ Reuse thread|⚠️ Request new thread|✅ Reuse thread|
|Under contention (the queue is already running)|🛑 Blocking|✅ Non-blocking|✅ Non-blocking|

먼저, Queue가 동작중이 아니라면, 즉 경쟁상태가 아니라면 아무런 문제 없다. 현재 동작하고 있는 Thread를 재사용하여 작업한다. 그런데 Serial Queue가 이미 동작중이다. 즉, 경쟁 상태다. 이런 경우 호출하는 thread(`databaseQueue.sync`를 호출했던 thread)는 block된다. 그리고 이 blocking 동작이 바로 thread explosion을 발생시키는 행동이다.

blocking의 문제 때문에, 일반적으로 우리는 dispatch async를 사용하는 것을 추천한다. dispatch async의 주요 이점은, non-blocking이라는 것이다. 그렇기 때문에 경쟁 상태에 놓이더라도 thread explosion이 발생하지 않는다. (바로 thread가 사라지고 작업만 뒤에 추가되는 것이기 때문) dispatch serial queue async의 단점으로는 경쟁이 없는 경우 호출한 스레드가 계속 다른 작업을 수행하는 동안 Dispatch가 비동기 작업을 수행하기 위해 새 스레드를 요청해야 한다는 것입니다. **그러므로 dispatch async의 빈번한 사용은, 과도한 thread wakeup과 context switching을 가져올 수 있다.**

이러한 필요성에서 Actor가 나왔다. Swift의 Actor는 효율적인 스케줄링을 위해 Cooperative thread pool을 활용하여 두 세계의 장점을 결합한다. 실행 중이 아닌 Actor에서 method를 호출할 때 **호출한 스레드를 다시 사용하여 메서드 호출을 실행할 수 있다.** 동작하고 있는 상황이라면 호출한 thread는 동작을 suspend하고 다른 작업을 가져와서 실행한다.

## Actor hopping

actor가 어떻게 동작하는지 한번 살펴보자.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_0.png)

news feed를 만드는 앱에서, database와 networking을 처리했던 subsystem을 살펴보자. 

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_1.png)

Swift concurrency로 넘어오면, GCD에서 있던 serial queue는 Database Actor로 바뀐다. 그리고 Concurrent Queue는 각각에 해당되는 Actor로 바뀐다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_2.png)

이 모든 Actor들은 Cooperative thread pool에서 동작한다. feed actor는 article 저장, 그리고 다른 목적들을 위해 database actor와 상호작용한다. 이걸 actor hopping process라 한다. 이 hopping process가 어떻게 일어나는지 알아보자.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_3.png)

sports feed를 위한 actor가 cooperative thread위에서 동작하고 있다고 생각해보자. 그리고 이 feed는 몇 article을 database에 저장하고 싶다. 그리고 database actor는 아직 사용된 적이 없다고 생각해보자. 즉, untended case이다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_4.png)

Thread는 직접적으로 sports feed actor에서 database actor로 hopping할 수 있다. 여기서 주목해야 하는 점은 두가지이다.

1. hopping actor시에 thread는 block되지 않았다.
1. hopping을 하는데 있어 다른 thread가 필요없다.

runtime에서 직접적으로 sport feed actor를 위해 work item을 suspend할 수 있다. 그리고 database actor를 위해 새로운 work item을 만들 수도 있다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_5.png)
database actor가 어느정도 실행되었지만, 첫번째 work item의 실행이 모두 끝나지는 않았다고 해보자. 그리고 이순간에 weather feed actor가 몇 article을 database에 저장하려고 시도하는 상황을 생각해보자.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_6.png)

이런 경우, database actor를 위해 새로운 work item이 생성된다. actor는 상호배제는 보장하기 때문에, 기껏해야 하나의 work item만 주어진 시간에 활성화 된다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_7.png)

actor 역시 non-blocking이기 때문에, 이와 같은 상황에서 weather feed의 경우 suspend될 것이다. 그리고 thread는 이제 freed 상태이기 때문에 다른 작업을 수행할 수 있다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_8.png)
![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_9.png)

어느정도 시간이 지난 후에, 최초 database 요청(D1)이 완료되었고, database actor에 있던 활성화된 work item은 제거된다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_10.png)

runtime은 다음으로 지연되어 있던 work item인 D2를 시작한다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_11.png)

또는 feed actors 등 중 하나를 골라 재개할 수도 있다. 혹은 다른 work를 가져와 freed 된 thread에서 작업을 실행할 수도 있다.

## Reentrancy and prioritization

1. 비동기 작업이 많거나
1. contention이 많이 이루어지고 있거나

위의 두가지 상황에서 system은 어떤 work가 더 중요한지에 대해서 판단해야 한다. 이상적으로 user interaction과 같이 최우선순위의 work가 backup과 같은 work에 비해 우선적으로 진행되는 것이 좋다.

Actor는 Reentrancy(재진입)이라는 개념 때문에 시스템이 work의 우선순위를 잘 정할 수 있도록 설계되었다. 그 전에, 왜 reentrancy가 여기서 중요한지 부터 알아보자.

### Serial dispatch queues

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_12.png)

당장 화면에 표시되는 정보를 가져오는 우선순위가 높은 작업을 database에게 요청한다고 생각해보자. 그리고 다음으로는 iCloud에 backup을 하는 우선순위에서 상대적으로 밀리는 작업을 요청하자. 그러면 요청을 한 순서대로 serial queue에 위와 같이 쌓이게 될 것이다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_13.png)

DispatchQueue는 FIFO 순서로 처리하기 때문에 들어간 순서대로 순차적으로 처리된다. 그리고 이 말은 곧 item A가 실행되고 난 후, 낮은 우선 수위를 가지는 5개의 item이 6번쨰 위치한 높은 우선 순위 item보다 먼저 실행되어야 함을 뜻한다. 이를 **우선 순위 역전**이라 한다. 

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_14.png)

Serial Queue는 높은 우선 순위 작업보다 앞에 있는 Queue의 모든 작업의 우선 순위를 높임으로써 우선 순위 역전을 방지한다. 즉, 이 말은 queue안에 있는 work들이 더 빨리 완료됨을 말한다.

하지만 이 방법은 1에서 5까지 원소가 B보다 먼저 완료되어야 한다는 점에서 main issue를 해결하지는 못한다. 이 문제를 해결하기 위해서는 빡빡한 FIFO 규정을 버려야 한다. 이러한 문제점에서 actor reentrancy가 고안되었다.

### Actor reentrancy

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_15.png)

database actor가 thread위에서 동작하고 있다 생각해보자. 

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_16.png)

database actor는 suspend 되었고, 그 자리를 sports feed actor가 차지했다고 생각해보자. 

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_17.png)

sports feed actor는 얼마 지나지 않아 동작을 완료했고, database actor에게 article을 저장해달라고 요청했다. database actor는 uncontended(실제 동작하고 있지 않음, 경쟁 X) 상태이기 때문에, pending한 작업(D1)이 있음에도 thread는 database actor를 hopping할 수 있다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_18.png)

`save` 작업을 하기 위해서는 새로운 work item이 database actor를 위해 생성되어야 한다. 이걸 actor reentrancy라 한다.

actor에 올려진 새로운 work item이 하나 혹은 하나 이상의 이전 작업이 suspend된 상태에서 앞으로 진행할 수 있도록 만들어주는 동작을 actor reentrancy라 한다.

actor는 여전히 상호배제를 만족한다. 기껏해야 하나의 item만이 해당 시간에 실행될 수 있기 때문이다. 

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_19.png)

어느정도 시간이 지난 후에, D2는 실행을 마친다. D2가 D1보다 나중에 생성되었음에도 불구하고 먼저 작업을 끝나쳤다는 것을 주목하자. **그러므로, actor reentrancy를 지원한다는 말은 actor가 엄격한 FIFO 순서를 따르지 않는 방식으로 item을 실행할 수 있음을 뜻한다.**

### Actor reprioritization

이런 actor reentrancy를 기반으로 우선순위가 걸린 작업이 어떻게 이루어지는 지 확인해보자.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_20.png)

먼저, 가장 우선순위가 높은 A item이 실행될 것이다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_21.png)

actor reentrancy에 따라 runtime은 최우선 순위 work item을 queue의 최상단으로 옮긴다. 

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_22.png)

이는 우선 순위 역전 문제를 직접 해결하여 보다 효과적인 스케줄링과 리소스 활용을 가능하게 한다.

## Main actor

마지막으로 다른 종류의 actor가 있다. main actor는 시스템의 기존 개념인 메인 스레드를 추상화하기 때문에 다소 다르다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_23.png)

다시 actor를 사용한 news feed를 받아오는 app을 떠올려보자. user interface를 업데이트 할 때, 우리는 main actor를 활용해야 한다. cooperative pool안에 있는 thread로부터 main thread는 분리되어 있기 때문이다. 그리고 이 작업은 context switching을 요한다.

````swift
// on database actor
func loadArticle(with id: ID) async throws -> Article { /* ... */ }

@MainActor func updateUI(for article: Article) async { /* ... */ }

@MainActor func updateArticles(for ids: [ID]) async throws {
    for id in ids {
        let article = try await database.loadArticle(with: id) // ✅ context switching
        await updateUI(for: article)
    }
}
````

database로부터 article을 로드하고 각 기사의 UI를 업데이트하는 위의 코드를 보자. 각각의 loop에서 적어도 두번의 context switching이 일어난다.

1. main actor에서 database actor로
1. database actor에서 main actor로

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_24.png)

루프 반복 횟수가 적고 각 반복에서 상당한 작업이 수행되고 있다면 괜찮을 수 있다. 하지만 실행이 main actor를 자주 오가는 경우 thread 전환의 오버헤드가 누적되기 시작할 수 있다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_25.png)

프로그램이 컨텍스트 전환에 많은 시간을 소비한다면, main actor에 대한 작업이 일괄 처리되도록 코드 구성을 변경해야 한다.

![](ConcurrentProgramming_13_SwiftConcurrencyBehindTheScenes-2_26.png)

cooperative pool에서 actor들 간의 hopping은 빠르지만, 앱을 작성할 때는 여전히 main actor와의 hopping를 염두에 두어야 한다.

# 마치며

Swift concurrency는 성능, 가독성, 안정성을 모두 고려한 방법이다.

* `await` 근처에서는 suspension이 일어난다.
* Thread의 blocking이 없으며, async하게 동작하는 경우 heap에 다음 처리 과정에 대한 정보를 저장한다.
* 그렇기에 thread의 동작이 돌아올 때 같은 thread라는 보장이 없다.
* actor는 상호배제를 보장하는 방법이다.
* 유연한 FIFO 구조를 가져, 우선순위 변경이 가능하다.
* main actor는 main thread와 관련있다.

# Reference

* [Swift concurrency: Behind the scenes](https://developer.apple.com/videos/play/wwdc2021/10254/)
* [Concurrency](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)
* [07: 쓰레드(Thread)](https://wansook0316.github.io/cs/os/2020/04/01/%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C-%EC%A0%95%EB%A6%AC-07-%EC%93%B0%EB%A0%88%EB%93%9C.html)
