---
title: Layout Performance
thumbnail: ''
draft: false
tags:
- ios
- swift
- UI
- layout
- performance
created: 2023-10-01
---

iOS Layout을 적용하는 것에는 여러가지 방법이 있다. autolayout만이 정답이라 생각했는데, 오산이었다. 이 부분은 주기적인 업데이트를 하도록 하겠다.

# Storyboard

장점으로는 UI 구성을 눈으로 확인할 수 있다는 점이다. 바로 시각적으로 파악할 수 있다. 마우스로 손 쉽게 레이아웃을 구성할 수 있고 autolayout도 보다 손쉽다.

하지만 단점이 보다 많다. 여러 constraint를 동적으로 적용해야 하는 화면이 있다면 constraint를 변수로 빼서 작업해야 한다. 또 history 파악도 어렵다. 로딩 시간도 오래걸린다. 또 재사용을 하는데 있어서도 어렵다. merge 경우 conflict가 나면 xml을 열어서 처리해줘야 한다. 제대로 이해하고 있지 않다면 상당히 복잡하다.

* 장점
  * 빠른 초기화
  * 시각화
  * 낮은 진입장벽
  * view code가 없어져 소스코드가 짧아짐
* 단점
  * 긴 로딩 시간
  * 유지보수, 재사용 어려움
  * conflict 해결 어려움

# Frame

![](Thinking_02_LayoutPerformance_0.png)

뷰의 프레임을 프로그래밍 방식으로 정의하면 유연하다. 어떤 변화가 생겨도 대응할 수 있기 때문이다. 

그러나 모든 변경 사항을 직접 관리해야 하기 때문에 많은 노력이 필요하다. 가장 효과적인 방법이지만 난이도도 많이 어려워진다. 하지만 추가적인 코드가 들어가지 않기 때문에 빠르다.

* 장점
  * 어떠한 변화에도 대응할 수 있음
  * 위치, 크기만을 신경쓰면 됨
* 단점
  * 변화에 따른 처리가 필요함
  * autolayout 대비 추가적인 동작이 없고 프로그래머에게 맡기기 때문에 빠름

# Autolayout

![](Thinking_02_LayoutPerformance_1.png)

제약 조건을 활용하여 정의하는 방식이다. 관계만 정의해두면, 일종의 수식을 통해 layout을 재계산한다. 그렇기 때문에 코드를 잘 구성해두면 화면 변화에 대응할 필요가 없다는 장점이 있다.

하지만 layout을 결국에는 재계산하는 로직이 추가적으로 있기 때문에 속도가 느리다. 실제로 코드로 작성하게 된다면 직관성이 조금은 떨어진다. 중복되는 코드가 많다.

* 장점
  * 제약을 통해 정의하기 때문에 할일이 줄어듦
  * 자동으로 layout을 재계산해줌
* 단점
  * 느림
  * 코드로 작성시 필요없는 로직이 들어감
    * 외부 라이브러리를 사용하면 조금 나음

cc. 여기서 stackView가 성능이 안 좋다는 점을 확인할 수 있었다. 역시 뭔가 너무 쉬우면 성능은 떨어진다.

# 마무리

최신 기술이라 해서 무조건적으로 좋은 것이 아님을 배웠다. 문제의 상황에 따라 선택할 수 있는 유연한 사고를 가진 엔지니어가 되는 것이 중요하다는 것을 느꼈다. autolayout이 느리다는 점을 배울 수 있어 좋았다. 끝!

[layoutBox/LayoutFrameworkBenchmark](https://github.com/layoutBox/LayoutFrameworkBenchmark#benchmark-charts)

하지만 성능적으로 좋지 않다. 

# Reference

* [layoutBox/LayoutFrameworkBenchmark](https://github.com/layoutBox/LayoutFrameworkBenchmark#benchmark-charts)
