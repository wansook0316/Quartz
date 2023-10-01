---
title: Dark mode
thumbnail: ''
draft: false
tags:
- dark-mode
- ios
- UIKit
- swift
- status-bar
created: 2023-10-01
---

WWDC 2019 키노트를 확인해보며 알짜 정보를 쏙쏙 뽑아보자.

# Dark Mode

iOS 13부터 지원되는 기능이다. 말 그대로 dark mode이다.

![](UIKIt_10_Dark_Mode_0.png)

해당 기능을 만들면서 고민했던 것은 역시 Mode에 따라 변화하는 색상이었다. 같은 화면이라도 모드에 따라 가시성을 위해 색이 변화해야 했다. 기존에는 RGB값으로 하드코딩 되어 있던 것을, Semantic Color를 도입하여 해결했다.

![](UIKIt_10_Dark_Mode_1.png)

semantic color는 말 그대로 의미론적인 색상이다. label이라는 색상이 있다고 가정했을 때, 이 색상은 mode에 따라 표현해야 하는 색상으로 변경된다. 이런식으로 prefix로 system이라고 붙은 경우가 apple에서 만들어둔 semantic color이다. mode에 따라 기본적으로 만들어둔 색상으로 변경된다.

![](UIKIt_10_Dark_Mode_2.png)

Apple은 이러한 semantic color를 여럿 구비해두었다. label의 경우 중요도에 따라 총 4가지 색상을 선택하여 사용할 수 있다. system background의 경우도 마찬가지다. 자세한 내용은 [Dark Mode](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/dark-mode/)를 확인하자.

![](UIKIt_10_Dark_Mode_3.png)

이러한 darkmode 대응은 Tab Bar, Button 등 다양한 UIKiut 요소에 이미 반영되어 있다. Customizing하고 싶다면 역시 이에 대한 방법 역시 열어두었다.

# Dynamic Colors

![](UIKIt_10_Dark_Mode_4.png)

위에서 얘기한 semantic color는 결국 하나의 단어에 두가지 색상을 담고 있다. 이렇게 하나의 색상이라는 의미론적 이름에 두개의 색을 담는 것을 apple에서는 **Dynamic Colors**라 소개하고 있다.

# Elevated Level

![](UIKIt_10_Dark_Mode_5.png)

같은 semantic color를 가짐에도 불구하고, 실제로 보았을 때 다른 색상을 나타낼 수도 있다. 예를 들어 modal이 올라온 경우, 올라온 modal의 배경과 뒤 VC의 배경색이 같더라도 다르게 표현되는 것이 그 예이다.

![](UIKIt_10_Dark_Mode_6.png)

이렇게 다르게 화면이 보일 때, 하위 VC를 base level이라 부르고, 올라온 VC를 elevated level이라 부른다. 바닥에 있는 경우는 base이다. 어떻게 이러한 것들을 device를 알고 색을 변경할 수 있을까? 해당 의문 사항은 이후 글인 **UITraitCollection**에서 알아보자.

# In Xcode

![](UIKIt_10_Dark_Mode_7.png)

Storyboard에서는 바로 색상을 확인할 수 있다.

![](UIKIt_10_Dark_Mode_8.png)

실행 중에도 해당 버튼을 누르고 바로바로 dark mode를 변하게 할 수 있다.

![](UIKIt_10_Dark_Mode_9.png)
![](UIKIt_10_Dark_Mode_10.png)

image와 asset에 대해 appearance에 `Any, Dark`를 선택하면, dark mode일 때 option이 새로 뜬다. 여기에 원하는 asset을 추가적으로 넣어주면 dynamic color로 사용이 가능하다. 

여기서 궁금증이 생겼는데, 왜 `Any, light, dark`는 왜 있느냐 하는 부분이었다. [Providing Images for Different Appearances](https://developer.apple.com/documentation/uikit/uiimage/providing_images_for_different_appearances) 해당 글을 보니 이유를 알 수 있었다.

 > 
 > Light and dark appearances. Provide images for both light and dark appearances. Use the Any Appearance slots to support older versions of macOS or iOS.

즉, older version 하위 호환성을 위해 만들어둔 것이 Any이다. 만약, older version에는 Any appearance로 맞추고, iOS 13이상 버전 기기에 대해서는 light, dark를 따로 적용하고 싶다면 해당 옵션을 사용하면 된다. 지금은, older version의 화면과 iOS 13버전 이상 light mode의 화면을 똑같이 맞출 의도이므로 `Any, dark` 옵션을 선택한다.

# iOS 13이후 변경 사항

## Status Bar

![](UIKIt_10_Dark_Mode_11.png)

## UIActivityIndicatorView![](UIKIt_10_Dark_Mode_12.png)

## Drawing Attributed Text

![](UIKIt_10_Dark_Mode_13.png)

# Reference

* [Implementing Dark Mode on iOS](https://developer.apple.com/videos/play/wwdc2019/214/)
* [Dark Mode](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/dark-mode/)
* [Adopting iOS Dark Mode](https://developer.apple.com/documentation/uikit/appearance_customization/adopting_ios_dark_mode)
* [What is the difference between 'any, light, dark' appearances in Xcode assets](https://stackoverflow.com/questions/66396394/what-is-the-difference-between-any-light-dark-appearances-in-xcode-assets)
* [Providing Images for Different Appearances](https://developer.apple.com/documentation/uikit/uiimage/providing_images_for_different_appearances)
* https://hcn1519.github.io/articles/2020-03/ios_darkmode
* https://developer.apple.com/videos/play/wwdc2019/214/
* https://eunjin3786.tistory.com/301
