---
title: URLSession
thumbnail: ''
draft: false
tags:
- swift
- network
- URL
- URLSession
created: 2023-09-30
---

iOS App에서 서버와 통신하기 위해 Apple에서는 `URLSession`이라는 기본 API를 제공하고 있다. third-party library로 많이 사용하는 `Alamofire`, `kingfisher` 등의 기반이 되는 API로 서버 통신을 위해 필수적으로 알아야 한다. Apple 문서를 읽으면서 이해해보자.

# Concept

일단 어떤 흐름으로 네트워크 요청을 처리하는지 개괄적으로 이해해보자.

1. Session configuration 결정
1. Session 생성
1. URL 생성
1. Request 객체 생성
1. 사용할 Task 결정
1. Completion handler Or Delegate 사용 여부 결정
1. Task 실행
1. Completion handler Or Delegate 실행

# URLSessionConfiguration

![](Swift_23_URLSession_0.png)

````swift
let `default` = URLSessionConfiguration.default
let ephemeral = URLSessionConfiguration.ephemeral
let background = URLSessionConfiguration.background(withIdentifier: "configurationIdentifier")
````

`URLSessionConfiguration` 객체는 `URLSession` 객체를 사용하여 데이터를 업로드하거나 다운로드할 때 사용할 **정책**과 **행동**을 정의한다. 그렇기 때문에 task를 통해 데이터를 받기 전에, 이 설정 작업이 최우선으로 진행되어야 한다. 다음과 같은 것을 설정할 수 있다.

* timeout 값
* caching 정책
* connection 요구 사항
  * cellular 허용 여부
  * connectivity

`URLSessionConfiguration` 객체를 설정하는 것은 매우 중요하다. 왜냐하면 이 설정을 기반으로 `URLSession` object가 생성되게 되는데, `URLSession` Object가 생성된 이후에 configuration을 변경할 수 없기 때문이다. 일단 `URLSession` 객체가 생성될 때 instance로 설정되면, `URLSessionConfiguration` instance에 발생하는 모든 변경사항이 생성된 `URLSession`에 반영되지 않는다. 이를 반영하여 작업하고 싶다면 새로운 `URLSession` 객체를 만드는 방법밖에 없다.

## Default

````swift
class var `default`: URLSessionConfiguration { get }
````

기본적으로 제공하는 configuration이다. 다음과 같은 특징을 갖는다.

* disk-based cache
  * 결과가 파일로 다운로드 되는 경우는 제외
* user의 keychain에 인증서들을 저장
* cookie 저장

## Ephemeral

````swift
class var ephemeral: URLSessionConfiguration { get }
````

ephemeral configuration의 경우 default와 비슷하다. 다음과 같은 점만 다르다고 생각하면 된다.

* cache를 저장하지 않음
* 인증서를 저장하지 않음
* session과 과련된 어떤 데이터도 disk에 저장하지 않음
  * ram에 저장함

대부분의 정보를 ram에 저장하거나, 저장하지 않는다. URL content가 file인 경우에만 disk에 저장한다.

이렇게 ephemeral configuration을 사용하는 최대 장점은 역시 privacy이다. 잠재적으로 민감한 정보를 disk에 저장하지 않음으로서 데이터가 가로채져서 사용될 가능성을 줄일 수 있다. 실제로 해당 세션이 private browsing mode 혹은 비슷한 상황에서 많이 사용된다.

그런데 일단 ephemeral configuration이 disk에 cache하지 않고 ram에 하기 때문에, cache size는 ram size에 따라 제한된다. 즉, 앞에 저장된 cache가 더 빨리 제거될 가능성이 있다는 말이다. 또한 user가 app을 닫거나 재실행하면 이 cache 정보는 다 날아간다. 결국 app의 특성에 따라 perfomance가 달라질 수 있음을 인지하고 있어야 한다.

추가적으로 이 configuration으로 만들어진 session을 invalidate한다면, 내부 session data는 자동적으로 삭제된다. 아 그런데 memory cache의 경우에는 app이 suspend 상황(home으로 넘어간 상황에서 background에서 작업을 하지 않는 경우)인 경우 자동적으로 삭제되지는 않는다. 다만 app이 terminated 되거나 memory가 부족한 경우(부족하면 suspend 상태 app이 제거되니까) 삭제될 가능성이 높다. (모호하게 말해뒀네)

## Background

````swift
class func background(withIdentifier identifier: String) -> URLSessionConfiguration
````

해당 configuration은 추가 파라미터를 가지는데, 얘는 `nil`이거나 empty string이면 안된다. 

이녀석은 app이 background에서 작동하는 동안 data를 보내기 위해 적절한 configuration이다. 이 configuration으로 만들어진 `URLSession`은 시스템으로 전송 제어권을 넘기고, 이 세션은 별도의 process에서 전송을 처리한다. 심지어 iOS의 경우, 이 configuration으로 만들어진 `URLSession`은 app이 suspend 혹은 terminated된 상태에서도 전송을 계속할 수 있다.(system으로 넘겨서 그런 듯)

