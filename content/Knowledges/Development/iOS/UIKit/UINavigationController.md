---
title: UINavigationController
thumbnail: ''
draft: false
tags:
- UIKit
- responser-chain
- chain-of-responsibility
- UIViewController
- UINavigationController
- swift
- ios
created: 2023-10-01
---

ViewController는 계층을 이루면서 구성된다. 그 중 대표적으로 알려진 것이 NavigationController, TabBarController 이다. 오늘은 계층이 어떻게 구성되었는지 간단하게 알아보고, 구체적으로는 NaviagtionController와 TabBarController를 알아보려 한다. 그럼 시작해보자.

# ViewController 계층

* Modal, Push, Pop 등 viewController는 자신 위, 혹은 아래에 다른 ViewController를 가질 수 있음
* presenting, presented, parent, child 등의 관계를 가짐
* 계층 구조가 있기 때문에 UIApplication 객체 내에 존재하는 모든 VC를 탐색하는 것이 가능 

## Responder Chain

![](UIKIt_03_UINavigationController_UITabBarController_0.png)

* 계층 구조의 반대로 (가장 상위에 올라와 있는 View 부터 하위로) 진행하면서, 이벤트를 처리할 수 있는지 확인하고 그렇지 않으면 넘기는 방식
* UIApplication으로 최종 event가 빠지는 형태이다. 

## UIKit 제공 Container View Controller

### UISplitViewController

![](UIKIt_03_UINavigationController_UITabBarController_1.png)

* [UISplitViewController](https://developer.apple.com/documentation/uikit/uisplitviewcontroller)

### UIPageViewController

![](UIKIt_03_UINavigationController_UITabBarController_2.png)

* [UIPageViewController](https://developer.apple.com/documentation/uikit/uipageviewcontroller)
* 사용자 제스처 혹은 코드로 한 화면에서 두개 이상의 ViewController 컨텐츠를 동시 표현 가능
* Scroll, Page Curl 애니메이션 지원
* 여러개 ViewController를 Child로 가짐
* Parent-Child 구조를 가짐

# UINavigationController

![](UIKIt_03_UINavigationController_UITabBarController_3.png)

* Stack 기반의 Container View Controller
* push, pop

## NavigationController가 관리하는 Property들

![](UIKIt_03_UINavigationController_UITabBarController_4.png)

* viewControllers
* NavigationBar
  ![](UIKIt_03_UINavigationController_UITabBarController_5.png)
  * left item
    * rootViewController를 제외한 모든 Child ViewController에 Back 버튼 제공됨
      * 기본적으로 이전 ViewController의 제목으로 생성됨
    * Custom하고 싶은 경우 backBarButtonItem으로 설정
  * middle item
    * `navigationItem.title`, `navigationItem.prompt`
    * 기본적으로 해당 ViewController의 title 이 표시됨
    * Custom하고 싶다면 `navigationItem.titleView` 설정
  * right item
    * `navigationItem.rightBarButtonItem`
    * 설정하지 않으면 표시 X
* toolBar
  * Tool bar 는 현재 content 에서 할 수 있는 조작을 보여주는 bar
  * 
* [delegate](https://developer.apple.com/documentation/uikit/uinavigationcontrollerdelegate)
  * NavigatinController의 Life Cycle
  * 회전
  * Transition
  * 특정 VC에서 회전 예외 룰 적용
  * 서브 클래싱 후, `supportedInterfaceOrientations` 오버라이딩하는 방법도 가능
  * [NavigationController avigationControllerSupportedInterfaceOrientations](https://developer.apple.com/documentation/uikit/uinavigationcontrollerdelegate/1621884-navigationcontrollersupportedint)
  * [UIViewController supportedInterfaceOrientations](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621435-supportedinterfaceorientations)
  * 예시
    * Nav -> A -> B -> C
    * A는 potrait, B, C는 landscape도 지원하고 싶음
    * Navigation Controller에서 topViewController 접근 후, 해당 ViewController가 회전 고정을 어떻게 했는지 확인하여 Navigation Controller역시 돌리는 방법을 사용
    * ViewController 회전 방향에 따라 Navigation Controller의 방향도 돌려줘야 한다는 것이 포인트
      ````swift
      // 돌리고 싶지 않은 VIewController
      override var supportedInterfaceOrientations: UIInterfaceOritentationMask {
          return .potrait
      }
      
      override var shouldAutorotate: Bool {
          return true
      }
      ````
      
      ````swift
      // NavigationControllerDelegate 채택 객체
      func navigationControllerSupportedInterfaceOrientations(_ navigationController: UINavigationController) -> UIInterfaceOrientationMask {
          return (navigationController.topViewController?.supportedInterfaceOrientations ?? .all
      }
      ````
      
      * 회전을 하고 싶은 VC에만 값을 override하여 회전을 하도록 만들 수 있음

## Transition시 ViewController 호출 순서

![](UIKIt_03_UINavigationController_UITabBarController_6.png)

A -> B Push의 경우 위와 같은 순서로 동작한다. 

![](UIKIt_03_UINavigationController_UITabBarController_7.png)

pop의 경우 위와 같은 순서로 동작한다.

# Reference

* [UINavigationController](https://developer.apple.com/documentation/uikit/uinavigationcontroller)
* [UINavigationControllerDelegate](https://developer.apple.com/documentation/uikit/uinavigationcontrollerdelegate)
* [UIViewController supportedInterfaceOrientations](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621435-supportedinterfaceorientations)
* [NavigationController avigationControllerSupportedInterfaceOrientations](https://developer.apple.com/documentation/uikit/uinavigationcontrollerdelegate/1621884-navigationcontrollersupportedint)
