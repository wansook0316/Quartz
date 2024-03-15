---
title: Deep Link
thumbnail: ''
draft: false
tags:
- deep-link
- universal-link
- dynamic-link
created: 2023-10-01
---

# Deep Link

기존의, 즉 옛날옛적의 웹은 home page를 통해 각 문서에 접근하여 정보를 얻는 방식을 취했었다. 하지만 그 이후, 웹사이트 (http://example.com/path/page)의 검색 가능하거나 인덱싱 된 웹 컨텐츠의 하이퍼링크를 사용하는 방법이 만들어졌다. 그게 딥 링크다. 

즉, 우리가 검색했을 때의 결과들은 URL로 나오게 되는데, 이 정보를 바로 찾아갈 수 있도록 하는 것이 딥 링크다. URL을 보면 모든 정보가 표시되어 있다. page, query등. 즉 우리가 현재 사용하고 있는 HTTP가 이 방식이라 생각하면 된다.

# Mobile Deep Link

일반적으로 Deep Link라 했을 때 사람들의 의도는 Mobile에 국한해서 말하는 경우가 많다. 이런 경험이 있을 것이다. 

![](TechTalks_12_Deep_Link_0.png)

버튼을 누르면 앱으로 바로 이동한다.

![](TechTalks_12_Deep_Link_1.png)

혹은 특정 광고에서 "앱 다운로드" 혹은 "이벤트 참여하기" 같은 버튼을 누르니, 특정 웹 화면으로 전환되면서, 앱을 받을 것이냐는 알림이 나온다. 그리고 확인을 누르면 특정 판매 화면으로 바로 이동한다.

이렇게 앱 내 특정 페이지로 이동할 수 있는 문자열을 모바일 딥 링크라 한다.

## 왜 사용하는가?

웹의 경우 URL을 입력함과 동시에 사용자가 원하는 화면을 즉각적으로 볼 수 있다. 하지만 App의 경우 설치를 해야 한다는 문제가 있다. 이러한 부분에서 특정 URI를 통해 앱으로 이동할 수 있는 기능이 필요했다.

# Mobile Deep Link의 변화과정

처음 해당 기술이 나온 이후, 기술의 변화가 있었다. 이 변화 과정에 대해서 알아보자. 하위 사진은 [출처](https://m.blog.naver.com/wcjpower/220899970761)에서 가져왔다.

## Direct Deep Link

![](TechTalks_12_Deep_Link_2.png)

초창기의 경우 기존에 앱을 설치한 유저는 앱 내 특정 페이지로 이동하는 것이 가능했지만, 미설치자의 경우 앱 스토에서 앱을 설치하는 과정에서 모바일 딥링크가 유실되었다. 다시 해당화면을 보고싶다면, 앱 설치 후 웹으로 돌아서 다시한번 버튼을 눌러주었어야 했다.

## Deferred Deep Link

![](TechTalks_12_Deep_Link_3.png)

이를 해결하고자 Defered Deep Link가 생겼다. 이름에서 알 수 있듯 "지연된" Deep Link로, 앱 설치 후에도 정보가 유실되지 않아 앱 내의 특정 페이지로 이동이 가능하다. 하지만 AOS, iOS 각각에 대해 대응해야 한다는 점에서 귀찮다는 문제가 있다.

## Dynamic Link(One Link)

![](TechTalks_12_Deep_Link_4.png)

이에 Firebase, Appsflyer에서는 여기서 한단계 발전한 것을 제시한다. 각각 Dynamic Link, One Link라 불리는 개념이다. 이 개념을 사용하면 하나의 URL로 각각 OS에 맞게 페이지로 이동할 수 있다.

# Reference

* [Deep Linking](https://en.wikipedia.org/wiki/Deep_linking)
* [Mobile Deep Linking](https://en.wikipedia.org/wiki/Mobile_deep_linking)
* [모바일 딥링크(Deep Link)의 발전](https://m.blog.naver.com/wcjpower/220899970761)
* [딥링크(Deeplink) : URI스킴, 유니버셜 링크, 앱링크 구분과 이해](https://help.dfinery.io/hc/ko/articles/360039757433-%EB%94%A5%EB%A7%81%ED%81%AC-Deeplink-URI%EC%8A%A4%ED%82%B4-%EC%9C%A0%EB%8B%88%EB%B2%84%EC%85%9C-%EB%A7%81%ED%81%AC-%EC%95%B1%EB%A7%81%ED%81%AC-%EA%B5%AC%EB%B6%84%EA%B3%BC-%EC%9D%B4%ED%95%B4)
* [딥링크란 무엇인가요?](https://blog.ab180.co/posts/deeplinkga-mweojyo)
* [\[Deeplink\] 딥링크 (URL Scheme, Universal Link)](https://ios-development.tistory.com/207)
