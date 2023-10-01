---
title: Event-Driven
thumbnail: ''
draft: false
tags:
- event-driven
- architecture
created: 2023-10-01
---

![](TechTalks_13_EventDriven_RequestDriven_2.png)

이러한 문제에 대해 가장 쉬운 해결 방법은 서버쪽에서 Ready 상태일 때, client로 정보를 밀어넣어주는 것이다. 이렇게 처리할 경우, 이제 정보 제공 Event는 Server로부터 시작된다고 할 수 있다. 이렇게 Event 발생시 Client쪽으로 데이터를 넘겨주는 방식을 WebHook이라 한다. 

![](TechTalks_13_EventDriven_RequestDriven_3.png)
webHook이 event 발생시 client로 데이터를 넣어주는 방식이라면, 연결 후 계속해서 데이터를 넣어주는 Streaming API도 있다.

이렇게 설명하면 Socket 통신과 비슷한 것 아니냐는 질문을 할 수도 있을 것 같다. 하지만 Socket의 경우는 **양방향** 통신, 즉 client 쪽에서도 정보를 보내고 받을 수 있으나, WebHook 또는 Streaming API의 경우 Client로 데이터를 보내는 단방향 통신에 사용된다. 

작업 처리에 시간이 걸리는 경우, 특정 이벤트가 발생했을 시 처리되어야 하는 경우, 계속해서 데이터를 밀어넣어주어야 하는 경우에는 Event-Driven 방식을 통해 Event 발생 시 데이터를 전송하는 것이 Resource를 아낄 수 있는 좋은 방법이라 할 수 있다.

# Reference

* [Request-Driven](Request-Driven.md)
* [Event-Driven vs Request-Driven (RESTful) Architecture in Microservices](https://www.techtalksbyanvita.com/post/event-driven-vs-request-driven-rest-architecture)
* [Event-driven vs REST API interactions](https://blog.axway.com/amplify-products/api-management/event-driven-vs-rest-api-interactions)
* [Streaming API](https://developer.mozilla.org/ko/docs/Web/API/Streams_API)
* [Web Hook](https://en.wikipedia.org/wiki/Webhook)
* [Event-Driven-Architecture란?](https://jaehun2841.github.io/2019/06/23/2019-06-23-event-driven-architecture/#Event-Driven-%EB%9E%80)
