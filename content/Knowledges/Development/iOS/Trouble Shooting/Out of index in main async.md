---
title: Out of index in main async
thumbnail: ''
draft: false
tags:
- UITableView
- out-of-index
- crash
- main-thread
- UIKit
- ios
created: 2023-10-01
---

TableView dataSource에서 아이템을 가져오다 outOfIndex가 나서 crash가 났다. 이로부터 배운 점에 대해 적어본다.

# 어떤 상황인가?

* crash 로그를 확인해보니, tableView에서 indexPath를 벗어나 발생했음을 확인했다.
* 단순히 코드를 보았을 때는 별 문제가 없어보였다.

# 코드의 상황

* Api 호출 시 들어가는 completion에서 `performInMainThread`를 수행해주고 있었다.
* completion에서 main으로 해줬다면, 중복되는 코드가 없어질 듯했다. 
* [Completion in main thread](Completion%20in%20main%20thread.md)
* 해당 코드내에서는 tableView를 reload 해주고 있었다.
* 이러면 어떤 문제가 발생할 수 있을까?

# 문제점

* async로 10개의 reload가 async하게 처리된다고 생각해보자.
* main thread는 serial하므로 순차적으로 tableView reload를 수행한다.
* 그런데, 그 와중에 만약 dataSource의 개수가 변경된다면?
* 현재 수행하는 작업 이후에 처리될 작업에서 tableView를 reload한다면 outOfIndex가 나올 수 있다.

# 방어코드

* 이러한 문제점때문에, array에 접근해서 값을 가져올 경우, 방어코드를 짜야한다.
* 이전에 알아보았던 subscript를 사용하는 것이 도움이 될 수 있다.
* [Safe Array Lookup](Safe%20Array%20Lookup.md)

# 정리

* 크래시가 나기 쉬운 상황은 예전에 정리했었다.
* 이번에 실질적인 상황을 마주하여 보다 조심하게 되는 계기가 되었다.

# Reference

* [No Crash Habits](https://velog.io/@wansook0316/Swift%EC%97%90%EC%84%9C-%ED%81%AC%EB%9E%98%EC%8B%9C%EB%A5%BC-%EC%A4%84%EC%9D%B4%EB%8A%94-4%EA%B0%80%EC%A7%80-%EB%B0%A9%EB%B2%95)
* [Completion in main thread](Completion%20in%20main%20thread.md)
* [Safe Array Lookup](Safe%20Array%20Lookup.md)
