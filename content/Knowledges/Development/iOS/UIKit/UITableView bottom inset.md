---
title: UITableView bottom inset
thumbnail: ''
draft: false
tags:
- swift
- UIKit
- ios
- UITableView
- bottom-inset
created: 2023-10-01
---

UITableView의 바닥을 어느정도 띄워야할 필요가 있었다. 어떻게 했는지 기록해둔다.

# Solution

* UIScrollView의 contentInset 동작을 이해했다면 쉽게 알아먹을 수 있다.
* 모른다면 [UIScrollView ContentInset, Offset, Size](https://velog.io/@wansook0316/UIScrollView-ContentInset-Offset-Size)를 참고하자.

````swift
self.tableView.contentInset.bottom = 15
````

# Reference

* [UIScrollView ContentInset, Offset, Size](https://velog.io/@wansook0316/UIScrollView-ContentInset-Offset-Size)
