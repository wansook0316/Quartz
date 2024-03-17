---
title: NSNotFound
thumbnail: ''
draft: false
tags:
- swift
- error
- NSNotFound
created: 2023-09-30
---

TableView의 index를 조정하면서 `NSNotFound`라는 값을 넣어주는 것을 보게되었다. 왜 이런 것이 필요한지 알아본다.

# 핵심 정리

* ObjectiveC에는 Optional이 없다.
* 그렇기 때문에 배열 및 문자열에서 특정 index가 존재하지 않는다와 같은 상태를 나타내기 위한 값이 필요했던 것

# NSNotFound

* OS X v10.5 이전에는 `0x7fffffff`으로 할당된 값이었다.
* 32비트 시스템에서는 `NSIntegerMax`와 같은 값이었다.
* 그런데 64비트 시스템을 호환하기 위해서 이제는 아예 `NSIntegerMax` 값과 동일시 처리하였다.
* 그말은 즉슨, 32, 64비트 환경에 따라 `NSNotFound`의 값이 달라진다는 말이다.
* 그렇기 때문에 아카이브다 파일에 **직접적으로 해당 값을 저장하면 안된다.** (물리적)
  * 시스템 환경에 따라 값이 달라질 것이기 때문
  * 논리적으로 저장해놓지 않으면 서로 다른 시스템에서 다르게 해석할 요지가 존재
  * 하드 코딩은 역시 어디서나 좋지 않다.

# Reference

* [NSNotFound](https://developer.apple.com/documentation/foundation/nsnotfound)
* [NSIntegerMax](https://developer.apple.com/documentation/objectivec/nsintegermax)
* [TableView ScrollToTop!](https://yagom.net/forums/topic/tableview-scrolltotop/)
* [NSRange와 Range](https://jcsoohwancho.github.io/2019-11-17-NSRange%EC%99%80-Range/)
