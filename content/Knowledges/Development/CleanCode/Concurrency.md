---
title: Concurrency
thumbnail: ''
draft: false
tags: null
created: 2023-09-21
---

**동시성과 깔끔한 코드는 양립하기 아주 어렵다.** 그럼에도 불구하고, 동시성은 왜 필요할까?

 > 
 > 객체는 처리의 추상화다. 스레드는 일정의 추상화다. - 제임스 O. 코플리엔

# 동시성이 필요한 이유?

 > 
 > 동시성은 "무엇"과 "언제"의 Coupling을 없애는 전략이다.

스레드가 하나인 프로그램은, 무엇과 언제가 밀접하기 때문에, call stack을 살펴보면 해당 프로그램의 상태를 바로 파악할 수 있다. 하지만, 무엇과 언제를 분리하면 애플리케이션 구조와 효율이 극적으로 나아진다. 거대한 하나의 루프가 아니라, 작은 협력 프로그램 여럿이 문제를 푸는 것으로 생각할 수 있다. 예를 들어, java Subvlet 모델의 경우, 웹 요청이 들어올 때마다 웹 서버는 비동기식으로 서블릿을 실행한다.

이런 구조적인 이점만을 위해 동시성을 채택하는 것은 아니다. 응답 시간, 작업 처리량 개선이라는 요구사항으로 인해 동시성 구현을 불가피하게 선택해야 하는 경우도 있다. 

## 미신과 오해

|오개념|해설|
|---------|------|
|동시성은 항상 성능을 높여준다.|때때로 성능을 높여준다. <br> 여러 프로세서가 동시에 처리할 계산이 충분히 많은 경우, 대기 시간이 긴 경우가 예가 될 수 있다.|
|동시성을 구현해도 설계는 변하지 않는다.|단일 스레드 시스템과 다중 스레드 시스템은 설계가 판이하게 다르다.|
|웹 또는 EJB 컨테이너를 사용하면 동시성을 이해할 필요가 없다.|컨테이너가 어떻게 동작하는지, 어떻게 동시 수정, 데드락과 같은 문제를 피할 수 있는지 알아야 한다.|

## 타당한 생각

|타당한 생각|해설|
|----------------|------|
|동시성은 다소 부하를 유발한다.|성능 측면에서 부하가 걸리며, 코드도 더 짜야 한다.|
|동시성은 복잡하다.|간단한 문제더라도 동시성은 복잡하다.|
|일반적으로 동시성 버그는 재현하기 어렵다.|진짜 결함이 아니고, 일시성 버그로 여기기 쉽다.|
|동시성을 구현하려면 흔히 근본적인 설계 전략을 다시 생각해야 한다.||

# 난관

그렇다면 왜 어려운 것일까?

````java
public class ClassWithThreadingProblem {
    private int lastIdUsed;
    
    public ClassWithThreadingProblem(int lastIdUsed) {
        this.lastIdUsed = lastIdUsed;
    }
    
    public int getNextId() {
        return ++lastIdUsed;
    }
}

public static void main(String args[]) {
    final ClassWithThreadingProblem classWithThreadingProblem = new ClassWithThreadingProblem(42); // 1. instance 생성, 초기값 42 설정
    
    Runnable runnable = new Runnable() {
        public void run() {
            classWithThreadingProblem.getNextId();
        }
    };
    
    Thread t1 = new Thread(runnable); // 두 스레드에서 호출 ✅
    Thread t2 = new Thread(runnable); // 두 스레드에서 호출 ✅
    t1.start();
    t2.start();
}
````

위 코드가 만들 수 있는 결과는 총 3가지 이다.

* t1이 43을, t2가 44를 가져간다. lastIdUsed는 44이다.(O)
* t1이 44을, t2가 43를 가져간다. lastIdUsed는 44이다.(O)
* t1이 43을, t2가 43를 가져간다. lastIdUsed는 43이다.(X)

