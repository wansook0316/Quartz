---
title: UITraitCollection
thumbnail: ''
draft: false
tags:
- UITraitCollection
- UIKit
- ios
- swift
created: 2023-10-01
---

회전과 관련된 코드를 보다보니, compact, regular와 같은 용어들이 보였다. UITraitCollection은 무엇일까?

# Size Classes

먼저, Apple이 다양한 디바이스들의 스크린 모양을 어떻게 논리적으로 관리하는 지 부터 알아야 한다. 결과적으로 말하면, 2개의 Class를 가지고 관리한다. (여기서 Class는 Programming에서의 Class가 아니고 분류의 의미이다) 

![](UIKIt_12_UITraitCollection_0.png)

* Regular
* Compact

Regular는 아무래도 일반적인 상황을 말하는 것 같고, Compact는 좀 빡빡하다라는 느낌을 주는 것 같다. 해당 Size Class의 경우, HIG에 가면 찾아볼 수 있다. Code로는 `UIUserInterfaceSizeClass`로 구현되어 있다.

# UITraitCollection

![](UIKIt_12_UITraitCollection_1.png)

 > 
 > horizontal, vertical size, display scale과 같은 iOS interface 환경을 담고 있는 Class

이전 글에서 Dark mode를 보면서 elevated level에 대해 배웠다. 보면서 궁금했던 점은, 어떻게 device가 이러한 정보들을 알고 환경에 맞게 색을 변화시키냐는 것이었다. 그 해답이 바로 `UITraitCollection`이다. 위에서 보았던 Size Classes 들도 이 `UITraitCollection`에서 관리하는 값중 하나이다.

* userInterfaceIdiom: device(iPhone, iPad, CarPlay)
* userInterfaceStyle: appearance
* userInterfaceLevel: VC의 level

![](UIKIt_12_UITraitCollection_2.png)

UITraitCollection은 App 실행시 1개의 값만 존재하는 것이 아니다. 각각의 view, viewController마다 존재한다. UITraitCollection 값은 System으로부터 UIScreen으로 전달되고, View 계층 구조를 따라 최하위의 View까지 전달된다.

![](UIKIt_12_UITraitCollection_3.png)

만약 새로운 View가 생성되면, 부모의 TraitCollection을 view에 밀어넣어준다. 

## Size

가장 자주 접하게 될 것은, 회전에 따라 어떻게 처리될 것이냐를 결정하는 것이다. `view.traitCollection.verticalSize`와 같은 형식으로 현재 device의 size class를 확인할 수 있다. 추가적으로 iOS interface의 변화가 일어난 경우 대응하고 싶다면, `traitCollectionDidChange(_:)`를 override하여 처리할 수 있다. 

만약 interface 환경이 변화함에 따라 발생하는 animation을 customizing하고 싶다면 `willTransition(to:with:)` 메서드를 override하면 가능하다.

## Color

`UITraitCollection`과 Dynamic Color를 통해 dark Mode로 변경되었을 시 자동으로 반영된다. 현재 view에서 어떤 Color를 사용하는지 보고 싶다면, `resolvedColor(with:)`를 사용하면 된다.

````swift
let dynamicColor = UIColor.systemBackground 
let traitCollection = view.traitCollection
let resolvedColor = dynamicColor.resolvedColor(with: traitCollection)
````

만약 dynamic color가 아닌 것을 불러올 경우 일반적으로 사용하는 Color가 리턴된다.

코드로 Dynamic Color를 만들 수도 있다.

````swift
let dynamicColor = UIColor { (traitCollection: UITraitCollection) -> UIColor in 
    if traitCollection.userInterfaceStyle == .dark {
        return .black 
    } else {
        return .white 
    }
}
````

이미지의 경우도 원리는 비슷하여 생략한다.

## UITraitCollection.current

![](UIKIt_12_UITraitCollection_4.png)

그럼 UIView는 어느 시점에 이 값을 읽어서 처리하는 걸까? 일단 현재 trait 값을 읽어와야 할 것이다. 그래서 apple은 iOS 13에 현재의 traitCollection을 알려주는 static 변수인 `UITraitCollection.current`를 추가했다.

````swift
class BackgroundView: UIView {
    override func draw(_ rect: CGRect) {
        // UIKit sets UITraitCollection.current to self.traitCollection
        UIColor.systemBackground.setFill()
        UIRectFill(rect) 
    }
}
````

UIView의 경우, draw method가 호출되기 직전에 UIKit이 `UITraitCollection.current`를 설정한다. 그렇기 때문에 하위 라인이 동작하면서 dark mode를 반영할 수 있게 된다.

![](UIKIt_12_UITraitCollection_5.png)

이렇게 `UITraitCollection.current`가 업데이트 되는 건 view만이 아니다. 또다른 설정 시점은 `layoutSubviews`가 호출되기 전이다. 그렇기 때문에, 만약 VC를 기준으로 traitCollection 기반 값을 변경해야 한다면, `viewDidLoad`가 아닌 `viewWillLayoutSubviews()` 혹은 `viewdidLayoutSubviews()`에서 처리해주어야 한다. UIPresentationController는 뭔지 모르겠는데, 다음 글에서 알아보자.

`layoutSubviews()`에서 UI 값을 변경해주었다면, `setNeedsLayout`이 호출되고, 다음 view update cycle에 반영되어 dark mode화면이 보이게 된다. VC를 기준으로 다음과 같은 예시가 있겠다.

