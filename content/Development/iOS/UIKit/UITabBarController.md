---
title: UITabBarController
thumbnail: ''
draft: false
tags:
- swift
- ios
- UIKit
- UIViewController
- UITabBarController
created: 2023-10-01
---

# UITabBarController

![](UIKIt_03_UINavigationController_UITabBarController_4.png)

위 그림에서 가운데 있는 것이 TabbarController이다. TabBarController의 경우 다음과 같은 특징을 갖는다.

* Parent-Child의 관계
* 특정 탭 선택시, 탭에 연결된 VC가 표시되면서 이전 탭의 VC가 대체됨
* 각각의 탭에 대응되는 VC는 한번에 로드되지 않고, 필요할 때 로드됨
* TabBarController안에 NavigationController를 사용할 수 있음
* 탭 6개 이상인 경우 4개 탭만 표시되고 more(...)로 표시됨
