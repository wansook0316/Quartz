---
title: Replace Nested Conditional With Guard Clauses
thumbnail: ''
draft: false
tags:
- refactoring
- guard
- conditional-expression
- javascript
created: 2023-10-02
---

Replace Nested Conditional With Guard Clauses, 중첩 조건문을 보호 구문으로 바꾸기를 알아보자.

# 요약

![](Refactoring_50_ReplaceNestedConditionalWithGuardClauses_0.png)

# 코드

````javascript
function getPayAmount() {
    let result;
    if (isDead) result = deadAmount();
    else {
        if (isSeparated) result = separatedAmount();
        else {
            if (isRetired) result = retiredAmount();
            else result = normalPayAmount();
        }
    }
    return result;
}
````

````javascript
function getPayAmount() {
    if (isDead) return deadAmount();
    if (isSeparated) return separatedAmount();
    if (isRetired) return retiredAmount();
    return normalPayAmount();
}
````

# 배경

* 조건문이 사용되는 경우는 두가지다.
  * 참이거나 거짓인 경우 모두가 정상동작으로 이어져야 하는 경우
  * 참인 경우만 의미가 있고, 그렇지 않은 경우 예외 처리를 해야 하는 경우
* 위 두가지 경우는 의도하는 바가 다르니, 이 의도가 형태로 드러나는 것이 옳다.
* `swift`에서는 `guard` 구문을 사용한다.

# 절차

1. 교체해야 할 조건 중 가장 바깥 것을 선택하여 보호 구문으로 바꾼다.
1. 테스트한다.
1. 1~2를 필요한 만큼 반복한다.
1. 모든 보호 구문이 같은 결과를 반환한다면, 조건문을 통합한다.

# 예시

````javascript
function payAmount(employee) {
    let result;
    if (employee.isSeparated) result = {amount: 0, reasonCode: "SEP"};
    else {
        if (employee.isRetired) result = {amount: 0, reasonCode: "RET"};
        else {
            // 급여 계산 로직
            lorem.ipsum(dolor.sitAmet);
            consectetur(adipiscing).elit();
            sed.do.eiusmod = tempor.incididunt.ut(labore) && dolore(magna.aliqua);
            ut.enim.ad(minim.veniam);
            result = someFinalComputation();
        }
    }
    return result;
}
````

* 도대체 뭘하는지 확연히 드러나지 않는다.
* 이 이유는 중첩된 조건들이 있기 때문이다.
* 잘 보면, 모든 조건이 거짓인 상황에 계산을 하고 있는 것을 알 수 있다.

````javascript
function payAmount(employee) {
    let result;
    if (employee.isSeparated) return {amount: 0, reasonCode: "SEP"};
    if (employee.isRetired) {
        result = {amount: 0, reasonCode: "RET"};
    }
    else {
        // 급여 계산 로직
        lorem.ipsum(dolor.sitAmet);
        consectetur(adipiscing).elit();
        sed.do.eiusmod = tempor.incididunt.ut(labore) && dolore(magna.aliqua);
        ut.enim.ad(minim.veniam);
        result = someFinalComputation();
    }
    return result;
}
````

* 일단 가장 처음에 만나는 조건에 대해 `result`에 담지 않고 `return` 시켰다.
* 이런식으로 만나는 조건들에 대해 early return을 시키면, 코드가 보다 명확해진다.

````javascript
function payAmount(employee) {
    if (employee.isSeparated) return {amount: 0, reasonCode: "SEP"};
    if (employee.isRetired) return {amount: 0, reasonCode: "RET"};
    // 급여 계산 로직
    lorem.ipsum(dolor.sitAmet);
    consectetur(adipiscing).elit();
    sed.do.eiusmod = tempor.incididunt.ut(labore) && dolore(magna.aliqua);
    ut.enim.ad(minim.veniam);
    return someFinalComputation();
}
````

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
