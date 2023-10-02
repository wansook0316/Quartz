---
title: Architecture Configuration
thumbnail: ''
draft: false
tags:
- xcode
- ios
- CPU
- architecture
created: 2023-10-02
---

iOS 내부 디바이스에 다양한 CPU 제품이 들어감에 따라 이를 대응할 수 있도록 Project setting을 해야한다. 내부 디바이스들이 어떤 특징을 가지고 있는지 알아보자. 이번 글은 [CPU Architecture](CPU%20Architecture.md) 글을 읽고 오면 좀 더 편하다. [Framework](Framework.md)이 글도 읽으면 좋다.

# ARM

ARM(Acorn RISC Machine)기반의 cpi(Cycle Per Instruction)를 탑재한 것을 말한다. 최근에 Apple Silicon이 등장하면서 Rosetta라는 것이 나왔는데, 이는 intel cpi로 개발된 앱을 arm cpi, 즉 CSIC를 RISC 방식으로 번역하는 과정을 수행하는 번역기를 말한다.

## armv7, arm64

둘다 arm architecture 이다. 당연히 RISC기반 프로세서이다.

* armv7
  * 32bit architecture
  * 임베디드 기기에 많이 사용됨
  * iphone 4s 미만 (iOS 6.0 이하)에서 사용됨
* armv7s
  * iPhone 5, iPhone 5C
* arm64
  * arm 아키텍쳐의 64비트 확장 버전
  * iPhone 5s, iPad4 이상에서 사용됨

|architecture|적용 기기|비고|
|:----------:|:---:--------|::----|
|**armv7**|iPhone 4s, iPad3, iPad Mini1, ~iPod Touch5|32bit|
|armv7s|iPhone 5, iPhone 5C, iPad4|32bit, armv7 호환|
|**arm64**|iPhone 5S ~ iPhone X \[Max\], <br />iPad Air1 ~ 2, iPad Pro1 ~ 2, ~iPad7, ~iPad Mini4<br />~iPad Touch7|64bit|
|arm64e|iPhone XR,  iPhone XS \[Max\], iPhon 11 \[Pro \[Max\]<br /> iPad Pro3, iPad Air3, iPad Mini5|64bit, arm64 호환|
|i386|32bit 기기에 대응하는 Simulator|32bit|
|x86_64|64bit 기기에 대응하는 Simulator, Mac|64bit|

좀 더 자세한 내용은 [해당 링크](https://www.innerfence.com/howto/apple-ios-devices-dates-versions-instruction-sets)에 들어가면 확인할 수 있다.

# Xcode CPU Arhitecture 설정

![](XcodeProject_22_Architecture_Configuration_0.png)

일단 해당 옵션에 들어가는 방법은, Project -> Target -> Build Settings -> Architectures 이다.

자, 위의 아키텍쳐 설명을 하면서 알아야 하는 내용은 두가지로 압축된다.

1. 아이폰은 기종에 따라 다른 아키텍쳐의 CPU를 사용한다.
1. 빌드를 하면 바이너리가 생성되는데, 이 바이너리는 CPU에서 읽고 그렇기 때문에 아키텍쳐에 맞는 바이너리를 생성해야 한다.

배포를 한다고 하면, 이 모든 기기에 대응되도록 모든 아키텍쳐에 맞게 바이너리를 생성해야겠지만, 개발하는 경우에는 사실 필요없다. 내가 가지고 있는 테스트기기의 cpu architecture에 해당하는 바이너리만 생성하면 되니까. 그 옵션이 `Build Active Architectures Only`이다.

![](XcodeProject_22_Architecture_Configuration_1.png)

이 옵션을 키면, 현재 연결된 기기를 감지해서, 해당 기기에 맞는 아키텍쳐용 빌드만 생성한다. 시뮬레이터는 어떨까? 인텔 맥이라면 `x86_64`, 애플 실리콘 맥이라면 `arm64` 아키텍쳐로 빌드될 것이다. Xcode 12기준, 현재로는 인텔 맥과 애플 실리콘이 공존하고 있는 상태로 시뮬레이터 아키텍쳐는 두개 모두 가지고 있다. 아래의 경로를 찾아가면 시뮬레이터의 정보를 알 수 있다.

````
/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator.sdk/SDKSettings.json
````

![](XcodeProject_22_Architecture_Configuration_2.png)

이전 Xcode 11에서는 `x86_64` 하나만 있었다고 한다. apple silicon의 등장으로 mac의 architecure역시 arm기반으로 변경되면서 두 arcitecure모두를 호환되도록 설정되어 있다. 만약 내가 intel 맥을 사용할 경우, 이점을 모른채로 빌드시 `arm64` 를 제외하지 않는다면 시뮬레이터 빌드시 에러가 난다.

# Universal App 설정

Universal App은, 하나의 프로젝트를 아이패드와 아이폰을 포함한 모든 버전의 iOS에서 실행되는 앱을 말한다. 이전에 아이패드를 썼던 경험이 있다면, 아이폰앱을 받은 경우 화면을 키우는 버튼이 있는 것을 본적이 있을 것이다. 이건 호환성 모드로 아이폰의 앱을 실행한 것이다.

Universal App은 아이폰과 아이패드 사이의 다양한 화면 크기를 다루도록 설계되었다. 

[Apple 필수 기기 기능](https://developer.apple.com/kr/support/required-device-capabilities/#ipad-devices) 여기에 가보면 디바이스별 제공하는 기능에 대한 설명이 있다. [UIRequiredDeviceCapabilities](https://developer.apple.com/documentation/bundleresources/information_property_list/uirequireddevicecapabilities)라는 값을 명시적으로 변경하라고 한다. 나는 모든 디바이스에서 가능하도록 만드는 것이 목적이므로 해당 키값을 `armv7`으로 지정해준다. 만약 특정 기능이 포함되어야 하는 경우라면 다른 기능을 명시적으로 적어주어야 AppStore Reject을 안 받는다고 한다.

![](XcodeProject_22_Architecture_Configuration_3.png)

![](XcodeProject_22_Architecture_Configuration_4.png)

# Reference

* [CPU Architectures](https://docs.elementscompiler.com/Platforms/Cocoa/CpuArchitectures/)
* [ARM 아키텍처](https://ko.wikipedia.org/wiki/ARM_%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98)
* [Apple 필수 기기 기능](https://developer.apple.com/kr/support/required-device-capabilities/#ipad-devices)
* [iOS Devices: Releases, Firmware, Instruction Sets, Screen Sizes](https://www.innerfence.com/howto/apple-ios-devices-dates-versions-instruction-sets)
* [Universal App, armv7, arm64 멀티 디바이스 대응, 바이너리 파일 설정 (CISC, RISC)](https://ios-development.tistory.com/805)
* [Xcode12에서 시뮬레이터 빌드 오류 원인 및 해결방법](https://jusung.github.io/Xcode12-Build-Error/)
* [UIRequiredDeviceCapabilities](https://developer.apple.com/documentation/bundleresources/information_property_list/uirequireddevicecapabilities)
* [Building a Universal macOS Binary](https://developer.apple.com/documentation/apple-silicon/building-a-universal-macos-binary)
