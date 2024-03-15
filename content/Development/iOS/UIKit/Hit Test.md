---
title: Hit Test
thumbnail: ''
draft: false
tags:
- hit-test
- ios
- UIKit
- swift
created: 2023-10-01
---

# Hit Testing

그럼 터치가 어디서 발생했는지는 어떻게 알 수 있을까? 즉, 터치가 발생한 시점에, 어떻게 내가 누른 가장 상위 객체(상단은 view 계층에서 top을 말함)를 판단할 수 있을까? 여기서 이벤트에 반응한 가장 상위 객체를 `first Responder`라 한다.

## Hit Test 실행 시점

![](UIKIt_04_Responder_Chain_Hit_Test_1.png)

그림이 어려울 수 있는데, 쉽게 설명해보겠다. 위의 그림을 보면 사용자가 특정 View 요소를 선택하고, 이동한 뒤, 떼는 작업을 하고 있다. 이 각각의 단계에서 아래에는 어떤 동작들이 이루어지는지 적혀있다. Hit test는 이 시점에서, 가장 처음 실행된다. 즉, 사용자가 터치를 실행하는 순간, Hit test를 통해 first responder가 어떤 녀석인지 확인한다.

그리고 drag를 하면서 일정 시간을 기준으로 사용자 이벤트가 계속 발생한다. 그래서 화살표가 3개이다. 이 이벤트들은 첫번째 hit test의 결과인 first responder에게 전달된다. 

마지막으로 터치를 뗀 경우, 뗀 event가 first responder로 전달된다. 어떄용 쉽죠?

## Hit Test 작동 방식

![](UIKIt_04_Responder_Chain_Hit_Test_2.png)

````swift
func hitTest(point: CGPoint) -> UIResponder? {
    guard isPoint(inside: point) else { return nil }
    guard subViews.count > 0 else { return self }

    let pointDiff = CGPoint(x: point.x = origin.x, y: point.y - origin.y)

    for subView in subViews.reversed() {
        let hitView = subView.hitTest(point: pointDiff)
        if hitView != nil {
            return hitView
        }
    }
    return self
}
````

해당 코드는 간략하게 동작을 나타내 본 것이다. 참고로 subview들은 하위에 있을 수록 array에 아래에 있다. (stack 구조이다.) 알고리즘에서 생각해야 하는 부분은 다음과 같다.

* 해당 알고리즘은 `UIApplication`에서 이벤트를 받아 하위로 전달한다.
  * `UIApplication`은 first responder를 사용하지 않는다.
* 내부에 들어있지 않으면 pass 한다.
* 내부에 들어있는데 하위 view가 없다면 (내가 가장 상위 뷰) 자신을 반환한다.
* 하위 view가 있는 경우, 내가 가장 위에 있지 않을수도 있으므로 하위 View로 Hit Test를 전달한다.

이런 알고리즘을 `Reverse Pre-order depth-first traversal algorithm` 이라 한다고 한다. 그런데 사실 DFS와 크게 다른점이 없다고 생각해서 깊게 작성하지는 않았다. 또 몇가지 더 고려하는 사항이 있긴한데, 중요하지 않아서 제거했다. 고려 사항은 다음과 같다.

* View가 hidden인가?
* UserInteraction이 Enable인가?
* Alpha 수준이 일정 이상 (0.01 up) 인가?
* 해당 이벤트가 포함되는가?

# Reference

* [Hit-Testing in iOS](http://smnh.me/hit-testing-in-ios/)