위의 `getNextId()` 메서드는 8개의 자바 byte-code로 변환되며, 이를 두 스레드에서 실행하게 되면 총 12,870개의 코드 조합을 낼 수 있다. 그 중 얼마 안 되는 몇몇 조합이 위의 3가지 결과 중 마지막 결과를 낳게 된다.

# 동시성 방어 원칙

동시성 코드가 발생하는 문제로부터 시스템을 방어하는 원칙과 기술을 소개한다.

## 단일 책임 원칙(Single Responsibility Principle, SRP)

 > 
 > 동시성 코드는 분리하자.

SRP는 기본적으로, 메서드/클래스/컴포넌트를 변경할 이유가 하나이어야 한다는 원칙이다. **동시성은 복잡성 하나만으로도 따로 분리할 이유가 충분하다.**

* Concurrency 관련 코드는 개발, 변경, 튜닝시 다른 코드와 분리된 생명주기를 가진다.
* Concurrency 관련 코드는 그 자체가 가지는 어려움(풀기 힘든 문제)이 있다.
* 잘못 작성된 concurrency 코드는 여러 문제를 발생시킬 수 있으며, 이는 추가적인 코드 없이 해결되기 힘들다.

## 따름 정리(Corollary): 자료 범위를 제한하라

 > 
 > 자료를 캡슐화 하라. 공유 자료를 최대한 줄이고, 임계 영역도 줄여라.

위의 코드에서 보았던 문제는 **객체를 고융한 상태에서, 동일 필드를 수정하던 두 스레드가 서로 간섭하기 때문에 발생한다.** 즉, 서로 간섭하지 못하도록 하면 문제는 해결된다. 이런 코드의 부분을 임계영역이라 한다. 이런 임계영역의 수가 많아질 경우 다음의 문제가 발생한다.

* 보호할 임계 영역을 빼먹는다.
* 모든 임계영역을 제대로 처리했는지 확인하느라 똑같은 노력과 수고를 반복한다.
* 안그래도 찾기 힘든데, 많아져서 더 찾기 어렵다.

## 따름 정리: 자료 사본을 사용하라

 > 
 > Copy를 떠서 처리하면 안전하다.

공유 자료를 사용하지 않는 것은 어떨까? 애초에 공유하지 않으면 동시성 문제는 발생하지 않는다. 읽기 전용으로 복사하여 사용할 수 있다. 물론 복사 비용(memory, time)이 든다는 trade-off가 있지만, 잘 사용하면 매우 좋은 방법이다.

## 따름 정리: 스레드는 가능한 독립적으로 구현하라

 > 
 > 독자적 스레드, 다른 프로세서에서 동작해도 무방하도록 자료를 독립적인 단위로 분할하라.

스레드 내부에서 돌아가는 코드가 공유 instance를 사용하지 않고, 내부 local 변수만 사용하는 것도 좋다. 이럴 경우 다른 스레드와 동기화할 필요가 없다. 즉, 순수함수로 짜라는 말이다.

# 라이브러리를 이해하라

해당 부분은 java 5기준으로 설명하기 때문에 필요없는 부분은 정리하지 않았다.

## 스레드 환경에 안전한 컬렉션

사용할 수 있는 개념위주로 설명한다.

