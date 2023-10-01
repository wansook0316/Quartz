---
title: Layout
thumbnail: ''
draft: false
tags:
- ios
- UIKit
- swift
- layoutSubviews
- setNeedsLayout
- layoutIfNeeded
- draw
- constraints
- main-thread
- RunLoop
created: 2023-10-01
---

iOS 화면 업데이트는 어떻게 되는 걸까? draw, layoutIfNeeded, setNeedsLayout 등. 이해가 안가는 것들이 너무 많았다. 오늘 한번 부셔보자!

# Main Run Loop

해당 메서드들을 이해하기 전에, View의 Layout이 어떤 식으로 그려지는지에 대한 이해가 필요하다. 핵심은 Run Loop이다. 

![](156957161-842d70c8-759e-4e53-9fa4-81769660f992.png)

iOS 애플리케이션의 main run loop는 User의 모든 input event를 받고 적절한 응답을 하기 위해 존재한다. 모든 interaction은 event queue를 거쳐 애플리케이션으로 전달된다. 애플리케이션 내의 UIApplication 객체는 event queue에서 event를 하나씩 꺼내고 해석하여 하위 객체로 전딸한다.

실제로 개발자가 적는 코드는 Core Object 안에 있다. 이 코드를 수행한 뒤, 제어권이 main run loop로 넘어간다. 이후 Update Cycle이 실행되어 작성한 코드에서의 변경사항을 반영한다. 즉 View를 배치하고 다시 그린다.

# Update Cycle

![](156958942-73916007-2145-439f-961a-b8d07137d40a.png)

Update Cycle이란, event를 넘기고 코드를 실행하고, 다시 main run loop로 돌아간 시점에 실행되는 것을 말한다.

이 시점에, 개발자가 변경하라는 코드가 실질적으로 반영되어 그려지게 된다. 여기서 핵심은 **내 코드가 처리되는 시점과, 실질적으로 화면에 보여지는 시점의 차이가 존재한다는 것이다.** 이 점을 인지하여야 아래의 내용들을 이해할 수 있다.

또한 이 Update Cycle까지 처리되어 다시 새로운 이벤트를 받기 위한 시간은 iOS 애플리케이션이 보여줄 수 있는 초당 프레임 (fps) 를 만족해야 한다. 즉, 현재 최대 초당 프레임은 120fps (pro 기준 - 22.03.07) 이므로 최대 1/120초 안에 처리되어야 한다는 말이다. 위의 사진의 경우 내가 사용하는 iphone 12 기준으로 작성했다.

# Layout

UIView에서 Layout은 화면에서 UIView의 크기와 위치를 말한다. 상대좌표계를 사용하고 있기 때문에, 부모 View에 대해서 어디에 위치하고 있으며 (point), 크기는 얼마인지 (size)를 정하는 것이 layout이다.

## layoutSubviews()

우리가 만드는 application의 화면 구성은 Subview들을 올리면서 구현하게 된다. 그렇다면 상위 View에 의존성이 있는 만큼, 내가 원하는 화면을 그리기 위해서는 상위 뷰부터 하위뷰로 위치와 크기를 계산하여야 원하는 화면이 표시될 것이다.

이렇게 View와 자식 View들의 위치와 크기를 재조정하기 위한 method가 `layoutSubviews()` 이다. 재귀적으로 호출되기 때문에 부하가 크다. 하위 뷰에서 override하여 사용도 가능하다.

하지만, **직접 호출하는 것은 금지되어 있다.** 어떻게 보면 이 원칙은 당연하다.

1. 화면을 그리는 것은 Update Cycle시 처리해야 한다.
1. 재귀 호출이기 때문에 부하가 크기 때문에 System에 맡긴다.

위의 이유 때문에 금지되어 있다. 그렇다면 어떻게 개발자는 자기가 원하는 시점에 화면을 업데이트할 수 있을까? 이런 부분을 위해 apple은 여러 method들을 만들어두었다.

### viewDidLayoutSubviews

UIViewController에서 변화된 화면에 따라 어떤 로직을 짜고 싶다면, `viewDidLayoutSubviews`에서 처리해야 한다. 하위 View까지 모두 `layoutSubviews`가 완료된 시점에 해당 callback이 호출된다. `viewDidLoad` 혹은 `viewDidAppear`에서 호출할 경우, 변경된 화면이 적용되지 않은 시점에 로직이 실행되어 원하지 않는 결과가 초래될 가능성이 높다.

