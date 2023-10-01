---
title: Shadow
thumbnail: ''
draft: false
tags:
- shadow
- UIKit
- ios
- swift
- UIView
- blur
- spread
created: 2023-10-01
---

업무 하면서 Shadow에 대해 알게된 내용을 정리한다.

# 코드

````swift
extension CALayer {
    func shadow(color: UIColor, alpha: CGFloat, x: CGFloat, y: CGFloat, blur: CGFloat, spread: CGFloat) {
        shadowColor = color.cgColor
        shadowOpacity = alpha
        shadowOffset = CGSize(width: x, height: y)
        shadowRadius = blur
        masksToBounds = false
        if properties.spread == 0 {
            shadowPath = nil
        } else {
            let dx = -spread
            let rect = bounds.insetBy(dx: dx, dy: dx)
            shadowPath = UIBezierPath(rect: rect).cgPath
        }
    }
}

self.view.layer.shadow(color: .black, alpha: 0.5, x: 0, y: 0, blur: 4, spread: 0)
````

# Subview의 순서를 잘 넣자.

* Shadow 적용은 addSubview 순서에 따라 가려짐이 결정된다.
* 가장 나중에 넣은 것이 가장 위에 있다고 판단되어 그림자가 생긴다.
* 순서 잘못 넣으면 그림자가 가려져서 안보이게 된다.
* 즉, 그림자에 대해서는 교환법칙이 성립하지 않는다.

# 배경색을 넣자.

* 또한 특정 View Component의 background가 정해지지 않았다면, 빛은 투과한다.
* 그래서 특정 View안에 다른 View를 넣었는데, 바깥 View의 색은 지정하지 않은 상태, 내부 View의 색은 지정한 상태로 그림자를 드리우면
* 내부 View만 그림자가 생기고 바깥뷰는 생기지 않는다.

# Blur

* 그림자 테두리의 흐릿한 정도를 말한다.
* blur를 적용하기 위해서는 다음의 방법으로 적용해야 한다고 알려주더라.
* `blur / UIScreen.main.scale`
* 그런데 [shadowRadius](https://developer.apple.com/documentation/quartzcore/calayer/1410819-shadowradius)를 보면, 해당 값은 이미 pt라고 명시되어 있다.
* 따라서 굳이 변환과정을 거치지 않고, 일반적인 디자인에서 pt를 기준으로 처리하기 때문에
* 그 값을 그대로 사용해도 문제가 없을 것으로 생각된다.
* spread도 마찬가지다.

# Spread

* 그림자의 퍼짐 정도를 말한다.
* [포토샵 그림자 효과 심층 분석](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=woxozm77&logNo=220476362445)를 참고하자.

# Reference

* [\[iOS - swift\] shadow 그림자 효과 top, left, right, bottom 방향 주는 방법 (layer.shadow)](https://ios-development.tistory.com/653)
* [\[Swift\] Shadow 그림자그리기](https://nsios.tistory.com/157)
* [\[iOS|Swift\] UIView 커스텀하기 (그림자)](https://small-thing.tistory.com/m/283)
* [\[iOS\] swift shadow 그림자 적용 (x, y, blur, spread) feat. Zeplin](https://baechukim.tistory.com/112)
* [How to control shadow spread and blur?](https://stackoverflow.com/questions/34269399/how-to-control-shadow-spread-and-blur)
* [shadowRadius](https://developer.apple.com/documentation/quartzcore/calayer/1410819-shadowradius)
* [포토샵 그림자 효과 심층 분석](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=woxozm77&logNo=220476362445)
