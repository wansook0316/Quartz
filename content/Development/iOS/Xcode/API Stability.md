---
title: API Stability
thumbnail: ''
draft: false
tags:
- xcode
- ios
- API
- stability
- compatibility
- ABI
- dump
- DerivedData
created: 2023-10-02
---

앞으로 그림에서 나오는 Swift version은 가상이다. 이해를 위해서 가상으로 적었다.

# 사전 지식

## `otool`

 > 
 > Object를 dump해서 내용들을 살펴볼 수 있는 utility

그 중 `otool -L`은 바이너리의 공유 라이브러리 디펜던시를 확인할 수 있는 명령어이다. 즉, 이 명령어는 바이너리 파일이 의존하고 있는 외부 공유 라이브러리의 path를 나열해준다. 내가 만든 testFramework 실행파일에 해당 명령어를 사용해보자. (이건 Swift 2.0 버전이다. 이렇게 하는 이유가 있다. 뒤에 나온다.)

````
$ otool -arch arm64 -L testFramework
testFramework:
    /System/Library/Frameworks/Foundation.framework/Foundation (compatibility version 300.0.0, current version 1673.126.0)
    /usr/lib/libobjc.A.dylib (compatibility version 1.0.0, current version 228.0.0)
    /usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1281.0.0)
    /System/Library/Frameworks/UIKit.framework/UIKit (compatibility version 1.0.0, current version 61000.0.0)
    @rpath/libswiftCore.dylib (compatibility version 1.0.0, current version 1100.2.255)
    @rpath/libswiftFoundation.dylib (compatibility version 1.0.0, current version 0.0.0)
    @rpath/libswiftObjectiveC.dylib (compatibility version 1.0.0, current version 0.0.0)
````

시스템 라이브러리인 `Foundation`과 `UIKit`이 보인다. `@rpath`라고 달려있지 않은 경로는 system library이다.

`@rpath`는 실행되는 binary의 위치를 기준으로(즉 상대 경로로) dynamic library나 framework의 위치를 지정할 수 있다. Run-Path라고 불린다. 보통 설치되는 App Bundle에 dynamic library가 포함되는 경우에 사용한다. Xcode Project file에서는 다음의 경로에서 확인할 수 있다. 

