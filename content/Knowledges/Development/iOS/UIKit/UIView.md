---
title: UIView
thumbnail: ''
draft: false
tags:
- ios
- UIKit
- UIView
- frame
- bounds
- layoutSubviews
- swift
created: 2023-10-01
---

# View

* 화면을 구성하는데 기본이 되는 class
* NSObject를 상속한 UIResponder를 상속해서 구성됨
* CustomView는 UIView를 상속함
* UIImageView, UILable, UIScrollView...

## 가능한 것들

* Drawing
* Animation
* Layout
* subview 관리
* Event Handling
  * UIResponder 상속하기 때문에, touch와 같은 event에 반응 가능
  * gesture 추가

## 초기화

* 형태
  ````swift
  // code
  init(frame:)
  init() // default parameter = CGRect.zero
  
  // storyboard
  init(coder:)
  ````

* templates 
  ````swift
  override init(frame: CGRect) {
      super.init(frame: frame)
      // write code
  }
  
  required init?(coder: NScoder) {
      super.init(coder: coder)
      // write code
  }
  ````

## frame & bounds

* UIView는 기본적으로 사각형임
* 이 상태에서 frame, bounds를 통해 크기와 위치 조정
* `CGRect`
  * frame, bounds의 자료형
  * x, y, point 및 가로,세로 크기를 가짐
* point
  * 좌표 체계
  * px * scale임
    * `UIScreen.main.scale`로 접근 가능
* frame
  * superview로 부터 상태적인 위치 및 크기
  * 집의 창문이라 생각
* bounds
  * view의 내부 크기
  * 방의 크기라 생각
  * 창문보다 방이 넓을 수 있고, 창문과 방이 크기가 같을 수 있다.
  * 창문 설치 위치가 고정이라고 했을 때, 방의 위치를 이리거리 움직인다면 방의 내부를 창문으로 볼 수 있을 것이다. 
  * 위의 설명 방식으로 동작한다.

## Subview 관리

* 추가
  ````swift
  view.addSubview(subview)
  ````

* 제거
  ````swift
  subview.removeFromSuperView()
  ````

## LayoutSubviews

* view 크기 및 bounds들이 변경될 때 호출됨
* layoutSubviews를 override해서 view의 화면 변화에 따른 subview들의 layout 재조정 가능
* 보다 깊은 사항은 추가 글을 통해 알아보자

## 주의 사항

* view 접근은 반드시 main thread에서 이루어져야 함
