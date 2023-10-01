---
title: print vs NSLog
thumbnail: ''
draft: false
tags: null
created: 2023-09-30
---

print와 NSLog는 어떤 차이점이 있을까?

Log를 사용해야 하는 이유는 [Why we should use Log](Why%20we%20should%20use%20Log.md)를 참고하자.

# 예시

````swift
let array = [1, 2, 3, 4, 5]
print(array)
NSLog(array.description)
````

````
[1, 2, 3, 4, 5]
2017-05-31 13:14:38.582 ProjetName[2286:7473287] [1, 2, 3, 4, 5]
````

# print vs. NSLog

|`print`|`NSLog`|
|-------|-------|
|- `String` 제외 타입도 출력 가능 <br> - Device console에서만 출력됨 <br> - `NSLog`보다 빠름 <br> - Single Thread.|- `String` 타입만 출력 가능 <br> - Time Stamp와 Project 이름이 같이 출력됨 <br> - Device, Debugger Console 모두에서 출력됨 <br> - `print`보다 느림 <br> - Multi Thread 지원, Thread Safe|

# 더 알아보기

* 이제는 WWDC 2020에 나온 Logger를 사용하는 것이 좋다.
* 이는 추후 정리해볼 예정

# Reference

* [print vs NSLog](https://riptutorial.com/swift/example/30983/print-vs-nslog)
* [Explore logging in Swift](https://developer.apple.com/videos/play/wwdc2020/10168/)
* [Why We Should Use Logger](https://velog.io/@wansook0316/Why-We-Should-Use-Logger)
