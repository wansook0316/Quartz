---
title: Library
thumbnail: ''
draft: false
tags:
- library
- framework
- ios
- xcode
- static-library
- dynamic-library
created: 2023-10-02
---

앞으로 진행할 긇에서는, Library와 Framework에 대해서 알아볼 것이다. 첫번째 순서로는 Library이다.

# Library & [Framework](Framework.md)

![](153550345-42e65709-f4fc-4e92-95ff-a12145b251e6%20(1).png)

일단 간단하게 Library와 [Framework](Framework.md)에 대한 차이를 알아보고 가자.

* Library: Linkable binary
  * 다른 프로그램과 link하여 사용할 목적으로 미리 만들어둔 클래스, 함수의 집합
  * 보통 소스코드로 컴파일된 목적 파일의 묶음
  * **실행 가능한 코드만 가지고 있다.**
  * 새 프로젝트를 실행할 때, 22.04기준 `Library`를 클릭하면 만들 수 있다.
* [Framework](Framework.md): Library + Resource
  * 계층화된 디렉토리 구조안에, 다음과 같은 것이 package로 담겨있는 것을 말한다.
    * library
    * nib file
    * image file
    * localized string
    * header files
    * reference documentation
  * 자체가 bundle이다. NSBundle class로 컨텐츠에 접근이 가능, Swift에서는 Bundle class로 접근할 수 있음
  * 정적 또는 동적 공유 라이브러리와 같은 목적으로 제공된다. 
    * 즉, 앱에서 특정 작업을 수행하기 위해 호출할 수 있는 루틴을 제공한다.
  * 곧, 프레임 워크는 라이브러리와 같은 용도로 사용되는데, 여러 리소스 파일을 함께 담고 있고, 그 리소스 접근하기 위해 Bundle 클래스를 사용할 수 있다.
  * 새 프로젝트를 실행할 때, 22.04기준 `Framework`를 클릭하면 만들 수 있다.

여기서 알 수 있는 점은, 개념적으로 [Framework](Framework.md)가 library를 포함한다는 사실이다. 

# Static Library

Static library는 아카이빙된 object file(`.o` 확장자)의 모음으로 `.a` 확장자 형태를 가진다. Static library는 **Static archive library, static linked shared library**라고도 불린다.

macOS/iOS 소스 코드를 컴파일하면 object files를 생성한다. object file은 Mach-O 형식의 binary 데이터로 다음과 같은 정보를 포함한다. Mach-O는 실행 파일 포맷의 일종이다. 해당 내용은 다음 글로 알아보도록 하겠다. 지금은 파일의 구성만 간단하게 알아보자.

1. Header: 해당 파일이 동작하는 CPU Architecture 정보를 명시한다.
1. Load Commands: 파일의 논리적 흐름에 대한 정보를 명시
1. Raw Segment Data: Raw code와 Data

![](Screen%20Shot%202022-04-04%20at%2010.16.32%20AM.png)

우리가 실제로 앱을 빌드한 후, 앱 번들 경로로 찾아가서 "패키기 정보 보기"를 통해 열어보면 프로젝트 이름과 같은 실행파일이 있다.

![](Screen%20Shot%202022-04-04%20at%2010.19.33%20AM.png)

파일 속성을 쳐보면, Mach-O 파일이라는 것을 확인할 수 있다.

## 동작 과정

![](153551905-84dc6a01-d9b2-4ec0-9113-7d9900a3b7b2.png)
위의 그림에서 사용하는 용어를 바탕으로 설명해보았다.

* 앱을 빌드하게 되면..
  * source file이 컴파일되어 Static linker로 들어감
  * 이 때 app의 executable file로 **복사**된다.
* 앱을 실행하게 되면..
  * library가 executable file에 복사되었기 때문에 런타임에 메모리에 **항상** 로드된다.

## 장단점

|장점|단점|
|------|------|
|- 앱의 주소 공간에 항상 로드되어 있기 때문에 라이브러리 코드 실행속도가 매우 빠름|- 앱의 executble file에 항상 포함되어야 함 <br> - 초기 런칭 속도 저하 <br> - 앱의 초기 메모리 사용량 증가 <br> - library의 버전 업데이트시 앱의 object files를 새로운 버전의 library로 변경해야 함. 즉, 새로 빌드되어야 업데이트된 라이브러리 사용가능|

