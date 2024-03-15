---
title: HTTP Transaction
thumbnail: ''
draft: false
tags:
- HTTP
- transaction
- TCP
created: 2023-10-01
---

`www.example.org/index.html` 을 GET 요청 한 상황을 가정해보자.

1. 서버는 80번 포트를 열고 요청을 대기한다.
1. 클라이언트는 웹 브라우저 주소창에 URL을 입력한다.
1. 웹 브라우저는 DNS에 물어보고 해당 URL Host의 아이피를 알아낸다.
1. 알아낸 IP와 포트번호 80(HTTP 기본)으로 TCP Connection을 연다.
1. 웹 브라우저는 열린 TCP Connection에 `GET /index.html HTTP/1.1` 요청을 보낸다.
1. 서버는 TCP Connection을 통해 들어온 `GET /index.html HTTP/1.1`을 읽고 index.html을 요청함을 확인한다.
1. 서버는 `/index.html`의 내용을 본문으로 하는 HTTP 응답 메시지를 만들어 이를 클라이언트에게 보내주기 위해 TCP Connection에 쓴다.
1. 클라이언트는 HTTP 응답 메시지의 본문을 `Content-Length`만큼 읽고, `Content-Type`의 값(`text/html`)을 읽어 본문을 HTML로 렌더링한다.
