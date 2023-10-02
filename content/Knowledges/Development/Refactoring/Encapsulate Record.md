---
title: Encapsulate Record
thumbnail: ''
draft: false
tags:
- refactoring
- capsulation
- javascript
created: 2023-10-02
---

Encapsulate Record, 레코드 캡슐화 하기를 알아보자.

# 요약

![](Refactoring_25_EncapsulateRecord_0.png)

# 코드

````javascript
organization = {name: "애크미 구스베리", country: "GB"};
````

````javascript
class Organization {
    constructor(data) {
        this._name = data.name;
        this._country = data.country;
    }

    get name() {return this._name;}
    set name(aString) {this._name = aString;}
    get country() {return this._country;}
    set country(aCountryCode) {this._country = aCountryCode;}
}
````

# 배경

* 보통의 프로그래밍 언어는 데터 레코드를 표현하는 구조를 제공한다.
* 묶어서 관리한다는 점에서는 편하나, **가변 데이터**를 표현하려면 좀 번거롭다.
* 예를 들어 범위를 나타내기 위해서는 `{start: 1, end: 5}`와 같이 표현해야 한다.
* 그럼 길이라는 정보를 알기위해서는 계산해서 얻어야 한다. 이 값까지 캡슐화는 안된다.
* 그렇기 때문에 객체를 사용하는 편이 낫다.
* 각각의 메서드를 통해 제공할 수 있기 때문이다. 이렇게 되면 무엇이 저장되었는지, 계산되었는지 알 필요가 없다.
  * 물론 특정 상황에서는 이 알 수 없는 상황이 **성능 문제**로 직결될 수도 있다.
  * 계산 프로퍼티를 계속해서 호출하게 되어 성능이 저하될 수 있다. 사용자는 계산 프로퍼티인줄 모르고 사용했는데 말이다.

# 절차

1. 레코드를 담은 변수를 캡슐화 한다.
1. 레코드를 감싼 단순한 클래스로 해당 변수의 내용을 교체한다.
1. 테스트 한다.
1. 원본 레코드 대신 새로 정의한 클래스 타입의 객체를 반환하는 함수들을 새로 만든다.
1. 레코드를 반환하는 예전 함수를 호출하는 코드를 전부 새 함수를 호출하도록 바꾼다.
1. 클래스에서 원본 데이터를 반환하는 접근자들을 제거한다.
1. 레코드의 필드도 데이터 구조인 중첩 구조라면 레코드 캡슐화하기를 재귀적으로 적용한다.

사실 어떻게 하면 안망가트리고 변경할 수 있을까를 고민하면 나오는 절차다. 저걸 멍청하게 외우지 않도록 주의하자.

# 예시

````javascript
const organization = {name: "애크미 구스베리", country: "GB"};

// Client 1
result += `<h1>${organization.name}</h1>`;
organization.name = newName;
````

* 먼저 `organization`을 캡슐화 하자.

````javascript
function getRawDataOfOrganization() {
    return organization;
}

// Client 1
result += `<h1>${getRawDataOfOrganization().name}</h1>`;
getRawDataOfOrganization().name = newName;
````

* 이제 `organization`을 감싼 클래스를 만들자.

````javascript
class Organization {
    constructor(data) {
        this._data = data;
    }
}

const organization = new Organization({name: "애크미 구스베리", country: "GB"});

function getRawDataOfOrganization() {
    return organization._data;
}

function getOrganization() {
    return organization;
}

// Client 1
result += `<h1>${getRawDataOfOrganization().name}</h1>`;
getRawDataOfOrganization().name = newName;
````

* 클래스 안에 레코드 자체를 넣었다.
* 그리고 바깥에서 사용할 때는 해당 클래스에서 레코드를 접근해서 뱉도록 변경했다.
* 이렇게 해서 코드를 기존과 똑같이 돌리되, 수정하는 범위를 제한했다.
  * 리팩토링에서 이게 제일 중요하다. 결국 내가 수정하고자 하는 범위를 줄여놓고 작업을 시작하는 것.
  * 그래야 본동작 그대로 돌아가는지 확인하기 쉽다.

````javascript
class Organization {
    constructor(data) {
        this._data = data;
    }

    set name(aString) {
        this._data.name = aString;
    }

    get name() {
        return this._data.name;
    }
}

function getOrganization() {
    return organization;
}

const organization = new Organization({name: "애크미 구스베리", country: "GB"});
result += `<h1>${organization.name}</h1>`;
getOrganization().name = newName;
````

* `getRawDataOfOrganization()`을 `getOrganization()`으로 변경했다.
* 마지막으로 정리 작업하자.

````javascript
class Organization {
    constructor(data) {
        this._name = data.name;
        this._country = data.country;
    }

    get name() {return this._name;}
    set name(aString) {this._name = aString;}
    get country() {return this._country;}
    set country(aCountryCode) {this._country = aCountryCode;}
}
````

# 중첩된 레코드의 경우

* 레코드가 지금은 간단했지만 만약 엄청 복잡하다면?
* 복잡한 json parsing 전의 상태로 그대로 사용하고 있다면?
* 일단 가장 중요한것은 아무래도 캡슐화다. 경계에서 어떻게 사용하게 될 것인지 인터페이스를 맞추고,
* 내부에서 이전 객체를 그대로 던지도록 선작업한다.
* 그 다음 내부에서 변경해서 던지도록 작업하면 된다.
* 사실 이 단계에서 고민해보아야 하는 것은 감싼 객체를 요청할 때, 원본 레코드는 그대로 두고, 복사해서 던질 것인가 참조로 던질 것인가 이런 거다.
* 지금 문제는 공통의 레코드가 이미 있고, 이걸 객체 형태로 감싸는 것인데, 변경에 대해 어떻게 대처해야 하는지에 대한 판단이 요구된다.
* 객체가 크면 복사 비용이 커질 것이고, 그렇다고 참조로 두면 변경에 대한 부작용이 발생할 수 있다.

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
