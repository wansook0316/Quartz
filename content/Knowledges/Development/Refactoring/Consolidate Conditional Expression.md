---
title: Consolidate Conditional Expression
thumbnail: ''
draft: false
tags:
- refactoring
- javascript
- conditional-expression
created: 2023-10-02
---

Consolidate Conditional Expression, 조건식 통합하기를 알아보자.

# 요약

![](Refactoring_49_ConsolidateConditionalExpression_0.png)

# 코드

````javascript
if (anEmployee.seniority < 2) return 0;
if (anEmployee.monthsDisabled > 12) return 0;
if (anEmployee.isPartTime) return 0;
````

````javascript
if (isNotEligibleForDisability()) return 0;

function isNotEligibleForDisability() {
    return ((anEmployee.seniority < 2)
        || (anEmployee.monthsDisabled > 12)
        || (anEmployee.isPartTime));
}
````

# 배경

* 비교하는 조건은 다르지만, 결과로 수행하는 동작은 같은 경우들이 더러 있다.
* 이럴 경우 조건을 통합하느게 낫다.
* 여러 조각으로 나뉜 조건들을 통합함으로써 하려는 일이 보다 명확해진다.
* 그리고 이렇게 묶어 놓았을 때, 함수로 추출하는 것이 보다 쉬워진다.
* 즉, 의도가 보다 분명해진다.

# 절차

1. 해당 조건식들 모두에 부작용(side effect)가 없는지 확인한다.
   * 부수 효과가 있으면, 함수부터 분리해두자.
1. 조건문 두 개를 논리 연산자로 결합한다.
1. 테스트 한다.
1. 조건이 하나만 남을 떄까지 2-3을 반복한다.
1. 최종적으로 나온 조건식을 함수로 추출할지 고려한다.

# 예시

````javascript
function disabilityAmount(anEmployee) {
    if (anEmployee.seniority < 2) return 0;
    if (anEmployee.monthsDisabled > 12) return 0;
    if (anEmployee.isPartTime) return 0;
    // 장애 수당 계산
}
````

* 같은 결과로 나오는 세개의 조건문이 순차적으로 진행되고 있다.
* 결과가 같으므로 이를 하나의 식으로 통합하자.

````javascript
function disabilityAmount(anEmployee) {
    if (isNotEligibleForDisability()) return 0;
    // 장애 수당 계산
}

function isNotEligibleForDisability() {
    return ((anEmployee.seniority < 2)
        || (anEmployee.monthsDisabled > 12)
        || (anEmployee.isPartTime));
}
````

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
