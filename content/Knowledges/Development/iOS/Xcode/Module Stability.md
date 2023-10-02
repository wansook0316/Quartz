---
title: Module Stability
thumbnail: ''
draft: false
tags:
- xcode
- ios
- mudule
- stability
- compatibility
- version
- swift
created: 2023-10-02
---

Module Stability는 무엇일까? 공식문서를 통해 알아보자.

# Module

Swift에서 Module은 무엇을 말할까? Swift는 접근 제어의 기준으로 Module을 사용한다. 코드 배포의 단위로써 `import` 키워드를 통해 사용하는 것들이 모두 모듈이다.

Xcode에서 build할 수 있는 타겟 (App Bundle, Framework etc) 들은 모두 Swift에서 Module로 취급한다.

# Module Stability

 > 
 > Compile Time에 서로 다른 버전의 Swift로 작성된 Module(framework)를 섞어 사용할 수 있음

이전에 배운 ABI Stability는 Runtime에 관련된 것들이었다. 즉, 이미 Compile이 완료된 binary file들에 대해 호환이 가능한지에 대한 내용이었다. 이번에는 Compile시에 호환되는 개념에 대해 말하고 있다.

서로 다른 Swift version이 있을 경우, compile시 내 product의 Swift version과 맞지 않다면, 기존에는 다른 library의 코드를 migration한 뒤에 compile이 가능했었다. 하지만 Module Stability를 가지게 되면서 이전 Swift version으로 작성된 module을 이후 Swift version에서 읽을 수 있다.

![](Assets/XcodeProject_07_Module_Stability_0.png)

* Swift 5.0 이하
  * Module의 interface를 정의하는 `.swiftmodule` format(일종의 header~~?~~)이 compiler version에 의존성을 갖는다.
  * 따라서 다른 버전의 swift로 compile된 module을 섞어서 link할 수 없다.
  * Swift version이 올라갈 때마다 모든 framework를 다시 compile 해야 한다.
* Swift 5.1에서 Module Stability 확보됨
  * Xcode > Build Settings > Build Options > **Build Libraries For Distribution**: Yes
  * `.swiftinterface`라는 새로운 format의 메타 데이터를 이용하여 모듈간의 link 수행
    * compiler version에 의존성을 갖지 않음

# Module Stability의 Trade-off

|.swiftmodule|.swiftmoduleinterface|
|:----------:|:-------------------:|
|Compiled Module Format|Swift Module Interface|
|Serialized, binary format|Textual listing of public API|
|Internal compiler data structure<br />
**Changes between compiler version**|**Compatible across compiler versions**|
|"Build Libraries For Distribution" OFF|"Build Libraries For Distribution" ON|

![](Pasted%20image%2020231002133542.png)
Trade Off가 있을 수 밖에 없다. 해당 기능을 Test로 한 경우, 최적화보다는 유연성에 초점이 맞춰지게 된다고 한다.

# Reference

* [Access Control](https://docs.swift.org/swift-book/LanguageGuide/AccessControl.html)
* [ABI stability](https://zeddios.tistory.com/654)
* [Binary Frameworks in Swift](https://developer.apple.com/videos/play/wwdc2019/416/)
