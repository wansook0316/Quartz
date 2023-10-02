---
title: Making Framework
thumbnail: ''
draft: false
tags:
- xcode
- framework
created: 2023-10-02
---

나뉘어진 프로젝트, 따로 관리되는 프레임워크. 이런 상황에서 새로운 프레임 워크를 만들어 넣는 방법을 알아본다.

# 프로젝트 상황

![](XcodeProject_26_MakingFramework_0.png)

* 일단 내가 처한 상황부터 간략하게 소개하겠다.
* 거대해지는 앱의 경우에는, 하나의 단일 프로젝트로만 관리하는 것이 어렵다.
* 즉, 프레임워크로 나누는 것은 당연하고 나뉘어진 프레임워크를 묶는 상위 집합의 역할을 하기 위해 프로젝트를 새로만드는 경우도 많다.
  * 애초에 CocoaPod이 동작하는 방식이 이거다.
* 그래서 앱에 관련된 프로젝트와, 특정 기능을 수행하는 프로젝트가 나뉘고, 그 안에서 타겟들이 다시 나뉜다고 생각해보자.
* Feature Project로 나눈 프레임워크의 경우 App에서만 사용하지만 의미론적으로 나눈 것이기 때문에
* App에서 사용하는 각 Signing profile을 그대로 바라보아야 한다.
* 이와 같은 상황에서 Feature Project에 새로운 프레임워크를 만들 것이다.
* 해당 Profile 설정은 각 프로젝트마다 다를 것이기 때문에, 간략하게 설명만 적어두도록 하겠다.

# 방법

1. 프레임워크를 넣고 싶은 project 선택
1. 프로젝트 안의 특정 타겟 선택
1. Signing & Capabilites 선택
1. Bundle identifier 확인 (reverse domain으로 되어 있을 가능성 높음)
1. Target 왼쪽 아래의 + 버튼 클릭

![](XcodeProject_26_MakingFramework_1.png)

6. Framework 선택

![](XcodeProject_26_MakingFramework_2.png)

7. 아까봤던 Bundle Identifier의 규칙대로 프레임워크 이름 작성
   ![](XcodeProject_26_MakingFramework_3.png)

7. 프레임워크가 생성됨

7. 해당 프레임워크가 다른 어떤 모듈을 가져와서 사용할지 결정해야 함

7. 이 과정에서 모듈의 참조 방향은 단방향으로 구성하는 것이 좋음. 상호 참조는 좋지 않음

7. 생성된 프레임워크 타겟 선택 > General > Frameworks and Libraries 에 사용할 모듈을 추가함
   ![](XcodeProject_26_MakingFramework_4.png)

7. Feature Project에서 새로만든 모듈은 끝남

7. 하지만 App Project에서도 Feature Project안에 있는 모듈을 사용할 수 있다는 것을 명시해 줘야함

7. 마찬가지로 앱 프로젝트 > 타겟 선택 > General > Frameworks and Libraries 에 사용할 모듈을 추가함
   ![](XcodeProject_26_MakingFramework_5.png)

7. 이제 특정 로직을 프레임워크로 뗐으니, 해당 프레임워크도 각기 다른 설정을 적용해주어야 한다. (분리해서 사용할 용도이므로)

7. 해당 프레임워크가 다른 의미를 띄지 않는 한, App에서의 설정을 그대로 따라가는 것이 일반적이다.

7. 이에 App쪽을 바라보고 있는 특정 프레임워크의 Configuration을 복사하여 추가해준다. (총 5개)

7. 새롭게 만들어진 프레임워크의 위치가 feature라면, 이는 실제 앱이 있는 project와 떼어진 환경이다.

7. 그렇기 때문에, PodFile에 해당 프레임워크의 위치를 명시해주어야 한다.

7. 추가적으로 외부 프레임워크가 있다면 해당 의존성을 정의해준다.
