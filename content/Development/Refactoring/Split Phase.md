---
title: Split Phase
thumbnail: ''
draft: false
tags:
- refactoring
- phase
- javascript
created: 2023-10-02
---

Split Phase, 단계 쪼개기를 알아보자.

# 요약

![](Refactoring_24_SplitPhase_0.png)

# 코드

````javascript
const orderData = orderString.split(/\s+/);
const productPrice = priceList[orderData[0].split("-")[1]];
const orderPrice = parseInt(orderData[1]) * productPrice;
````

````javascript
const orderRecord = parseOrder(order);
const orderPrice = price(orderRecord, priceList);

function parseOrder(aString) {
    const values = aString.split(/\s+/);
    return ({
        productID: values[0].split("-")[1],
        quantity: parseInt(values[1])
    });
}

function price(order, priceList) {
    return order.quantity * priceList[order.productID];
}
````

# 배경

* 서로 다른 두 대상을 한꺼번에 다루는 코드를 발견하면 별개 모듈로 나누자.
* 위의 예시코드를 보면, 파싱 로직과 실제 계산 로직이 혼재되어 있다.
* 차라리 파싱을 하고, 계산을 하는 것을 나누면 편해진다.
* 또 대표적인 예로 컴파일러가 있다.
* 텍스트를 실행 가능한 형태로 일단 바꿔야 한다. 그리고 이를 가지고 최적화를 하고, 결과적으로 목적 코드를 생성한다.
* 이렇게 단계를 쪼개면 각 단계를 독립적으로 다룰 수 있어서 유지보수가 쉬워진다.
* 이렇게 들으면 규모가 큰 프로그램에서 적용하는 거라 생각할 수 있으나,
* 규모에 상관없이 적용할 수 있는 방법이다.

# 절차

1. 두번째 단계에 해당하는 코드를 독립 함수로 추출한다.
1. 테스트한다.
1. 중간 데이터 구조를 만들어서 앞에서 추출한 함수의 인수로 추가한다.
1. 테스트한다.
1. 추출한 두번째 단계 함수의 매개변수를 하나씩 검토한다.
1. 첫번째 단계 코드를 함수로 추출하면서 중간 데이터 구조를 반환하도록 수정한다.

# 예시

````javascript
function priceOrder(product, quantity, shippingMethod) {
    const basePrice = product.basePrice * quantity;
    const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
    const shippingPerCase = (basePrice > shippingMethod.discountThreshold) ? shippingMethod.discountedFee : shippingMethod.feePerCase;
    const shippingCost = quantity * shippingPerCase;
    const price = basePrice - discount + shippingCost;
    return price;
}
````

* 하나는 상품 가격을 계산하는 것이고, 하나는 배송비를 계산하는 것이다.
* 각 단계를 나누는게 유지보수에 좋아보인다.

## 배송비 계산 부분 추출\```javascript

function priceOrder(product, quantity, shippingMethod) {
const basePrice = product.basePrice * quantity;
const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
const price = applyShipping(basePrice, shippingMethod, quantity, discount);
return price;
}

function applyShipping(basePrice, shippingMethod, quantity, discount) {
const shippingPerCase = (basePrice > shippingMethod.discountThreshold) ? shippingMethod.discountedFee : shippingMethod.feePerCase;
const shippingCost = quantity * shippingPerCase;
const price = basePrice - discount + shippingCost;
return price;
}

````

- 두번째 단계를 함수로 추출했다.
- 일단 다른 작업하지 말고 인수로 다 끌고 들어오는게 좋다. 한번에 여러개 하려고 하면 안된다.

## 중간 데이터 구조 만들기 
```javascript
function priceOrder(product, quantity, shippingMethod) {
    const basePrice = product.basePrice * quantity;
    const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
    const priceData = {};
    const price = applyShipping(priceData, basePrice, shippingMethod, quantity, discount);
    return price;
}

function applyShipping(priceData, basePrice, shippingMethod, quantity, discount) {
    const shippingPerCase = (basePrice > shippingMethod.discountThreshold) ? shippingMethod.discountedFee : shippingMethod.feePerCase;
    const shippingCost = quantity * shippingPerCase;
    const price = basePrice - discount + shippingCost;
    return price;
}
````

* basePrice를 priceData라는 중간 데이터 구조로 옮겼다.

## applyShipping의 매개변수 검토

````javascript

````

* `basePrice`는 중간 데이터에서 받으면 된다.
* `shippingMethod`는 앞에서 계산하지 않으니 받아야 한다.
* `quantity`는 중간 데이터에서 받으면 된다. 상품 가격에 관련된 정보니까.
* `discount`는 중간 데이터에서 받으면 된다.

````javascript
function priceOrder(product, quantity, shippingMethod) {
    const priceData = calculatePricingData(product, quantity);
    const price = applyShipping(priceData, shippingMethod);
    return price;
}

function calculatePricingData(product, quantity) {
    const basePrice = product.basePrice * quantity;
    const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
    return {basePrice: basePrice, quantity: quantity, discount: discount};
}

function applyShipping(priceData, shippingMethod) {
    const shippingPerCase = (priceData.basePrice > shippingMethod.discountThreshold) ? shippingMethod.discountedFee : shippingMethod.feePerCase;
    const shippingCost = priceData.quantity * shippingPerCase;
    const price = priceData.basePrice - priceData.discount + shippingCost;
    return price;
}
````

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
