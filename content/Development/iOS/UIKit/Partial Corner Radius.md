---
title: Partial Corner Radius
thumbnail: ''
draft: false
tags:
- UIKit
- ios
- swift
- corner-radius
created: 2023-10-01
---

부분적으로 rounding 처리하는 방법을 알아보자.

# Answer

````swift
view.layer.masksToBounds = true
view.layer.cornerRadius = 10
view.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
````

동작은 간단하다. 다만, 이걸 어떻게 일반화하여 적용하고 쉽게 사용할 수 있게 만들까가 더 어려운 질문이다. 다양한 방법들에 대해서만 적어두겠다. 사용할 때는 실제로 만들어서 사용하자.

1. corner의 위치(왼위, 오위, 왼아래, 오아래)와 그 정도(반지름)에 대한 정보는 따로 관리하는 것이 좋다.
   * 즉, 함수의 파라미터로 단순히 넣는 방법은 유지보수 측면에서 그리 좋지 못하다.
   * 연관된 값이기 때문에 캡슐화를 해서 가지고 있는 것이 더 좋다.
1. 외부에서 사용할 때는 `.layerMinXMinYCorner`와 같이 안읽히는 값 말고 직관적인 다른 것이 필요하다.
   * `UIRectCorner`를 생각해보자.
1. 1을 적용했다면 결국 이러한 값을 내부적으로 view에 적용할 방법이 필요하다.
   * 1의 구조체에서 view를 외부에서 받아서 처리하는 방법이 있다.
1. 실제로 외부에서 사용할 시 UIView의 함수를 호출하는 것 말고 다른 방법도 있을 수 있다.
   * 연산자 정의

여기까지 말해줬으면 어떻게 구현할 수 있겠지? ~~내 컴퓨터 .md를 찾아볼 것~~

# Reference

* [UIView+round.swift](https://gist.github.com/Sorix/259e4cc4e6d0ae30e554f135476853e1)
  * 이것도 답은 아님, 그냥 참고
* [maskedCorners](https://developer.apple.com/documentation/quartzcore/calayer/2877488-maskedcorners#)
* [UIRectCorner](https://developer.apple.com/documentation/uikit/uirectcorner)
* [CACornerMask](https://developer.apple.com/documentation/quartzcore/cacornermask)
