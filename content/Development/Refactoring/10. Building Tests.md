---
title: Building Tests
thumbnail: ''
draft: false
tags:
- refactoring
- test
- testing
- unit-test
- boundary
created: 2023-10-02
---

리팩토링에 있어 테스트 코드는 왜 중요할까?

# 자가 테스트 코드의 가치

* 프로그래머들의 대부분의 시간은 코드치는 시간이 아니다.
* 현상황 파악 / 설계 고민 / 디버깅에 많은 시간을 쓴다.
* 디버깅의 경우 수정자체는 금방 끝난다. 다만 찾는데 고통스럽다.

 > 
 > 모든 테스트를 완전히 자동화하고 그 결과까지 스스로 검사하게 만들자.

* 테스트를 작성해두면 회귀 버그(이전에는 잘 동작하다가 문제가 생기는 것.)를 잡는데 몇 분 이상 소요할 필요가 없다.
* 이렇게 좋음에도 선뜻 설득시키는 것은 쉽지 않다.
* 부가적 코드를 많이 만들어야 하고, 이 테스트가 오히려 속도를 높인다는 것을 확인하기 전까지는 잘 이해하지 못하기 때문이다.

# 테스트할 샘플 코드

![](Refactoring_12_BuildingTests_0.png)

* 특정 지역에 대한 생산 계획이다.
* 수요는 30, 가격은 20이다.
* 이 상황에서 생산자 수는 3명이며, 각 생산자가 만들 수 있는 스펙이 적혀있다.
* 최종적으로 부족분과 얻을 수 있는 총 수익을 계산하는 앱이다.
* 여기서 비즈니스 로직 부분만 집중해서 처리해보자.

````javascript

function sampleProvinceData() {
    return {
        name: "Asia",
        producers: [
            {name: "Byzantium", cost: 10, production: 9},
            {name: "Attalia", cost: 12, production: 10},
            {name: "Sinope", cost: 10, production: 6},
        ],
        demand: 30,
        price: 20
    };
}

class Province {
    constructor(doc) { // json을 인자로 받음
        this._name = doc.name;
        this._producers = [];
        this._totalProduction = 0;
        this._demand = doc.demand;
        this._price = doc.price;
        doc.producers.forEach(d => this.addProducer(new Producer(this, d)));
    }

    addProducer(arg) {
        this._producers.push(arg);
        this._totalProduction += arg.production;
    }

    get name() {
        return this._name;
    }

    get producers() {
        return this._producers.slice();
    }

    get totalProduction() {
        return this._totalProduction;
    }

    set totalProduction(arg) {
        this._totalProduction = arg;
    }

    get demand() {
        return this._demand;
    }

    set demand(arg) {
        this._demand = parseInt(arg);
    }
     // 숫자로 변환
    get price() {
        return this._price;
    }

    set price(arg) {
        this._price = parseInt(arg);
    }
     // 숫자로 변환
    get shortfall() {
        return this._demand - this.totalProduction;
    }

    get profit() {
        return this.demandValue - this.demandCost;
    }

    get demandValue() {
        return this.satisfiedDemand * this.price;
    }

    get satisfiedDemand() {
        return Math.min(this._demand, this.totalProduction);
    }

    get demandCost() {
        let remainingDemand = this.demand;
        let result = 0;
        this.producers
            .sort((a, b) => a.cost - b.cost)
            .forEach(p => {
                const contribution = Math.min(remainingDemand, p.production);
                remainingDemand -= contribution;
                result += contribution * p.cost;
            });
        return result;
    }

}

class Producer {
    
    constructor(aProvince, data) {
        this._province = aProvince;
        this._cost = data.cost;
        this._name = data.name;
        this._production = data.production || 0;
    }

    get name() {
        return this._name;
    }

    get cost() {
        return this._cost;
    }

    set cost(arg) {
        this._cost = parseInt(arg);
    }

    get production() {
        return this._production;
    }

