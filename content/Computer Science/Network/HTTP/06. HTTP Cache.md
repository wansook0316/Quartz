---
title: HTTP Cache
thumbnail: ''
draft: false
tags:
- cache
- HTTP
- fresh
- stale
created: 2023-10-01
---

# 언제 사용할까?

* Conditional GET을 이용하여 트래픽은 줄일 수 있으나, Round Trip은 줄일 수 없다.
  * Round Trip
    * 패킷이 보내지고 응답을 받을 때까지 걸리는 시간
* 즉, 리소스의 변경 사실을 확인하기 위해서라면 원 서버에 요청을 보내고 응답을 기다려야 한다.
* 원 서버가 멀리 있다면 이 지연이 수백 ms일 수 있다.
* 이 지연까지 줄이고 싶어 탄생하게 된 개념

# 용어

* Fresh (신선한): freshness_lifetime > current_age
* Stale (상한): freshness_lifetime \<= current_age

# 브라우저 캐시

* 캐시된 응답이 아직 fresh한 경우
  * 브라우저 내에 저장된 값 반환 (Read from disk)
* 캐시된 응답이 stale한 경우
  * 서버로 요청을 보냄 (Validation)
    * 리소스 변경이 없는 경우
      * 304 Not Modified
      * body 없음
    * 리소스 변경이 있는 경우
      * 200 ok
      * body 있음

# Cache-control

* 예전에 Pragma로 사용
* HTTP 1.1 Spec
* 해당 캐시 동작을 변경하고 싶다면 서버에서 해당 헤더를 변경하면 된다.
* Expire의 경우 절대 시간 표현이나 해당 헤더는 상대시간 표현 가능
