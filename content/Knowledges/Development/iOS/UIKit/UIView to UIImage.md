---
title: UIView to UIImage
thumbnail: ''
draft: false
tags:
- UIKit
- UIView
- UIImage
- swift
- ios
created: 2023-10-01
---

디자인 가이드를 읽다보면, Asset이 없는 경우가 있다. 이럴 경우 그냥 View를 만들고 Image화 해서 사용하면 좋겠는데.. 잘 찾아왔다!!

# Answer

````swift
extension UIView {

    public func asImage() -> UIImage {
        UIGraphicsImageRenderer(bounds: self.bounds).image {
            self.layer.render(in: $0.cgContext)
        }
    }

}
````

# UIGraphicsImageRenderer

그런데 이 친구가 뭐하는 녀석인지 문득 궁금해졌다. 

 > 
 > Core Graphics 지원 이미지를 만들기 위한 그래픽 렌더러

UIKit 기반 앱을 위해 Core Graphics에 대한 게이트웨이 역할을 한다. 즉, renderer 객체를 만들고 그 객체 내에 rendering context를 작성하면, Core Graphics에서 해당 작업을 처리하여 다시 UIKit에 해당하는 녀석으로 반환해준다. 공식 문서에 있는 예시를 기반으로 하면, 어떤 친구인지 대번에 알 수 있다.

````swift
let renderer = UIGraphicsImageRenderer(size: CGSize(width: 200, height: 200)) // Format이 필요하다면 해당 initilizer를 사용

// UIImage를 리턴하는 메서드. jpg, png도 있다.
let image = renderer.image { (context) in
  UIColor.darkGray.setStroke()
  context.stroke(renderer.format.bounds)
  UIColor(colorLiteralRed: 158/255, green: 215/255, blue: 245/255, alpha: 1).setFill()
  context.fill(CGRect(x: 1, y: 1, width: 140, height: 140))
  UIColor(colorLiteralRed: 145/255, green: 211/255, blue: 205/255, alpha: 1).setFill()
  context.fill(CGRect(x: 60, y: 60, width: 140, height: 140), blendMode: .multiply)
  
  UIColor(colorLiteralRed: 203/255, green: 222/255, blue: 116/255, alpha: 0.6).setFill()
  context.cgContext.fillEllipse(in: CGRect(x: 60, y: 60, width: 140, height: 140)) // CGContext 사용
}
````

1. 크기가 200x200인 UIGraphicsImageRenderer 개체 renderer를 만든다.
   * renderer를 만들었다고 렌더링이 실행되지는 않는다. renderer의 `image()` 메서드에서 실행된다.
1. `renderer.image`의 closure를 작성한다.
   * `func image(actions: (UIGraphicsImageRendererContext) -> Void) -> UIImage`
   * 클로저만을 입력 인수로 받고, 결과로 UIImage를 준다.
   * closure 내부에는 `UIGraphicsImageRenderContext`가 있는데, 이녀석은 `UIGraphicsRendeerContext`를 상속하고 있어, 그리기에 관련된 코드를 가지고 있는 `cgContext`를 가지고 있다. 그래서 이 녀석을 사용해서 그려주면 된다.
   * `UIGraphicsImageRenderContext`에도 기본적인 그리기 메서드는 있지만, 고급 동작을 하고 싶다면 `UIGraphicsRendeerContext.CGContext`를 사용해야 한다.

이 작업을 마치면 아래와 같은 도형이 그려진다.

![](UIKIt_22_UIViewToUIImage_0.png)

# 요약

* `UIGraphicsImageRendererContext`는 Core Graphic 렌더링 기능을 직접적으로 사용할 수 있는 `cgContext`를 가지고 있다.
* 그렇기 때문에 UIKit에서 Core Graphic에 접근하여 이미지 렌더링을 수행할 수 있다.
* 이런 의미에서 애플의 정의는 어느정도 이해가 되는 부분이다. 

끝!

# Reference

* [UIGraphicsImageRenderer](https://developer.apple.com/documentation/uikit/uigraphicsimagerenderer)
