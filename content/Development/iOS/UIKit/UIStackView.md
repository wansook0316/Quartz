---
title: UIStackView
thumbnail: ''
draft: false
tags:
- UIstackView
- UIKit
- ios
- swift
- alignment
- distribution
created: 2023-10-01
---

stack view는 autolayout을 적용하지 않고도 layout을 잡을 수 있는 신기한 친구다. 한번 알아보자. 이 글을 읽기 위해서는 [이전글](https://velog.io/@wansook0316/Auto-Layout)을 읽고 오는 것이 이해가 쉽다.

# Concept

애플에서는 이 stackview를 constraint가 복잡하게 있는 autolayout을 쉽게 제공하기 위해 만들었다고 한다. stackview하나는 row나 column 하나를 정의하고, 사전에 만들어둔 properties들을 통해 이를 제어한다고 한다.

* axis(UIStackView): vertical 이냐 horizontal이냐
* orientation(NSStackView): vertical 이냐 horizontal이냐
* distribution: axis를 따라 view들이 어떻게(크기가) 분배될지를 정함
* alignment: axis의 수직인 방향으로 어떻게 분배될지를 정함
* spacing: 인접한 View들 사이에 간격을 정의

![](UIKIt_08_StackView_0.png)

이 그림은 UIKit에서 가져온 건데, 위 property를 이 그림을 보면서 이해해보도록 하자.

먼저 그림에 나온 stackview는 horizontal stackview인데, 이럴 경우 일단 axis는 horizontal일 것이다.(UIStackView 기준으로 설명) 그리고 distribution의 정의를 보니 **axis를 따라** 배치되는 방법을 정의하는 것이므로, 가로축의 정렬 방법을 정하는 것으로 보인다. 반대로 alignment의 경우 **axis에 수직 방향** 배치 방법이므로 세로축의 정렬 방법을 정하는 것이다.

 > 
 > 원리가 stackview 바깥의 크기를 기반으로 내부 요소들을 정렬하기 때문에, stackview의 위치와 크기를 지정해주어야 한다.

# Axis

* horizontal: 요소가 왼쪽부터 들어감
* vertical: 요소가 위부터 들어감

기본적으로 요소가 들어갈 때, stackView의 가장 끝면 (edge라 표현되어 있음)과 요소의 끝면이 맞닿게 들어간다고 한다. 즉, horizontal인 경우 첫번째 요소의 왼쪽 edge가 stackview의 왼쪽 edge와 맞닿고, vertical인 경우 첫번째 요소의 top edge가 stackview의 top edge와 맞닿는다는 말이다. 마지막 요소는 유추할 수 있으니 생략하겠다.

그런데 이 때, edge와의 margin을 주면서 요소를 넣는 방법이 있다고 한다. `isLayoutMarginsRelativeArrangement` 라는 프로퍼티이다.

````swift
let stackview = UIStackView()
stackview.isLayoutMarginsRelativeArrangement = true
stackview.axis = .horizontal
stackview.layoutMargins.left = 20
stackview.layoutMargins.right = 20
````

이런식으로 주면, stackview의 leading edge가 20, trailing edge가 20 띄어진 상태로 배치된다.

# Distribution

해당 property는 결국 요소의 축 기준 크기를 어떻게 설정하겠냐는 말이다.

horizontal stackview를 만들고, 크기와 위치를 결정했다. 만약에 이 스택뷰에 들어가는 요소들이 모두 같은 가로 간격을 가지고 싶다라고 생각했다면 해당 property를 변경해주면 된다.

근데 이전글에서 특이한 친구들은 intrinsic content size라는 것을 가진다고 설명했었다. stackview도 이런점을 알고있다. 그래서 기본적으로는 해당 size를 기준으로 정렬하되, 플레그의 특성에 따라 이 옵션이 무시될 때도 있다고 한다.

## fill

 > 
 > 가능하면 꽈악 채우렴

자, stackview에 4개의 요소를 넣었다고 생각해보자. 그런데 사실 "어떤 요소"를 넣었냐에 따라 상황은 달라진다. stackview의 가로 사이즈가 100이라고 가정하자. 4개의 요소를 넣을 건데 이 각각의 요소의 intrinsic content size가 25이다. 그러면 문제가 없다. 아주 행복하게 25씩 나눠먹으면 된다. 그런데 사실 그렇지 않다. 각각의 요소를 사람이라고 생각해봤을 때, 4인실 방잡았다고 방이 크냐 작냐 느끼는 것은 각 사람 사이즈에 따라 달라지기 때문이다. 먼저 멸치 친구들이 들어갔을 때를 생각해보자.

![](UIKIt_08_StackView_1.png)

멸치들이 들어가서 방이 널널하게 남고 있다. 그런데 stackview의 distribution을 fill로 줬기 때문에 일단 늘어나긴 해야한다. 그런데 기준이 뭘까? 그 기준은 hugging property로 한다. hugging property는 더 안고 싶어! 더 안아지고 싶어! 의 정도인데, 반대로 말하면 늘어나기 싫어!! 라는 말과 동치이다. 각각의 사람에 hugging property를 달아두었는데, 이렇게 되었을 때 가장 늘어나기 싫은건 첫번째 요소, 반대는 마지막 요소이다. 그래서 stack view는 hugging property가 가장 낮은 친구를 사정없이 늘려버린다.

만약 4번째 친구를 늘렸음에도 불구하고 문제가 발생했다면 다음 타자는 세번째다. 힘의 논리다.

![](UIKIt_08_StackView_2.png)

이번에는 나같은 돼지친구들만 있다고 생각해보자. 좁아터질 것이다. 그렇게 되었을 때도 결국 fill 옵션이기 때문에 맞추긴 맞춰야 한다. 누굴 타겟으로 할까? 이 때 기준이 되는 것이 Compress Resistance Property이다. 쉽게 말하면 난 작아지기 싫어!! 라는 뜻인데 위 상황에 참 잘 맞다. 결국 가장 낮은 값을 가지고 있는 네번째 친구가 몸을 구깃구깃 접는다.

마찬가지로 최대한 접었음에도(즉, intrinsic content size까지) 불구하고 공간이 안남으면 다음은 세번째다.

## fillEqually

 > 
 > 응 싸우지 말고 모두 같게 가지렴

![](UIKIt_08_StackView_3.png)

fill같은 경우 투쟁의 연속이었다. 하지만 이건 공산주의 체제다. 모두 같게 무족선 가지는 것이다. 이 경우 intrisic content size에 상관없이 같게 배정된다.

## fillProportionally

 > 
 > 어 일단 fill한다음에, 공간이 남으면 니들 size 비율에 맞춰서 커지렴

![](UIKIt_08_StackView_4.png)

일단 stackview를 채우고, 남는 공간이 생기는 경우 각 요소의 intrinsic content size 비율에 맞게 공간을 분배한다. 만약 위의 멸치들 그림에서 각 요소의 intrinsic content size가 다음과 같다면,

* 첫번째: 10
* 두번째: 20
* 세번째: 30
* 네번쨰: 40

남은 공간이 발생했을 때, 남은 공간을 10개로 나누어 1:2:3:4비율로 나눠갖도록 하여 fill을 만족시키는 방법이다.

## equalSpacing

 > 
 > 간격만 맞춰! 

![](UIKIt_08_StackView_5.png)

이것도 사실 정확하게 알려면 문제가 있다. 그럼 공간이 남는 경우에는 누가 늘어가는가? 부족한 경우는 누가 줄어드는가?

fill 옵션에서 장황하게 설명한 이유가 여기있다. hugging, compress기준으로 줄어들고 늘어난다.

## equalCentering

 > 
 > 중앙을 기준으로 간격 맞춰!

![](UIKIt_08_StackView_6.png)

원리는 동일하다.

# Alignment

가로는 이제 끝났고, 다른 정렬 조건이 필요하다. Alignment는 axis의 수직인, horizontal인 경우 vertical, 부분의 정렬을 결정하는 property다.

왠만하면 그림만 봐도 쉽게 이해할 수 있다.

## Common

하위 항목은 horizontal, vertical에 상관없이 적용이 가능하다. 90도 돌리기만 하면 vertical이다.

### fill

![](UIKIt_08_StackView_7.png)

### center

![](UIKIt_08_StackView_8.png)

## axis: Horizontal

### top

![](UIKIt_08_StackView_9.png)

### firstBaseline

![](UIKIt_08_StackView_10.png)

### bottom

![](UIKIt_08_StackView_11.png)

### lastBaseline

![](UIKIt_08_StackView_12.png)

## axis: Vertical

### leading

![](UIKIt_08_StackView_13.png)

### trailing

![](UIKIt_08_StackView_14.png)

# Spacing

지금까지 읽다보면, distribution이 모든 역할을 다 하는 것처럼 보인다. 하지만 하나의 옵션! `fillProportionally`의 경우에는 "남는 공간에 대해서 비율을 적용"하기 때문에 요소끼리의 간격을 정해줘야 한다. `fillProportionally`의 경우에는 딱! 정해진 값을 적용한다.

`equalSpacing`, `equalCentering`의 경우에도 해당 값이 적용되기는 하나, 이는 "최소값"이다.

기본값은 0이며, 음수로 지정할 경우 overlap이 가능하다.

# Reference

* [Auto Layout Without Constraints](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/AutoLayoutWithoutConstraints.html#//apple_ref/doc/uid/TP40010853-CH8-SW1)
* [StackView](https://developer.apple.com/documentation/uikit/uistackview)
