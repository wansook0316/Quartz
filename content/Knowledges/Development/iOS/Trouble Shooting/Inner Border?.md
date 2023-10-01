---
title: Inner Border?
thumbnail: ''
draft: false
tags:
- border
- UI
- swift
- UIKit
- ios
created: 2023-10-01
---

Border는 바깥으로 그려질까 안쪽으로 그려질까? 오해와 삽질에 대해 정리해본다.

# Answer

* ~~innerborder를 그리기 위해서는 현재 표현되는 frame을 border width만큼 줄여버리면 된다.~~
* ~~`inset(by:)`, `insetBy(dx:dy:)` 를 사용하여 처리할 수 있다.~~

````swift

import UIKit

internal final class InnerBorderViewController: UIViewController {

    internal override func viewDidLoad() {
        super.viewDidLoad()

        self.view.backgroundColor = .white

        self.defaultBorderView.backgroundColor = .red
        self.outerBorderView.backgroundColor = .blue
        self.innerBorderView.backgroundColor = .blue

        self.defaultBorderView.alpha = 0.5
        self.outerBorderView.alpha = 0.5


        self.defaultBorderView.frame = CGRect(origin: CGPoint(x: 50, y: 100),
                                              size: CGSize(width: 100, height: 100))
        self.outerBorderView.frame = CGRect(origin: CGPoint(x: 50, y: 100),
                                            size: CGSize(width: 100, height: 100))
        self.innerBorderView.frame = CGRect(origin: CGPoint(x: 50, y: 400),
                                            size: CGSize(width: 100, height: 100))

        self.outerBorderView.layer.borderWidth = 2
        self.innerBorderView.layer.borderWidth = 2

        self.view.addSubview(self.defaultBorderView)
        self.view.addSubview(self.outerBorderView)
        self.view.addSubview(self.innerBorderView)

        // inset(by:)
        self.innerBorderView.frame = self.innerBorderView.frame.inset(by: UIEdgeInsets(top: 2,
                                                          left: 2,
                                                          bottom: 10,
                                                          right: 10))

        // insetBy(dx:dy:)
//        self.innerBorderView.frame = self.innerBorderView.frame.insetBy(dx: 2, dy: 2)

    }

    private let defaultBorderView = UIView()
    private let outerBorderView = UIView()
    private let innerBorderView = UIView()
}
````

* 다음의 View를 기반으로 동작시켜본 결과, **Border는 기본적으로 inner로 들어간다.**
* 같은 크기인 상황에서 border를 넣고 두화면을 겹쳐본 결과 border까지 포함한 크기라는 것이 확인되었다.
  * defaultBorderView: red
  * outerBorderView: blue

![](TroubleShooting_03_InnerBorder?_0.gif)

# 오해

* inset 관련 함수는 말 그대로 frame을 inset한 결과를 얻어오는 함수에 불과하다.
* border는 inner로 그려져, border까지 포함한 크기로 화면에 그려진다.

# Reference

* [How to add a border inside a uiview?](https://stackoverflow.com/questions/28824950/how-to-add-a-border-inside-a-uiview)
* [inset(by:)](https://developer.apple.com/documentation/corefoundation/cgrect/1624499-inset)
* [insetBy(dx:dy:)](https://developer.apple.com/documentation/coregraphics/1454218-cgrectinset)
