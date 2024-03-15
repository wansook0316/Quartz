---
title: UIViewController
thumbnail: ''
draft: false
tags:
- ios
- UIViewController
- UIKit
- loadView
- swift
created: 2023-10-01
---

ViewController는 iOS 앱 개발에서 빼놓을 수 없는 요소이다. 구조적으로 어떻게 구성되었는지 알아보고, 어떤 life cycle을 가지는지 이해해보자. 그럼 시작하자.

# ViewController

![](UIKIt_02_UIViewController_UIView_0.png)

* View management model
* 역할
  * view 구성
  * view event 처리
  * data를 view와 연결
* templates
  ````swift
  class ViewController: UIViewController {
      override func viewDidLoad() {
          super.viewDidLoad()
          // VC내부에 property로 있는 view가 화면에 보이기 위해 load 되었을 때 호출됨
          // VC 생성 시점과 view가 보이는 시점은 차이가 있음
      }
  
      override func didReceiveMemoryWarning() {
          super.didReceiveMemoryWarning()
          // App이 메모리 부족 경고를 받을 경우 호출됨
      }
  }
  ````
  
  * 메모리 관리는 AppDelegate에서도 가능

## 초기화

````swift
// code
public init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?)

// storyboard
public init?(coder: NSCoder)
````

* parameter
  * nibName: nib 파일명
  * bundle: nib파일이 있는 Bundle(NSBundle) 객체
  * `UIViewController.init()`인 경우 nil로 넘어옴
* 활용
  ````swift
  class ViewController: UIViewController {
      override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
          super.init(nibName: nibNameOrnil, bundle: nibBundleOrNil)
  
          // 초기화 코드 작성
          // 해당 시점에는 view가 없음
          // view와 관계없는 object 초기화 용도로 좋음
      }
  }
  
  class ViewController: UIViewController {
      required init?(coder: NSCoder) {
          super.init(coder: coder)
  
          // 상등
      }
  }
  ````

## Life Cycle

1. init
1. loadView
1. viewDidLoad
1. viewWillAppear
1. viewDidAppear
1. viewWillDisappear
1. viewDidDisappear
1. deinit

# LoadView

* view에 대한 customizing 작업
* 구현하지 않아도 기본적으로 view가 생성되어 load됨

````swift
override func loadView() {
    let view = UIView(frame: UIScreen.main.bounds) // 스크린 크기에 맞춘 view 생성
    view.backgroundColor = UIColor.green
    view.autoresizingMask = [.flexibleWidth, .flexibleHeight] // window의 크기 변경에 맞춰 변하도록 설정
    self.view = view
}
````

## 주의사항

* init method에서 view에 접근하면 위험함
  * 초기화 작업 중에 viewDidLoad가 호출될 수 있음
  * method 호출 순서가 달라져 버그 발생위험 있음
  * 일반적인 상황
    * viewController가 사용되기 시작할 때 호출됨
  * init method에서 접근
    * view 생성, 초기화 과정에서 호출됨

## Container View Controller

![](UIKIt_02_UIViewController_UIView_1.png)

* UIViewController 하위에 ChildViewController를 둘 수 있음
* 기능에 따라 ViewController를 분리 후, Container ViewController에 모아서 보여줄 수 있음
* **동일한 생명주기를 가짐**

## 정리

![](UIKIt_02_UIViewController_UIView_2.png)

* UIWindow위에 rootViewController가 올라간다.
* ViewController에서는 ChildViewController를 가진다.
* 추가적으로 다른 창을 띄울수도 있고(modal) 이는 `presentedViewController`로 접근 가능하다.

# Reference

* [ViewController for iOS](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/index.html#//apple_ref/doc/uid/TP40007457-CH2-SW1)
