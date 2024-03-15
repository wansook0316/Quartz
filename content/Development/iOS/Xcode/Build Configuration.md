---
title: Build Configuration
thumbnail: ''
draft: false
tags:
- xcode
- ios
- build-configuration
- scheme
- Bundle
- bundle-identifier
created: 2023-10-02
---

이전 글에서 Scheme에 대해서 알아보았다. 하지만 실제로 어떻게 사용하는 건지 잘 모른다. 이번 글에서 알아보도록 하자.

# Scheme 알아보기

![](XcodeProject_20_Build_Configuration_0.png)

프로젝트를 하나 만들어주고, Product -> Scheme -> Edit Scheme 들어가자.

![](XcodeProject_20_Build_Configuration_1.png)

왼쪽에 기본 Scheme들이 설정되어 있다. 빌드, 런(앱 실행), 테스트, 프로파일, 분석, 아카이브 등이 있다. 이 중에서 우리가 보통 사용하는 것은 run인데, 들어가보면 build configuration에 debug, release 두개의 configuration이 있다는 것을 확인할 수 있다. 이전 글에서 기본으로 두개가 있다고 설명했었다.

왼쪽을 보니 각각의 Scheme 별로 사용하는 configuration이 다른 것을 알 수 있다. 

* Build: 선택가능
  * 프로젝트를 실행하는 소스 코드들을 컴파일함
* Run: Debug
  * 선택된 Device 또는 Simulator에서 Target을 빌드하고 실행
* Test: Debug
  * 선택한 타겟과 그 Unit Test를 빌드함
* Profile: Release
  * 선택된 Device 또는 Simulator에서 선택한 Instruments 도구(Leaks, Allocations 등)와 함께 Target을 빌드하고 실행
* Analyze: Debug
  * 정적 분석기를 사용하여 선택한 Target을 빌드하고 코드 안에 버그 있는지 알려줌
  * 정적 분석기는 소스코드 실행 없이 소프트웨어를 분석하는 것을 말한다. 즉, 코드 검토와 같은 기능을 한다.
* Archive: Release
  * AppStore에 게시하는데 필요한 정보를 포함하는 디렉토리 `.xcarchive`를 생성함
  * `.xcarchive`는 `.ipa`를 생성하기 위한 시작점으로 활용되는 디렉토리임

# Build Configuration 추가하기

일반적인 상황이라면 두가지 configuration으로 처리가 가능하지만, 실전은 다르다. 사내 테스트용, 무료 버전, 유로 버전, 베타 버전 등 다양한 환경에 따라 Target을 만들 필요가 있다. 만드는 방법을 알아보자.

![](XcodeProject_20_Build_Configuration_2.png)

configuration을 복사한 뒤에,

![](XcodeProject_20_Build_Configuration_3.png)

이름을 바꿔준다. 일단 특정 회사 내 배포가 목적이라 가정하고, `Inhouse`라 이름지었다. 이제 이 Scheme을 변경해야 한다.

![](XcodeProject_20_Build_Configuration_4.png)

Target -> 왼쪽 마우스 클릭 -> Manager Schemes 선택

![](XcodeProject_20_Build_Configuration_5.png)

`+` 버튼 누르고

![](XcodeProject_20_Build_Configuration_6.png)

이름 설정한 후에

![](XcodeProject_20_Build_Configuration_7.png)

짠. 추가되었다. 이제 이 Configuation으로 빌드할 수 있다.

![](XcodeProject_20_Build_Configuration_8.png)

실제로 아까 Configuration을 다시 누르면, 새로운 configuration이 생성됨을 확인할 수 있다. 하지만.. 이상태에서 앱을 빌드하면, 2개의 앱이 생성되기를 바랐지만 (test, test.inhouse) 하나만 생성된다.

이유는 bundle identifier가 같기 때문이다.

# Bundle Identifier 변경하기

![](XcodeProject_20_Build_Configuration_9.png)

내가 빌드하고 싶은 타겟의 Build Setting -> + -> Add User-Defined Setting 을 누르자.

![](XcodeProject_20_Build_Configuration_10.png)

새로운 세팅이 만들어 졌고, 이제 여기다가 custom bundle identifier를 만들어주자.

![](XcodeProject_20_Build_Configuration_11.png)

이름은 reverse domain으로 짓는 것이 권장된다. 이제 info.plist에 가서 이 변수로 세팅을 변경하자.

![](XcodeProject_20_Build_Configuration_12.png)

새 Row를 추가해주고,

![](XcodeProject_20_Build_Configuration_13.png)

변수로 바꾸자.

이제 각각의 Configuration에 Edit Scheme에 들어가서 Run 행동시 어떤 Configuration을 설정할 것인지 세팅하자.

![](XcodeProject_20_Build_Configuration_14.png)

![](XcodeProject_20_Build_Configuration_15.png)

![](XcodeProject_20_Build_Configuration_16.png)

![](XcodeProject_20_Build_Configuration_17.png)

이렇게 하고 빌드하면 새로운 다른 Configuration을 가진 두개의 앱이 나온다! 이름이 같을텐데, Bundle Name을 아까와 같이 적용하면 다른 앱 이름으로 생성되는 것을 확인할 수 있다.

220329 기준 안나옴.. 왜지?

# Reference

* [Xcode Build Configuration 설정하기](https://zeddios.tistory.com/705?category=682196)
* [Analyzing Your Code](https://developer.apple.com/library/archive/documentation/ToolsLanguages/Conceptual/Xcode_Overview/AnalyzingYourCode.html)
* [정적 프로그램 분석](https://ko.wikipedia.org/wiki/%EC%A0%95%EC%A0%81_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8_%EB%B6%84%EC%84%9D)
