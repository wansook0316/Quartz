---
title: Framework
thumbnail: ''
draft: false
tags:
- ios
- xcode
- framework
- Bundle
- modulemap
created: 2023-10-02
---

Library에 대해서는 알아보았다. 그럼 Framework는 무엇일까?

# Framework

 > 
 > Shared Resources(`dynamic shared library`, nib, image)를 Package 형태로 담고 있는 디렉토리

대표적인 Framework로는 `UIKit`, `Foundation` 등이 있다. `import`를 통해서 Framework에서 제공하는 기능들을 바로 사용할 수 있다. 여기까지만 읽으면 library와 비슷한 역할을 한다고 생각할 수 있다. 실제로 Framework는 library + resources라 생각해도 무방하다. 하지만 Resource도 포함하고 있기 때문에 모듈 배포에 있어서 더 많이 활용이 가능하다. library와의 차이점은 다음과 같다.

* 효율적 리소스 관리
* 소스코드와 더불어 리소스 역시 패키징하여 제공
* 여러 버전을 동일한 Bundle에 포함하여 하위 호환성 지원
* 물리적으로 메모리의 한 군데에서만 read-only 형태로 실행되기 때문에 메모리 사용량을 줄일 수 있음

## [Bundle](Bundle.md)의 한 종류

이전에 Bundle에 대해서 공부했을 때, 개발자를 위한 Package라 했었다. 마찬가지로 Framework도 이 분류에 속한다. 소스코드 레벨에서는 `NSBundle`, `Bundle` 클래스로 접근할 수 있다. 다만 이제는 실행하는 프로젝트 내부 Bundle에 접근해서 Resource를 가져오는 것이 아니라, Framework 내부의 Resource를 사용하고 싶다는 Custom Bundle을 사용하여 접근해야 한다. (main Bundle이 아니란 얘기)

````swift
let bundle = Bundle(identifier: "com.wansook.CustomFramework") // Framework의 Bundle Identifier
let image = UIImage(named: "default_egg", in: bundle, compatibleWith: nil)
````

## Not Opaque Data Type

이전글에서 Bundle은 Opaque Data Type이라 했었다. 즉 directory이지만 Finder에서 실행 파일처럼 취급됨을 의미한다.(Package의 의미) [해당 글]()에서 `.app`의 경우 finder에서 실행파일로 인식되어 클릭하면 앱이 실행되나, "패키지 내용 보기"를 통해 접근하여 내부 파일을 볼 수 있다고 했다. 이렇게 finder에서 디렉토리지만 단일 파일처럼 인식하는 것을 Opaque Data Type이라 하는데, framework의 경우 일반 디렉토리로 취급되어 Opaque Data Type이 아니다. 

# Framework의 구조

![](XcodeProject_04_Framework_0.png)

## Binary file

Framework 프로젝트와 이름이 같은 바이너리 파일을 말한다. Library의 특성을 가지고 있기 때문에, Static 혹은 Dynamic library를 정할 수 있다.

![](XcodeProject_04_Framework_1.png)

* Build Setting -> Mach-O Type에서 설정할 수 있다.

## Header

Header 폴더 안에 생성되는 파일은, 해당 Framework에 어떤 file이 있느냐에 따라 다른 파일이 포함된다. 만약 Objective C 파일이 있었다면 `testFramework.h` 하나만 생성된다. 하지만 swift 파일도 있었다면, `testFramework-Swift.h` 역시 생성된다.

해당 Framework에 작성된 객체를 외부에서 접근하기 위해서는 접근 제어자가 필요하다. Swift의 경우 접근 제어 규칙에 따라 외부 Framework에서 사용가능 여부가 정해진다. Objective-C의 경우 관련 header를 public으로 전환해주어야 사용이 가능하다.

## modulemap

swift는 code를 module로 정리한다. 각 module은 namespace를 지정하고, 해당 코드의 어떤 부분을 module 외부에서 사용할 수 있는지에 대해 접근 제어를 지정한다. (위의 header 설명) `import` 키워드를 통해 우리가 사용하고 있던 것들이다.

module 이전에 framework를 사용하기 위해서는 header를 코드로 직접 가져와야 했다. Xcode내에서 framework의 binary를 수동으로 연결하는 작업 역시 요구되었다. `#import` 매크로는 말 그대로 모든 해결된 종속성 구조를 코드에 복사한 후 컴파일러가 그 큰 소스 파일에 작업을 했다. 하지만 다음과 같은 문제점이 발생했다.

* Macro 정의에 문제가 생길 수 있다.
* 타 Framework를 쉽게 망가트릴 수 있었다. (Macro 이름 중첩..)

이런 문제의 해결책으로 나온 것이 modulemap이다. module과 header의 연결고리 역할을 하는 파일로, module에 포함되는 header가 무엇인지 정의하고, 어떤 implementation(`.a`(static), `.dylib`(dynamic))이 module에 포함되는지 알려주는 파일이다. 아래와 같이 생겼다.

![](XcodeProject_04_Framework_2.png)

# Reference

* [What are Frameworks?](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html#//apple_ref/doc/uid/20002303-BBCEIJFI)
* [Deep dive into Swift frameworks](https://theswiftdev.com/deep-dive-into-swift-frameworks/)
* [Overview of the Mach-O Executable Format](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/CodeFootprint/Articles/MachOOverview.html)
* [Module maps](https://clang.llvm.org/docs/Modules.html#module-maps)
