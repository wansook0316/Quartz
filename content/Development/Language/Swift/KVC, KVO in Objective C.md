---
title: KVC, KVO in Objective C
thumbnail: ''
draft: false
tags:
- KVO
- KVC
- key-value-coding
- key-value-observing
- objective-C
created: 2023-09-30
---

KVC/KVO 는 Apple Framework에서 중요한 부분을 담당한다. 한번 공부해보자.

# Background

[03. Operation Queue](03.%20Operation%20Queue.md)에서 간단하게 알아보았던 적이 있다.

일단 왜 이 개념이 나왔는지에 대해서 이해하기 위해서는 Objective C가 필요하다. MVC 패턴이 최고라고 여겨질 시기.. Controller의 역할은 Model과 View의 Sync를 맞추는 것이었다. 이러한 과정에서 Controller가 해야하는 일은 두가지이다.

1. Model의 변화를 View에 반영한다.
1. View의 Interaction을 바탕으로 Model에 반영한다.

이러한 과정에 있어서 상태값을 결국 동기화해주는 문제에 직면하게 된다. Action이 일어날 때마다 이를 일일히 업데이트해주기 보다는 묶어서 서로 업데이트하도록 해두면 편하지 않을까? 이러한 점에서 Objective C 시절 나온 개념이라고 이해하면 된다. 

# Key Value Coding

 > 
 > 문자열 식별자를 사용하여 객체의 프로퍼티에 간접적으로 액세스하기 위한 메커니즘

위의 문제 배경으로 부터 이를 해결하기 위해 첫번째 개념이 등장한다. 

KVC는 `NSKeyValueCoding`이라는 protocol을 사용한다. 이 protocol은 접근자 getter와 setter를 제공한다. 이 protocol에서 제공하는 setter를 사용해야, observer들에게 값을 보낼 수 있다.(KVO와 연결)

* getter Method
  * `valueForKey:`
  * `valueForKeyPath`
* setter Method
  * `setValue:forKey:`
  * `setValue:forKeyPath`

Key로 들어가는 녀석들은 특정 규칙이 있다.

* ASCII Encoding이어야 한다.
* 소문자로 시작해야 한다.
* 공백이 없어야 한다.

````swift
id address = [person valueForKey:@"address"];
id town = [address valueForKey:@"town"];
````

Key를 가지고 객체의 값을 가져오는 예제이다. 보면 객체의 property에 직접 접근(`ObjectInstance.property`)하지 않고 문자열을 통해서 값을 가져오는 것을 확인할 수 있다.

````swift
id town = [person valueForKeyPath:@"address.town"];
````

다음은 KeyPath를 사용한 예제이다. 차이점을 알겠는가? 인스턴스에 직접 접근하지 않고, `.`을 포함한 문자열을 통해 간접적으로 property를 가져오고 있다.

# Key Value Observing

 > 
 > 다른 객체의 특정 프로퍼티에 대한 변경 사항을 알림 받을 수 있는 메커니즘

KVO는 KVC를 기반으로 하고 있다. 즉, 특정 값을 관찰하는데 있어서 KVC를 사용한다는 것이다. 그렇다면 어떻게 Observing할 수 있는지, remove할 수 있는지만 알면 된다.

````swift
[self addObserver:self
       forKeyPath:@"someView.frame"
          options:0
          context:NULL];
````

위의 예는 특정 View의 frame 값을 observing 하는 코드를 적어둔 것이다. KeyPath를 사용하여 값을 관찰할 수 있다.

````swift
[self removeObserver:self forKeyPath:@"someView.frame"];
````

사용이 끝난 시기에 지워주는 것도 잊지 말아야 겠다.

# Reference

* [About Key-Value Coding](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/index.html#//apple_ref/doc/uid/10000107-SW1)
* [Key-value coding](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/KeyValueCoding.html)
* https://jcsoohwancho.github.io/2019-11-28-Key-Value-Coding(KVC)/
* [Understanding KVC and KVO in Objective-C](http://hongchaozhang.github.io/blog/2015/08/13/Understanding-KVC-and-KVO/)
* [what's the difference between single key and keypath?](https://stackoverflow.com/questions/4269568/whats-the-difference-between-single-key-and-keypath)
