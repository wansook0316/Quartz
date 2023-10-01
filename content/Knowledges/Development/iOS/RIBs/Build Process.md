---
title: Build Process
thumbnail: ''
draft: false
tags:
- builder
- RIBs
- architecture
created: 2023-10-01
---

![](TechTalks_16_RIBS_5.png)

그럼 이번에는 Router에서 하위 RIB의 `build()`를 호출할 때 어떠한 순서로 진행되는지 알아보자.

1. 먼저, 동적 의존성이 있을 경우 `component`를 생성해준다.
1. 다음으로는 `View`, `Interactor`, `Router`의 의존 순서에 맞춰 View 부터 만들어준다.
1. `Interactor`를 만들어 준다. 이 때 `View`를 생성자 주입한다.
1. 해당 RIB의 하위 RIB의 `Builder`를 만들어준다.
1. Router를 만들어 준다. 이 때, `Interactor`와 `View`, 하위 RIB `Builder` 모두를 주입한다.
1. 마지막으로 해당 Router를 반환한다. 반환한 Router는 상위 RIB의 Router가 관리한다.
