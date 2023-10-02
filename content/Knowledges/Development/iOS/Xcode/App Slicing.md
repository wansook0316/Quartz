---
title: App Slicing
thumbnail: ''
draft: false
tags:
- app-thinning
- app-slicing
- ios
- xcode
- deployment
created: 2023-10-02
---

앱 배포에 있어 꼭 알아야 하는 App Thining중 App Slicing에 대해 알아본다. 해당글은 WWDC 2015를 기준으로 한다.

# App Distribution Today

![](XcodeProject_09_App_Slicing_0.png)

이전의 App 배포 방법은 다음과 같은 방식으로 수행되었다. 가물가물하다면 [이 글](https://velog.io/@wansook0316/Code-Signing)을 다시보자.

1. Xcode로 개발
1. test후 app store 제출
1. 개발자 certificate로 signing한다. 애플은 이를 보고 검증된 개발자인지 아닌지 여부를 검증한다.
1. 애플이 앱을 검사하고 승인한다.
1. 앱스토어는 app store certificate로 re-signing하여 사용자들이 app을 다운로드할 수 있게 한다.

# What's in an App?

![](XcodeProject_09_App_Slicing_1.png)

그럼 앱 안에는 무엇이 있을까? 컴파일된 실행코드와 Resource들이 들어가 있겠다.

## Executable Code

![](XcodeProject_09_App_Slicing_2.png)

상대적 크기에 따라서 비대한 영역이 다를 수 있다.

![](XcodeProject_09_App_Slicing_3.png)

실행가능한 코드, 그러니까 바이너리는 32비트, 64비트 CPU인지 고려해야 한다. 그뿐만이 아니고, 어떤 아키텍쳐를 가지고 있는지 역시 고려해야 한다. 이부분이 궁금하다면 [Architecture Configuration](https://velog.io/@wansook0316/Architecture-Configuration)을 보고오자. 간단하게 말하면 armv7, armv6s, arm64는 iphone에 들어가는 arm계열 cpu 아키텍쳐 종류이다. 이 모든 것에 대응하도록 해야 애플 생태계에 있는 모든 하드웨어에서 동작하도록 앱을 만들 수 있다.

## Resources

![](XcodeProject_09_App_Slicing_4.png)

Resources에서 고려해야 하는 것들은 무엇이 있을까? 먼저 이미지가 있다면 디바이스들의 scale이 다르기 때문에, 이에 맞는 1x, 2x, 3x 이미지를 사용해야 한다.

![](XcodeProject_09_App_Slicing_5.png)

iPad와 같이 성격이 다른 디바이스까지 대응해야 한다면 문제는 더 복잡해진다.

![](XcodeProject_09_App_Slicing_6.png)

게임이나 다른 3D 그래픽 기반 앱을 사용하는 경우, 1x 2x는 중요하지 않다.

![](XcodeProject_09_App_Slicing_7.png)

OpenGL ES나 Metal의 강점을 적극 이용하려면, 각 asset에 대해 그에 대한 다른 질감(textures)을 가지고 있어야 한다. 그리고 그를 기반으로  메모리와 그래픽 capability에 따라 낮은/높은 품질을 차별화 한다면 모든 디바이스에서 좋은 결과를 얻을 수 있다. 그리고 또한 오디오도 가지고 있을 수 있겠다. bit rates 측면에서 변화를 줄 수 있다.

![](XcodeProject_09_App_Slicing_8.png)

이외에 다른 데이터들도 있을 수 있다.

# App Slicing

![](XcodeProject_09_App_Slicing_8.png)

문제는 이거다. 앱 하나에 이렇게 다양하게 모든 것을 고려해서 배치를 해두었는데, 실제로 다양한 디바이스에서 사용할 때 이 모든게 필요하지는 않다. 각각의 앱에서 필요한 것만 쏙 뽑아 담을 수는 없을까?

![](XcodeProject_09_App_Slicing_10.png)

그게 바로 App Slicing이다. iPad Mini를 위한 앱 번들을 만든다고 생각해보자. 아키텍쳐를 선택하고, 작으니까 작은 이미지를 선택하고, 성능도 좋지 못하니 그에 맞는 OpenGL과 오디오를 선택하자. 나머지 데이터는 항상들어가야 하니까 추가해주고.

![](XcodeProject_09_App_Slicing_11.png)

iPhone 6+여도 마찬가지다. 성능이 좋으니까 좋은 녀석들이 많이 들어간다.

![](XcodeProject_09_App_Slicing_12.png)

이것이!! 위 그림의 정체였던 것! App Record는 Fat binary를 의미한다. 아주 뚱뚱한 친구들! 이걸 App Store에서 받아서, 실제 device에 전달할 때는 이를 각 device에 맞는 녀석들로 추린다음에 앱 번들을 만들어서 ipa 형태로 뿌려준다.

# 마무리

App Thinning의 시작 App Slicing을 알아보았다. 여기서 더 줄일 수 있는 방법이 있는데, 그건 다음글, On Demand Resources에서 알아보자.

# Reference

* [App Thinning in Xcode](https://developer.apple.com/videos/play/wwdc2015/404)
* [App thinning, Bitcode, Slicing: tutorial (iOS app)](https://ankur-s20.medium.com/implementing-app-thinning-in-your-project-step-by-step-tutorial-ios-app-b3cfd139896d)
* [Doing Basic Optimization to Reduce Your App’s Size](https://developer.apple.com/documentation/xcode/doing-basic-optimization-to-reduce-your-app-s-size)
* [Doing Advanced Optimization to Further Reduce Your App’s Size](https://developer.apple.com/documentation/xcode/doing-advanced-optimization-to-further-reduce-your-app-s-size)
* [Distribution options](https://help.apple.com/xcode/mac/11.0/index.html?localePath=en.lproj#/devde46df08a)
