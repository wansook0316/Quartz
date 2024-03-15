---
title: Timer
thumbnail: ''
draft: false
tags:
- timer
- swift
- RunLoop
created: 2023-09-30
---

이전 글에서 [RunLoop](RunLoop.md)에 대해 알아보았다. Timer도 같이 처리한다 했었는데, 이번에는 Timer에 대해서 알아보려한다.

# Timer

 > 
 > 특정 시간 간격이 지난 후, Target 객체로 메시지를 전송한다.

문서를 읽어보니, Run loop는 Timer에 대해 **강한 참조**를 유지하기 때문에, Run loop에 타이머를 추가한 후에 강한 참조를 유지하지 않아도 된다고 한다. 이게 무슨말인가 싶어 좀 찾아보니, run loop에 timer를 추가할 수 있는데 그 뒤로는 timer 객체를 들고 있을 필요가 없다라는 말인 것 같다. 하지만 fire를 위해서는 들고 있는 것이 좋을 수도 있다.

그 다음으로 문서에서는 Timer가 실시간 매커니즘이 아니라고 한다. 이는 Run loop에 대해 알아야 한다. 이전 글을 참고하자.

일단 생각해보면, Timer는 Run loop안에서 돌아가는 녀석이다. 그런데 run loop는 input source역시 처리한다. 만약 내가 timer를 main thread에서 처리하도록 한 경우인데, input source가 굉장히 많이 들어온다. 그러면 먼저 쌓여있는 이 이벤트를 처리하려고 할 것이다. 그런데 그와중에 갑자기 timer가 fire되어야 하는 시기가 찾아왔다. 하지만 앞에 쌓인 event가 많기 때문에 실제로 원하는 time interval이 지난 후에 timer가 fire된다. 이러한 점에서 실시간 매커니즘이 아니라는 말을 하는 것이다. 이후 예시들에서 보면 알겠지만, 보통 timer를 사용할 때 선언하는 방식은 암시적으로 main thread에서 처리된다. 그렇기 때문에 이렇게 real time이 아닐 수 있다는 점을 아는 것은 중요할 수 있다. (그렇다면 다른 run loop에 timer를 넣을 수 있다는 얘기인가?: 그렇다) 이렇게 timer가 fire되는 시간 간격을 **Timer Tolerance**라 한다.

Timer 객체는 CFRunLoopTimer와 연결된다고 한다. 정확하지는 않으나, 이렇게 Type casting을 하는데 있어 cost가 없이 작업을 할 수 있는 개념을 Toll-Free Bridging이라 부른다고 한다. Objective C와 관련된 개념이라 일단 넘어간다.

# Comparing Repeating and Nonrepeating Timers

일단 타이머에서 가장 큰 분류는 이것으로 말할 수 있다. 반복하느냐, 반복하지 않느냐.

## Repeating Timers

반복 타이머의 경우 특정 반복시간을 기준으로 스케줄링 된다. 5초마다 fire를 원하는 경우, 일단 예정된 fire 일정은 5초간격으로 잡히게 된다. 그런데 해당 run loop에 다른 event들이 많이 쌓여 있는 경우 어느정도는 delay된다. 그 delay 수준이 time interval보다 넘어간 경우에는 그 시간동한 **한번만** fire된다. 

````swift
let timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(fireTimer), userInfo: nil, repeats: true)

@objc func fireTimer() {
    print("Timer fired!")
}
````

위 방식은 `@objc`를 사용했기 때문에 Target/Action 방식을 활용한 것이다. 만약 objective c 방식이 아니라면 다음과 같이 사용할 수 있다.

````swift
let timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
    print("Timer fired!")
}
````

해당 함수를 사용할 경우 return value로 Timer를 반환한다. 반복하는 경우 해당 객체를 저장해두어야 추후 `invalidate()`를 할 수 있기 때문에 가지고 있는 것이 좋을 수 있다. 혹은 closure가 호출되는 시점에 invalidate하는 것도 가능하다.

## Nonrepeating Timers

한번 fire후에 자동으로 무효화 된다. 그렇기 때문에 내가 한번만 사용할 것이라면 이녀석을 사용하는 것이 좋다. 

````swift
let timer1 = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(fireTimer), userInfo: nil, repeats: false)

let timer2 = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: false) { timer in
    print("Timer fired!")
}
````

이런식으로 argument에 추가하여 사용할 수 있다. 그런데 굳이 한번만 사용한다면 이렇게 할 필요가 없다.

````swift
DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
    print("Timer fired!")
}
````

# Ending the timer

아까도 말했지만, closure를 사용하는 경우 timer 객체를 주기 때문에, 그 안에서 종료 처리를 할 수 있다. `guard`문 같은 걸로 ealry exit를 처리할 수도 있겠다.

