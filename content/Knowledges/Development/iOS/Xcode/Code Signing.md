---
title: Code Signing
thumbnail: ''
draft: false
tags:
- deployment
- ios
- xcode
- code-signing
- provisioning
- profile
created: 2023-10-02
---

앱스토어에 실제 앱을 배포해본 사람은 알겠지만, 인증서, provisioning과 같은 개념은 생소하다. 정확하게 알아보자.

![](Pasted%20image%2020231002134139.png)

# 원칙

 > 
 > Apple 만이 자신들의 하드웨어(iOS, iPadOS, MacOS etc)에 특정 소프트웨어가 동작하도록 할 수 있다.

이 원칙을 알고가는 것이 중요하다. 중앙에서 소프트웨어의 동작 권한을 관리하겠다는 것. 그런데 문제는, 내가 만든 앱이 애플의 하드웨어에서 동작시키고 싶은 경우 어떻게 해야하는가이다. 항상 애플에게 물어볼 수도 없는 노릇. 그래서 필요한 것이 인증서이다.

# Apple 인증서

 > 
 > 애플이 주는 개발자 신뢰 인증 문서

나라는 개발자를 애플이 신뢰한다는 증서로 인증서를 발급해주고, 이를 활용하여 앱 실행 권한을 가지는 것. 이걸 Apple 인증서라고 부른다.

## 방법