## Automatic refresh triggers

개발자가 굳이 호출해주지 않아도 해당 View가 변경되었다고 체크되는 이벤트들이다. 자동적으로 layoutSubviews가 다음 updateCycle에 호출된다.

* View Resizing
* Subview 추가
* UIScrollView 스크롤시, UIScrollView, 그리고 부모뷰에 layoutsubviews가 호출됨
* Device의 회전
* View의 Constraint 변경

## setNeedsLayout()

다음 UpdateCycle에서 해당 View에서 `layoutSubviews`를 호출해달라고 요청하는 메서드이다. 위의 Automatic refresh trigger가 작동하지 않는 경우, 해당 메서드를 호출하여 다음 update cycle에서 반영하도록 할 수 있다.

## layoutIfNeeded()

`setNeedsLayout`과 달리, `layoutIfNeeded`는 호출 즉시 `layoutSubviews`를 호출한다. 그런데, 만약 View가 재조정되어야 하는 이유가 없다면 `layoutSubviews`는 호출되지 않는다. 그렇기에 해당 메서드의 이름이 `layoutIfNeeded`로 지어진 것.

지금까지의 글을 읽었다면, 해당 메서드를 호출하는 것은 상대적으로 신중해야 한다는 것을 알 수 있다. 굳이 빠르게 업데이트할 필요가 없다면 `setNeedsLayout`을 호출하는 것이 적은 부하로 처리할 수 있는 방법이기 때문이다.

그렇다면 어떤 경우에 이 메서드를 사용할 수 있을까? 바로, 애니메이션이다. Constraint를 적용한 상태로 그냥 `setNeedsLayout`을 호출할 경우, 60fps(혹은 120fps)에 대응되어 애니메이션이 발생할 것이다. 애니메이션의 경우 보다 부드러운 화면 처리가 필요하기 때문에, 추가적으로 호출하여 바로바로 이를 적용하는 것이 사용자에게 더 좋은 경험을 선사할 수 있다.

# Display

Layout이 View의 위치와 크기를 나타낸다면, Display는 뷰의 속성중 크기, 위치, 자식 View에 대한 정보를 제외한 것들을 말한다.

* Color
* Text
* Image
* Core Graphics

Display 역시 시스템의 흐름에서 업데이트를 하도록 예약 거는 방식과 명시적으로 처리하도록 하는 메서드들이 있다.

## draw(\_:)

Layout에서 layoutSubviews와 같은 역할이다. 그런데 재귀적으로 호출되지는 않는다. 즉, 하위 View의 draw는 호출하지 않는다는 것.

해당 함수 안에서 화면에 보이는 속성들을 설정해주면 된다. layoutSubviews와 같이 직접 호출은 좋지 않다.

## setNeedsDisplay()

`setNeedsLayout`과 유사하다. 해당 함수를 호출해두면, 다음 UpdateCycle에서 `draw` 함수를 호출하여 다시 그린다.

````swift
class MyView: UIView {
    var numberOfPoints = 0 {
        didSet {
            setNeedsDisplay()
        }
    }

    override func draw(_ rect: CGRect) {
        switch numberOfPoints {
        case 0:
            return
        case 1:
            drawPoint(rect)
        case 2:
            drawLine(rect)
        case 3:
            drawTriangle(rect)
        case 4:
            drawRectangle(rect)
        case 5:
            drawPentagon(rect)
        default:
            drawEllipse(rect)
        }
    }
}
````

위와 같이 처리하여 보여지는 방식을 바꿀 수 있다. updateCycle마다 변경된 값을 반영하여 그릴 수 있다.

# Constraints

AutoLayout에서 나오는 개념이다. 위에서 알아본 Layout, Display는 결국 어떠한 제약 사항이 변경되었을 때, 어떻게 적용하여 위치와 크기의 변화를 화면에 적용하고, 화면 요소의 가시 요소들(색 등)을 보여줄 지에 대한 것들이었다.

알아보지 않은 것은 이 Layout과 Display가 적용되기 이전에, 제약사항이 변경될 경우 어떤 방식으로 이루어지느냐이다. 해당 내용을 이해한다면 다음과 같은 흐름으로 화면이 업데이트 된다는 것을 이해할 수 있다.

