---
title: Less Crash habits
thumbnail: ''
draft: false
tags:
- swift
- objective-C
- crash
- Optional
- force-unwrapping
- index
- out-of-range
created: 2023-10-01
---

# ! 사용하지 않기

Swift 코드에서 !가 보이는 경우는 두가지다. 연산자(!=, not, !==)에서 사용하는 경우는 제외한다.

1. 강제 언래핑
1. 암시적 옵셔널 (IUO: Implicitly Unwrapped Optional)

## 강제 언래핑

이건 뭐 기본적으로 이렇게 사용하지 않는 것에 동의하는 사람이 많으므로 패스.

## Implicitly Unwrapped Optional

````swift
@IBOutlet weak var label: UILabel! // 이거 시렁
````

이 부분에서 50%의 Crash가 여기서 난다. 옵셔널이긴 하지만 아닌 것이라고 가정(100% 값이 있을 거야!)하는 것.

**그런데 100%라는 것은 없다.** 실제로 코드르 짜보니, 여러번 코드가 수정되면서, 기존에 어떤 로직이었는지 제대로 파악하지 못하고 사용하는 경우가 생겼다. 그런 경우 해당 코드를 받은 담당자는 왜 이런 문제가 생겼는지 찾아야 하여 시간적인 손실이 발생한다. 그리고 가장 중요한 것은 앱이 죽는다.

하나의 예시를 들어보자.

* ViewController가 memory warning을 받음
* Memory가 부족하면 iOS는 View를 날릴 수 있음
* Subview들 역시 날아감
* 그런데 다른 VC에서 혹시라도 해당 변수에 접근한다면? -> Crash

# Array bounds check

Objective C의 경우에는 이런 경우 Exception을 발생시킨다. 그래서 이러한 경우 Error Catch를 하여 죽지 않게 만들 수 있다.

하지만 Swift의 경우, 바로 Crash난다. 죽지 않게 처리하는 방법이 있다.

* [Safe Array Lookup](Safe%20Array%20Lookup.md)

# Overflow

Int는 OS에 따라서 다른 범위를 가진다. OS가 32비트이면 Int32, 64비트면 Int64가 된다. 

64비트에서는 우리가 생각한대로 잘 동작한다. 그런데, 여전히 존재하는 32비트 디바이스라면? Crash난다. 즉, 32비트 기기에서 Int64를 넣어버리면, 처리할 수 있는 범위 외로 넘어가버리기 때문에 죽는다. 

값이 커서 Int64로 처리했는데, 32비트 디바이스에서 Crash나는 경우가 있다.

# Objective C 때문에 발생

## nullablility check

Objective C에서 nullable, unnullable을 지정해주지 않으면 모두 force upwrapped 된 것처럼 동작한다. 그런데 objective C 코드에서 nil을 리턴하는 경우가 많다. 그렇기 때문에 Swift와 같이 사용하는 Objective C의 경우에는 반드시 nullability를 명시해야 한다.

## objective C에서 exception 발생

Objective C 내부 코드가 exception을 발생시키는 경우에는 이를 Swift에서 받을 방법이 없다. Objective C에서의 Exception과 Swift의 Exception은 완전히 다른 개념이다. 그렇기 때문에 Swift에서 Error Handling을 할 수가 없다.

# 정리

Crash는 사용자 경험에 있어서 매우 안좋다. 몇번 시도하다가 안되면 바로 앱 삭제로 이어진다. 

# Reference

* [Swift에서 크래시를 안나게 하는 네가지 습관](https://www.youtube.com/watch?v=rhLffk7ogfs)
