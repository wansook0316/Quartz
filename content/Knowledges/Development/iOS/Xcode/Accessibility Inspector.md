---
title: Accessibility Inspector
thumbnail: ''
draft: false
tags:
- xcode
- accessibility
- ios
created: 2023-10-02
---

접근성 개발에 있어 쉽게 도와주는 녀석이 있다! Accessibility Inspector!!

# Introduction

접근성 관련해서 반영해주려니까 테스트 기기가 없더라. 흠 이걸 기다려야해..? 하던 와중 찾아보니 시뮬레이터에서 접근성 테스트 할 수 있는 걸 제공하더라! 이전에 프로젝트했을 때, 일일히 빌드해서 하던 팀원이 있었는데 오늘따라 생각이 난다.. 여튼, 알아보자.

아, 기본적으로 어떤 property들이 있는지 모르면 [VoiceOver](VoiceOver.md)를 보고오자.

# Accessibility Inspector

![](XcodeProject_21_Accessibility_Inspector_0.png)

* Xcode → Xcode Menu → Open Developer Tools → Accessibility Inspector

일단 요로코롬 들어가주자.

![](XcodeProject_21_Accessibility_Inspector_1.png)

그럼 이런 창이 뜬다. 일단 가장 상위 탭부터 이해해보자.

![](XcodeProject_21_Accessibility_Inspector_2.png)

## inspection

![](XcodeProject_21_Accessibility_Inspector_3.png)

* 시각 장애우가 살펴보는 방식대로 넘기면서 (좌우 화살표) 확인할 수 있음
* 스크립트가 어떻게 읽히는지 확인 가능
* 초점이 올라간 element에 어떤 accessibility가 적용되었는지 확인 가능

## audit

![](XcodeProject_21_Accessibility_Inspector_4.png)

* ~~음 나는 뭔가 맛이 갔는데 원래 경고가 오른쪽에 뜬다..~~
* 접근성 이슈가 발생하는 리스트를 볼 수 있음
* Hit area가 너무 작다와 같은 오류들이 뜸
* Help 버튼을 누르면 해당 문제가 왜 발생했는지 혹은, 해결방법을 알려줌

## settings![](XcodeProject_21_Accessibility_Inspector_5.png)

* 폰트 크기
* 화면 색상 invert 등의 설정

# 마무리

이렇게 시뮬레이터와 실기기에서 해당 inspector를 켜놓으면 굉장히 쉽게 accessibility를 작업할 수 있다! 좀더 고급진 녀석들까지 알아보기에는 시간이 없어서 이만 마무리하도록 하겠다.

# Reference

* [\[Xcode\] Accessibility, Accessibility Inspector](https://velog.io/@ryan-son/Xcode-Accessibility-Accessibility-Inspector)
* [iOS ) Accessibility(접근성) - Accessibility Inspector](https://zeddios.tistory.com/444)
* [Accessibility Inspector](https://developer.apple.com/videos/play/wwdc2019/257/)
* [Writing Great Accessibility Labels - WWDC19](https://developer.apple.com/videos/play/wwdc2019/254/)
