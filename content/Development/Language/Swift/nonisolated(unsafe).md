---
title: nonisolated(unsafe)
thumbnail: ''
draft: false
tags:
- swift
- concurrency
- data-race
created: 2024-06-20
---


 > 
 > Data-race의 문제를 swift concurrency (compiler constraint)를 통해 해결하지 않고, 타 매커니즘을 통해 해결한 경우, 이에 대해 에러를 내뿜지 않도록 하는 키워드

* swift concurrency는 compiler가 data-race에 대한 취약점을 파악할 수 있다는 점에서 유용하다.
* 하지만 이를 migration하는 과정에서 모든 것을 한순간에 다 바꾸는 것은 어려울 수 있다.
* 그리고 컴파일러는 이렇게 런타임에서 data-race를 막는 코드에 대해 알수가 없다.
* 이런 부분에서 프로그래머가 설정할 수 있는 키워드라 이해하면 되겠다.
