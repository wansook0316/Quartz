---
title: Request-Driven
thumbnail: ''
draft: false
tags:
- architecture
- request-driven
created: 2023-10-01
---

![](TechTalks_13_EventDriven_RequestDriven_0.png)

특정 데이터를 서버로부터 받고 싶다고 하자. 일반적인 REST API를 사용한다면 서버에 `GET` 요청을 하고, 그 결과로 json 데이터를 받을 것이다. 이렇게 일반적으로 가장 많이 사용하는 Server 통신 방식이 Request-Driven 방식이라 생각하면 된다. 그런데 이런 Request-Driven 방식도 맞지 않는 기술 선택일 수 있다.

![](TechTalks_13_EventDriven_RequestDriven_1.png)

만약 요청의 결과가 시간이 필요한 작업이라면, 그 작업이 끝나는 시기에 Client는 Server에 주기적으로 질의해야 한다. 이는 Block-NonBlock 방식을 얘기할 때, 비동기로 처리되나 작업의 완료시점을 알기 위해 작업을 요청한 thread에서 작업을 하고 있는 thread에 계속해서 완료 시점을 점검하는 것과 유사하다. 

직관적으로 보았을 때, 이러한 처리가 필요한 task에서 위와 같은 Request-Driven 방식을 사용하는 것은 좋지 않다.

Request-Driven 방식은 **필요한 시점에 정보를 요청**하고, 그에 맞는 데이터를 받아 처리하는 방식이다. 서버에서 데이터를 이미 가지고 있어 **제공만 하면 되는 경우** 이 방식이 Resource를 적게 먹기 때문에 좋은 방식이라 할 수 있겠다.

# Reference

* [Event-Driven](Event-Driven.md)
* [Event-Driven vs Request-Driven (RESTful) Architecture in Microservices](https://www.techtalksbyanvita.com/post/event-driven-vs-request-driven-rest-architecture)
* [Event-driven vs REST API interactions](https://blog.axway.com/amplify-products/api-management/event-driven-vs-rest-api-interactions)
* [Streaming API](https://developer.mozilla.org/ko/docs/Web/API/Streams_API)
* [Web Hook](https://en.wikipedia.org/wiki/Webhook)
* [Event-Driven-Architecture란?](https://jaehun2841.github.io/2019/06/23/2019-06-23-event-driven-architecture/#Event-Driven-%EB%9E%80)
