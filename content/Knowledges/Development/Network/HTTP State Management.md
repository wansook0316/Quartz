---
title: HTTP State Management
thumbnail: ''
draft: false
tags:
- HTTP
- state
- management
- cookie
- authentication
- IP
created: 2023-10-01
---

# HTTP에서 상태가 필요한 이유

* 로그인이 되게 하고 싶다.
* 쇼핑몰 로그인이 아니어도 카트 목록을 기억하게 하고 싶다.

# 해결 방법

## Fat URL

````
- URL에 상태 정보를 모두 집어 넣기
- URL을 파싱해서, 사용자의 상태를 확인한다.
- 하지만 사용하지 않음
````

## IP 추적

````
- 클라이언트 IP를 보고 어떤 상태였는지 기억
````

## Authentication

````
- HTTP 인증 메커니즘 사용 (Basic Authentication)
````

## Cookie

* 서버가 쿠키를 생성하라는 명령을 내리고, 클라이언트가 만들어서 클라이언트(브라우저)에 저장하는 값
* User Agent가 알아서 저장한다.
* 생성 후에 서버는 세션을 생성하고, 이 쿠키를 통해 어떤 세션과 연결되어 있는지 판단한다.

### 방식

* Set-Cookie 응답 헤더를 통해 서버에서 클라이언트에 보냄
* 클라이언트는 쿠키를 보관하고 있다가 필요할 때 Cookie 헤더를 통해 서버에 보냄
* 응답 헤더
  * `Set-Cookie: Name=Value; expires=DATE; path=PATH; domain=DOMAIN_NAME; secure`
* 요청 헤더
  * `Cookie: NAME1=OPAQUE_STRING1; NAME2=OPAQUE_STRING2 ...`

### 종류

* Session Cookie
  * 브라우저 닫으면 사라짐
  * 탭을 닫으면 사라짐
* Persistent Cookie
  * Domain 지정 여부에 따라 동작이 다름
  * 보통 사용하는 쿠키

### 어떤 값을 담으면 좋을까?

* 정말 기본적인 값
* 보안적으로 문제가 생김
* 카트 정보, 물품 정보들을 이전에 담았었으나, 이제는 그것도 개인정보라 판단하여 넣지 않음
