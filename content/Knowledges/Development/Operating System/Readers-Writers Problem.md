---
title: Readers-Writers Problem
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

Readers-Writers 문제는 대표적으로 공통 데이터베이스에 접근하는 경우가 있다. 하나의 데이터베이스에 여러 프로세스(readers, writers)가 접근하므로, 데이터베이스는 임계구역으로 설정해야한다. 즉, 한 번에 한 개의 프로세스만 접근가능하도록 해야하는데 이는 매우 비효율적이다.

비효율을 해결하기 위해 데이터베이스에 **접근하는 프로세스 종류를 reader와 writer로 나눈다.** 그리고 reader는 데이터베이스 내의 정보를 바꾸지 않고 **읽기만 하는 프로세스**이므로, 여러 reader 프로세스가 동시에 데이터베이스를 접근하는 것을 허용한다. writer는 데이터베이스 내용을 바꾸는 프로세스이므로 당연히 **mutual exclusion 을 보장**해야한다.

# 2.1 분류

Readers-Writers 문제는 우선순위에 따라 여러 경우로 나눌 수 있다.

1. The first R/W problem (readers-preference): 이 방법은 reader 프로세스에 우선권을 주는 것이다. 만약, 한 reader 프로세스가 데이터베이스를 읽고 있는 동안 writer 프로세스가 오면 당연히 접근하지 못하고 기다린다. 이 상황에서 다른 reader 프로세스가 들어온다면, writer 프로세스가 기다리는 것을 무시하고 데이터베이스에 접근하여 읽는다. 그 결과, 두 reader가 동시에 데이터베이스를 읽는 상황이 된다.
1. The second R/W problem (writers-preference): 위 방법과 반대로 writer 프로세스가 기다리는 상황에서 다른 reader 프로세스가 들어온다면, 기존의 writer 프로세스 다음 순서로 기다려야한다.
1. The third R/W problem: 아무에게도 우선순위를 주지 않는다.

# Reference

* [KOCW 양희재 교수님 - 운영체제](http://www.kocw.net/home/search/kemView.do?kemId=978503)
* [양희재 교수님 블로그(시험 기출 문제)](https://m.blog.naver.com/PostList.nhn?blogId=hjyang0&categoryNo=13)
* [codemcd 님의 정리글](https://velog.io/@codemcd/)
* Operating System Concepts, 9th Edition - Abraham Silberschatz
