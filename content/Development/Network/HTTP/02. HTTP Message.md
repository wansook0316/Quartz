---
title: HTTP Message
thumbnail: ''
draft: false
tags:
- CR
- Carriage-Return
- LF
- Line-Feed
created: 2023-10-01
---


````
Request-Line OR Status-Line
[Header CRLF]
CRLF
[ Body ]
````

# Start Line

* `Request`
* `Response`

# Header

* 헤더 중 X가 붙은 경우, 커스텀 헤더임
* `Pragma`: 옛날 캐시 정책 Deprecated
* `Cache-Control`: 캐시 정책인데, 기능이 추가된 것들
* `Connection`: close, keep-alive 두 개의 옵션이 있음

## Stateless Protocol

* HTTP는 상태가 없는 프로토콜이다.
  * 즉, 이전 Request에 대해서 고려하지 않는다는 것
    * 터미널 같은 경우, 이전 요청에 종속적인 결과를 줌
  * TCP 통신을 하게되면 연결과정에 오버헤드가 생김
  * 그런데 어차피 계속 요청, 응답을 할거라면 요청 보낼때마다 이를 연결하고 끊는 것은 비효율적
  * 그래서 해당 헤더가 있다.
  * 그런데 이게 문제가 있을 수도 있다.
  * 대용량 서비스 같은 경우에 해당 옵션을 킨다는 것은 소켓하나를 점유하고 있다는 것이기 때문
  * 만약 특정 이벤트를 진행해서 순간적으로 사람들이 엄청 몰린다고 해보자. 이 상황이면 켜는 것이 좋을까, 끄는 것이 좋을까?
    * 끄는 경우
      * 더 많은 클라이언트들 처리할 수 있다.
    * 키는 경우 (요즘)
      * 근데 끄게 되었을 때, 문제가 생기는데 페이지는 떴지만, 이미지는 뜨지 않는 상황이 발생했다.
      * 다시 재요청을 하는데, 그럴 경우 해당 요청이 뒤로 밀리게 되기 때문
      * 즉, 이렇게 되면 한사람이 느끼는 서비스 품질이 상당히 떨어지게 된다.
      * 보통 들어와서 사이트 전체를 보고, 로그인을 하든 어떠한 행동을 취하는 것까지가 하나의 액션이기 때문이다.
      * 그렇기 때문에 요즘에는 keep alive를 키되, 해당 연결 지속 시간을 줄이는 것으로 변화하는 추세이다.

# Blank Line

* header와 body를 구분해주는 라인이다.
* CR (Carriage return)
  * `\r`
  * Ascii 13
* LF (Line Feed)
  * `\n`
  * Ascii 10
* 타자기에서 발생한 어원
  * 이전에는 종이가 움직이고 아이핑하는 것은 타자기의 중앙에 위치했음
  * 이 때, 종이를 움직이게 만드는 것을  `carriage`라 불렀음
  * 한줄을 다 치게되면, 왼쪽으로 옮겨졌던 종이를 다시 오른쪽으로 옮겨야 함
    * 이 과정에서 나온 것이 Carriage return
  * 또 다음줄을 쳐야했기 때문에 종이를 위로 올려야 함
    * 이 과정에서 나온 것이 Line feed
* 현재
  * 이제는 Carriage Return을 할 필요가 없음
  * Line Feed만 사용하면 의미를 충분히 전달할 수가 있음
  * 하지만..
    * Window: CRLF 사용 `\r\n`
    * Unix 계열: LF만 사용 `\n`
    * 에디터에서는 이를 똑같이 인식해주나, 이전 HTTP 메시지를 직접 작성한 경우, `\r\n` 이 없어서 곤역을 치렀던 경험이 있음

# Body

* 텍스트 데이터
  * 일반 텍스트, JSON, XML, HTML 등

2. 이진 데이터
   * 이미지, 오디오, 비디오 등
2. 폼 데이터
   * HTML 폼을 통해 제출된 데이터
2. 기타 형식
