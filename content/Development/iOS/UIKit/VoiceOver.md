---
title: VoiceOver
thumbnail: ''
draft: false
tags:
- ios
- swift
- UIKit
- accessibility
- voiceover
created: 2023-10-01
---

Accessibility 자체만 해도 상당히 방대한 개념이다. 이번에는 iOS 개발자가 실제로 많이 사용하는 Accessibility인 Voice Over를 UIKit에 적용하는 방법에 대해 알아보자. 

# VoiceOver

 > 
 > 시력이 좋지 않은 분들이 기기의 Interface를 경험할 수 있도록 하는 스크린 리더

설정 -> 손쉬운사용 -> VoiceOver에서 활성화 가능하다. 시리를 사용하는게 더 빠르다!

## 동작

* Tap
  * 해당 항목이 어떤 녀석인지 선택할 수 있다.
  * 선택하면 해당 항목에 대한 정보를 읽어준다.
* Double Tap
  * 해당 항목의 기존 Tap기능이 활성화 된다.
  * 즉 터치행위를 더블 탭으로 사용할 수 있다.
* Horizontal Swipe
  * 오른쪽: 다음 항목
  * 왼쪽: 이전 항목
* Vertical Swipe
  * Voice over 로터 기능을 사용할 수 있다.
  * 톱니 바퀴 모양으로 기어가 돌아가면서 옵션을 선택할 수 있다.

# VoiceOver 적용

iOS에서 기본적으로 제공하는 Component의 경우, 기본 접근성이 제공된다. 하지만 우리가 만드는 것은 복잡한 앱이기 때문에, 원하는 동작을 하기 위해서는 어떻게 설정하는지 알고 있어야 한다.

## isAccessbilityElement

 > 
 > 접근성 요소 맞니..?

기본값은 false이지만, Control의 경우 기본이 true이다. true로 설정된 경우, 해당 요소에 초점(커서)를 이동할 수 있다. 불필요한 요소인 경우 옵션을 꺼 내용을 읽지 않도록 한다.

````swift
let imageView = UIImageVIew()
imageView.isAccessbilityElement = false // 해당 이미지 요소에 커서가 가지않는다.
````

## accessibilityElementsHidden

 > 
 > 내 밑의 View들도 다 accessibililty 꺼줘!

해당 옵션을 적용한 view의 subView들의 accessibility도 모두 disable된다.

````swift
let someView = UIView()
someView.addSubview(UIView())
someView.accessibilityElementsHidden = true
````

## accessibilityElements

 > 
 > 하위 뷰 중에 너희들만 accessibility On이야!

추가적인 효과는 이 배열의 순서대로 읽어온다. 가끔 내가 원하는 방식대로 voiceover 호출이 안되는 경우가 있는데, 해당 옵션을 사용하면 된다.

````swift
let someView = UIView()
let subview1 = UIView()
let subview2 = UIView()
let subview3 = UIView()
someView.addSubview(subview1)
someView.addSubview(subview2)
someView.addSubview(subview3)
someView.accessibilityElements = [subview1, subview2]
````

## accessibilityLabel

 > 
 > 선택하면 어떤 텍스트를 읽어줄까?

````swift
let deleteButton = UIButton()
deleteButton.setImage(UIImage(named: "delete", for: .normal))
deleteButton.accessbilityLabel = "삭제하기"
````

## accessibilityHint

 > 
 > 추가적인 정보를 제공, 주로 어떻게 동작하는지에 대한 설명이 들어감

````swift
let imageView = UIImageView()
imageView.accessibilityLabel = "설날 이벤트"
imageView.accessibilityHint = "탭하여 이통"
````

## accessibilityValue

 > 
 > Slider, TextField와 같이 값이 변경하는 요소에 사용

````swift
let slider = UISlider()
slider.accessibilityLabel = "다운로드 진행도"
slider.accessibilityValue = "50%"
````

## accessbilityTraits

 > 
 > 요소의 특징을 지정한다.

특징 종류에는 `.button`, `.image` 등이 있다. 없는 경우 `.none`을 입력하면 된다.

````swift
let imageView = UIImageView()
imageView.accessibilityTraits = .image

let button = UIButton()
button.accessibilityTraits = .button

let view = UIView()
view.accessibilityTraits = .none
````

## UIAccessibility Notification

 > 
 > 앱 내에 변경사항이 있는 경우 Notification을 통해 알림이 옴

````swift
let view = UIView()
// 레이아웃 변경 알림

UIAccessibility.post(
  notification: UIAccessibility.Notification.layoutChanged,
  argument: view
)
````

## shouldGroupAccessibilityChildren

 > 
 > 스크린의 위치에 상관없이, 해당 Element에 Focus가 먼저가도록 하는 Bool 값

* [Reading Order](https://a11y-guidelines.orange.com/en/mobile/ios/development/#grouping-elements) 여기를 참고하자.

기본적으로 Voiceover의 초점은 왼쪽 상단에서 오른쪽 하단으로 이동한다. 그렇기 때문에 정보가 수직으로 나열되어 있을 때 하위로 우선적으로 읽어주어야 한다면 해당 옵션을 사용하면 되겠다. 예를 들어 하나의 셀 내의 두개의 View가 가로로 배치되어 있는 경우 왼쪽 먼저 정보를 읽고, 오른쪽을 읽어야 할 것이다. 이런 경우 사용하면 좋다!

# Reference

* [iOS 접근성 VoiceOver 알아보기](https://okanghoon.medium.com/ios-%EC%A0%91%EA%B7%BC%EC%84%B1-voiceover-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0-f2b3b1288b02)
* [\[iOS\] 접근성 정리](https://minsone.github.io/ios/mac/ios-accessibility)
* [Accessibility on iOS](https://developer.apple.com/accessibility/ios/)
* [Accessibility for UIKit](https://developer.apple.com/documentation/uikit/accessibility_for_uikit)
* [iOS developer Accessibility guide](https://a11y-guidelines.orange.com/en/mobile/ios/development/)
* [iOS Accessibility: Getting Started](https://www.raywenderlich.com/6827616-ios-accessibility-getting-started)
* [shouldgroupaccessibilitychildren](https://developer.apple.com/documentation/objectivec/nsobject/1615143-shouldgroupaccessibilitychildren)
