---
title: UIImageView UserInteractive
thumbnail: ''
draft: false
tags:
- swift
- UIKit
- UIImageView
- userInteractionEnabled
created: 2023-10-01
---

`UIImageView` 내부에 `GestureRecognizer`를 넣고 이벤트를 받으려 했더니 동작하지 않았다.

# userInteractionEnabled

* `UIImageView`의 `userInteractionEnabled`의 값은 `defaultValue`가 `false`이다.
* `UIView`의 값을 상속해서 사용하나, `UIImageView`는 이값을 바꾼다고 한다.

# Reference

* [UIImageView/userInteractionEnabled](https://developer.apple.com/documentation/uikit/uiimageview/1621063-userinteractionenabled)
