---
title: Parallelism
thumbnail: ''
draft: false
tags:
- parallelism
- data-parallelism
- task-parallelism
created: 2023-10-01
---


 > 
 > 같은 일을 여러 사람이 동시에 하는 것

***군대 삽질 분대가 다같이***

***행위는 하나, 주체는 여러개***  
병렬성은 [Concurrency](Development/Concepts/Concurrency.md)에 포함된다.

![](TechTalks_22_ConcurrencyParallelism_0.png)
![](ConcurrentProgramming_01_ConcurrencyThread_0.jpg)

# Parallelism

* 진짜 병렬
* 물리적으로 2개 이상의 코어에서 작업이 이루어지는 것
* 순수하게 정말 "동시"에 두개의 작업을 실행할 수 있음

## 데이터 병렬성

* 전체 데이터 -> 서브 데이터들
* 각각의 서브 데이터들에 대해 병렬 처리
* 코어 개수만큼 물리적으로 동시에 실행됨

## 작업 병렬성

* 서로 다른 작업을 병렬 처리
* 웹 서버의 경우 각각의 브라우저에서 요청한 내용을 개별 스레드에서 병렬로 처리함

# Reference

* [Concurrency](Development/Concepts/Concurrency.md)
