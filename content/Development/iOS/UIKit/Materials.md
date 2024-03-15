---
title: Materials
thumbnail: ''
draft: false
tags:
- blur
- ios
- vibrancy
- UIKit
- swift
created: 2023-10-01
---

불투명한 뷰는 어떻게 만드는거지? 그게 바로 이거였다.

# Materials

![](UIKIt_11_Materials_0.png)
![](UIKIt_11_Materials_1.png)

iOS는 깊이감을 느낄 수 있도록 하는 반투명 효과를 제공한다. Blur Effect 혹은 Material으로 부르는 친구다. HIG에서는 해당 화면을 사용하면, foreground에 올라와있는 content를 방해하지 않으면서도 background view와 control에 대한 hint를 얻는 효과를 얻을 수 있다고 한다. ~~그냥 예뻐서 쓰는거 아니었어?~~

Material을 사용하면 이런 Blur 효과를 만들기 위해서, foreground에서 보이는 화면을 보이기 위해 blur 효과를 주고, background color를 보이게 하기 위해 투명하게 한다.

종류는 Thick, Regular, Thin, Ultrathin 4가지를 가진다. 오른쪽으로 갈수록 뒷 배경이 보다 많이 보이는 특징을 갖는다.

# How to Use Them

![](UIKIt_11_Materials_2.png)

우리의 목적이 좌측 화면에서 우측 화면까지 만드는 것이라 생각해보자.

## Blur Effect

![](UIKIt_11_Materials_3.png)

먼저, `UIBlurEffect`를 사용한다. 그리고 해당 style에 위에서 본 4가지 종류중의 하나를 선택해준다. 

다음으로는 이 View의 size와 position을 정해주는 `UIVisualEffectView`를 만들어준다. 그리고 당연히 view 계층에 넣어주어야 보일 것이다. 즉 view를 만들고 `UIBlurEffect`를 적용하면 된다.

````swift
let blurEffect = UIBlurEffect(style: .regular)
let blurView = UIVisualEffectView(effect: blurEffect)
self.view.addSubview(blurView)
````

## Vibrancy Effect

그 위에 vibrant content를 올릴 수 있다. 해당 기능은 VisualEffectView 위에, 즉 Subview로 올려져서 사용되는 것을 의도하고 만든 클래스이다. 이걸 사용하면, Content view 내부에 배치된 컨텐츠가 더욱 생생해진다.

이 Vibrancy effect는 color에 의존적이다. Color는 무시되고 **Alpha** 만 사용된다. 

또한 content view에 추가한 subview들은 `tintColorDidChanged()` 메서드를 **항상** override 해야 한다. 예외 사항으로 `UIImage.RenderingMode.alwaysTemplate`가 설정된 `UIImageView` 또는 `UILabel`의 경우 `tintColorDidChanged()`를 override할 필요가 없다. 자동적으로 tintColor를 업데이트 해준다. 

지금 같은 경우에는 Blur View안에 vibracy view를 넣는데, 그 vibrancy view도 blur 되어야 한다. 코드로 넣는 방법은 아래와 같다. style은 알아서 결정하면 된다.

````swift
let vibrancyEffect = UIVibrancyEffect(blurEffect: blurEffect, style: .fill)
let vibrancyView = UIVisualEffectView(effect: vibrancyEffect)
/** 또는..
vibrancyView.effect = vibrancyEffect
**/
blurView.contentView.addSubview(vibrancyView)
````

![](image%20(2).png)

사실 여기까지 읽어도 뭔소린지 잘 감이 안온다. apple 설명에서 나온 imageView와 Label을 비교해보면 위와 같다.

vibrancy가 없는 경우, 뒤에 Blur가 되어 있더라도 올려진 content의 색상이 그대로 표현됨을 알 수 있다. 반대로 vibrany view를 추가한 후에 label을 올린 경우 (이번에는 vibrancy view에 blur를 뺀거라 이렇게 표현된 거다), 내부 content가 뭔가 blur 하면서도 읽을 수 있는..? 생동감있게 표현되었다. 뭔가 blur에 잘 어울리는 색상?으로 변경되었다. 너무 좋다.

![](UIKIt_11_Materials_4.png)

더 직관적으로 이해하고 싶다면 이 그림을 보자. (출처: Zedd) 1번의 경우 기존 하트의 색이 파란색이었음에도 불구하고, 2로 가면서 색이 변화되었다. 즉 색이 blurView에 의존적으로 변화했다. 

오른쪽은 위에 적었던 예외 사항에 대한 설명이다. `UIImage`의 rendering mode를 templates로 하지 않았을 경우, 색이 변화하지 않고 그대로 표현된 것을 확인할 수 있다.

다시한번 말하지만, `UIImageview`, `UILabel`을 제외한 녀석들은 vibrancy가 자동 적용되지 않아 `tintColorDidChanged()`를 override해야 한다.

![](UIKIt_11_Materials_5.png)

이러한 흐름을 표현한 것이 WWDC 세션에서 그린 이 그림이다. 

1. `UIBlurEffect`를 만들고 `UIVisualEffectView`에 적용하여 View를 만든다.
1. 1의 View를 `VC.view`에 추가한다.
1. `UIVibrancyEffect`를 만들고 `UIVisualEffectView`에 적용하여 View를 만든다.
1. 3의 View를 `1.contentView`에 추가한다.
1. 3의 view 아래(subview)에 `UILabel` 과 같은 component를 추가한다.

![](UIKIt_11_Materials_6.png)

Apple은 이러한 Vibrant도 여러가지 만들어두었다.

# 마무리

Blur관련해서 어떻게 하는 건지 궁금했는데 잘 알아본 듯 하다. 그리고 Apple 요소에 생각보다 이 요소가 많이 반영되어 있다는 것을 확인하는 좋은 기회였다. 끝!

# Reference

* [Materials](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/materials/)
* [UIVisualEffectView](https://developer.apple.com/documentation/uikit/uivisualeffectview)
* [UIVisualEffect](https://developer.apple.com/documentation/uikit/uivisualeffect)
* [UIVibrancyEffect](https://developer.apple.com/documentation/uikit/uivibrancyeffect)
* [iOS ) UIVisualEffect (Blur, Vibrancy)](https://zeddios.tistory.com/1140)
* [UIVisualEffectView Tutorial: Getting Started](https://www.raywenderlich.com/16125723-uivisualeffectview-tutorial-getting-started)
