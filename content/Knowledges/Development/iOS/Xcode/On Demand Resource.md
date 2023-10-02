---
title: On Demand Resource
thumbnail: ''
draft: false
tags:
- on-demand-resource
- ios
- xcode
- deployment
- ODR
created: 2023-10-02
---

앱 배포에 있어 꼭 알아야 하는 App Thining중 On-Demand Resource에 대해 알아본다. 해당글은 WWDC 2015를 기준으로 한다.

# Do Better

이전 글에서 App Slicing을 하면서 앱 크기를 많이 줄일 수 있다는 것을 확인했다. 하지만 여전히 개선할 점이 있다.

![](XcodeProject_10_On_Demand_Resource_0.png)

* 항상 필요한 것
  * 실행 코드
  * 기본 인터페이스 (처음 화면 들어왔을 떄 보이는 녀석들)
* 나중에 필요한 것
  * 총 20레벨 까지 게임이 있는데, 굳이 20단계에서 보여질 Resource를 로드할 필요 없음
  * Keynote와 같은 앱을 만든다고 할 때, 문서 template 썸네일만 보여주면 됨. 실제 데이터까지 모두 들고 있을 필요 없음
* 거의 필요없는 컨텐츠
  * 이미 안내가 끝난 Tool Tip 혹은 Tutorial

# On-Demand Resources

위의 상황에서 필요한 것은, 당장 보여질 것은 가지고 있되, 필요할 때 누군가가 얍! 하고 던져주는 것이다. 즉 동적으로 리소스 관리를 하는 것. 이런 것을 \*\*On-Demand Resources(ODR)\*\*이라고 한다.

ODR은 Appstore에 IPA와 별도로 저장되고, 필요할 때마다 더 많은 컨텐츠를 가져올 수 있다. 받은 데이터는 기기 내부의 App Bundle나 iCloud에 저장되지 않고 "메모리"에 저장된다. 

정확하게 말하면 System이 관리하는 메모리에 저장되고, 이 메모리는 다양한 App에서 발생하는 ODR를 캐시하는 역할을 한다.

![](XcodeProject_10_On_Demand_Resource_1.png)

앱의 기본 구조가 이런식으로 잡혀있다고 생각해보자.

![](XcodeProject_10_On_Demand_Resource_2.png)

말했듯, 각 계층의 ranking 다르다고 생각해보자. Shared는 항상 가지고 있어야 하는 것, level은 숫자에 따라 필요한 시점이 다르다. 위 사진은 Xcode에서 개발자가 개발한 후 AppStore에서 App Slicing후 하나의 ipa라고 가정해보자.

![](XcodeProject_10_On_Demand_Resource_3.png)

ODR이 적용되고 나면 전체가 ipa화 되는 것이 아니고, 왼쪽의 영역만 ipa화 되어 기기에 가지고 있다. 오른쪽 영역을 AppStore가 가지고 있다. Code영역은 모두 Shared되어 기기가 들고 있다는 것을 확인할 수 있다.

![](XcodeProject_10_On_Demand_Resource_4.png)

실제 기기에서 가지고 있는 데이터는 요만큼 뿐이다. 이 상황에서 level1의 데이터를 요청하면!

![](XcodeProject_10_On_Demand_Resource_5.png)

![](XcodeProject_10_On_Demand_Resource_6.png)

![](XcodeProject_10_On_Demand_Resource_7.png)

요러코롬 받아오게 된다. 아까 이 데이터를 받는 객체가 시스템에서 관리한다고 했는데 여기서 level 4를 받으면 어떻게 될까?

![](XcodeProject_10_On_Demand_Resource_8.png)![](XcodeProject_10_On_Demand_Resource_9.png)

메모리의 크기가 정해져있기 때문에, 삭제된다. 이 때 캐시정책은 LRU 정책을 사용한다고 한다.

![](XcodeProject_10_On_Demand_Resource_10.png)

만약 사용자가 해당 앱을 오래동안 사용하지 않았고, 다른 앱이 ODR을 요청한다면 시스템은 메모리를 비우고, 다시 사용자가 앱을 사용할 경우 로드하는 방식으로 동작한다.

![](XcodeProject_10_On_Demand_Resource_11.png)

정리하면 다음과 같다. On-Demand Resources는...

* Asset Pack은 Xcode에 의해서 만들어짐
* 실행가능하지 않은 Asset을 포함할 수 있음
* App Store가 호스팅함
* 필요할 때 다운로드함
* 적절한 시점에 되찾음
* 디바이스에 맞게 최적화됨

![](XcodeProject_10_On_Demand_Resource_12.png)

장점으로는 다음과 같은게 있다고 한다.

* 스토리지가 적은 디바이스 대응 가능
* 초기 다운로드 시간 감소
* OTA 크기 제한안에 있기 더 쉽다. (애플 100mb인가 Cellular제한 있음)
* 덜 타협하고 많은 디바이스 지원 가능 (기기 스펙에 따라 용량 걱정할 필요가 줄어듦)
* 이전에 맞추지 못했던 기능을 넣을 수 있음 (용량 제한 적어짐)

# 마무리

App Slicing에 이어 On-Demand Resources까지 알아보았다. 그림으로 보니 괜찮은 듯 싶다. 다음에는 BitCode까지 알아보자.

# Reference

* [App Thinning in Xcode](https://developer.apple.com/videos/play/wwdc2015/404)
* [App thinning, Bitcode, Slicing: tutorial (iOS app)](https://ankur-s20.medium.com/implementing-app-thinning-in-your-project-step-by-step-tutorial-ios-app-b3cfd139896d)
* [Doing Basic Optimization to Reduce Your App’s Size](https://developer.apple.com/documentation/xcode/doing-basic-optimization-to-reduce-your-app-s-size)
* [Doing Advanced Optimization to Further Reduce Your App’s Size](https://developer.apple.com/documentation/xcode/doing-advanced-optimization-to-further-reduce-your-app-s-size)
* [Distribution options](https://help.apple.com/xcode/mac/11.0/index.html?localePath=en.lproj#/devde46df08a)
