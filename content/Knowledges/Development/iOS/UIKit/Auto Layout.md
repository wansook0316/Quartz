---
title: Auto Layout
thumbnail: ''
draft: false
tags:
- ios
- swift
- UIKit
- auto-layout
- frame
- constraints
- hugging-property
- compression-resistance-priority
- intrinsic-content-size
created: 2023-10-01
---

iOS 앱개발에서 화면을 담당한다면 피할 수 없는 autolayout! 공식 문서를 읽어보며 정리해보자. 간략하게!

# Introduction

 > 
 > Constraints를 기반으로 View hierarchy에 있는 모든 뷰의 크기와 위치를 동적으로 계산하는 방법

변경사항이 발생했을 때, 동적으로 대응이 가능하다. 어떤 변경사항들이 있을까?

* 외부
  * 창의 크기를 조정 (OS X)
  * 분할 보기 (iPad)
  * 회전 (iOS)
  * 다양한 화면 크기 지원
  * 다양한 크기 클래스를 지원
* 내부
  * 표시되는 컨텐츠의 변화
    * 컨텐츠 변화에 따라 다른 레이아웃을 가져야 할 수 있다. (텍스트, 이미지)
  * 국제화 (다양한 언어)
    * 언어마다 같은 단어의 길이가 달라짐 (텍스트의 공간)
    * 미국과 한국은 날짜 나타내는 순서가 반대임 (날짜 및 숫자에 따른 변화)
    * 아랍 언어는 오른쪽에서 왼쪽 (레이아웃 구성)
    * 글꼴 크기 조정에 따른 레이아웃 변경

# Autolayout vs. Frame-based Layout

## Frame-based Layout

![](UIKIt_06_AutoLayout_0.png)

Frame-based Layout은 이전에 사용하던 방식이다. UI를 만들려면, 모든 View 에 대한 크기와 위치를 계산해야 했다. 뷰 계층이 내려감에 따라 하위 뷰는 상위 뷰를 기반으로 위치와 크기를 잡게되는데, 이렇게 순차적으로 얽혀있기 때문에, 복잡한 뷰를 만들기 위해서는 굉장히 귀찮았다. 또한 만약에 화면 변경 사항이 발생하면 이 짓을 다시 해야한다. 으으.

이런 어려움에 있어서 `autoresizing mask`라는 것이 있다. super view의 프레임이 변경될 때, 내 프레임이 어떻게 변경될지 설정할 수 있다.

![](UIKIt_06_AutoLayout_1.png)

스토리보드에서 보던 이녀석이다. 화면을 보면 상하좌우, 내부 세로, 가로에 화살표가 있다. 오른쪽에는 해당 옵션을 클릭했을 때, 상위 뷰와 어떤 관계를 맺어서 보일지에 대한 간단한 애니매이션을 보여준다. autolayout을 설정할 때는, 해당 옵션을 사용하지 않겠다고 명시적으로 선언해주어야 한다. `customView.translatesAutoresizingMaskIntoConstraints = false`

하지만 이런 autoresizing mask는 위에서 살펴보았던 변경사항들 중에 부분적으로만 커버가 가능하다. 즉, 위의 외부, 내부 변경사항 중에서 외부 변경사항만 반영할 수 있다. 

이러한 접근 방식에서 조금더 나아가, 동적으로 레이아웃을 개선하는 방법이 바로 autolayout이다.

## Autolayout

![](UIKIt_06_AutoLayout_2.png)

레이아웃을 설정하는 것이 아닌, 관계를 설정하고 나머지는 맡기는 방식이다. 그림을 잘 보면, 상하좌우, view간의 관계, 너비, 높이 등에 대해 숫자가 달려있다는 것을 알 수 있다. 이런 관계를 기반으로 동적으로 view 요소의 크기와 위치를 계산하여 화면에 보여주는 것이 autolayout이다.

# Anatomy of a Constraint

![](UIKIt_06_AutoLayout_3.png)

생각보다 쉽다. 결국 우리는 2개의 view사이의 관계를 정의해주면 된다. 앞에서 부터 읽어보면, RedView의 Leading은 BlueView의 trailing에 1배이고 추가적으로 8만큼의 상수를 더한 값이다.

 > 
 > left, right가 아니고 왜 leading, trailing인가요? <br> 국적에 따라 left의 사회적의미가 달라지기 때문이다. 즉, left라는 단어에는 여러가지 의미가 혼재되있을 수 있다. 부정적 의미 (인도), 글의 시작점 (한국, 미국, 일본), 글의 끝점 (아랍권) 등등. 그렇기 때문에 좀더 명확한 의미로 leading, trailing을 사용하는 것이 좋다.

## Autolayout Attributes

![](UIKIt_06_AutoLayout_4.png)

특성으로는 여러개가 있다. 이는 실제로 스펙을 보고, 유연하게 적용하는 것이 필요하다. 삽질 여러번 해보면 감이 온다.

그런데.. 다음과 같은 것들을 알아둬야, 나중에 찾아서 처리가 가능할 것이다.

## Constraint Inequalities

지금은 구속 방정식이 등호인 것만 알아보았는데, 그렇지 않을 수도 있다. 예를 들어서 두개의 view가 있는데 사용자가 화면을 엄청 찌그려트렸다고 생각해보자.

