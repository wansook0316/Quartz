---
title: XCFramework
thumbnail: ''
draft: false
tags:
- xcode
- XCFramework
- framework
created: 2023-10-02
---

Framework와 library에 대해서는 모두 알았다. 그럼 XCFramework는 무엇일까?

# XCFramework

 > 
 > framework의 다양한 변형들을 Bundle하는 새로운 방법, Framework를 한번더 Bundling 한다.

Xcode 11과 함께 2019년에 출시된 기능이다. 기존에 Framework를 사용하여 AppStore에 올리는 경우, simulator architecture까지 같이 담고 있어서 에러가 났었다. strip 작업을 통해 원하지 않는 아키텍쳐를 strip하여 다시 올려야 한다. (`lipo` command를 사용한다.) 이 이유는 Universal Framework가 simulator architecture까지 담고 있기 때문이다. 잘 모른다면 [해당 글](https://velog.io/@wansook0316/Binary-Files)을 읽고 오자. 이 상황에서 XCFramework를 사용한다면 이러한 문제를 원천 봉쇄할 수 있다.
![](Pasted%20image%2020231002133625.png)

먼저, 하나의 XCFramework안에 simulator target과 device target을 담을 수 있다.

![](Pasted%20image%2020231002133635.png)

심지어 iOS, maciOS, tvOS, watchOS의 프레임워크도 하나로 묶을 수 있다.

![](Pasted%20image%2020231002133645.png)

또한 Mac App을 위한 Framework인 AppKit과 iOS를 위한 UIKit도 한번에 묶어서 관리할 수 있다. Client가 어떤 API를 원하든 이 하나의 XCFramework안에서 사용이 가능하다.

![](XcodeProject_08_XCFramework_3.png)

또한 기존에는 Framework만 Bundle up 할 수 있었지만(왼쪽), 이제는 Static Library도 header와 함께 묶어 Bundling할 수 있다.

![](XcodeProject_08_XCFramework_4.png)

그리고 당연히, XCFramwork는 Swift, C-Based code에 대해 Binary Distribution을 지원한다.

## 정리

* Muliple Architectures and Platforms를 위해 나온 개념
* AppKit과 UIKit, Simulator용을 한번에 지원 가능
  * 여러 프레임워크를 다시한번 감싸는 형태
* 더이상 simulator architecture strip 과정 필요 없음
* Static library도 header와 함께 묶을 수 있음
  * 이 경우 Xcode가 Project의 Header search path를 자동으로 update 해줌

# Archiving Framework

![](XcodeProject_08_XCFramework_5.png)

XCFramework를 만들기 위해서는 일단 binary로 나온 파일이 필요하다. 그렇게 하기 위해서 먼저, Project의 Build Option에서 `Build Libraries for Distribution` 옵션을 켜주자. 내가 작업하는 녀석이 library로 배포될 것인지 항상 켜주어야 한다. 잊지 말자.

![](XcodeProject_08_XCFramework_6.png)

`xcodebuild archive` command를 통해 아카이빙할 수 있다.
프로젝트 내에 원하는 Scheme을 선택하고, Compile하고 싶은 destination을 설정한다. 예를 들어, iOS 디바이스와 simulator, mac에 대응되는 빌드 product를 원한다면, 해당 부근에 argument를 전달하면 된다. 추가적으로 `Skip Install` 빌드 세팅을 No로 설정해야 한다. 이렇게 해야 결과 Archive에 Framework를 설치한다.

![](XcodeProject_08_XCFramework_7.png)

이 작업을 통해 여러 변형된 Archive를 뽑아내었다. 즉, 다양한 architecture, device에서 모두 사용할 수 있는 binary를 뽑아내었다.

# Building an XCFramework

![](XcodeProject_08_XCFramework_8.png)

이제 각각 다른 binary framework가 있으니, 이를 XCFramework로 묶어보자. 

![](XcodeProject_08_XCFramework_9.png)

`xcodebuild -create-cxframework` command로 생성이 가능하다. framework에는 archive된 파일들의 경로를 적어주면 되고, output은 최종적으로 bundling된 XCFramework의 경로를 적어주면 된다.

정리하면,

1. Build Library for Distribution: YES
1. `xcodebuild archive`
1. `xcodebuild -xreate-xcframework`

# Deep inside

![](Pasted%20image%2020231002133712.png)

실제로 만들어진 XCFramework를 열어보면, 각각의 architecture에 따른 framework를 nesting한 형태로 담고 있다. 

# 정리

지금까지 약 8개 정도의 글에서 binary, framework, bundle 등에 대해서 알아보았다. 간단하게 정리하고 마무리 하도록 하겠다.

* Library vs Framework
  * Libary: Linkable binary
  * **Framework**: Library with directory for **resources and headers**
* Static vs Dynamic
  * Static: build-time linkable binary 
    * link후 output binary에 포함되어 하나의 실행파일이 됨.
  * Dynamic: run-time linkable binary 
    * output binary에 포함되지 않으며, 여러 다른 binary에서 공유해서 사용가능
    * 앱에서는 Dynamic Framework인 경우 App Package에 **embed**하여 사용 (`@rpath`)
* Universal(fat) binary
  * Multi-Architecture Binary format
  * App store에 upload하는 binary에는 simulator용 architecture가 포함되지 않아야 함 (`strip` 필요)
* Swift Compatibility
  * ABI Stability: Swift 5.0이상 (+ deployment target 13.0이상)
  * Module Stability: Swift 5.1이상 (+ Build Libraries For Distribution = Yes) 
* Useful shell commands
  * `man`(manual)   : format and display the on-line manual pages
  * `file`  : determine file type
  * `lipo`  : create or operate on universal files 
  * `otool` : command line parser for llvm-objdump
* Framework 생성 목적
  * 타 프로젝트에서 사용할 수 있도록 **배포** (3rd-party library)
  * 앱 익스텐션에서 공통으로 사용할 코드 및 리소스 
  * 빌드 속도 개선 (앱 런칭 속도와 trade-off 관계임)
  * 마이크로 피쳐 아키텍쳐 적용 시 생성 필요

# Reference

* [XCFramework internal](https://appspector.com/blog/xcframeworks)
* [Binary Frameworks in Swift](https://developer.apple.com/videos/play/wwdc2019/416/)