1. Constraint
1. Layout
1. Display

마지막 단계로 Constraint에 대해 알아보려한다.

## updateConstraints

layout 단계에서의 layoutSubviews나, Display단계에서 draw와 같이 `updateConstraints`는 override하여 사용하고, **직접 호출은 금지되어 있다.**

그렇다면 결국, updateCycle에서 해당 함수가 호출될 것을 예상하고 override하여 구현사항을 넣어야 한다는 소리이다. 이런 경우는 보통 동적으로 constraint가 변경될 가능성이 있는 경우 구현하게 될 것이다. 위의 `setNeedsDisplay`와 같이 특정 상태값이 있고, updateCycle마다 이를 체크하고 다른 constraint를 적용해야 할 수 있겠다.

보통 정적인 constraint는 interface builder나 viewDidLoad에서 정의하고 들어갔었다. 만약 동적인 constraint를 정의해야한다면 IBOutlet으로 변수를 들고있거나, 그냥 constraint를 변수로 들고 updateConstraint에 적어두면 system이 호출해 줄 것이다.

해당 메서드는 시스템에서 호출하는 메서드라는 사실이 중요하다.

## setNeedsUpdateConstraints

다음 updateCycle에서 Constraint가 업데이트되도록 하는 메서드이다. `setNeedsLayout`이나 `setNeedsDisplay`와 비슷하다.

## updateConstraintsIfNeeded()

`updateConstraints`의 경우는 updateCycle에 맞춰서 동작하기를 기대하고 사용하는 메서드였다. layoutIfNeeded와 마찬가지로 바로 constraint를 적용, 즉 updateContraint를 호출하는 메서드이다.

해당 메서드가 호출되면 Ststem은 `Constraint Update Flag`를 검사한다. 이 Flag는 `setNeedsUpdateConstraints`를 호출한 경우 역시 설정된다. 결국 상기 적은 모든 메서드들은 Flag를 변경해주는 행위이며, 이를 읽고 시스템이 처리한다는 사실을 알 수 있다. 해당 Flag는 `invalidIntrinsicContentSize`를 통해 설정될 수도 있다. 

만약 Constraint가 업데이트 되어야 한다면 `updateConstraints` 함수를 즉시 호출한다.

## invalidateIntrinsicContenstSize

AutoLayout을 사용하면 몇몇 View들은 `intrinsicContentSize` 속성을 갖는다. **이는 View가 갖고 있는 Content의 크기를 지정할 수 있는 속성이다.** 

보통 view의 Contraint로 결정되지만, override하여 특정 view의 content size를 정할 수 있다. 이렇게 설정된 view의 경우, `invalidIntrinsicContentSize`를 호출하여 View가 가지고 있는 `intrinsicContentSize`가 변경되어야 함을 알릴 수 있다. 이 경우 Flag값이 변경되어 다음 Update Cycle에서 반영된다.

# 정리

![](156968049-25ae002a-7772-4816-8226-f75b007f8b9e.png)
위의 내용을 모두 정리하면 다음과 같다. 처음 볼 때는 뭔지 잘 몰랐는데 이제좀 이해가 된 것 같다!

![](156968143-53d74ca4-cd04-4490-9289-dfabfe1656c0.png)

다음은 지금까지 배운 내용이 어떤 식으로 시스템에서 처리되는지에 대한 Flow Chart이다.

# Reference

* [\[ios\] setNeedsLayout vs layoutIfNeeded](https://baked-corn.tistory.com/105)
* [layoutSubviews()](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews)
* [setNeedsLayout()](https://developer.apple.com/documentation/uikit/uiview/1622601-setneedslayout)
* [layoutIfNeeded()](https://developer.apple.com/documentation/uikit/uiview/1622507-layoutifneeded)
* [\[번역\] iOS 레이아웃의 미스터리를 파헤치다](https://medium.com/mj-studio/%EB%B2%88%EC%97%AD-ios-%EB%A0%88%EC%9D%B4%EC%95%84%EC%9B%83%EC%9D%98-%EB%AF%B8%EC%8A%A4%ED%84%B0%EB%A6%AC%EB%A5%BC-%ED%8C%8C%ED%97%A4%EC%B9%98%EB%8B%A4-2cfa99e942f9)
* [Demystifying iOS Layout](http://tech.gc.com/demystifying-ios-layout/)
