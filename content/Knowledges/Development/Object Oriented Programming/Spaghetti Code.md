---
title: Spaghetti Code
thumbnail: ''
draft: false
tags:
- oop
- spaghetti-code
- feature-envy
- inheritance
- 10-200-rule
created: 2023-09-29
---

코드를 짜다보면, 어느새 얽히고 섥혀있는 내 프로젝트를 마주한다. 부지런함이 개발자의 덕목이 아닌가라고 생각될 정도로 항상 깔끔함을 유지하는 것이 참 중요하다는 생각이 들곤한다. 혹은 미래의 나와 과거의 나가 항상 현재에서 싸우는 듯하기도 한다. 오늘은 이렇게 마주하기 싫은 스파게티 코드에 대해서 한번 분석해보고, 어떤 해결 방법, 원칙을 두는 것이 좋은지 알아보려한다.

# 스파게티 코드

* [스파게티 코드](https://ko.wikipedia.org/wiki/스파게티_코드)
* 소스 코드가 복잡하게 얽힌 모습을 면발에 비유한 표현
* 문제점
  * 유지보수 어려움
  * 재활용 불가
  * 버그의 온상
  * 생산성 저하
* 형태
  * 복잡한 제어문
  * 많은 변수
  * 잘못된 상속
  * 클래스 간 의존관계 정리가 안됨
  * 추상화 단계의 부재
* 원인
  * 몰라서
    * 주니어의 경우
  * 게을러서
    * 이게 더 문제가 많음

# 형태에 따른 스파게티 코드

위에서 알아본 스파게티 코드의 형태에 따라 예시와 함께 해당 분류를 이해해보자.

## 복잡한 제어문

* goto
* branch (if, switch)
  * 분기 별로 case를 따져야 한다는 점에서 읽기 어려운 코드를 만듦
* loop (for, while)
* [Cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
  * 코드의 복잡성을 나타내는 지표 중 하나
  * Control flow 분기 개수를 세어 측정
* if 문이 없다면..?
  * 상당히 코드 읽기가 수월해질 것

## 많은 변수

* 단순히 값을 저장하는 용도
* 제어를 컨트롤 하기 위한 용도
  * 해당 변수가 변화함에 따라 분기(if, switch) 혹은 loop(for)를 사용한다면 흐름을 기억해야 함
  * 상당히 코드가 읽기 힘들어짐
  * 제어에 사용되는 변수가 많을 수록 코드 흐름을 따라가기 힘듦
* 변수가 없다면..?
  * 모든 것이 상수라면, 분기도 없을 것이고 단순하게 읽을 수 있을 것

## 잘못된 상속

* 눈치채기 어려운 스파게티 코드
* 진성 스파게티 코드
* 상속은 가장 강한 커플링 중 하나
  * 코드를 제대로 이해하기 위해서는 부모 클래스를 번갈아가면서 읽어야 함
  * override된 함수와 아닌 함수를 구분해서 읽어야 함
* 잘못된 상속
  * 매우 다양한 상황에서 발생
  * 기본적으로 feature envy 상황을 가정해보자.
    * [Feature Envy](https://waog.wordpress.com/2014/08/25/code-smell-feature-envy/)
      * 기능에 대한 욕심
      * 본연의 임무 이외의 기능이 해당 클래스에 들어가서 타 클래스에서 이에 의존적이게 되는 경우
      * 메서드에서 발생하는 Code Smell
        * [Code Smell](https://ko.wikipedia.org/wiki/코드_스멜)
          * 심오한 문제를 일으킬 가능성이 있는 소스 코드의 특징
      * A Class의 메서드의 동작이 B Class의 여러 method에 의존적임
        ![](ObjectOrientedProgramming_01_ObjectOrientedProgramming_0.png)
      * Method Move를 통해 해결이 가능하다.
        ![](ObjectOrientedProgramming_01_ObjectOrientedProgramming_1.png)
  * 예시
    * UIViewController \<- DefaultNetworkViewController \<- RealViewController
    * DefaultNetworkViewController
      * UIViewController 상속
      * viewWillAppear에 network 요청하는 코드 넣어둚
        * 일단 View를 담당하는 클래스가 network 요청하는 코드를 가지고 있다는 것이 말이 안되긴 함
        * 역할을 나누고 분리해야 함
    * RealViewController
      * DefaultNetworkViewController 상속
      * super.network 메서드 호출
    * 현상
      * RealViewController는 네트워크 호출을 하면 한번만 호출될 줄 알았는데 2번 호출됨
      * ViewWillAppear에 해당 코드가 숨겨져 있기 때문
      * 원하는 동작을 하지 않기 때문에 디버깅 비용이 많이 들어감

## 클래스 간 의존관계 정리가 안됨

* 클래스간 의존 관계가 복잡하여 클래스를 독자적으로 재활용 할 수 없는 상황
  * 특정 클래스 동작 위해 다른 클래스를 필요로 함
  * 클래스 하나를 재활용하려 했는데, 수십개의 클래스를 가져와야 하는 상황(빌드가 안되서)
* 클래스의 동작이 상관없는 다른 클래스에 영향을 미치는 경우

## 추상화 단계의 부재

* 디테일까지 모두 적는다면 읽기가 어려워짐
* 코드는 추상화된 내용으로 기술되어야 함
* 이 때, 하나의 함수 안에서는 동일한 레벨의 추상화가 사용되어야 함

# 해결 방법

* OOP를 제대로 다시 공부해야 해결이 가능
  * 학교에서 배운 OOP?
  * OOP를 배운 것이 아니고 OOP Language를 배운 것
* 디자인 패턴 공부
  * 오히려 너무 복잡하게 처리하는 것이 아닌가 하는 의문
  * 이건 잘못써서 그런 것
* 리팩토링 공부
  * 기존의 레거시를 잡기 위해 리팩토링
  * 버그를 잡기 위한 UnitTest
* 문제점
  * 이걸 모두 다 빠른 시간내에 공부하기 어려움
  * Design Pattern: 목적이해가 없어서 어려움
  * Clean Code: 입으로만 클린코드
  * Refactoring: 재작성인가?
  * UnitTest: 먹는건가?
* 법칙
  * 10-200 Rule
    * **모든 함수는 10라인 안에서 끝난다.**
    * **모든 class(struct, enum)은 200라인 안에서 끝나야 한다.**
    * 효과
      * 발생한 다양한 문제들을 해결하는 가장 기본적인 과정
      * 문제 해결의 시작
      * 로직과 구조의 단순화로 상관관계 파악 용이
    * 짧게 작성한다는 것의 의미
      * 요소의 분리
        * 하나의 함수가 여러개의 함수로 분리
        * 하나의 클래스가 여러개의 클래스로 분리
      * 분리를 하다보면 규칙이 생김
        * 추상화 레벨을 생각할 수 밖에 없음
      * 순수함수에 가까운 형태로 변화
        * Cyclomatic complexity가 높아질 수 없음
        * 변수를 많이 사용할 수 없음
        * 각각의 역할이 명확해짐
      * 많은 **고민**을 하게 됨
        * 10줄, 200줄은 협소한 공간
        * 어떻게 하면 간결하게?
        * 어떻게 함수를 분리할까?
        * 어떻게 클래스를 분리할까?
  * 고민의 시간을 많이 확보하기
    * 고민을 많이 해야 추가 학습 내용을 받아들이는 속도가 빨라짐
    * 함수와 클래스를 분리했다면, 어떻게 다시 구조화 시킬 것인지에 대한 고민도 필요
      * 디자인 패턴

# Reference

* [Code Smell: Feature Envy](https://waog.wordpress.com/2014/08/25/code-smell-feature-envy/)
