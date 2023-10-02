---
title: Combine Functions into Transform
thumbnail: ''
draft: false
tags:
- refactoring
- javascript
- functions
created: 2023-10-02
---

Combine Functions into Transform, 여러 함수를 변환 함수로 묶기를 알아보자.

# 요약

![](Refactoring_23_CombineFunctionsIntoTransform_0.png)

# 코드

````javascript
function base(aReading) {...}
function taxableCharge(aReading) {...}
````

````javascript
function enrichReading(argReading) {
    const aReading = _.cloneDeep(argReading);
    aReading.baseCharge = base(aReading);
    aReading.taxableCharge = taxableCharge(aReading);
    return aReading;
}
````

# 배경

* 데이터를 받아서 내가 원하는 형태의 객체로 반환하는 경우가 종종 있다.
* 이럴 경우 한 곳에서 관리하지 않으면 중복로직이 되버린다.
* 이럴 경우 변환 함수로 묶어버리면 여러곳에서 편하게 사용할 수 있다.

# 절차

1. 변환할 레코드를 입력받아서 값을 그대로 반환하는 변환 함수를 만든다.
   * 이 작업은 대체로 깊은 복사로 처리해야 한다.
   * 변환 함수가 원본 레코드를 바꾸지 않는지 검사하는 테스트를 마련해두면 좋다.
1. 묶을 함수 중 함수 하나를 골라서 본문 코드를 변환 함수로 옮긴다.
   * 클라이언트 코드가 해당 필드를 사용하도록 수정한다.
   * 로직이 복잡하면 함수 추출하기 부터 한다.
1. 테스트한다.
1. 나머지 함수도 위 과정을 반복한다.

# 예시

````javascript
reading = {customer: "ivan", quantity: 10, month: 5, year: 2017};

// Client 1
const aReading = aquireReading();
const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;

// Client 2
const aReading = aquireReading();
const base = (baseRate(aReading.month, aReading.year) * aReading.quantity);
const taxableCharge = Math.max(0, base - taxThreshold(aReading.year));

// Client 3
const aReading = aquireReading();
const basicChargeAmount = calculateBaseCharge(aReading);

function calculateBaseCharge(aReading) {
    return baseRate(aReading.month, aReading.year) * aReading.quantity;
}
````

* 계산 코드가 반복되고 있는 상황이다.
* 클라이언트 3에서는 함수로 만들어놓고 사용하고 있다.
* 이 모두를 하나의 변환 단계로 모아보자.

````javascript
function enrichReading(original) {
    const result = _.cloneDeep(original);
    result.baseCharge = calculateBaseCharge(result);
    result.taxableCharge = Math.max(0, result.baseCharge - taxThreshold(result.year));
    return result;
}

// Client 1
const rawReading = aquireReading();
const aReading = enrichReading(rawReading);
const baseCharge = aReading.baseCharge;

// Client 2
const rawReading = aquireReading();
const aReading = enrichReading(rawReading);
const taxableCharge = aReading.taxableCharge;

// Client 3
const rawReading = aquireReading();
const aReading = enrichReading(rawReading);
const basicChargeAmount = aReading.baseCharge;
````

# 잠재적 문제

* 지금은 원본 필드 자체를 복사하고, 내보낼 때 필드를 추가해서 내보내고 있다.
* 이렇게 되면 클라이언트에서 원본 필드를 변경할 경우 문제가 생긴다.
* 차라리 클래스로 묶어서 뱉는 것이 좋아보인다.

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
