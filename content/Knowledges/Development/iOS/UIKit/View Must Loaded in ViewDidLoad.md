---
title: View Must Loaded in ViewDidLoad
thumbnail: ''
draft: false
tags:
- ViewDidLoad
- UIKit
- ios
- swift
- UIViewController
created: 2023-10-01
---

`UIViewController`가 init 되는 시점에 특정 View를 설정하면 안되는가? 왜 안되는가?

# 핵심 요약

* `UIViewController`의 init에 `View`를 설정하게 되면, **메모리 부족으로 인해 View가 해제되는 상황에 대응할 수 없다.**
* iOS 시스템은 메모리가 부족한 경우, 절대적으로 치명적이지 않은 자원을 해제해버린다.
* 정확히 말하면 메모리 경고 발생 > `UIViewController` 객체 안의 `UIView` 객체가 사용되지 않는 상태이면 nil로 설정된다.
* 이 다음에는 현재는 deprecated된 `viewDidUnload`가 호출되었었다.
* 이 상황에서 다시 viewController가 활성화된다면 다시 viewDidLoad가 호출되게 된다.
* **하지만 iOS6 부터 더이상 메모리 부족 상황에서 View가 purge되지 않는다고 한다.**
* 개발자가 메모리 부족 상황에 따라 자체적으로 대처해주어야 한다.
* 그럼에도 불구하고 `viewDidLoad`에서 View를 처리해야 한다는 것은 변하지 않는다.
* 예전에는 iOS 개발 기본 질문이었으나, 메모리 크기가 커지면서 묻지 않는 추세가 되었다.

# didReceiveMemoryWarning

* 메모리 경고가 발생할시 호출되는 메서드이다.
* 직접적으로 호출아면 안된다.
* 해당 메서드를 override하여 iOS 6 이전의 동작처럼 현재 보이지 않는 View에 대해 nil처리를 할 수 있을 것이다.
* 즉, 이전에는 시스템에서 알아서 안보이는 뷰를 해제 시켰다면, 이제는 개발자가 상황에 맞춰 처리해주어야 한다.

# viewDidLoad

* View Hierachy가 메모리에 로드될 때 호출된다.
* 문서에서도 추가적인 View의 초기화가 필요하다면 해당 시점에 하라고 명시되어 있다.

# Reference

* [How to implement didReceiveMemoryWarning?](https://stackoverflow.com/questions/2430728/how-to-implement-didreceivememorywarning)
* [viewDidUnload](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621383-viewdidunload)
