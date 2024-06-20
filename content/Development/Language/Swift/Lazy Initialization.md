---
title: Lazy Initialization
thumbnail: null
draft: false
tags:
- swift
- lazy
- initialization
created: 2024-06-20
---


 > 
 > Global, Static 변수에 대해 **사용시에 초기화 되는 방법**

# eager

* 앱 시작시 생성됨
* 장점
  * 단순하다.
  * data race 문제 없다.
* 단점
  * 초기 로딩시 느리다.

# lazy

* 사용시에 초기화됨
* 장점
  * 초기 로딩시 필요없는 것들을 로딩하지 않아 빠르다.
* 단점
  * Data race를 발생시킬 수 있다.
  * 어느 스레드에서 초기접근하여 생성될지 알수가 없다.
  * 생성되는 스레드가 2개이상인데, 동시에 접근한다면 crash다.

# Apple에서는..

* C, Objective C -> eager initialization
* Swift -> lazy initialization

# Data race 문제는 어떻게 해결?

* 두개 이상의 스레드에서 동시접근 한 경우 
* **하나의 스레드에서만 초기화가 가능하다.**
* 다른 스레드에서는 block하고, 대기한다.
