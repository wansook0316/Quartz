---
title: RunLoop
thumbnail: ''
draft: false
tags:
- swift
- RunLoop
- thread
- timer
created: 2023-09-30
---

RunLoop이란 무엇일까?

# RunLoop

Run loop은 일단 Thread와 관련된 녀석이다. 간단하게 말하면, Run loop은 event를 처리하기 위해 만들어진 loop이다. Timer 또한 함께 처리한다. 하지만 이를 바깥에서 한번 감싼 구조인데, 이렇게 만든 이유는 **할 일이 있을 경우에는 Thread를 busy하게 두고, 그렇지 않을 때는 sleep 하도록 하기 위함**이다.

Run loop의 관리는 자동적으로 되는 것이 아니다. 적절한 타이밍에 thread code를 시작하도록 해야하고, 들어오는 이벤트에 맞추어서 반응하도록 설계해야 한다. Cocoa, Core Foundation에서는 내가 만들고 싶은 thread의 run loop을 쉽게 설정하기 위해 run loop 객체를 제공한다. 즉, **명시적으로 생성해서 사용할 필요가 없다.** 각각의 thread (main 포함)에는 각각의 run loop object를 가지고 있다. main thread의 경우에는 run loop이 계속 돌고 있어서 run할 필요가 없지만, 따로 만든 thread의 경우에는 내가 직접 실행해주어야 한다.

즉, 정리하면

* Run Loop은 Thread마다 각각 있다.
* Main Thread의 Run Loop은 자동적으로 돌아간다.
* 다른 Thread는 그렇지 않다. 그래서 명시적으로 `run()`해주어야 한다.
* RunLoop 객체가 필요하다면, 생성하지 않고 `RunLoop.current` 또는 `RunLoop.main` 등으로 시스템에서 생성된 객체에 접근해야 한다.

# RunLoop의 존재 이유와 원리

핵심은 input source, timer 두가지의 이벤트를 처리하기 위함이다. input source는 다른 Thread나 Application으로 부터 온 **비동기 이벤트**를 전달받는 것을 말한다. Timer source는 scheduled된 시간 혹은 특정 주기를 기준으로 반복되는 **동기 이벤트**를 전달 받는다.

![](Swift_18_RunLoop_0.jpg)

이 그림을 보면, 위는 Input sources이고, 아래는 Timer sources이다. Input sources부터 보면, 왼쪽에 있는 Thread에 작업을 마구 쌓아두고, run loop의 run을 호출하여 쌓여있는 이벤트를 처리하고 있음을 나타내고 있다. 이 때, run loop의 `runUntilDate`를 사용하고 있어, 특정 날짜에 run loop을 종료하도록 하고 있다. 그와 반대로 위 그림에서는 Timer의 경우 event를 전달하지만 run loop가 종료되도록 하지는 않고 있다. 

여기서 보면, run loop의 존재 이유인 **할 일이 있을 경우에는 Thread를 busy하게 두고, 그렇지 않을 때는 sleep 하도록 하기 위함**에 잘 맞는 설계라 볼 수 있다. 명시적으로 programmer가 run하도록 하여 resource를 아끼겠다는 의도가 다분히 보인다.

![](Swift_18_RunLoop_1.png)

loop를 실행시키는 방법은 여러가지가 있다. 상황에 맞게 읽고 사용하면 되겠다.

# Main Run Loop

![](Swift_18_RunLoop_2.jpeg)

사실 우리가 이 RunLoop을 가장 많이 마주하는 곳은 이거다. 이벤트 루프로서 사용자 event를 받아 application에 전달하는, 그 역할을 하는 것이 이녀석이다. 그래서 위에서 설명할 때, main run loop는 항상 run되어있는 상태라고 말했던 것이다. 이 그림에서 run loop의 역할을 생각한다면, 왜 저런식으로 정의를 해두었는지 쉽게 이해가 가능하다.

# 마무리

이 부분을 깊게 이해하는 것은 어려웠다. 두번째인데도 실제 코드를 뜯어보지 못하니 어렵다. 끝!

# Reference

* [Run Loops](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Multithreading/RunLoopManagement/RunLoopManagement.html)
* [RunLoop](https://developer.apple.com/documentation/foundation/runloop)
* [Dive into CFRunLoop](https://suelan.github.io/2021/02/13/20210213-dive-into-runloop-ios/)
