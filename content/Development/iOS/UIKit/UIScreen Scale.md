---
title: UIScreen Scale
thumbnail: ''
draft: false
tags:
- UIKit
- swift
- ios
- UIScreen
- scale
created: 2023-10-01
---

Shadow를 보다가 scale에 대해서 알게된 내용을 적어본다.

# 정리

* retina display가 나오면서 화면의 기본단위를 논리적으로 정의된 것을 사용하게 되었다.
* Point가 그것이다.
* 즉, 1pt는 각 디바이스의 scale factor에 따라 실제 pixel에 대응되는 값이 달라진다는 뜻이다.
* retina display라면, 2, 3의 값을 갖는데, 이 경우 1pt == 9px, 4px로 변환된다.
* 모든 디바이스의 scale factor는 [iOS Resolution](https://www.ios-resolution.com/)에서 찾아볼 수 있다.

# Reference

* [UIScreen.screen](https://developer.apple.com/documentation/uikit/uiscreen/1617836-scale)
* [iOS Resolution](https://www.ios-resolution.com/)
