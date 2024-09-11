---
title: Global Actor
thumbnail: ''
draft: false
tags:
- swift
- actor
- concurrency
created: 2024-06-20
---

# 개념

 > 
 > 특정 작업이 **전역적으로 단일 스레드에서 실행되도록 보장하는 장치**

* 우리는 `@MainActor`라는 키워드만 추가하게 되면 main thread에서 동작한다는 것을 보장할 수 있다. 
* 어떻게 가능한 것일까?

# MainActor

````swift
@globalActor 
final public actor MainActor: GlobalActor {  
  
	public static let shared: MainActor  
    
	@inlinable nonisolated final public var unownedExecutor: UnownedSerialExecutor { get }  
  
	@inlinable public static var sharedUnownedExecutor: UnownedSerialExecutor { get }  
  
	@inlinable nonisolated final public func enqueue(_ job: UnownedJob)  
  
	public typealias ActorType = MainActor  
}

````

* MainActor는 GlobalActor를 채택하고 있음을 확인할 수 있다.
* 해당 actor는 자신의 고유한 실행흐름을 가지고 있으며, 전역적으로 해당 실행흐름을 특정 함수나 프로퍼티에 선언하여 처리가 가능하다.

# Customization

````swift
@globalActor actor UserProfileActor {  
	static var shared = UserProfileActor()  
}
````

* 그렇다면 고유의 실행흐름을 가지는 Actor 역시 만들 수 있을 것이다.

## Usage

````swift
@MainActor  
final class UserViewModel {  
	func updateProfilePhoto() {  
		print("Update the profile photo done on MainThread: \(Thread.isMainThread)")  
		print("Update the profile photo done on Thread: \(Thread.current)")  
	}  
  
	@UserProfileActor  
	func fetchProfilePhoto() async {  
		print("Fetch the profile photo done on MainThread: \(Thread.isMainThread)")  
		print("Fetch the profile photo done on Thread: \(Thread.current)")  
		await updateProfilePhoto()  
	}  
}
````

````
Fetch the profile photo done on MainThread: false  
Fetch the profile photo done on Thread: <NSThread: 0x600000c34940>{number = 7, name = (null)}  
  
Update the profile photo done on MainThread: true  
Update the profile photo done on Thread: <_NSMainThread: 0x600000c280c0>{number = 1, name = main}
````

* 두 개 이상의 Annotation을 설정하고 실행했을 때의 결과이다.
* 함수에 설정하는 것에따라 실행흐름이 바뀌는 것을 확인할 수 잇다.

# Reference

* [GlobalActor](https://developer.apple.com/documentation/swift/globalactor)
* [SE-0316 Global Actors](https://github.com/apple/swift-evolution/blob/main/proposals/0316-global-actors.md).
* [How to use Swift @MainActor and @globalActor](https://blog.devgenius.io/how-to-use-mainactor-and-globalactor-d5fd3794903d)
