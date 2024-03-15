---
title: Combine Functions into Class
thumbnail: ''
draft: false
tags:
- refactoring
- functions
- javascript
- class
created: 2023-10-02
---

Combine Functions into Class, 여러 함수를 클래스로 묶기를 알아보자.

# 요약

![](Refactoring_22_CombineFunctionsIntoClass_0.png)

# 코드

````javascript
function base(aReading) {...}
function taxableCharge(aReading) {...}
function calculateBaseCharge(aReading) {...}
````

````javascript
class Reading {
    base() {...}
    taxableCharge() {...}
    calculateBaseCharge() {...}
}
````

# 배경

* 공통 데이터를 중심으로 긴밀하게 엮여있는 함수 무리를 발견하면 클래스로 묶는 것이 좋다.
* 클래스로 묶으면 함수들이 공유하는 공통 환경을 명시적으로 드러낼 수 있다.
* 각 함수에 전달되는 인수도 줄일 수 있다.
* 클래스 말고 변환 함수로 묶는 경우도 있는데, 이는 다음에 알아보자.

# 절차

1. 함수들이 공유하는 공통 데이터 레코드를 캡슐화한다.
   * 이게 안되어 있으면 매개변수 객체 만들기부터 한다.
1. 공통 레코드를 사용하는 함수 각각을 새 클래스로 옮긴다.
   * 이때 공통 레코드를 멤버는 호출문의 인수에서 제거한다.
1. 데이터 조작 로직은 함수로 추출하여 클래스로 옮긴다.

# 예시

````javascript
reading = {customer: "ivan", quantity: 10, month: 5, year: 2017};

// client 1
const aReading = acquireReading();
const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;

// client 2
const aReading = acquireReading();
const base = (baseRate(aReading.month, aReading.year) * aReading.quantity);
const taxableCharge = Math.max(0, base - taxThreshold(aReading.year));

// client 3
const aReading = acquireReading();
const basicChargeAmount = calculateBaseCharge(aReading);

function calculateBaseCharge(aReading) {
    return baseRate(aReading.month, aReading.year) * aReading.quantity;
}
````

* 1, 2, 3에서 기본 요금 계산 공식이 똑같다.
* 그렇다고 3에서 사용한 최상위 코드를 1, 2에서 사용하게 하는 것이 옳을까?
* 데이터 근처에 두는 게 맞다.
* 그렇다면 클래스다.

````javascript
class Reading {
    constructor(data) {
        this._customer = data.customer;
        this._quantity = data.quantity;
        this._month = data.month;
        this._year = data.year;
    }

    get customer() {
        return this._customer;
    }

    get quantity() {
        return this._quantity;
    }

    get month() {
        return this._month;
    }

    get year() {
        return this._year;
    }

    get baseCharge() {
        return baseRate(this.month, this.year) * this.quantity;
    }

    get taxableCharge() {
        return Math.max(0, this.baseCharge - taxThreshold(this.year));
    }
}

// client 1
const rawReading = acquireReading();
const aReading = new Reading(rawReading);
const baseCharge = aReading.baseCharge;

// client 2
const rawReading = acquireReading();
const aReading = new Reading(rawReading);
const taxableCharge = aReading.taxableCharge;

// client 3
const rawReading = acquireReading();
const aReading = new Reading(rawReading);
const taxableCharge = aReading.taxableCharge;
````

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
