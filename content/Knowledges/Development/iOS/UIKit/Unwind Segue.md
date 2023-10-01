---
title: Unwind Segue
thumbnail: ''
draft: false
tags:
- storyboard
- unwind-segue
- UIKit
- ios
- swift
created: 2023-10-01
---

code를 보다가 unwind segue라는 녀석을 보게 되었다. 처음 보는 친구라 정리해보려고 한다.

# Unwind Segue

일단 Unwind라는 뜻을 알아보자.
![](UIKIt_17_UnwindSegue_0.png)

음. 무언가를 푼다는 개념같다. 그렇다면 무엇을 푸는 걸까?

웹/앱 서비스를 사용하다 보면 이런 경우가 있다. A -> B -> C와 같이 화면이 이동하다가, 뒤로 Back 하는 경우에는 C -> B -> A 순으로 작동하면 안되고 C -> A로 바로 이동해야 하는 경우가 있다. 예를 들어, Home -> Detail 화면까지는 진입했는데, 로그인이 사용자가 안되어 있어서 Login을 위한 Modal이 뜨게 되고, 이 modal에서 로그인을 하지 않을 경우에는 바로 Home을 보여주는 경우가 있겠다.

이럴 경우, Storyboard에서 Login -> Home으로 Segue를 연결할 경우, stack에 VC가 쌓이게 되기 때문에, 내가 원하는 동작을 한다고 보기 어렵다. 이러한 상황에서 Xcode에서는 `Unwind Segue`라는 것을 제공한다. 이를 걸어두면, 중간에 있는 VC들이 메모리에서 해제되면서 원하는 화면을 볼 수 있게 된다.

# Usage

![](UIKIt_17_UnwindSegue_1.png)

위에서 말한 예를 추상적으로 만들어보았다. Detail 화면이 보이고, Login 버튼을 누르면 Modal창이 올라와서 login, cancel을 누르면 화면이 Home으로 돌아간다.

사용법은 간단하다. 내가 돌아가고자하는 목적지를 일단 알아야 한다. 위 예의 경우, Home으로 돌아가야 하기 때문에, Home이 돌아갈 목적지가 되겠다.

이 Home에 다음과 같은 Segue 함수를 구현한다.

````swift
import UIKit

class HomeViewController: UIViewController {

    @IBAction func unwindToHome(_ unwindsegue: UIStoryboardSegue) {}

}
````

이렇게 구성해두면, Storyboard의 Exit 버튼에 선택할 수 있는 항목이 생긴다. 

![](UIKIt_17_UnwindSegue_2.png)

원하는 Button의 Action에 이 Segue를 연결해두면 끝이다.

![](UIKIt_17_UnwindSegue_3.gif)

# Reference

* [Dismissing a View Controller with an Unwind Segue](https://developer.apple.com/documentation/uikit/resource_management/dismissing_a_view_controller_with_an_unwind_segue)
