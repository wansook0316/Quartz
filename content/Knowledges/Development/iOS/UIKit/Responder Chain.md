---
title: Responder Chain
thumbnail: ''
draft: false
tags:
- UIKit
- responser-chain
- chain-of-responsibility
- ios
- swift
- UIResponder
- UIEvent
- UITouch
- UIControl
created: 2023-10-01
---

앞 글에서 간단하게 소개했지만 Responder Chain은 간단하게 알고 넘어갈 만한 것이 아니다. 어떤 식으로 이벤트를 받아야 하는 오소를 감지하는지, 그리고 어떻게 이벤트를 넘기는지에 관한 내용을 이해해야 사용자와의 제대로된 interaction이 있는 앱을 만들 수 있을 것이다. 이번에는 Hit Test와 Responder chain에 대해서 제대로 알아보도록 하자. 그럼 시작하자.

# Responder Chain

![](UIKIt_04_Responder_Chain_Hit_Test_0.png)

 > 
 > 가장 상위 (View 계층 구조에서 이벤트 발생시, 가장 위에 있는 UI 요소) 요소로 이벤트가 전달되고, 만약 해당 이벤트를 받지 못한다면, 그보다 상위에 있는 `UIResponder` 객체로 이벤트가 전달되는 방식

사용자는 이벤트를 발생시킨다. 그 이벤트의 종류는 다양하겠으나 일단 터치를 생각해보자. View는 계층을 이루면서 구현되게 되는데, 특정 요소가 터치되었다는 것을 어떻게 알 수 있을까? 그리고 특정 요소가 터치되지 않길 바란다면, 사용자의 터치 자체는 바로 무시되는 것일까?

이러한 의문에 대한 답이 Responder Chain이다. 먼저 Hit test를 통해 view 계층에서 가장 상위에 있는 view를 알아낸다. 그리고 이 View로 Event가 전달되고, 이를 처리하는 로직이 없는 경우, 해당 View의 상위(superView) view로 이벤트가 전달된다. 최종적으로 UIApplication에서 이벤트가 전달되고, 받지 못하는 경우 소멸된다. 여기서 View라 통칭했으나, 실질적으로 `UIResponder` 객체를 상속받은 객체(예: `UIView`, `UIViewController`, `UIApplication`)를 말한다.

# 알아두어야 할 용어

## UIResponder

이벤트를 처리하는 객체는 UIResponder를 상속 받아야 한다. 대부분의 우리가 아는 View 요소들이 해당 클래스를 상속해서 만들어져 있다. 

## UIEvent

Event는 디바이스와 사용자가 서로 소통하기 위한 일종의 인터페이스라 생각할 수 있을 것이다. 터치, 리모컨 버튼 누름, 모션 등등 다양한 이벤트가 발생할 수 있고 디바이스는 이를 수신한다. 터치를 우리는 아마 가장 많이 다루게 될 것이다.

이 부분에서 알아두어야 하는 것은, 이벤트 객체가 같은 이벤트에 대해서 재사용된다는 것이다. 즉, 어플리케이션이 실행되고, 특정 이벤트(터치)가 처음으로 발생되면, 이 이벤트 객체가 생성되고 다음 이벤트에서도 재사용된다. 생성된 이벤트가 터치라면, UITouch 객체를 포함한다.

## UITouch

터치 이벤트 발생시, 이벤트 객체와 동시에 발생한 터치에 관한 정보를 담는 UITouch 객체가 생성된다. 내부에 들어있는 정보는 아래와 같다.

* 터치가 발생한 view, or window property
* 터치가 발생한 view/window에서의 좌표 (`func location(in: UIView?)` method)
* 터치의 반지름
* 터치의 강도
* 터치 횟수
* 같은 좌표에 대한 터치 발생시 증가함
* 처치된 순간의 시간

## UIControl

`addTarget(_:action:for:)` method로 이벤트와 액션을 연결한다. UIControl은 UIResponder 메소드보다 상위(고수준) 메소드를 제공한다. 즉, 이벤트에 대한 분석이 모두 끝난 상태로 적용이 가능하다는 것이다. 

예를 들어, UIButton의 `.touchUpInside`의 경우 버튼 boundary내에서 터치가 시작되고 끝났을 때를 의미하는 `UIControl.Event` 객체이다. 해당 메서드를 사용하지 않고 UIResponder가 제공하는 method (`touchesBegan`, `touchesEnded` override)로 구현한다면 몇단계나 추가되어야 할까? 터치 시작, 끝에 해당하는 메서드를 override해야 할 것이고, target-action으로 연결도 해주어야 할 것이다. 상당히 귀찮다.

# Reference

* [UIResponder](https://developer.apple.com/documentation/uikit/uiresponder)
* [UIEvent](https://developer.apple.com/documentation/uikit/uievent)
* [UITouch](https://developer.apple.com/documentation/uikit/uitouch)
