---
title: Extract Variable
thumbnail: ''
draft: false
tags:
- extract
- refactoring
- javascript
- variable
created: 2023-10-02
---

Extract Variable, 변수 추출하기를 알아보자.

# 요약

![](Refactoring_16_ExtractVariable_0.png)

# 코드

````javascript
return order.quantity * order.itemPrice -
    Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
    Math.min(order.quantity * order.itemPrice * 0.1, 100);
````

````javascript
const basePrice = order.quantity * order.itemPrice;
const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
const shipping = Math.min(basePrice * 0.1, 100);
return basePrice - quantityDiscount + shipping;
````

# 배경

* 표현식이 너무 복잡해지면 쪼개는 것이 좋다. 이해하기 어렵기 때문이다.
* 쪼개면 로직의 구성에서 추가적인 정보를 넣을 수 있어 목적을 명확하게 드러낼 수 있다.
* 디버깅에도 도움이 된다.
* 변수를 추출한다는 것은 표현식에 이름을 붙이고 싶다는 뜻이다.
* 만약 함수 스코프 안에서 사용된다면 변수로 변수로 추출하는 것이 좋다.
* 하지만 해당 변수가 더 넓은 문맥에서 사용되는 친구라면, 변수가 아닌 함수로 추출해야 한다.

# 절차

1. 추출하려는 표현식에 부작용은 없는지 확인한다.
1. 불변 변수를 하나 선언하고 이름을 붙일 표현식의 복제본을 대입한다.
1. 원본 표현식을 새로 만든 변수로 교체한다.
1. 테스트한다.
1. 표현식을 여러 곳에서 사용한다면 각각을 새로 만든 변수로 교체한다. 하나 교체할 때마다 테스트한다.

# 따라하기

````javascript
function price(order) {
    // 가격(price) = 기본 가격 - 수량 할인 + 배송비
    return order.quantity * order.itemPrice -
        Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
        Math.min(order.quantity * order.itemPrice * 0.1, 100);
}
````

* 이 상황에서 단계를 나누어 추가정보를 넣어보자.

````javascript
function price(order) {
    // 가격(price) = 기본 가격 - 수량 할인 + 배송비
    const basePrice = order.quantity * order.itemPrice;
    return basePrice -
        Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
        Math.min(order.quantity * order.itemPrice * 0.1, 100);
}
````

* 교체하고, 테스트한다.
* 더 많은 곳에서 해당 표현을 사용한다면 대체한다.
* 이런 방식으로 다른 변수도 적용한다.

## 클래스안이라면

````javascript
class Order {
    constructor(aRecord) {
        this._data = aRecord;
    }

    get quantity() {return this._data.quantity;}
    get itemPrice() {return this._data.itemPrice;}

    get price() {
        return order.quantity * order.itemPrice -
        Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
        Math.min(order.quantity * order.itemPrice * 0.1, 100);
    }
}
````

* 추출하려는 변수자체의 의미가 클래스 전반에 영향을 준다면메서드로 추출하자.

````javascript
class Order {
    constructor(aRecord) {
        this._data = aRecord;
    }

    get quantity() {return this._data.quantity;}
    get itemPrice() {return this._data.itemPrice;}

    get price() {
        return this.basePrice - this.quantityDiscount + this.shipping;
    }

    get basePrice() {
        return order.quantity * order.itemPrice;
    }

    get quantityDiscount() {
        return Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
    }

    get shipping() {
        return Math.min(order.quantity * order.itemPrice * 0.1, 100);
    }
}
````

* 객체를 사용하는 것의 장점을 확인할 수 있다.
* 요청과 응답에 있어 하나의 추상적인 문맥을 추가함으로서 동작의 설명을 쉽게 만들어준다.

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
