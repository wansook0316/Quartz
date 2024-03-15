---
title: Bitcode
thumbnail: ''
draft: false
tags:
- app-thinning
- bitcode
- LLVM
- xcode
- deployment
- ios
created: 2023-10-02
---

앱 배포를 하다보면 bitcode enabled라는 flag가 있다. 이녀석을 체크하냐 마냐에 따라서 빌드 속도가 상당히 차이나는 것을 보았는데 도대체 왜 그런 건지 이해해보려 한다.

# bitcode

다음은 [Distrubution Options](https://help.apple.com/xcode/mac/11.0/index.html?localePath=en.lproj#/devde46df08a)에서 찾은 설명이다.

 > 
 > Bitcode is an intermediate representation of a compiled program. Apps you upload to App Store Connect that contain bitcode will be compiled and linked on the App Store. Including bitcode will allow Apple to re-optimize your app binary in the future without the need to submit a new version of your app to the App Store.

* 컴파일된 프로그램의 중간 표현
* 앱스토어 커넥트에 업로드 시 비트코드가 포함된 경우 앱스토어에서 컴파일 및 링크됨
* 비트코드를 제출하면, 새버전 앱을 제출할 필요없이 앱 바이너리를 다시 최적화 할 수 있음

 > 
 > For iOS apps, bitcode is the default, but optional. For watchOS and tvOS apps, bitcode is required. If you provide bitcode, all apps and frameworks in the app bundle (all targets in the project) need to include bitcode.

* iOS앱의 경우 bitcode가 기본이나 옵셔널임
* watchOS 및 tvOS 경우 필수
* 만약 비트코드를 제공한다면, 앱 번들 하위의 모든 Target이 비트 코드를 포함해야 함

정리해보면,

* 중간 단계의 코드
* 다른 아키텍쳐에 대한 최적화를 진행하여 앱 크기를 줄임
  * App Slicing과 함께 사용됨
* BitCode Option을 켜면, Intermediate Represention으로 올려 AppStore에서 컴파일 및 링크해줌
* 끄게되면 최종 컴파일 결과를 올림

# LLVM

![](XcodeProject_11_Bitcode_0.png)

요약한 결과는 위와 같지만, 보다 심오한 내용이 숨어있다. LLVM은 Low Level Virtual Machine의 약자로, Intermediate 또는 Machine 언어로 코드를 컴파일 해주는 라이브러리이다.

기본적으로 두 부분으로 나뉘는데, 고수준 언어를 중간 표현 코드로 변경하는 프론트 엔드와 그 중간 표현 코드를 기계 언어로 변환하는 백엔드로 구성되어 있다.

이 구조의 장점은, 중간 코드로 바꾸는 과정이 있기 때문에 디바이스에 사용되는 **CPU를 손쉽게 변경**할 수 있다는 점이다.

2013년, iphone5에서 애플은 64bit 칩셋으로 바꾸고 있다고 발표했었다고 한다. (하위 quora link 참고) 이전에는 개발자들이 코드 수정하고, 앱 컴파일하고, 그 결과를 제출했었다. 그런데 어느 시점부터 bitcode를 올리라는 지침이 있었고, 한 용자가 그걸 예측했다. 즉, 다양한 디바이스에서 사용하는 cpu에 구애받지 않고 한번에 적용할 수 있도록 중간 표현 코드를 올리고, AppStore에서 이를 처리하여 여러 디바이스에 적용하겠다는 큰 그림을 그렸던 것!

이전에는 앱이 실행될 수 있는 모든 환경들 (armv7, arm64, 등등)에 대해 binary를 생성하고 하나로 합친 뒤 보냈다고 한다. (app slicing에서 fat binary 들어봤죵?) 이제는 이 bitcode를 보내고, 이를 기반으로 app slicing하여 app thinning이 가능하게 된 것이다.

![](XcodeProject_11_Bitcode_1.png)

해당 옵션 설정은! 위의 경로에서 할 수 있다.

# Reference

* [Doing Basic Optimization to Reduce Your App’s Size](https://developer.apple.com/documentation/xcode/doing-basic-optimization-to-reduce-your-app-s-size)
* [Doing Advanced Optimization to Further Reduce Your App’s Size](https://developer.apple.com/documentation/xcode/doing-advanced-optimization-to-further-reduce-your-app-s-size)
* [Distribution options](https://help.apple.com/xcode/mac/11.0/index.html?localePath=en.lproj#/devde46df08a)
* [What is bitcode on Apple platforms?](https://www.quora.com/What-is-bitcode-on-Apple-platforms)
* [LLVM](https://namu.wiki/w/LLVM)
* [Bitcode 도입하기](https://hcn1519.github.io/articles/2020-05/bitcode_implementation)
