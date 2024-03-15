---
title: Target & Scheme
thumbnail: ''
draft: false
tags:
- xcode
- target
- scheme
- ios
- build-configuration
- configuration
created: 2023-10-02
---

# Target

![](XcodeProject_19_Target_Scheme_0.png)

 > 
 > Xcode의 빌드를 통해 생성된 최종 Product

* Framework
* Application
* 등등

일반적으로 하나의 모듈 또는 앱을 의미한다. 보통 프로젝트 생성시 하나만 생성되나, 목적에 따라 하나의 프로젝트에 여러개의 `Target`을 생성할 수 있다. 하나의 프로젝트에서 생성하고 싶은 end product가 여러개가 있을 수 있으니까. 다음과 같은 예가 있겠다.

* 하나의 프로젝트에서 특정 부분만 end product로 빼고 싶은 경우
* Unit Test Target 설정

![](XcodeProject_19_Target_Scheme_1.png)

각각의 Target에서 프로젝트의 Build Setting이 가능하다. 포함될 객체, 리소스, 스크립트 등 역시 따로 설정이 가능하다. 이걸 애플 공식문서에서는 `instuctions`라 한다. 

이것이 가능한 이유는, Target은 Project build setting을 상속받기 때문이다. Project를 눌러도 Build Setting이 있고 Target을 눌러도 있다. 각각의 다른 타겟으로 변경후 빌드가 되는 이유가 이것. 하위 설정으로 갈아치울 수가 있으니까!

Xcode에서는 Target을 통해서 하나의 프로젝트를 여러개의 배포판으로 사용할 수 있도록 해준다. (ex: iPhone용, iPad용, 특정 라이브러리가 포함된 Target)

## 종속성 해결

Target은 Product를 생성하는 것이라는 사실은 이해했다. 그런데, A라는 제품을 만드는데 있어 다른 Target에 의존할 수 있다. 즉, B가 있어야 A가 완성되는 경우를 말한다.

Xcode는 이러한 "암묵적 종속성 (Implicit dependency)"를 알아서 발견하여 순서대로 build한다.

build setting에서 명시적으로 Target 종속성을 지정할 수 있다. 여기서는 Xcode가 어? 이거 종속적이네 하면서 암시적인 종속성을 순서대로 빌드하는 경우에, 아니야! 그렇게 하면안돼! 와 같은 행위도 지정할 수 있다고 한다.

# Scheme

![](XcodeProject_19_Target_Scheme_2.png)

 > 
 > Target이 프로젝트를 Build, Profile, Test 할 때, 발생할 일을 정의하는 곳

일반적으로 Target은 1개 이상의 Scheme을 갖는다. 프로젝트 빌드시 사용되는 환경 변수나 인자를 넘겨주는 역할을 한다. 즉 런타임의 인자를 바꿔넣을 수 있다는 것이다.

## Build Configuration

 > 
 > 하나의 타겟에 대해 다른 configuation을 설정할 수 있는 기능

Scheme은 프로젝트 런타임에서 일어날 일을 설정할 수 있다고 했다. 이런 점에서 대표적으로 사용되는 것이 Build Configuration이다. 기본적으로는 Debug, Release 두개가 생성된다.

![](XcodeProject_19_Target_Scheme_3.png)

이녀석을 실제로 어떻게 적용하는지는 다음글에서 알아보도록 하자!

# Reference

* [Xcode 프로젝트 파일](https://hcn1519.github.io/articles/2018-06/xcodeconfiguration)
* [\[iOS - swift\] 프로젝트 개념 (xcodeproj / project.pbxproj / xcuserdata / .xcworkspace / contents.xcworkspacedata / Target / Scheme](https://ios-development.tistory.com/406?category=889410)
* [Xcode Project](https://developer.apple.com/library/archive/featuredarticles/XcodeConcepts/Concept-Projects.html#//apple_ref/doc/uid/TP40009328-CH5-SW1)
* [Xcode Target, Project, Workspace, Scheme 그리고 Build Setting.](https://zeddios.tistory.com/706)
