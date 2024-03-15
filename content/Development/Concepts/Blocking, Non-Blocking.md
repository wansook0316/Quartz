---
title: Blocking, Non-Blocking
thumbnail: null
draft: false
tags:
- blocking
- non-blocking
- thread
- request-driven
- event-driven
- sync
- async
created: 2023-10-01
---

무심코 사용하는 많은 비동기 함수들은 사실 변화의 과정을 겪은 결과들이다. 네트워크 I/O API가 어떻게 변화되어 왔는지 알아보자.

# 한눈에 보기

![](TechTalks_14_BlockingNonblocking_0.png)

network API를 사용하다보면 자연스레 머리에 이런 그림이 떠오른다. 하지만 이런 처리 방식은 Network에서만 국한되서 발생하는 것이 아니다. Network API는 결국 I/O API에 속하게 되기 때문에, 큰 맥락에서 이해하는 것이 중요하다. 쉽게 말해, 두개의 작대기를 왼쪽은 User Level, 오른쪽은 Kernel Level이라고 해도 충분히 말이 되기 때문이다. 

즉, 이 과정은 Network에 국한되기 보다는, 시스템의 발전 과정에 대해 이해하는 것이라 보는 것이 더 타당하겠다. 실제로 Sync와 Async의 동작 방식을 본다면 이전 글인 [Request-Driven](Request-Driven.md), [Event-Driven](Event-Driven.md)와 상당히 비슷한 idea를 가지고 있음을 확인할 수 있다.

# Sync/Blocking

![](TechTalks_14_BlockingNonblocking_1.png)

Sync/Blocking 방식은 거의 thread를 나눈 이유가 없다고 볼 수 있다. 작업의 독립적인 흐름의 단위가 thread인데, 독립적으로 작동하지 못하고 종속되어 있기 때문이다. 즉, 1번 thread에서 2번 thread로 작업을 요청했을 시, 2번 thread에서 작업이 완료되기 전까지 1번 thread는 아무일도 하지 못한다(block)는 말이다.

만약 1번이 client, 2번이 server라고 가정한다면, TCP 연결을 위한 3-way handshaking 이 완료되기 전까지 client는 아무 작업도 할 수 없다는 말이다. 즉, App이 멈춰버린다. 초기 BSD Socket API가 이런 형태였다.

# Sync/Non-Blocking

![](TechTalks_14_BlockingNonblocking_2.png)

이게 지나치게 불편하다는 점에서 개선된 형태이다. 어떻게 보면 진정한 의미의 thread가 생겼다고 할 수 있다. 요청을 하면, 요청을 받은 thread에서 작업을 하되, 요청한 thread를 block하지 않고 바로 리턴(non-block)하여 일을 할 수 있도록 한다. 이 때, 상태를 같이 전달함으로써 요청한 thread가 확인할 수 있도록 한다.

요청한 thread는 연결이 되었는지 확인하기 위해 주기적으로 물어볼 수 밖에 없다. 이렇게 물어볼 때마다 상태만을 전달 받고, 최종적으로 작업이 모두 완료된 이후 시점에 질문하였다면 완료 상태를 전달한다. 이후 요청 thread는 로직에 따라 추가작업을 수행할 수 있다. BSD Socket은 여전히 Sync/Blocking과 Sync/Non-Blocking 방식 모두를 하위호환을 위해 제공한다고 한다. 이제는 거의 남아있지 않다.

# Async/Non-Blocking

![](TechTalks_14_BlockingNonblocking_3.png)

요즘의 API는 대부분 이 구조이다. 어떤 context, 즉, 어느 thread에서 요청하든 간에, 즉시 return하고 Callback function을 함께 넘겨주어, 작업이 끝난 시점에 동작하도록 하는 구조이다. 혹은 delegate를 넘겨, 작업이 끝난 시점에 위임 객체가 동작을 처리하도록 할 수도 있겠다. 

동작을 처리하는 thread가 달라질 수 있기 때문에, UI update와 같은 동작들을 main thread에서 처리할 수 있도록 변경해주는 일이 필요하다. 혹은 thread를 설정을 잘못하여, 상호 호출이 발생하여 무한정 대기하는 상황이 발생할 수도 있다. 동작을 정확하게 이해하고 적용하는 것이 중요하다.

# Async/Blocking

![](TechTalks_14_BlockingNonblocking_4.png)

이런 API는 사실 본 적이 없다. 구분 상으로는 의미가 있으나, 사실상 의미가 없다. 그 이유는, 제어권이 요청한 thread로 넘어왔음에도 아무런 동작을 할 수 없기 때문에, 굳이 return을 할 이유가 없다. 결국은 sync/blocking 방식과 거의 유사하게 동작한다는 점에서 사용하기 어려운 방식이다.

# Note!

결국 이 모든 것들을 보게 된다면, 어떤 thread가 이 동작의 권한을 가지냐로 직결된다. 즉, Sync의 경우, 결국 1번 thread가 흐름 제어와 같이 보다 처리를 주도하고 있다. Async의 경우 처리의 완료 시점에 따라 로직이 진행되기 때문에, 2번 thread가 처리를 주도한다고 볼 수 있다.

이러한 점은 이전 글에서 보았던[Request-Driven](Request-Driven.md), [Event-Driven](Event-Driven.md)과 상당히 유사한데, Request쪽에서 주도하는 경우가 Sync, Event쪽에서 주도하는 경우가 Async라고 비교해 볼 수 있겠다.
