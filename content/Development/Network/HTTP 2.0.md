---
title: HTTP 2.0
thumbnail: ''
draft: false
tags: null
created: 2023-10-01
---


 > 
 > HTTP/1.1 보다 빠름

# Header Compression

* [Huffman Coding](https://ko.wikipedia.org/wiki/허프먼_부호화)
* Header Tables

# Multiplexed Streams

 > 
 > 한 커넥션으로 동시에 여러 개의 메세지를 주고 받을 수 있으며, 응답은 순서 상관없이 Stream 으로 주고 받음

![](image.png)

* HTTP/1.1
  
  * TCP 커넥션 1개를 연다.
  * HTML 문서 1개응 요청해서 받는다.
  * TCP 커넥션 7개를 더 연다.
    * PNG 파일 8개를 받는다.
    * PNG 파일 3개를 받는다.
    * PNG 파일 3개를 받는다.
  * 사실 이렇게 한 이유는, 브라우저 당 Connection 개수에 제한이 있기 때문
  * 클라이언트 입장에서 Connection 수를 정해놓지 않으면, 지나치게 리소스를 많이 사용할 수 있기 때문에
  * 서버 입장에서는 무리하게 요청이 들어올 것 같기 때문에
* HTTP/2
  
  * TCP 커넥션 1개를 연다.
  * HTML 문서 1개를 요청해서 받는다.
  * PNG 파일 13개를 요청해서 받는다.
  # Server Push
  
  * 안할 경우
    * TCP 커넥션 1개를 연다.
    * HTML 문서 1개를 요청해서 받는다.
    * 그림 파일 2개를 요청해서 받는다.
  * 할 경우
    * TCP 커넥션 1개를 연다.
    * HTML 문서 1개를 요청해서 그림 파일 2개와 함께 받는다.
  # Stream Priority
  
  * 응답을 줄 때, 우선순위를 지정해서 줄 수 있음
  * 의존성 지정 안하면
    * TCP 커넥션 1개 연다.
    * HTML 문서 1개 요청하여 받는다.
    * CSS 문서 1개와 그림파일 2개를 요청해서 받는다.
    * CSS 문서가 늦게와서 렌더링이 늦어진다.
  * 의존성 지정하면
    * TCP 커넥션 1개 연다.
    * HTML 문서 1개 요청하여 받는다.
    * CSS 문서 1개와 그림 파일 2개를 요청해서 받는다.
      * 이 떄, 그림파일이 CSS에 의존성이 있다고 설정한다.
    * CSS 문서가 가장 먼저 도착하고, 순조로운 렌더링이 가능하다.
