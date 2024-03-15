---
title: Application Structure
thumbnail: ''
draft: false
tags:
- UIKit
- application
- application-structure
- ios
- UIApplication
- UIWindow
- AppDelegate
- swift
created: 2023-10-01
---

이전에 앱의 실행 과정에 대해서 공부했을 때 제대로 이해하지 못했었다. 이번 기회에 제대로 이해하는 자리를 가져보려 한다. 조금 성장했는지 약간 더 이해가 되었다! 그럼 시작하자.

# Application Structure

![](UIKIt_01_ApplicationStructure_0.png)

* Model
  * 개발자가 만든 모델
* Event Loop
  * 하드웨어 단에서 발생한 이벤트를 Delegation(위임) 함
* Application Delegate
  * App 전체 제어를 담당함
* ViewController
  * View 단위 제어 담당
* UIWindow
  * 개발자들이 만든 View들이 붙는 최상위 View

# UIApplication

````swift
// main.swift

import UIKit

// UIApplication을 만듦
UIApplicationMain(CommandLine.argc, CommandLine.unsageArgv, nil, NSStringFromClass(AppDelegate.self))
````

* 앱의 시작
* 전달 받은 AppDelegate의 이름을 이용하여 AppDelegate의 인스턴스를 생성 후 연결
* static metatype을 넘겨주고 있다.
* 내부 함수에서 찾아서 스스로 인스턴스화 함을 알 수 있다.
* [\[Swift\] Metatype 이란? (.Type, .self, .Protocol) (번역)](https://onelife2live.tistory.com/49)
* Swift 같은 경우는 해당 파일을 작성할 필요가 없다.

# AppDelegate

````swift
// AppDelegate.swift

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication,LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        return true
    }
}
````

* `@UIApplicationMain` 선언을 통해 `main.swift`를 생성함
* 따라서 UIApplicationMain 호출이 필요없음
* 해당 parameter로 AppDelegate 클래스의 type을 자동으로 전달
  * 사실 컴파일러가 해주는 것
* App 당 1개의 AppDelegate instance 유지
* 기능
  * App 상태에 따른 동작처리
  * App document와 data object의 생성
* 특징
  * property로 `UIWindow`를 가짐
  * 이 window위에 화면에 보이는 view를 올림
* SceneDelegate
  * iOS 13
  * 같은 program을 여러 화면에서 보여질 수 있도록

## Application 실행 상태

![](UIKIt_01_ApplicationStructure_1.png)

````swift
//애플리케이션이 실행된 직후 사용자의 화면에 보여지기 직전에 호출 
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool	

//애플리케이션이 최초 실행될 때 호출되는 메소드 
func application(_ application: UIApplication, willFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool		
//애플리케이션이 InActive 상태로 전환되기 직전에 호출 
func applicationWillResignActive(_ application: UIApplication)	

//애플리케이션이 백그라운드 상태로 전환된 직후 호출
func applicationDidEnterBackground(_ application: UIApplication)	

//애플리케이션이 Active 상태가 되기 직전, 화면에 보여지기 직전에 호출 
func applicationWillEnterForeground(_ application: UIApplication)	

//애플리케이션이 Active 상태로 전환된 직후 호출
func applicationDidBecomeActive(_ application: UIApplication)

//애플리케이션이 종료되기 직전에 호출 
func applicationWillTerminate(_ application: UIApplication)	
````

# Application Structure 생성 순서

````swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    let window = UIWindow.init(frame: UIScreen.main.bounds) // 2.1

    window.makeKeyAndVisible() // 2.2
    self.window = window // 2.3

    let viewController = ViewController.init() // 3
    self.window?.rootViewController = viewController // 4, 5

    return true
}
````

1. UIApplicationMain이 실행
1. Application Delegate 생성
   1. 디바이스 화면 크기만큼의 window 생성
   1. key window, visible 설정
   1. window를 appDelegate에 세팅
1. AppDelegate에서 Window를 property로 생성
1. RootViewController 생성
1. ViewController의 View를 Window에 붙임

# Reference

* [Apple Documents](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/Introduction.html#//apple_ref/doc/uid/TP40008195-CH68-DontLinkElementID_2)
* [About App Development with UIKit](https://developer.apple.com/documentation/uikit/about_app_development_with_uikit)
* [Managing your app cycle](https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle)