![](https://user-images.githubusercontent.com/37871541/153783021-6d36a2ac-6aaf-4e70-8910-fba005c60b85.png)

* Xcode > Build Settings > Linking > RunPath Search Paths

그런데 이상한 게 있다. dynamic library나 framework는 외부에서 만들어서 사용하는 것 아닌가? 지금은 외부 프레임워크가 아예 없음에도 불구하고 `@rpath`가 있다. 아무래도 시스템에 관련된 녀석 즉, Swift, Foundation, ObjectiveC에 관련된 녀석인 것 같은데 왜 Bundle 내부에 추가되어 있을까?

여기서 의문점이 들었다면 잘 찾아왔다.

## App Package Inside

일단 다양한 아키텍쳐에 대응되는 실행파일을 만들어보자. Xcode에서 프로젝트를 Any iOS Device target으로 빌드한다. 빌드한 Product를 보려면 `DerivedData`(파생 데이터)에 접근하면 된다. 이전에는 project navigator에 products라는 group이 있었는데, 없어진 듯 하다.

* 경로: `~/Library/Developer/Xcode/DerivedData`

Xcode에서 해당 경로를 바로 찾아가고 싶다면 다음과 같은 두가지 방법으로 확인할 수 있다.

![](XcodeProject_06_ABI_Stability_1.png)

* Xcode > Preference > Locations > Derived Data

![](XcodeProject_06_ABI_Stability_2.png)

* Xcode > File > Project Settings > Derived Data

해당 경로 안에는 내가 빌드한 프로젝트들이 모여 있다. `프로젝트 이름 + 해시값`의 형태의 폴더들이 보일거다. 

![](XcodeProject_06_ABI_Stability_3.png)

App을 빌드한 경우에는 `Package` 형태로 묶여있어 오른쪽 클릭 후 "패키지 내용 보기"를 통해 접근해야 한다. 

![](XcodeProject_06_ABI_Stability_4.png)

만약 Framework라면 Opaque directory가 아니기 때문에 폴더 형태인 것을 확인할 수 있다. 이 설명이 어렵다면 [Package](Package.md), [Bundle](Bundle.md)을 읽고 오면 좋다.

# ABI

일단 단어부터 무슨소리인지 모르겠다. 일단 ABI라는 것이 무엇일까?

 > 
 > Application Binary Interface

흔히 아는 API(Application Programming Interface)와 비슷하다. API의 경우 특정 함수나 property를 공개하고, 타 프로그램 혹은 프로그래머가 사용할 수 있는 cheat sheet?의 개념이다. 말 그래도 interface인 것.

ABI 역시 interface이나, 영역이 binary인 것이 다르다. 우리가 코드를 작성하고, 컴파일하면 최종 결과물로 binary code가 나온다. 결국 이 친구들과 상호 소통하며 우리가 만든 코드를 컴퓨터가 이해하여 product가 동작하는 것. 그럼 이 환경에서 역시 **서로 어떻게 소통할지에 대한 규약**이 필요하다. 그것이 ABI이다.

![](XcodeProject_06_ABI_Stability_5.png)

런타임에 Swift 프로그램의 binary는 다른 library와 ABI를 통해 소통한다. API를 정의할 때는 보통 함수의 이름, 타입, 인자, 반환 타입등을 정의한다. ABI의 경우에는 함수를 어떻게 호출할지, 메모리에 데이터를 어떻게 표현할지, 메타데이터를 어디에 놓고 어떻게 접근할지 등을 정의한다.

* CPU instructions (registers, stack organization, memory access type) CPU명령어
* calling convention(함수 호출, argument전달, 값 리턴)
* OS에 대한 시스템 호출 
* Data Layout
* Type Metadata
* Mangling
* Runtime
* Standard Library

이해를 위해서! Dynamic library를 로드하여 사용할 때 필요한 것이라 생각하자. Dynamic library의 경우 이미 컴파일된 실행파일 자체를 가지고 와서 메모리에 올려 사용하는 것이기 때문에, Binary 영역에서의 interface가 필수적이다.

# ABI Stability (Binary Compatibility)

ABI Stability는 Swift 5.0에서 확보된 기능이다. 이게 도대체 왜 필요할까? 쉽게 API를 기준으로 생각해보자. 서버에서 사용자가 담아둔 상품 리스트를 조회하는 API version 1.0을 배포해서 우리가 사용하고 있었다고 하자. 그런데 version 2로 업데이트가 되면서, 기존에 사용하고 있던 interface의 이름이 바뀌었다! 혹은 상품 리스트를 조회하는데, 안전모드(?)에서 접근하는지를 판단하는 인수가 추가되었다고 하자. 그럼 client쪽은 (해당 API를 사용하는 쪽) 아예 사용이 불가하게 된다. 

![](XcodeProject_06_ABI_Stability_6.png)

이와 마찬가지의 상황이다! Swift 버전이 변경되면, 해당 언어를 해석할 수 있는 Compiler의 변경이 일어나고, 그렇게 되면 ABI역시 변경된다. Swift 2.0으로 만들어낸 binary file를 Swift 3.0에서 사용할 수가 없다. 이를 가능하게 하기 위해서는 Package에 **Swift runtime library**를 추가하여 하위 버전의 OS와 호환을 확보해야 했었다. 그래서 이전 Swift 2.0 버전의 App을 보면(ipa를 열면) `.dylib`를  포함하고 있었다고 한다. (Swift dynamic library) 즉, 다른 버전의 binary 호환성을 위해 App Bundle에 이를 추가해서 배포했던 것.

그렇다면 ABI Stability를 지원한다는 것은 어떤 말일까?

![](XcodeProject_06_ABI_Stability_7.png)

 > 
 > Swift Dynamic library(Swift Runtime library)가 OS의 일부가 된다.

이렇게 되면 Swift version에 상관없이 해당 binary를 해석하는 ABI는 OS가 들고 있어서 **App Package**에 추가하지 않아도 된다! 그래서 **deployment target 13.0** 이상 설정 시, Swift Runtime Library의 위치가 `@rpath`에서 system path로 변경된다.

````
$ otool -arch arm64 -L testFramework
testFramework:
    /System/Library/Frameworks/Foundation.framework/Foundation (compatibility version 300.0.0, current version 1673.126.0)
    /usr/lib/libobjc.A.dylib (compatibility version 1.0.0, current version 228.0.0)
    /usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1281.0.0)
    /System/Library/Frameworks/UIKit.framework/UIKit (compatibility version 1.0.0, current version 61000.0.0)
    /usr/lib/swift/libswiftCore.dylib (compatibility version 1.0.0, current version 1100.2.255)
    /usr/lib/swift/libswiftFoundation.dylib (compatibility version 1.0.0, current version 0.0.0)
    /usr/lib/swift/libswiftObjectiveC.dylib (compatibility version 1.0.0, current version 0.0.0)
````

아래의 3개 항목이 OS 경로로 변경되었다. 이제 의문점이 해소되었다!

## 장점

일단 애플의 입장에서 플랫폼 안정화를 가진다는 점에서 좋을 것이다. 흠 개발 관점에서만 보자면,

* App과 Library간의 Binary Compatibility를 가진다.
  * 특정 버전의 Swift Compiler로 구축된 Product를 버전에 상관없이 적용할 수 있다.
* 번들 크기 감소
  * 이전에는 Swift Runtime Library를 추가해줬어야 했는데 빼도 된다. (근데 한 5mb 한대..)
* Migration 비용 감소
  * 개발자에게 호재요 호재

# Reference

* [ABI Stability and More](https://www.swift.org/blog/abi-stability-and-more/)
* [The System Library: libSystem](https://www.oreilly.com/library/view/mac-os-x/0596003560/ch05s02.html)
* [What is ABI Stability in Swift 5?](https://medium.com/swiftcommmunity/what-is-abi-stability-in-swift-5-187556e3c3ae)
* [Optimizing App Startup Time (WWDC16)](https://developer.apple.com/videos/play/wwdc2016/406/)
* [stackoverflow - Submit to App Store issues: Unsupported Architecture x86](https://stackoverflow.com/questions/30547283/submit-to-app-store-issues-unsupported-architecture-x86)
* [hmac - duplicate symbol 이슈](https://oss.navercorp.com/api-gateway/api-gateway-hmac/issues/29)
* [Run-Path Dependent Libraries - Dynamic Library Programming Topics](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/DynamicLibraries/100-Articles/RunpathDependentLibraries.html)
* [ABI Stability and More](https://www.swift.org/blog/abi-stability-and-more/)
* [Binary Frameworks in Swift](https://developer.apple.com/videos/play/wwdc2019/416/)
* [Compatibility](https://developer.apple.com/swift/blog/?id=2)
* [Binary Frameworks in Swift - WWDC 2019](https://developer.apple.com/videos/play/wwdc2019/416/)