    set production(amountStr) {
        const amount = parseInt(amountStr);
        const newProduction = Number.isNaN(amount) ? 0 : amount;
        this._province.totalProduction += newProduction - this._production;
        this._production = newProduction;
    }
}

````

# 첫 번째 테스트

* 이 코드를 테스트하기 위해서는 테스트 프레임워크를 마렿ㄴ해야 한다.
* 이 글을 읽는 시점에는 달라질 수 있으나, 사용법은 크게 다르지 않다.
* 생산 부족분을 제대로 계산하는지 확인하는 테스트이다.

````javascript
describe('province', function () {
    it('shortfall', function () {
        const asia = new Province(sampleProvinceData()); // 픽스쳐 설정
        expect(asia.shortfall).equal(5); // 검증
    });
});
````

* 픽스쳐 설정은, **테스트에 필요한 데이터와 객체를 설정하는 것을 말한다.**
* 두번째에서 이를 검증한다.
* 이 때, 성공과 실패 두 가지 경우를 모두 한번 확인해보자. 그래야 프레임워크를 신뢰할 수 있으니까

# 테스트 추가하기

* **테스트는 위험 요인을 중심으로 작성해야 한다.**
* 따라서 단순히 필드를 읽고 쓰기만하는 접근자는 테스트할 필요가 없다.
* 오히려 필요한 테스트를 놓치지 말자.

 > 
 > 완벽하게 만드느라 테스트를 수행하지 못하느니, 불완전한 테스트라도 작성해 실행하는게 낫다.

* 이번에는 총 수익을 계산하는 테스트를 추가해보자.

````javascript
describe('province', function () {
    it('shortfall', function () {
        const asia = new Province(sampleProvinceData());
        expect(asia.shortfall).equal(5); 
    });

    it('profit', function () {
        const asia = new Province(sampleProvinceData());
        expect(asia.profit).equal(230); 
    });
});
````

* 그런데 누구는 이렇게 된 상황을 보고 중복!이라 할 수 있다.
* `const asia = new Province(sampleProvinceData());` 이 부분이 중복되니까 말이다.
* 그런데 그렇다해서 이걸 공유하도록 해서는 안되;ㄴ다.
* **테스트끼리 상호작용하게 되기 때문이다.**
* 그럼에도 중복이 발생하고 있는데, 좀더 쌈빡하게 할 수는 없을까?

````javascript
describe('province', function () {
    let asia;
    beforeEach(function () {
        asia = new Province(sampleProvinceData());
    });

    it('shortfall', function () {
        expect(asia.shortfall).equal(5); 
    });

    it('profit', function () {
        expect(asia.profit).equal(230); 
    });
});
````

* `beforeEach`를 사용하면 된다.
* 이 구문은 각각의 테스트 바로 전에 실행되어 asia를 초기화 한다.
* swift에서는 `setUpWithError()`가 그역할을 한다.

# 픽스처 수정하기

````javascript
describe('province', function () {
    let asia;
    beforeEach(function () {
        asia = new Province(sampleProvinceData());
    });

    it('shortfall', function () {
        expect(asia.shortfall).equal(5); 
    });

    it('profit', function () {
        expect(asia.profit).equal(230); 
    });

    it('change production', function () {
        asia.producers[0].production = 20;
        expect(asia.shortfall).equal(-6);
        expect(asia.profit).equal(292);
    });
});
````

* change production에서 값을 수정하고 테스트하는 코드를 추가했다.
* 당연히 beforeEach에서 수행하면 안되고, 스코프를 명확히 구분해서 처리해야 한다.
* 그리고 굳이 하나의 테스트에서 두가지 속성을 검증해도 된다.

# 경계 조건 검사하기

* 지금까지는 꽃길 테스트만 진행했다.
* 우리 의도대로 작동하는 상황만 검증했다는 말이다.
* 추가적으로 경계 지점에 대한 문제도 검증해야 한다.