````swift
class ViewController: UIViewController {
    override func viewWillLayoutSubviews() {
        // Updated TraitCollection (UITraitCollection.current)
        super.viewWillLayoutSubviews()
        self.updateTitle()
    }

    private func updateTitle() {
        if #available(iOS 13.0, *) {
            guard traitCollection.userInterfaceStyle == .dark else {
                self.title = "Light Mode"
                return
            }
            self.title = "Dark Mode"
        } else {
            self.title = "Light Mode"
        }
    }
}
````

![](UIKIt_12_UITraitCollection_6.png)

추가적으로 trait이 변경되었을 때, 알려주는 callBack이 있다. 변경 사항이 발생한 시점에 바로 Color를 적용하거나 할 때 용이하게 사용할 수 있다.

하지만.. 해당 Method가 호출된 시점에서의 `UITraitCollection.current`과 이 method 외부에서 TraitCollection의 값은 다를 수 있다. 이는 그럴 수 있는 것이, traitCollection의 값을 각각의 view가 가지고 있기 때문이다. 하위 view까지 업데이트된 TraitCollection이 적용되지 않은 시점에 Callback이 호출될 수도 있기 때문이다. 그렇다고 같은 주소 값에 있는 녀석의 값을 바꾸면 동시성 문제가 발생한다. 여러모로 골치아픈 상황이다.

즉, 우리가 하고 싶은 것은 traitCollection이 변경된 시점의 가장 따끈따끈한, 즉 가장 신선한 녀석을 기반으로 Color를 바꾸고 싶은 것이다. 이를 하기 위해서 Apple은 세가지 방법을 제안한다.

````swift
let layer = CALayer()
let traitCollection = view.traitCollection

// Option 1 - resolvedColor를 통해 traitCollection 반영
let resolvedColor = UIColor.label.resolvedColor(with: traitCollection)
layer.borderColor = resolvedColor.cgColor

// Option 2 - performAsCurrent 클로저 활용
traitCollection.performAsCurrent {
    layer.borderColor = UIColor.label.cgColor
}

// Option 3 - 직접 current TraitCollection 업데이트
// 이 경우 UITraitCollection은 동작하는 Thread에서만 적용되어 다른 Thread에 영향을 주지 않는다.
// 이 방식은 performAsCurrent의 내부 동작과 동일
let savedTraitCollection = UITraitCollection.current
UITraitCollection.current = traitCollection
layer.borderColor = UIColor.label.cgColor
UITraitCollection.current = savedTraitCollection
````

`traitCollectionDidChange(_:)`와 같은 메서드는 당연하게도 Color 변화에 따라서만 호출되는 것이 아니다. 그래서 userInterfaceStyle 변경을 확인할 수 있는 추가적인 API도 제공한다. 

````swift
override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
    super.traitCollectionDidChange(previousTraitCollection)
    if traitCollection.hasDifferentColorAppearance(comparedTo: previousTraitCollection) {
        // Resolve dynamic colors again
    }
}
````

## TraitCollection을 활용한 Style 강제 설정

![](UIKIt_12_UITraitCollection_7.png)

각각의 view에 traitCollection을 가지고 있다면, 부분적으로 원하는 mode를 적용하는 것도 가능할 것이다.

````swift
class UIViewController {
    var overrideUserInterfaceStyle: UIUserInterfaceStyle
}

class UIView {
    var overrideUserInterfaceStyle: UIUserInterfaceStyle
}
````

`overrideUserInterfaceStyle` 이라는 property가 iOS13부터 새로 생겼는데, 이 값에 대해 `.light`, `.dark`와 같이 지정하면 하위 Subview까지 스타일이 overriding된다.

혹은 전체 앱에 대해 dark mode를 강제하고 싶은 경우, `Info.plist`에 `UIUserInterfaceStyle` 값을 `.light`, `.dark`와 같이 설정하면 된다.

## TraitCollection Debug

![](UIKIt_12_UITraitCollection_8.png)

Debug를 위한 option이 추가되었다.

# 마무리

* TraitCollection은 다양한 trait(device, style, size)를 가지고 있는 객체이다.
* 초기화시 parent view로부터 view에 할당된다.
* UIScreen으로 부터 view 계층을 따라 업데이트 된다.
* 시점문제 때문에 `traitCollectionDidChange(_:)`에서의 값과 view가 가지고 있는 값이 다를 수 있다.
* size외에 색만 반영하기 위한 method(`traitCollection.hasDifferentColorAppearance(comparedTo:)`)가 있다.
* layout이 변화되는 시점(`layoutSubview()`)가 trait을 사용하기 가장 좋은 시점이다.

Dark mode와 TraitCollection이 엮이는 바람에 구분하여 정리하기가 쉽지 않았다. 끝!

# Reference

* [UITraitCollection](https://developer.apple.com/documentation/uikit/uitraitcollection)
* [UIUserInterfaceSizeClass](https://developer.apple.com/documentation/uikit/uiuserinterfacesizeclass)
* [Adaptivity and Layout](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/)
* [\[iOS\] AutoLayout 기본개념(5)](https://velog.io/@leeyoungwoozz/iOS-AutoLayout-%EA%B8%B0%EB%B3%B8%EA%B0%9C%EB%85%905)
* [resolvedColor(with:)](https://developer.apple.com/documentation/uikit/uicolor/3238042-resolvedcolor)
* [traitCollectionDidChange(\_:)](https://developer.apple.com/documentation/uikit/uitraitenvironment/1623516-traitcollectiondidchange)
* [Providing Images for Different Appearances](https://developer.apple.com/documentation/uikit/uiimage/providing_images_for_different_appearances)