[해당 글](https://medium.com/jinshine-%EA%B8%B0%EC%88%A0-%EB%B8%94%EB%A1%9C%EA%B7%B8/%EC%BD%94%EB%93%9C%EC%82%AC%EC%9D%B4%EB%8B%9D-%EC%9D%B8%EC%A6%9D%EC%84%9C-%ED%94%84%EB%A1%9C%EB%B9%84%EC%A0%80%EB%8B%9D-%ED%94%84%EB%A1%9C%ED%8C%8C%EC%9D%BC%EC%9D%B4%EB%9E%80-2bd2c652d00f)에 방법이 잘 나와있다.

1. "키체인 접근 앱"에서 CSR(Certificate Signing Request)를 생성한다.
   * 키체인 접근 -> 인증서 지원 -> 인증 기관에서 인증서 요청'
     * 해당 작업시 이런 작업을 수행한다.
     * 공개키, 개인키 생성
     * 애플에 보낼 `CertificateSigningRequest.certSigningRequest` 파일 생성
1. Certificate 발급 받기

* [Apple Developer](https://developer.apple.com) -> Certificates, Identifiers & Profiles
* Development, Distribution으로 나뉨, 선택
* CSR(CertificateSigningRequest) 등록 후 Continue
* 다운로드하여 KeyChain 적용 확인

여기까지 끝냈다면, **애플에서 인증한 개발자가 된 것이다.** 앱을 sign할 수 있는 권한이 생겼다. 하지만, 실제로 헤당 앱을 설치하는 기기에서 역시 앱을 만든 개발자를 신뢰해주어야 설치가 가능하다.

이렇게 애플이 증명해주는 애플인증서와 iOS 기기에서의 신뢰 여부를 연결해주어야 한다.

# Provisioning Profile

 > 
 > 소프트웨어를 실행시킬 디바이스가 개발자 신뢰여부에 따라 앱 설치여부를 결정할 수 있도록 해주는 것, iOS기기와 애플 인증서를 연결해주는 역할

 > 
 > 임시 실행권한을 등록된 단말에 한해서 인정해주는 단기 여행비자

![](Pasted%20image%2020231002134216.png)
Provisioning Profile에는 위의 그림처럼 3개가 들어간다.

* App Id: 앱스토어에 등록될 Bundle ID
* Certificate: 위에서 만든 Apple 인증서
* Device: 디바이스의 UUID

Certificate는 만들었으니, App Id, Device 정보를 얻고, 그 후에 Proivisioning Profile을 만들어보자.

## App ID 생성 방법

[해당 글](https://medium.com/jinshine-%EA%B8%B0%EC%88%A0-%EB%B8%94%EB%A1%9C%EA%B7%B8/%EC%BD%94%EB%93%9C%EC%82%AC%EC%9D%B4%EB%8B%9D-%EC%9D%B8%EC%A6%9D%EC%84%9C-%ED%94%84%EB%A1%9C%EB%B9%84%EC%A0%80%EB%8B%9D-%ED%94%84%EB%A1%9C%ED%8C%8C%EC%9D%BC%EC%9D%B4%EB%9E%80-2bd2c652d00f)에 잘 나와있다. 요약만 하겠다.

1. [Apple Developer](https://developer.apple.com) -> App IDs
1. Identifier의 Type을 정한다.
   * App
   * App Clip
1. Bundle ID 등록
1. 사용할 Capabilities 체크, 추후 수정 가능
1. Continue -> Register

## Device 등록 방법

1. [Apple Developer](https://developer.apple.com) -> Devices
1. 
   * 클릭
1. Name에 UUID 입력
1. Continue

디바이스의 UUID는 Xcode -> window -> Devices and Similators에 들어가면 확인할 수 있다. (Identifier)

## Provisioning Profile 생성 방법

1. [Apple Developer](https://developer.apple.com) -> Provisioning Proifiles
1. Development, Distribution 선택, Continue
1. App Id 선택
1. 인증서 선택
1. Device 선택
1. Provisioning profile 이름 입력
1. 파일 다운로드

````
<이름 규칙 예시>
[<company name>] <app name> <profile type (AdHoc|AppStore)>
Apple FaceTime AdHoc
Instagram AppStore
````

## 알아두어야 할 점

* provisioning 파일을 만들면, `*.mobileprovision` 확장자로 생성되는데, 이 녀석이 iOS 앱을 컴파일하는 과정에서 사용된다.
* 그리고 proivisioning profile을 이 앱을 실행해보고자 하는(테스트) 디바이스에 설치되어야 한다.
* 개발자는 복수의 프로비저닝 프로파일을 가질 수 있다.
* 하지만 App ID와 실제 컴파일하려는 앱의 Bundle ID가 일치해야 하므로, 즉 **각 프로젝트마다 하나의 프로비저닝 프로파일을 만들어야 한다.**

# 빌드 및 실행과정

## Ad-Hoc

위의 모든 과정을 거치고 얻은 것은 다음과 같다.

1. 개발자를 증명하는 공개키, 비밀키
1. 애플이 인정해준 앱 서명 허락 인증서 (Apple 인증서)
1. 디바이스에 설치가능한 Provisioning Profile

이 세가지를 가지고 Xcode에서 빌드를 하게 되는데 그렇게 해서 생성되는 것이 `.app` 파일이다. 해당 패키지 내부에는 2개가 있다.

1. 컴파일 시 사용된 provisioning profile이 복사된다.
1. codeSignature folder
   * CodeResources란 파일(.plist)를 가지고 있다.
   * 패키지에 있는 모든 파일의 암호화된 해시 정보를 가지고 있다.

그럼 앱이 디바이스에 설치될 때는 어떤 과정을 거쳐 실행될까?

1. `.app` 에 포함된 Provisioning profile 이 애플에서 서명된 것인지 확인
1. CodeResources 파일에 기록된 각 파일의 해시정보를 실제 파일들과 확인하여 빌드 후 수정되지 않았는지 확인 (단방향 암호화)
1. 디바이스에 `.app`에 포함된 Provisioning Profile이 있는지 확인

위와 같은 방식을 거쳐 실행된다.

## Enterprise

모든 디바이스를 애플에 등록하지 않고도 개발된 앱을 디바이스에 바로 실행할 수 있도록 해주는 인증서를 준다. 즉, 특정 회사에 애플인 것과 같은 정도의 권한을 준다는 것.

## App Store 배포

Enterprise 배포와 비슷하다, 이 배포 과정에 포함된 Provisioning profile의 경우, 빌드된 앱이 어떤 디바이스에서도 실행이 되지 않는다.

즉, 해당 provisioning profile은 앱스토어 제출용 말고 어디서도 사용할 수 없다.

애플쪽에 앱을 제출하면, 해당 앱은 개발자에 의해 이미 서명되었고, provisioning profile을 가지고 있기 때문에 애플에 인증된 개발자가 제출한 앱임을 확인할 수 있다.

이후 애플 측에서 앱 배포를 승인하면, **자신들의 서명을 다시하여 모든 iOS 디바이스에서 실행할 수 있도록 해준다.**

참고) TestFlight 배포를 원한다면 해당 옵션을 클릭해야 한다.

# Reference

* [코드사이닝, 인증서, 프로비저닝 프로파일이란?](https://medium.com/jinshine-%EA%B8%B0%EC%88%A0-%EB%B8%94%EB%A1%9C%EA%B7%B8/%EC%BD%94%EB%93%9C%EC%82%AC%EC%9D%B4%EB%8B%9D-%EC%9D%B8%EC%A6%9D%EC%84%9C-%ED%94%84%EB%A1%9C%EB%B9%84%EC%A0%80%EB%8B%9D-%ED%94%84%EB%A1%9C%ED%8C%8C%EC%9D%BC%EC%9D%B4%EB%9E%80-2bd2c652d00f)
* [알면 알수록 헷갈리는 IOS 환경 #1 - 인증서와 프로비저닝(코드서명)](https://www.blueswt.com/123)
* [코드사이닝? 인증서? 프로비저닝??](https://zeddios.tistory.com/392)
* [\[iOS\] 코드 사이닝 (프로비저닝 프로파일, 인증서)](https://beankhan.tistory.com/115)
* [\[iOS\] 인증서와 코드 사이닝 이해하기](http://la-stranger.blogspot.com/2014/04/ios.html?m=1)