|방법|설명|
|------|------|
|[Lock](https://developer.apple.com/documentation/foundation/nslock)|한 메서드에서 잠그고 다른 메서드에서 푼다.|
|[Semaphore](https://developer.apple.com/documentation/dispatch/dispatchsemaphore)|전통적인 세마포어(갯수를 셀 수 있는 lock)의 구현체이다.|
|[CountDownLatch](https://github.com/uber/swift-concurrency/blob/master/Sources/Concurrency/CountDownLatch.swift)|기다리는 모든 스레드들을 해제하기 전 특정 횟수의 이벤트가 발생하는 것을 기다리게 할 수 있는 lock이다. 모든 스레드가 거의 동시에 시작될 수 있게 도와줄 수 있다.|

# 실행 모델을 이해하라

기본 용어부터 정리해보자.

|방법|설명|
|------|------|
|Bound Resources|환경에서 사용되는 고정된 크기의 자원이다. 예시로 데이터베이스 연결, 고정된 크기의 읽기/쓰기 버퍼가 있다.|
|Mutual Exclusion|한 시점에 공유 자원에 접근할 수 있는 스레드는 단 하나이다.|
|Starvation|한 스레드 혹은 스레드의 그룹이 긴 시간 혹은 영원히 작업을 수행할 수 없게 된다. 작업의 우선권을 가지는 수행 시간이 짧은 스레드가 끝없이 실행된다면 수행 시간이 긴 스레드는 굶게 된다.|
|Deadlock|두 개 이상의 스레드들이 서로의 작업이 끝나기를 기다린다. 각 스레드는 서로가 필요로 하는 자원을 점유하고 있으며 필요한 자원을 얻지 못하는 이상 그 누구도 작업을 끝내지 못하게 된다.|
|Livelock|두 스레드가 락의 해제와 획득을 무한 반복하는 상태이다. 스레드들이 서로 작업을 수행하려는 중 다른 스레드가 작업중인 것을 인지하고 서로 양보한다. 이러한 공명 때문에 스레드들은 작업을 계속 수행하려 하지만 장시간 혹은 영원히 작업을 수행하지 못하게 된다.|

## 생산자-소비자(Producer-Consumer)

![](CleanCode_13_Concurrency_0.png)

위의 그림에서 잘못하면 생산자가 정보를 생산한 이후, 소비자에게 알림을 보냈음에도 불구하고 소비자는 다시 생산자에게 대기열을 채우라는 요청을 걸어두고 응답을 대기하고 있는 상황이 초래될 수 있다.

## 읽기-쓰기(Readers-Writers)

![](CleanCode_13_Concurrency_1.png)

쓰기 작업을 처리하는 동안 읽기 스레드가 읽지 못하게 한다면, 처리율에 영향을 미친다. 이런 경우 기아 현상이 발생할 수 있다. 반대로 읽기 스레드가 읽는 동안 쓰기가 갱신하는 것도 못하게 해야 한다. 

이런 상황에서 읽기 스레드의 요구와 쓰기 스레드의 요구를 적절히 만족시킬 필요가 있다. 

## 식사하는 철학자들(Dining Philosophers)

![](CleanCode_13_Concurrency_2.png)

원탁을 둘러싼 여러 명의 철학자들이 있다. 각 철학자의 왼쪽에 젓가락이 놓여 있으며 테이블의 중앙에 큰 음식이 놓여 있다. 배가 고파지면 그들은 자신의 양쪽에 놓여 있는 젓가락을 잡고 스파게티를 먹는다.

젓가락은 두짝이 있어야 비로소 먹을 수 있다. 옆 사람이 사용하고 있으면 기다려야 한다. 스파게티를 먹은 철학자는 다시 배가 고파질 때까지 포크를 놓고 있는다.

위 상황에서 철학자를 스레드로, 포크를 공유 자원으로 생각하면 이는 자원을 놓고 경쟁하는 프로세스와 비슷한 상황이 된다. 모두가 배가 고픈 상태가 되어 왼쪽에 있는 젓가락 부터 잡을 경우, 모두가 밥을 못먹고 굶어죽는 기아상태에 빠진다. 이렇게 잘 설계되지 않은 시스템은 deadlock, livelock, 처리량 문제, 효율성 저하 문제에 맞닥뜨리기 쉽다.

당신이 맞닥뜨릴 대부분의 concurrent관련 문제들은 위의 세 가지 문제의 변형일 가능성이 높다. 이 알고리즘들을 공부하고 스스로 해법을 작성함으로써 이와 같은 문제들을 직면하더라도 의연하게 대처할 수 있도록 하자.

# 동기화하는 메서드 사이에 존재하는 의존성을 이해하라

동기화된 메서드 간의 의존성은 동시성 코드에서 사소한 버그를 일으킬 수 있다. 자바는 `synchronized`라는 "메서드 하나를 보호하는 노테이션"을 제공한다. 하지만 한 클래스에 두 개 이상의 `synchronized` 메서드가 존재하면 문제를 일으킬 수도 있다. 즉, `synchronized` 키워드가 달린 함수를 의존성이 있게 순차적으로 호출하게 되는 경우, 시점에 영향을 받기 때문에 원하지 않는 결과를 가져올 수 있다는 말이다.

````java
/* Code 2-1: 문제가 되는 상황 */

public class IntegerIterator implements Iterator<Integer> {
    private Integer nextValue = 0;
    
    public synchronized boolean hasNext() {
        return nextValue < 100000;
    }
    
    public synchronized Integer next() {
        if (nextValue == 100000)
            throw new IteratorPastEndException();
        return nextValue++;
    }
    
    public synchronized Integer getNextValue() {
        return nextValue;
    }
}

// Shared Resource
IntegerIterator iterator = new IntegerIterator();

// Threaded-Code
while(iterator.hasNext()) {
    // nextValue가 99999인 상황에서 두 스레드에서 순차적으로 while(iterator.hasNext())를 호출하게 되면
    // 두 스레드 모두 while문 안으로 진입하게 된다. 왜냐하면 해당 조건만 확인하는 메소드였기 때문이다.
    // 이는 예상되지 않은 결과이다.
    // 이미 100000이하인 상황을 가정하고 아래 동작을 하길 바랐는데, 통과해버린 것이다.
    int nextValue = iterator.next();
    // do something with nextValue
}
````

이런 상황이면 `synchronized` 키워드를 사용한 이유가 없다. 이런 경우 다음의 세가지 방법으로 해결하자.

## 클라이언트 기반 잠금(Client-Based Locking)

먼저, 공유 객체를 사용하는 쪽 코드에서 공유 객체를 잠그는 방법이 있다.

````java
/* Code 2-2: Client-Based Locking */

// Shared Resource
IntegerIterator iterator = new IntegerIterator();

// Threaded-Code
while (true) {
    int nextValue;
    synchronized (iterator) { ✅
        if (!iterator.hasNext())
            break;
        nextValue = iterator.next();
    }
    doSometingWith(nextValue);
}
````

사용하는 쪽에서 `synchronized` 키워드를 통해서 thread가 순차적으로 접근하고, 그 안에서 조건을 탐색하도록 했다. 이럴 경우, 원하는 방식대로 순차적으로 들어오도록 만들 수 있다.

사실 이 방식은 좋지 않다. **해당 코드를 사용하는 모든 클라이언트에서 lock을 필요로하기 때문에, 경계영역이 흩어져 유지보수 비용이 상승한다.**

## 서버 기반 잠금(Server-Based Locking)

이번에는 제공하는 쪽에서 lock을 거는 방법이다.

````java
/* Code 2-3: Server-Based Locking */

public class IntegerIteratorServerLocked {
    private Integer nextValue = 0;
    
    public synchronized Integer getNextOrNull() { ✅
        if (nextValue < 100000)
            return nextValue++;
        else
            return null;
    }
}

// Shared Resource
IntegerIterator iterator = new IntegerIterator();

// Threaded-Code
while (true) {
    Integer nextValue = iterator.getNextOrNull();
    if (next == null)
        break;
    // do something with nextValue
}
````

동작을 수행하는 조건을 탐색하는 함수를 내부로 넣어서 해결했다. 사실 가장 위에서 설명한 문제가 발생하는 코드는, 동작의 진행을 판단하는 함수와 동작이 분기되어 있기 때문에 발생했다.

이 경우, 임계 영역을 최소화했기 때문에 클라이언트 기반 잠금보다 좋은 방식이다.

## 중계된 서버(Adapted Server)

````java
/* Code 2-4: Adapted Server */

public class ThreadSafeIntegerIterator {
    private IntegerIterator iterator = new IntegerIterator();
    
    public synchronized Integer getNextOrNull() { ✅
        if(iterator.hasNext())
            return iterator.next();
        return null;
    }
}

// Shared Resource
IntegerIterator iterator = new IntegerIterator();

// Threaded-Code
while (true) {
    Integer nextValue = iterator.getNextOrNull();
    if (next == null)
        break;
    // do something with nextValue
}
````

이번에는 `iterator`를 내부에 가짐으로서 임계영역을 최소화하면서 문제를 해결했다. 기본적인 방식은 서버 기반 잠금과 동일하나, 서드파티 라이브러리를 사용해야 하는 경우 사용하면 좋은 방식이다.

# 동기화하는 부분을 작게 만들어라

`Synchronized`로 수행되는 잠금은 딜레이와 오버헤드를 만들기 때문에 연산 비용이 비싸다. 그렇기 때문에 가능한 한 작게 만들어야 한다.

작게 만들면서도 critical section은 꼭 보호되어야 한다.

추천: 동기화된 영역은 최대한 작게 만들어라.

# 올바른 종료 코드는 구현하기 어렵다

 > 
 > 개발 초기에 시스템 종료에 대해 고민하고 구현하라. 이 작업은 생각보다 오래 걸릴 것이다. 기존에 구현한 알고리즘을 리뷰하는 것도 필요하다.

"항상 살아 있어야 하는 코드"의 작성은 "잠시 동작하고 조용히 끝나는" 코드의 작성과는 다르다. 깔끔하게 종료하는 경우는 구현하기가 어렵다. 흔히 발생하는 문제로는 Dead Lock이 있다. 부모 스레드가 자식 스레드를 여러개를 만든 후 모두가 끝나기를 기다렸다 자원을 해제하고 종료한다고 해보자. 자식 스레드 간에 dead lock이 걸렸다면 어떨까? 혹은 생산자/소비자 관계라면? 두 경우 모두, 무한정 대기하는 상황이 발생할 수 있다. 이런 경우 종료는 불가능해진다. 다중 스레드 코드를 짜는 경우, 올바르게 구현하는데 시간을 투자해야 한다.

# 스레드 코드 테스트하기

 > 
 > 다중 스레드 환경에서 테스트를 한다면, 프로그램 설정과 시스템 설정을 바꿔가며 자주 돌리자. 간헐적으로 통과하는 테스트 코드는 그냥 넘어가서 될일이 아니다.

단일 스레드 환경이라면, 테스트 코드가 충분히 의미가 있다. 정확성을 보장하기 때문이다. 하지만 다중 스레드 환경이라면, 고려할 상황이 매우 많아진다.

### 말이 안 되는 실패는 잠정적인 스레드 문제로 취급하라

 > 
 > 시스템 실패를 일회성이라 치부하지 마라.

다중 스레드 코드를 짜다보면 "말이 안되는" 오류를 일으킨다. 실제로 내 상식으로는 돌아가야 하는데, 그렇지 않은 상황을 마주한다. 이는 다중 스레드 환경이 주는 복잡함 때문에 발생한다. 직관적으로 이해하기가 어렵기 때문이다. 그렇기 때문에 우리 개발자들은, 이런 문제를 우주선 문제(?), 하드웨어 문제 등 일회성 문제로 치부하고 무시하기 마련이다. 하지만 이렇게 일회성 문제로 치워둔 문제를 계속 무시한다면 잘못된 코드 위에 코드가 계속 쌓인다.

### 다중 스레드를 고려하지 않은 순차 코드부터 제대로 돌게 만들자

 > 
 > 스레드 환경 밖에서 생기는 버그와 스레드 환경에서 생기는 버그를 동시에 디버깅하지 마라. 스레드 환경 밖에서 코드를 먼저 확인하고 스레드 환경을 체크하자.

스레드 내부에서 특정 코드가 돌아가고 있다면, 내부에서 돌아가는 코드의 테스트부터 수행하자. 내부에 들어가는 코드는 스레드와 관련이 없기 때문에, 정확성 체크가 가능하다.

### 다중 스레드를 쓰는 코드 부분을 다양한 환경에 쉽게 끼워 넣을 수 있게 스레드 코드를 구현하라

 > 
 > 다양한 설정에서 실행할 목적으로 다른 환경에 쉽게 끼워 넣을 수 있게 코드를 구현하자.

* 하나의 스레드 환경, 여러 스레드 환경, 실행 중 스레드 수를 변경하여 테스트 한다.
* 스레드 코드를 실제 환경, 테스트 환경에서 돌려본다.
* 여러 속도(빠르게, 천천히)로 테스트 코드를 돌려본다.
* 반복 테스트가 가능하도록 테스트 케이스를 작성한다.

### 다중 스레드를 쓰는 코드 부분을 상황에 맞게 조율할 수 있게 작성하라

적절한 스레드 개수를 파악하려면 상당한 시행착오가 필요하다. 그렇기 때문에, 처음부터 다양한 설정으로 프로그램의 성능 측정 방법을 생각하자. 즉, 스레드 개수를 조율하기 쉽게 코드를 구현하자. 프로그램이 동작하는 시점에 스레드 개수를 변경하는 방법도 고려하자. 혹은 처리율과 효율에 따라 스레드 개수를 조율하는 코드를 생각해보자.

### 프로세서 수보다 많은 스레드를 돌려보라

시스템에서 운영하는 물리 스레드 개수와 소프트웨어 스레드 개수가 다르면 스와핑이 일어난다. 스와핑이 잦으면 임계영역을 빼먹은 코드, Dead Lock을 발견하기 쉬워진다. 임의로 소프트웨어 스레드를 많이 만들어 스와핑을 일으켜 문제를 확인해보자.

### 다른 플랫폼에서 돌려보라

 > 
 > 처음부터, 그리고 자주 모든 Target Platform에서 코드를 돌려보자.

저자는 윈도우 XP, OS X에서 예제 코드를 돌릴 일이 생겼는데, 어디는 되고 어디는 안됐다. 그 이유는 각각의 운영체제 마다 스레드를 처리하는 정책이 달랐기 때문이다. 이런 문제까지 봉쇄하기 위해서는 여러 플랫폼에서 테스트를 수행하는 것이 좋다.

### 코드에 보조 코드 instrument를 넣어 돌려라. 강제로 실패를 일으키게 해보라

스레드 버그가 산발적이고, 우발적이며, 재현이 어려운 이유는 코드가 실행되는 수천가지 경로중에 아주 소수만 실패하기 때문이다. 

이렇게 빈도 횟수가 극도로 적은 경우에 에러를 잡기 위해서는 어떻게 해야할까? 이건 비단 다중 스레드 환경에서만 발생하는 해결책은 아니다. 가장 먼저 해볼 방법은 **빈도수를 극도로 올려 발생 횟수를 늘리는 것이다.** 확률적으로 발생 수는 같으나, 횟수가 늘어나기 때문에 상대적으로 발생하는 상황을 더 자주 마주할 수 있다.

다음으로는 **보조 코드를 추가하여 실행되는 순서를 바꿔주는 것이다.** `wait()`, `sleep()`, `yield()`, `priority()` 등과 같은 메서드를 추가하여 다양한 순서로 실행되도록 해보자.

#### 직접 구현하기

이는 `wait()`, `sleep()`, `yield()`, `priority()` 등의 메서드를 사용해 실행 경로를 변경함으로써 코드의 문제를 발견하는 방법이다.

````java
/* Code 3-1 */

public synchronized String nextUrlOrNull() {
    if(hasNext()) {
        String url = urlGenerator.next();
        Thread.yield(); ✅
        // inserted for testing.
        updateHasNext();
        return url;
    }
    return null;
}
````

`yield()` 메서드를 호출함으로써 코드의 실행 경로를 변경할 수 있다. 만약 위 코드에서 문제가 발생한다면 이는 `yield()`를 추가해 생긴 문제가 아니라 이미 존재하던 문제를 명백히 만든것 뿐이다. 하지만 이 방법에는 몇 가지 문제가 있다.

* 테스트할 부분을 직접 찾아야 한다.
* 어디에 어느 메서드를 호출해야 할지 알기 어렵다.
* 이와 같은 코드를 제품에 포함해 배포하는 것은 불필요하게 퍼포먼스를 저하시킬 뿐이다.
* 무작위적이다. 오류가 드러날 수도 있고, 아닐 수도 있다. 아닐 확률이 더 높다.

이런 경우, debug 키워드를 통해 debug시에만 컴파일 되도록 하는 방법을 사용할 수 있겠다. 근본적으로는 POJO 단위로 나눠서, instrument code를 삽입할 부분을 찾기 쉽기하는 방법이 있겠다.

#### 자동화

위와 다르게 Aspect-oriented Framework, CGLib, ASM등을 통해 프로그램적으로 코드를 조작할 수도 있다. 

````java
/* Code 4-1 */

public class ThreadJigglePoint {
    public static void jiggle() { }
}

public synchronized String nextUrlOrNull() {
    if(hasNext()) {
        ThreadJiglePoint.jiggle(); ✅
        String url = urlGenerator.next();
        ThreadJiglePoint.jiggle(); ✅
        updateHasNext();
        ThreadJiglePoint.jiggle(); ✅
        return url;
    }
    return null;
}
````

jiggle은 영어로 흔들다라는 뜻이다. 즉, 해당 메서드를 만들어두고, 디버그 환경에서 내부적으로 thread를 `sleep()` 하거나, `yield()` 하는 동작을 넣어버리는 것이다. 혹은 무작위로 둘 중 하나의 메서드가 실행되도록 할 수 있겠다. 배포 환경에서는 구현을 빼버린다. 

# 결론

* 동시성 코드는 제대로 작성하기 어렵다.
* SRP를 준수해야 한다. 스레드를 관리하는 코드와 그와 무관한 코드는 구분해야 한다.
* 테스트시에는 스레드 무관한 코드부터 동작의 정확성을 검증한다.
* 동시성 오류가 발생하는 잠정적인 원인에 대해 먼저 숙지한다. 이를 위한 기본 알고리즘을 이해한다.
* 임계 영역을 찾는 방법, 그리고 특정 코드의 진입을 잠그는 방법을 이해한다.
* 유지보수를 위해 임계 영역은 최대한 줄인다.
* 클라이언트에게 공유 상태를 관리하는 책임을 떠넘기지 않는다.
* 다중 스레드 환경에서 발생하는 테스트 실패를 일회성으로 넘기지 말아라.
* 다양한 환경, 스레드 수, 실행 속도, 보조 코드, 빈도수 증대 등의 방법을 통해 쉽사리 발생하지 않는 동시성 문제의 빈도수를 높혀 문제를 찾아라.

# Reference

* [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin)
* [Yooii-Studios / Clean-Code](https://github.com/Yooii-Studios/Clean-Code)
* [Clean Code](https://book.interpark.com/product/BookDisplay.do?_method=detail&sc.prdNo=213656258&gclid=CjwKCAjw9-KTBhBcEiwAr19igynFiOxjFYKEJyaiyNEI4XXL1bFM78ki2cNQLMSxcUWU9XNks8eEThoCG6EQAvD_BwE)
* [zinc0214 / CleanCode](https://github.com/Yooii-Studios/Clean-Code)
* [wojteklu/clean_code.md](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