만약에 iOS app이 system에 의해 terminated되거나 재실행된 경우, app이 이 session을 찾아야 할 수 있다. 이런 경우 새로운 configuration과 session object를 만들고, 종료시점의 전송 progress를 얻기 위해 설정한 같은 `identifier`를 사용할 수 있다. 이렇게 사용하는 경우는 system에 의해 정상적으로 종료된 시점에만 가능하다. 만약에 user가 app을 멀티 태스킹화면으로부터 종료한 경우, system은 모든 background 전송을 종료한다. 게다가 system은 user가 app을 강제종료한 경우 자동적으로 app을 실행하지 않는다. 다시 transfer가 시작되려면 user가 명시적으로 app을 다시 켜야 한다.

`isDiscredit` property를 사용하면 최적의 성능을 위해 system 재량에 따라 전송을 예약하도록 background configuration을 만들 수 있다. 만약에 대용량 데이터를 전송할일이 있다면 이 value를 true로 바꿔주자. 추가적으로 예시가 궁금하다면 [Downloading Files in the Background](https://developer.apple.com/documentation/foundation/url_loading_system/downloading_files_in_the_background) 여길 보자. (~~이건 못보겠다 힘들다~~)

# URLSession

````swift
let defaultSession = URLSession(configuration: .default)
let ephemeralSession = URLSession(configuration: .ephemeral)
let backgroundSession = URLSession(configuration: .background(withIdentifier: "backgroundIdentifier"))

let defaultSession = URLSession(configuration: .default, delegate: self, delegateQueue: nil) // with delegate
````

`URLSession` 객체 혹은 관련된 객체는 지정된 URL들로 부터 데이터를 다운로드 하거나 업로드할 수 있는 API를 제공한다. App이 run하지 않거나 suspended 상태인 경우 Background download를 수행할 수 있다. `URLSessionDelegate` 혹은 `URLSessionTaskDelegate`를 사용하면 authentication 지원이나 redirection, task completion과 같은 이벤트를 받을 수 있다.

App이 하나이상의 `URLSession` instance를 만들고, 그 각각의 instance는 관련된 data transfer task를 조정한다. 예를 들어 web browser를 만든다면, Tab 혹은 window마다 하나의 세션을 만들 수 있다. 혹은 interactive한 사용을 위한 Session, background download를 위한 Session 식으로 만들어서 사용이 가능하다. 각 Session에서 App은 특정 URL에 대한 요청을 나타내는 task를 추가한다. (필요한 경우 HTTP redirect를 따름)

`URLSession`을 만들게 되면 configuration 객체가 필요하다. 앞에서 설명했듯, 단일 호스트에 연결할 최대 공시 연결 수, cellular network 사용 여부등과 같은 동작을 정의하는 `URLSessionConfiguration` 객체를 가지고 만들 수 있다. 기본적인 request를 위한 `shared` singleton 객체를 제공한다. 이녀석은 configuration object를 가지고 있지 않다. 이녀석은 custimziation이 불가하지만, 제한된 requirement라면 좋은 시작점이 될 수 있다. 추가 설정이 필요하다면 `URLSessionConfiguration` 객체를 사용하여 만들어서 사용하도록 하자.

async/await 구문 역시 사용이 가능하다. 이 부분은 추가 포스팅으로 작성할 예정이다.

`URLSession`은 자체적으로 `data`, `file`, `ftp`, `http`, `https` URL Scheme을 지원한다. 또한 `HTTP/1.1`, `HTTP/2`, `HTTP/3` 프로토콜 역시 지원한다. 추가적으로 custom networking protocl을 만들어서 사용하는 것도 지원하는데, [URLProtocol](https://developer.apple.com/documentation/foundation/urlprotocol)을 참고하자.

iOS 9.0 및 macOS 10.11 이상은 `URLSession`으로 만들어진 모든 HTTP 연결에 앱 전송 보안(App Transport Security: ATS)을 사용한다. 보안에 취약한 네트워크의 연결을 차단하게 되는데, 보통 네트워크 연결하고 `http`로 된 url에 접속하는 경우 보게되는 에러와 관련있다. [App Transport Security](https://velog.io/@wansook0316/App-Transport-Security)을 참고하자.

URLSession API는 **thread safe**하다. 그렇기 때문에, 자유롭게 session과 task를 어느 thread에서든 만들어도 된다. delegate method가 completion handler를 호출하면, 올바른 delegate queue에 자동으로 예약된다.

# 마무리

어떻게 Session을 만들고, Session을 만드는데 필요한 설정이 어떤 것들이 있는지 알아보았다. 다음은 URL과 Request 객체를 만드는 방법을 알아보자. 끝!

# Reference

* [iOS URLSession 이해하기](https://hcn1519.github.io/articles/2017-07/iOS_URLSession)
* [URL Loading System](https://developer.apple.com/documentation/foundation/url_loading_system)
* [Fetching Website Data into Memory](https://developer.apple.com/documentation/foundation/url_loading_system/fetching_website_data_into_memory)
* [URLSessionConfiguration](https://developer.apple.com/documentation/foundation/urlsessionconfiguration)
  * [default](https://developer.apple.com/documentation/foundation/urlsessionconfiguration/1411560-default)
  * [ephemeral](https://developer.apple.com/documentation/foundation/urlsessionconfiguration/1410529-ephemeral)
  * [background(withIdentifier:)](https://developer.apple.com/documentation/foundation/urlsessionconfiguration/1407496-background)
  * [Downloading Files in the Background](https://developer.apple.com/documentation/foundation/url_loading_system/downloading_files_in_the_background)
* [URLSession](https://developer.apple.com/documentation/foundation/urlsession)
  * [URLProtocol](https://developer.apple.com/documentation/foundation/urlprotocol)
