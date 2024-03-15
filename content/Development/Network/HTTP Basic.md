---
title: HTTP Basic
thumbnail: ''
draft: false
tags:
- HTTP
- HTTPS
- protocol
created: 2023-10-01
---

HTTP 관련 내용은 사실 읽어도 읽어도 잘 머리에 안남는 것 같다. 사실 전반적인 흐름은 아는데, 뭔가 단어들이 기억에 잘 남는다는 느낌은 안들었었다. 다시한번 정리하면서 반복학습을 할 목적으로 포스팅을 남겨본다.

# HTTP 란?

* HyperText Transfer Protocol
* 응용 레벨의 프로토콜 (OSI 7)
* HTTP는 **신뢰**할만한 전송 또는 세션 레이어의 \*\*연결(Connection)\*\*을 통해 메시지를 주고 받는 **상태가 없는 (Stateless)** 요청/응답 프로토콜이다.
* HTTP 클라이언트
  * 서버와 연결을 맺고, 하나 이상의 HTTP 메시지를 보내는 프로그램
* HTTP 서버
  * 클라이언트의 연결을 수락하고 (연결을 맺고)
  * HTTP 요청을 처리하여 응답을 보내주는 프로그램

# HTTP Protocol 특징 (간략)

![](Pasted%20image%2020231004130726.png)

1. Message 종류 두 가지
   * Request & Response
1. TCP 사용
   * Transport Layer 위에 Application Layer 존재
1. stateless protocol
   * 상대방 상태정보를 저장하지 않음
   * 그냥 request, response후 아무것도 저장 안한다.

# 역사

* HTTP v0.9 (1996)
* HTTP v1.0 (1996)
  * RFC2616
  * URL과 URI의 차이
    * URL (Uniform REsource Locator)
      * URI의 한 종류
      * scheme이 http인 경우의 URI를 URL이라 함
    * URI (Uniform Resource Indicator)
      * 자원의 위치를 알려주는 문자열
  * 날짜 포맷
    * 3가지의 날짜 포맷을 지원
    * RFC 1123: 가장 많이 사용
      * Sun, 06 Nov 1994 08:49:37 GMT
    * RFC 1036
      * Sunday, 06-Nov-94 08:49:37 GMT
    * asctime
      * Sun Nov  6 08:49:37 1994
* HTTP v1.1 (1999)
  * [working group](http://httpwg.org)
    * wg (working group)
    * 예외 케이스를 개정하는 작업을 했던 곳
    * 문서를 개정해서 만듦
    * 상세하게 보고 싶으면 해당 링크에서 확인

# 브라우저에 입력 후 창이 보이기 까지 과정

* PC (Client: User Agent)
  * User agent
    * HTTP 프로토콜 헤더에 있음
    * Mozilla/5.0 ~ 으로 시작하는 녀석
    * 이 정보를 왜 줄까?
      * 호환성 때문
      * 옛날에 서버 차원에서 들어온 값에 따라 다르게 보내주는 경우가 있었음
      * 즉, 이 정보 바탕으로 호환되는 결과를 응답으로 줘! 라는 얘기
* [DNS](DNS.md)
* [CDN](CDN.md)
* Server (Origin)
  * Application Server
    * 네트워크를 통해 Endpoint와 통신을 할 수 있는 서버를 말한다.
    * Web Server
      * 주로 HTTP 프로토콜을 처리하는 서버
      * Apache
        * 정적인 처리에 특화된 웹서버
        * 정적이란?
          * 미리 서버에 저장된 파일을 제공
          * 어떤 요청이냐에 상관없이 같은 정보를 제공
      * Tomcat
        * Apache와 세트로 다님
        * 동적처리에 주로 사용됨 (정적 처리도 가능)
        * Servelet Container
          * Servelet을 관리하는 역할을 수행
          * 웹서버와 소켓을 만들어 Servet이 통신하는 환경을 제공
          * Servelet이란?
            * 웹에서 자바 프로그래밍 구현을 위해 탄생
            * 클라이언트의 요청에 따라 처리 후 결과를 클라이언트에 보내는 클래스
        * Tomcat을 사용하는 경우 보톤 Web Application Server라 불린다.
        * 흐름
          * Client -> Apache -> Tomcat -> Servelet -> Tomcat -> Apache -> Client
    * Database Server
    * File Server
    * Proxy Server

# HTTP는 어떻게 동작할까?

* HTTP/0.9
  * 메소드 GET 밖에 없음
  * 문서 포맷 HTML만 가능
  * 헤더 없음
  * `GET /test.html`
* HTTP/1.0
  * 메소드 POST 추가
    * 쓰기 가능

# Non-Persistent HTTP

Request Message 를 서버로 보내기 위해선 우선 TCP Connection이 선행되어야 한다. 그리고 request msg 에 대해서 response msg 를 받게되면 TCP Connection 은 끊기며 다시 웹사이트의 리소스를 들고오기 위해선 TCP Connection 을 재차 맺어야한다. Connection 이 지속적인 상태가 아니다.

![](Pasted%20image%2020231004130805.png)
![](Pasted%20image%2020231004131254.png)

1. HTTP client가 IP/PORT에 TCP 연결을 시작한다.
1. HTTP server의 host는 80번 포트에서 TCP 연결을 기다리다가 문제가 없으면 "accept" 라고 client에게 알린다.
1. HTTP client는 HTTP request 메시지를 TCP 연결 Socket에 보낸다.
1. HTTP server는 요청을 받고 response를 socket에 넣는다.
1. HTTP sever는 TCP 연결을 끊는 준비를 한다.
1. HTTP client는 응답을 받고 화면에 보여준다.
1. HTTP client가 다 받았다면 다 받았다는 메시지를 보낸다.
1. 함께 Connection을 끊는다.

# Persistent HTTP

웹클라이언트 (브라우저) 는 보통 같은 사이트에 여러 개의 TCP 커넥션을 맺는다. 예를 들어 웹 페이지에 첨부된 이미지들 대부분은 같은 웹사이트에 있으며, 여러 하이퍼링크도 같은 사이트를 가리키는 경우가 있다. 여기서 서버에 HTTP 요청을 하기 시작한 애플리케이션은 웹 페이지의 다른 이미지 등을 가져오기 위해서 그 서버에 또 다시 요청하는 경우가 생기는데, 이 속성을 사이트 지역성(Site Locality)이라고 부른다. 하지만 이러한 TCP 커넥션을 계속 유지하여 앞으로도 있을 HTTP 요청에 재사용할 수 있도록 하는 것이다. 처리가 완료된 이후에도 계속 연결된 상태로 있는 TCP 커넥션을 Persistent Connection 이라고 한다.
