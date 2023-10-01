---
title: UIScrollView
thumbnail: ''
draft: false
tags:
- content-offset
- content-inset
- UIKit
- ios
- swift
- UIScrollView
created: 2023-10-01
---

UIScrollView의 ContentInset, ContentOffset, ContentSize에 대해서 알아본다.

# 핵심 요약

[ContentOffset, ContentInset, and ContentSize of a UI ScrollView](https://betterprogramming.pub/contentoffset-contentinset-and-contentsize-of-a-uiscrollview-5ae8beb0f1db)에 좋은 사진이 있어 공유한다.
![](UIKIt_30_UIScrollViewContentOffsetInsetSize_0.webp)

# ContentInset

* safe area 혹은 scrollView의 가장 자리로부터 어느정도 떨어져있는지를 지정할 수 있는 값
* 즉, **여백**

# ContentOffset

* 스크롤 뷰의 원점으로 부터 컨텐츠 뷰의 원점이 어느정도 떨어져 있는가?
* 즉, **스크롤된 지점**
* 이 값이 bounds랑 관련이 있을 수 밖에 없다.
* `scrollView.setContentOffset(CGPoint(x: .zero, y: 50), animated: true)`
* `scrollView.bounds.y = -50`
* 위 두개는 같은 것이다. 같은 현상을 무엇을 주어로 하여 값을 매기냐에 따라 다르게 표기되는 것.
  * contentView 입장에서 Offset == 간격 == 양수로 매기기를 바람
  * bounds는 내부의 좌표계의 원점을 의미함
    * 좌표계의 위치가 올라가야 컨텐츠는 상대적으로 아래에 위치함 == 음수
  * 헷갈린다면 [Frame & Bounds](https://velog.io/@wansook0316/Frame-Bounds)를 참고하자.

# ContentSize

* ScrollView는 당연히 스크롤하려고 쓰는 것이다.
* 그렇다면 화면에 보이는 것보다 실제 컨텐츠 영역이 더 길다는 말이다.
* 이러한 영역 자체를 내부적으로 갖고 있을 것이며, 이걸 설정하는 것이 contentSize이다.

# Reference

* [iOS ) ContentInset](https://zeddios.tistory.com/803)
* [contentInset](https://developer.apple.com/documentation/uikit/uiscrollview/1619406-contentinset)
* [contentOffset](https://developer.apple.com/documentation/uikit/uiscrollview/1619404-contentoffset)
* [Frame & Bounds](https://velog.io/@wansook0316/Frame-Bounds)
* [ContentOffset, ContentInset, and ContentSize of a UI ScrollView](https://betterprogramming.pub/contentoffset-contentinset-and-contentsize-of-a-uiscrollview-5ae8beb0f1db)