그런 상황에서 꼭 보여야 하는 Title이 있어서, 상대적으로 덜 중요한 View가 찌그러트려지게 하고 싶다. 즉, 제약 조건의 영향도를 조절하고 싶다는 얘기다.

이런 경우 시도해 볼 수 있는 옵션이 부등식을 사용하는 것이다.

````swift
// A single equal relationship
Blue.leading = 1.0 * Red.trailing + 8.0
 
// Can be replaced with two inequality relationships
Blue.leading >= 1.0 * Red.trailing + 8.0
Blue.leading <= 1.0 * Red.trailing + 8.0
````

## Constraint Priorities

다음으로는 우선순위를 정할 수 있다.

![](UIKIt_06_AutoLayout_5.png)

UILabel같은 녀석을 올리고 조사해보면 위와 같은 녀석이 나온다. 우선순위를 정하는 방법은 두개가 있다. 하나씩 알아보자.

### Hugging priority

 > 
 > 숫자가 크면 더 "안고 싶어 == 작아지고 싶어!"

![](UIKIt_06_AutoLayout_6.png)

라벨 두개를 올려두고 leading 20, 사이 20, trailing 20을 주었다. 이런 상황이면 두 label중 하나는 width가 늘어나서, 이 constraint를 만족시켜주어야 한다. 즉, 어떤놈 하나는 늘어나야 한다! (빨간색으로 적용안됨)

![](UIKIt_06_AutoLayout_7.png)

만약, 이런 상황에서 왼쪽이 좀더 안으로 들어가려는 경향을 가지고 싶다면 왼쪽 label의 hugging priority를 증가시켜주면 된다.

![](UIKIt_06_AutoLayout_8.png)

반대라면 오른쪽을 높혀주면 된다.

### Compression Resistance priority

 > 
 > 숫자가 크면 더 "저항하고 싶어 == 날 유지하고 싶어!"

그런데 이게 끝이 아니다. 위 상황에서 content를 가득 채워보자.

![](UIKIt_06_AutoLayout_9.png)

오토 레이아웃이 안맞다면서 뭐라뭐라 한다.

![](UIKIt_06_AutoLayout_10.png)

잘 보니, 가로 축의 compression resistance를 줄이라고 한다. 그럼 이녀석은 도대체 무엇일까? 일단 줄여보자.

![](UIKIt_06_AutoLayout_11.png)

왼쪽의 저항도를 1올렸더니 노란색이 집에 가버렸다. 즉, 더 컨텐츠가 들어왔을 때 힘이 세지게 만들어준 것. 반대로 오른쪽이를 높혀보자.

![](UIKIt_06_AutoLayout_12.png)

오른쪽이의 힘이 강력해졌다!

### 정리

숫자가 컸을 때 기준으로 정리했다.

* Hugging Priority
  * 그냥 레이아웃이 정해져있을 때, 누가 더 쭈구리야?
* Compress Resistance priority
  * 니네 안에 내용차있으면 누군가는 작아져야되는데, 그 상황에서의 힘 스텟

아래 내용까지 이해해야 왜 이렇게 되는지 더 자세히 이해할 수 있다!

## Intrinsic Content Size

UILabel로 위의 예를 들었지만, 사실 UILabel은 특수한 친구다. 우리가 제대로 autolayout을 정하려고 했다면 사실 UIView로 하는 게 맞다. 위의 내용을 설명하려고 하다보니 부득이하게 UILabel을 사용했다.

UILabel이 뭐가 특별할까? 사실 위에서 우리는 layout을 걸어주는데 있어서, leading, trailing, top, bottom의 4개만 걸었다. 그럼에도 불구하고 label은 자신만의 크기를 가졌고, interface builder는 아무 오류도 내뿜지 않았다.

하지만 사실 이상하지 않은가? 어떻게 상하좌우의 위치만 결정해줬다고 해서 특정 view의 크기가 정해질 수 있을까? 여기서 특별함이 발생한다.

UILabel은 자신만의 고유한 크기를 가질 수 있다. 우리는 label을 보통 사용할 때, 특정 string을 입력해서 사용한다. 그렇다면 이 string의 크기만큼은 적어도 보여줘야 한다는 것이다. 이렇게 특정 UIView의 하위 객체가 고유의 크기를 가지는 것을 **Intrinsic Content Size**이라 한다.

![](UIKIt_06_AutoLayout_13.png)

그래서 아까 Label의 경우 적용되었던 priority를 다시보면 위와 같다. hugging은 기본적으로 가지고 있는 intrinsic size에 맞춰지려는 특성이고, compression은 이를 저지하고 확장하려는 속성이다.

## 종류

|View|Intrinsic Content Size|
|:---|:---------------------|
|UIView, NSView|없음.|
|Slider|너비(iOS)만 규정한다. <br>슬라이더의 유형(OS X)에 따라 너비, 높이 또는 둘 다 정의 필요.|
|Label, Button, Switch, TextField|Width, Height 둘다 있음|
|TextView, ImageView|크기가 다양할 수 있다.|

# Reference

* [Auto Layout Guide](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/index.html#//apple_ref/doc/uid/TP40010853-CH7-SW1)
