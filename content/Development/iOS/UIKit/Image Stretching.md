---
title: Image Stretching
thumbnail: ''
draft: false
tags:
- nine-patch
- UIKit
- ios
- swift
- mobile
created: 2023-10-01
---

이미지 자체를 늘리고 싶은데.. 특정 부분은 고정시키고 싶으면 어떻게 할까?

# Image Stretch a.k.a nine patch

* 이렇게 이미지의 특정 부분은 고정시키고 나머지만 늘릴 수 있도록 하게 만드는 것을 Image Stretch라 한다.
* Android에서는 Nine Patch라 한다고 한다.

![](UIKIt_25_ImageStretching_0.png)
![](UIKIt_25_ImageStretching_1.png)

* 이러한 상황은 보통, Corner에 위치한 이미지는 고정, 중앙을 기반으로 늘리고 싶은 경우에서 발생한다.
* 그렇기에 위와 같이 상하좌우를 고려했을 때 나뉘는 공간은 총 9개가 된다.
* 그래서 nine patch라 부른다.
* 일단 상하좌우의 위치를 결정하기 위해 inset이라는 개념을 사용하며,
* 이 부분을 제외한 곳은 각 위치에 맞게 특정 방향으로 Stretch된다.

# Problem

![](UIKIt_25_ImageStretching_2.png)

* 위와 같은 기획서를 받았다.
* 버튼 내부에 해당하는 Text의 길이에 따라 버튼의 UI 역시 비례하여 늘어나야 한다.

![](UIKIt_25_ImageStretching_3.png)

* 그런데 버튼에 해당되는 UI를 그려주는 것이 아니고, 이미지가 들어온다.
* 이런 경우 특정 부분에 대해서만 이미지를 늘려주어야 좌우의 곡선이 "원"으로 유지될 것이다.

![](UIKIt_25_ImageStretching_4.png)

* 만약 그렇지 않다면 위와 같이 타원으로 찌그러질 것이다.

# Solution

해결법은 간단하다.

1. Xcode의 Asset에 들어간다.
1. Asset에서 Stretch하고 싶은 asset을 클릭한다.

![](UIKIt_25_ImageStretching_5.png)

3. 클릭하고 위에 `...` > `Show Slicing` 선택

![](UIKIt_25_ImageStretching_6.png)

4. `Start Slicing`

![](UIKIt_25_ImageStretching_7.png)

5. 우리는 좌우만 늘리면 되므로 1번 항목 선택

![](UIKIt_25_ImageStretching_8.png)

6. 선택하게 되면 위와 같은 형식으로 Xcode에서 어느 부분을 늘리게될지 잡아준다.
   * 불투명한곳이 늘리게 될 곳이다.
   * 아래에 보면 Slicing이라는 항목의 값이 변경되어 있는 것을 확인할 수 있다.
   * 추가적으로 center에 값은 tiles, stretch가 있는데 우리는 좌우를 제외한 중앙 부분을 "늘릴 것"이기 때문에 Stretch를 선택하자.
   * Tiles의 경우 선택된 영역을 tile과 같은 형태로 반복하여 채운다는 의미다.

# Result

* Image View - Content Mode : Scale To Fill

|Stretch X|Stretch O|
|---------|---------|
|![](UIKIt_25_ImageStretching_9.gif)|![](UIKIt_25_ImageStretching_10.gif)|

* 왼쪽의 경우 곡선까지 Stretch되지만 오른쪽은 중앙만 Stretch 된다.

# Reference

* [Xcode image Slicing tutorial](https://www.youtube.com/watch?v=zShmv6Ik1NM)
* [Define a stretchable image](https://developer.apple.com/documentation/uikit/uiimage/#overview)