````swift
var runCount = 0

Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
    print("Timer fired!")
    runCount += 1

    if runCount == 3 {
        timer.invalidate()
    }
}
````

# Adding Context

이건 Target/Action 방식을 사용할 경우, 즉, Objective c runtime에서 처리할 경우에 사용할 수 있는 함수이다. Timer가 발동되어 특정 함수를 실행시길 때, Timer 객체가 같이 넘어가게 되는데, 거기에 원하는 context 정보를 넣어서 처리할 수 있다.

````swift
let context = ["user": "@wansook"]
Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(fireTimer), userInfo: context, repeats: true)

@objc func fireTimer(timer: Timer) {
    guard let context = timer.userInfo as? [String: String] else { return }
    let user = context["user", default: "Anonymous"]

    print("Timer fired by \(user)!")
    runCount += 1

    if runCount == 3 {
        timer.invalidate()
    }
}
````

# Timer Tolerance

Timer는 기본적으로 runloop안에서 돌아가기 때문에, event의 쌓여있는 정도에 따라 실행되는 시간에 영향을 미친다. 그렇기 때문에 system입장에서는 이 시간을 잘지키기 위해 스케쥴링을 잘해야 하는데, 이게 cost가 들어가는 작업일 수 밖에 없다.

이러한 점에서 Apple은 약간의 유도리를 부여해준다면 좀 더 전력 사용량에 도움이 될거라고 한다. 그게 바로 이 개념이다. 

````swift
let timer = Timer.scheduledTimer(timeInterval: 5.0, target: self, selector: #selector(fireTimer), userInfo: nil, repeats: true)
timer.tolerance = 0.5
````

![](Swift_19_Timer_0.png)

5초 반복 timer를 만들었다고 가정해보자. 기본적으로는 tolerance가 0이기 때문에 system은 최대한 이 기준을 맞추려고 노력한다. 그래서 힘들어한다. 여기서 내가 tolerance를 0.5초로 지정해주면 약간의 숨통이 트인다. 일단은 최대한 tolerance가 0에 맞추는 걸 노력하되, 어쩔 수 없는 시점에서는 tolerance를 보고 유도리있게 처리한다.

여기서 맹점은 실행시간이 늦춰졌다고 해서 다음 실행시간이 늦춰지는 것은 아니라는 점이다. 유도리있게 처리한다는 게 딱 맞는 설명이다.

# Working with RunLoop

Tolerance까지 이해했다면 한가지 의문점이 들 수 있다. 그럼 input source가 계속해서 들어오면 timer가 작동하지 않을 수도 있는데, 이거 문제아닌가? 사용자 경험을 해치는 것 아닌가??

맞다. 그런 경우가 있을 수 있다. 일단 Timer 객체는 기본적으로 우리가 사용하는 방식이 Main Thread에 넣는 방식이다. 그렇게 되니 사용자의 interaction이 많이 들어오면 timer가 발동되지 않는다. 대표적으로 Scroll이 있겠다. 손을 대고 천천히 계속해서 움직인다면 system은 계속해서 event를 내보낼 거고, 그걸 처리하는 곳은 main runloop이다. 그러면 timer가 발동되어야 하는 시점에 발동이 못되는 경우도 있을 수 있다.

이런 경우 우리가 선택할 수 있는 방법은 내가 원하는 runloop에서 timer를 발동시키는 것이다. 

````swift
let timer = Timer(timeInterval: 1.0, target: self, selector: #selector(fireTimer), repeats: true)
RunLoop.current.add(timer, forMode: .common)
````

이 개념은 반복하지 않는 timer에도 적용할 수 있는데, 이 경우에는 DispatchQueue를 global queue로 바꿔서 실행시키는 것이 보다 나은 방법이라 생각된다.

````swift
DispatchQueue.global.asyncAfter(deadline: .now() + 1) {
    print("Timer fired!")
}
````

# 마무리

이렇게 Timer에 대해서 정리해보았다. Cheeting note가 될 듯하다. 끝!

# Reference

* [Timer](https://developer.apple.com/documentation/foundation/timer)
* [Threading Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Multithreading/Introduction/Introduction.html#//apple_ref/doc/uid/10000057i)
* [add(\_:forMode:)](https://developer.apple.com/documentation/foundation/runloop/1418468-add)
* [The ultimate guide to Timer](https://www.hackingwithswift.com/articles/117/the-ultimate-guide-to-timer)
* [Toll-Free Bridging](https://developer.apple.com/library/archive/documentation/General/Conceptual/CocoaEncyclopedia/Toll-FreeBridgin/Toll-FreeBridgin.html#//apple_ref/doc/uid/TP40010810-CH2)