````javascript
describe('province', function () {
    let asia;
    beforeEach(function () {
        asia = new Province(sampleProvinceData());
    });

    it('shortfall', function () {
        expect(asia.shortfall).equal(5); 
    });

    it('profit', function () {
        expect(asia.profit).equal(230); 
    });

    it('change production', function () {
        asia.producers[0].production = 20;
        expect(asia.shortfall).equal(-6);
        expect(asia.profit).equal(292);
    });

    it('zero demand', function () { // 비었을 때를 확인한다.
        asia.demand = 0;
        expect(asia.shortfall).equal(-25);
        expect(asia.profit).equal(0);
    });

    it('negative demand', function () { // 수요가 음수라면?
        asia.demand = -1;
        expect(asia.shortfall).equal(-26);
        expect(asia.profit).equal(-10);
    });
});
````

* 수요가 마이너스인 경우 뭔가 이상하다.
* 수익이 음수로 나오는 것이 말이되나?
* 이런 경우 0으로 고정하는 것이 좋을 것 같다.

 > 
 > 문제가 생길 가능성이 있는 경계 조건을 생각해보고 그 부분을 집중적으로 테스트하자.

````javascript
describe('province', function () {
    let asia;
    beforeEach(function () {
        asia = new Province(sampleProvinceData());
    });

    it('shortfall', function () {
        expect(asia.shortfall).equal(5); 
    });

    it('profit', function () {
        expect(asia.profit).equal(230); 
    });

    it('change production', function () {
        asia.producers[0].production = 20;
        expect(asia.shortfall).equal(-6);
        expect(asia.profit).equal(292);
    });

    it('zero demand', function () { // 비었을 때를 확인한다.
        asia.demand = 0;
        expect(asia.shortfall).equal(-25);
        expect(asia.profit).equal(0);
    });

    it('negative demand', function () { // 수요가 음수라면?
        asia.demand = -1;
        expect(asia.shortfall).equal(-26);
        expect(asia.profit).equal(-10);
    });

    it('empty string demand', function () { // 수요가 비어있다면?
        asia.demand = "";
        expect(asia.shortfall).NaN;
        expect(asia.profit).NaN;
    });
});

describe('string for producers', function () { // 생산자 수 필드에 문자열을 대입
    it('', function () {
        const data = {
            name: "String producers",
            producers: "",
            demand: 30,
            price: 20
        };
        const prov = new Province(data);
        expect(prov.shortfall).equal(0);
    });
});
````

* 생산자 수 필드에 문자열을 대입하는 경우를 추가했다.
* 원래는 생산자에 대한 정보들이 들어갔을 것이다.
* 그리고 `forEach`를 통해 결과값을 만들었었다.
* 당연히 빈 스트링이니  `forEach`가 동작하지 않아 에러를 띄운다.

````
9 passing (12ms)
1 failing

1) string for producers :
    TypeError: doc.producers.forEach is not a function
````

* 이렇게 경계에서 문제가 생기는 경우를 테스트해야 한다.

 > 
 > 어차피 모든 버그를 잡아낼 수는 없다 생각하여 테스트를 작성하지 않으면, 대다수의 버그를 잡을 기회를 놓치게 된다.

* 그렇다고 너무나 세세한 테스트까지 하기는 버겁다.
* 수확 체감 법칙이 적용되기 때문이다.
* 그렇기 때문에 코드에서 처리 과정이 복잡한 부분부터 처리하자.
* 즉, **우선 순위를 정해서 처리해라.**

# 끝나지 않은 여정

* 지금한 건 단위 테스트이다.
* 자가 테스트 시스템의 대부분은 단위 테스트가 차지한다.
* 테스트도 반복적으로 진행한다. 한번에 완벽한 테스트를 갖출 순 없다.
* 테스트가 충분한지를 평가하는 기준은 주관적이다.

 > 
 > 버그 리포트를 받으면 그 버그를 드러내는 단위 테스트 부터 작성하자.

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