# Dynamic Library

static library가 compile time에 executable file에 포함된다는 점은 앱이 커질 수록 더 큰 문제로 작용했다. 복잡도가 늘어나 추가적인 작업이 많이 요구되었기 때문이다. 이를 해결하기 위해 나온 것이 Dynamic library이다. 핵심은 executable files에 포함되지 않는다는 점이다. 즉, Dynamic library는 compile과 독립적으로 동작하며, 그렇기 때문에 compile 없이 dynamic library의 코드는 변경될 수 있다. 이런 속성 떄문에 **dynamic shared libraries, shared objects, dynamically linked libraries**라 불린다. (`dll`, `sodll`)

## 동작 과정

![](address_space2_2x%20(1).png)

* 앱을 빌드하게 되면..
  * source file이 compile된다.
  * 컴파일된 파일에서 필요로하는 library를 link한다.
  * 이 링크과정에서 executable file이 필요로 하는 라이브러리의 주소를 Dynamic linker가 제공한다.
* 앱을 실행하게 되면..
  * 필요한 시점에 주소를 기반으로 원하는 라이브러리를 로드한다.

## 장단점

|장점|단점|
|------|------|
|- 앱의 compile과 별개로 동작하기 때문에 compile없이 library의 변화된 코드 반영가능 <br> - 불필요하다면 memory에 로드되지 않음 <br> -  엡 초기 실행 속도 개선 - 앱 메모리 사용량 감소|- 런타임 앱 실행 속도 감소  <br> - Library 사용할 수 없거나, 사용은 가능하나 버전 호환되지 않는 경우 앱이 죽을 수 있다.|

# Xcode에서 찾아보기

## Link Binary with libraries

 > 
 > Xcode > Build Phase > Link Binary With Libraries

![](Pasted%20image%2020231002133428.png)
link 해야할 모든 libraries, Frameworks(다음글)를 적는다.

## Embed Frameworks

 > 
 > Xcode > Build Phase > Embed Frameworks

![](Pasted%20image%2020231002133449.png)

App Bundle에 묶여서 Copy 되어야 할 Frameworks를 적는다.

빌드가 완료된다면 products 폴더에 생기는데, 해당 번들의 package 폴더를 열어보면, frameworks 폴더가 있고, 이 안에 dynamic framework로 구성해둔 타겟의 실행파일이 위치해 있다. pod으로 설정한 것들은 pod project에 위치해있다.

# 정리

||Static|Dynamic (shared)|
|--|------|----------------|
|사용 가능 타이밍|Build time 이후 곧바로 가능 <br> (application에 모두 반영됨)|Run tim에 메모리 올린 후 가능 <br>(App Launch Time)|
|binary 확장자|`.a`|`.dylib` (Framework인 경우 특별한 확장자 없음)|
|target file 크기|target size 증가 <br> 사용하는 실행파일 각각에 컴파일되어 추가됨|target size 변동 없음|
|공유 가능 여부|불가능|여러 프로세스에서 사용 가능 <br> (여러 애플리케이션에서 사용은 불가능, sandbox내에 들어가 있어 보안적으로 막혀있음, 대신 app extension에서 사용가능)|
|iOS 앱 크기|최소 (다 커질 수도 있음) 라이브러리 크기 만큼 증가|라이브러리 크기 만큼만 증가 <br> 앱 패키지에 embed 되어 사용되므로)|

![](Pasted%20image%2020231002133505.png)

처음 프로젝트를 만들었을 때 보이는 New target 설정의 Framework는 dynamic 라이브러리를 이야기 한다. iOS 8.0부터 사용이 가능했다. static library는 여전히 일반적으로 말하는 static library이라 말한다.

# Reference

* [What are Frameworks?](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html#//apple_ref/doc/uid/20002303-BBCEIJFI)
* [Deep dive into Swift frameworks](https://theswiftdev.com/deep-dive-into-swift-frameworks/)
* [Overview of the Mach-O Executable Format](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/CodeFootprint/Articles/MachOOverview.html)
* [Dynamic Library](https://hcn1519.github.io/articles/2019-09/dynamic_library)
