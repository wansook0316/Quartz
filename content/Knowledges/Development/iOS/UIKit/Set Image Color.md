---
title: Set Image Color
thumbnail: ''
draft: false
tags:
- UIKit
- ios
- swift
- tint-color
- rendering-mode
created: 2023-10-01
---

디자이너와 일을 하다보면, image의 색상 자체를 변경해주길 바라는 경우가 있다. 어떻게 할 수 있을까?

# Answer

````swift
let image = UIImage(named: "asset_name")
    .withRenderingMode(.alwaysTemplate)
    .withTintColor(.red)
````

# Tint Color

* 시각적으로 화면상의 어떤 요소가 현재 활성화 되었는지를 보여주는 요소
* Button 클릭했을 때 파란색으로 변하면서 눌렸다는 것을 인지하게 되는데 이때 이러한 효과를 가능케하는 것이 tint color
* `tintcolor`는 UIView의 property로 존재하기 때문에 이를 상속받는 뷰에서 적용가능하다.
* `view.tintColor = UIColor.red`
* image의 경우에는 약간 다른 방식으로 적용해야 한다. 위에 적어두었다.

# RenderingMode

![](UIKIt_26_SetImageColor_0.png)

* automatic
  * Draw the image using the context’s default rendering mode.
  * context: 어떤 UI Component에 들어간 것인가?
  * `UIBarButtonItem`, `UITabBarItem`에 이미지가 들어간 경우와 `UIImageView`에 들어간 경우에 보이는 이미지가 달랐다.
  * 이런 의도에서 `UIImage`의 기본값으로 설정되어 있음
* alwaysOriginal
  * Always draw the original image, without treating it as a template.
  * image가 가지고 있는 원래 이미지로 그려짐
* alwaysTemplate
  * Always draw the image as a template image, ignoring its color information.
  * **불투명한 부분을 tint color로 대체함**

# Reference

* [tintColor](https://developer.apple.com/documentation/uikit/uiview/1622467-tintcolor)
* [UIImage: Rendering images in different colors](https://medium.com/@bhupendra.trivedi14/uiimage-rendering-images-in-different-colors-39968ceb3174)
* [withTintColor(\_:)](https://developer.apple.com/documentation/uikit/uiimage/3327300-withtintcolor)
* [withRenderingMode(\_:)](https://developer.apple.com/documentation/uikit/uiimage/1624153-withrenderingmode)
* [UIImage.RenderingMode](https://developer.apple.com/documentation/uikit/uiimage/renderingmode)
