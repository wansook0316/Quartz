---
title: Introduction Part. 06
thumbnail: ''
draft: false
tags:
- refactoring
- polymorphism
created: 2023-10-02
---

만약에 연극 종류가 추가되면 어떻게 될까? 이제 다형성으로 변경할 시점이다.

# 다형성을 활용해 계산코드 재구성하기

* 지금까지 구성한 코드를 한번 보자.

````javascript
// createStatementData.js

export default function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount();
    statementData.totalVolumeCredits = totalVolumeCredits();
    return statementData;


    function enrichPerformance(aPerformance) { 
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result); 
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {
        let result = 0;
        switch (aPerformance.play.type) {
            case "tragedy": // 비극
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy": // 희극
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error('알 수 없는 장르: ${aPerformance.play.type}');
        }
        return result;
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    func totalVolumeCredits(data) {
        data.performances
            .reduce((total, p) => total + p.volumeCredits, 0); 
    }
}
````

````javascript
// statement.js

import createStatementData from './createStatementData.js';

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function htmlStatement(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    let result = "청구 내역 (고객명: ${data.customer})\n";
    for (let perf of data.performances) {
      result += " ${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n";
    }
    result += "총액: ${usd(data.totalAmount)}\n";
    result += "적립 포인트: ${data.totalVolumeCredits}점\n";
    return result;
}

function renderHtml(data) {
    let result = "<h1>청구 내역 (고객명: ${data.customer})</h1>\n";
    result += "<table>\n";
    result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>";
    for (let perf of data.performances) {
        result += " <tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>";
        result += "<td>${usd(amountFor(perf))}</td></tr>\n";
    }
    result += "</table>\n";
    result += "<p>총액: <em>${usd(data.totalAmount)}</em></p>\n";
    result += "<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n";
    return result;
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD",
        minimumFractionDigits: 2 }).format(aNumber/100);
}
````

* 이번에는 연극 장르를 추가해보자.
* 연극 장르라 함은 "comedy"와 같이 표기된걸 말한다.
* 그렇게 되면 `amountFor()` 함수를 건들고, 여기서 처리할 수 밖에 없다.
* `switch`문을 사용하게 되고, **확장이 될수록 골칫거리가 될 것이라는 것을 파악할 수 있다.**
* 이를 방지하려면 **구조적인 요소로 보완해야 한다.** 여기서 사용할 방법은 **다형성**이다.
* **조건부 로직을 다형성으로 바꾸기**를 사용할 것이다.
* 상속 계층을 구성하여 각각의 서브 클래스가 구체적인 계산 로직을 정의할 수 있도록 하자.
* 앞서 리팩토링을 해두었기 때문에 `createStatementData.js`에만 집중하면 된다.

````javascript
// createStatementData.js

export default function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount();
    statementData.totalVolumeCredits = totalVolumeCredits();
    return statementData;

    function enrichPerformance(aPerformance) { 
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result); 
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {
        let result = 0;
        switch (aPerformance.play.type) {
            case "tragedy": // 비극
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy": // 희극
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error('알 수 없는 장르: ${aPerformance.play.type}');
        }
        return result;
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    func totalVolumeCredits(data) {
        data.performances
            .reduce((total, p) => total + p.volumeCredits, 0); 
    }
}
````

## 공연료 계산기 만들기

* 위의 코드를 보면, `amountFor()` 함수가 `aPerformance`를 매개변수로 받는다.
* 그리고 그 안에서 `type`에 따라 계산로직이 분기되고 있다.
* `volumeCreditsFor()` 함수도 마찬가지다.
* 위의 두 함수를 전용 클래스로 옮기자. (`PerformanceCalculator`)

````javascript
// createStatementData.js

class PerformanceCalculator {
    constructor(aPerformance) {
        this.performance = aPerformance;
    }
}

export default function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount();
    statementData.totalVolumeCredits = totalVolumeCredits();
    return statementData;

    function enrichPerformance(aPerformance) { 
        const calculator = new PerformanceCalculator(aPerformance);
        const result = Object.assign({}, aPerformance);
        result.play = playFor(aPerformance);
        result.amount = amountFor(result); 
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {
        let result = 0;
        switch (aPerformance.play.type) {
            case "tragedy": // 비극
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy": // 희극
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error('알 수 없는 장르: ${aPerformance.play.type}');
        }
        return result;
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    func totalVolumeCredits(data) {
        data.performances
            .reduce((total, p) => total + p.volumeCredits, 0); 
    }
}
````

* 컴파일 - 테스트 - 커밋한다.
* 일단 이 계산기에서 모든 정보를 계산할 수 있도록 변경해보자.
* 연극 레코드를 계산하기 위해 해당 정보를 일단 안으로 받아보자.

````javascript
// createStatementData.js

class PerformanceCalculator {
    constructor(aPerformance, aPlay) { // 변경됨
        this.performance = aPerformance;
        this.play = aPlay; // 변경됨
    }
}

export default function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount();
    statementData.totalVolumeCredits = totalVolumeCredits();
    return statementData;

    function enrichPerformance(aPerformance) { 
        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance)); // 변경됨
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play; // 변경됨
        result.amount = amountFor(result); 
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    ...
}
````

## 함수들을 계산기로 옮기기

* 이 다음은 공연료 계산 로직이다.
* 여기서부터 작업이 좀 커진다.
* 일단 `amountFor()` 함수를 옮겨보자.
* 아예 `PerfomanaceCalculator` 클래스 안에서 작업 가능하도록 하자.

````javascript
// createStatementData.js

class PerformanceCalculator {
    constructor(aPerformance, aPlay) { 
        this.performance = aPerformance;
        this.play = aPlay; 
    }

    function amount() {
        let result = 0;
        switch (this.play.type) { // 변경됨
            case "tragedy":
                result = 40000;
                if (this.performance.audience > 30) { // 변경됨
                    result += 1000 * (this.performance.audience - 30); // 변경됨
                }
                break;
            case "comedy":
                result = 30000;
                if (this.performance.audience > 20) { // 변경됨 
                    result += 10000 + 500 * (this.performance.audience - 20); // 변경됨
                }
                result += 300 * this.performance.audience; // 변경됨
                break;
            default:
                throw new Error('알 수 없는 장르: ${this.play.type}'); // 변경됨
        }
        return result;
    }
}

export default function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount();
    statementData.totalVolumeCredits = totalVolumeCredits();
    return statementData;

    function enrichPerformance(aPerformance) { 
        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance)); 
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play; 
        result.amount = calculator.amount(); // 변경됨
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    func totalVolumeCredits(data) {
        data.performances
            .reduce((total, p) => total + p.volumeCredits, 0); 
    }
    ...
}
````

* `amountFor()` 함수를 `PerformanceCalculator` 클래스로 옮겼다.
* 다음은 적립 포인트 부분이다.

````javascript
// createStatementData.js

class PerformanceCalculator {
    constructor(aPerformance, aPlay) { 
        this.performance = aPerformance;
        this.play = aPlay; 
    }

    get amount() {
        let result = 0;
        switch (this.play.type) {
            case "tragedy":
                result = 40000;
                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (this.performance.audience > 20) { 
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error('알 수 없는 장르: ${this.play.type}');
        }
        return result;
    }

    get volumeCredits() {
        let result = 0;
        result += Math.max(this.aPerformance.audience - 30, 0); // 변경됨
        if ("comedy" === this.play.type) // 변경됨
            result += Math.floor(this.aPerformance.audience / 5); // 변경됨
        return result;
    }

}

export default function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount();
    statementData.totalVolumeCredits = totalVolumeCredits();
    return statementData;

    function enrichPerformance(aPerformance) { 
        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance)); 
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play; 
        result.amount = calculator.amount();
        result.volumeCredits = calculator.volumeCredits(); // 변경됨
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        data.performances
            .reduce((total, p) => total + p.volumeCredits, 0); 
    }
    ...
}
````

## 공연료 계산기를 다형성 버전으로 만들기

* 이제 `PerformanceCalculator` 클래스를 다형성으로 바꿔보자.
* 가장 먼저할 일은 **`.type` 대신 서브클래스를 사용하도록 바꾸는 것이다.** (**타입 코드를 서브클래스로 바꾸기**)
* 일단 팩토리 함수를 만들자.

````javascript
// createStatementData.js

function createPerformanceCalculator(aPerformance, aPlay) {
    switch(aPlay.type) {
        case "tragedy":
            return new TragedyCalculator(aPerformance, aPlay);
        case "comedy":
            return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error('알 수 없는 장르: ${aPlay.type}');
    }
}

class TragedyCalculator(aPerformance, aPlay) {
    
}

class ComedyCalculator(aPerformance, aPlay) {
    
}

class PerformanceCalculator {
    constructor(aPerformance, aPlay) { 
        this.performance = aPerformance;
        this.play = aPlay; 
    }

    get amount() {
        let result = 0;
        switch (this.play.type) {
            case "tragedy":
                result = 40000;
                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (this.performance.audience > 20) { 
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error('알 수 없는 장르: ${this.play.type}');
        }
        return result;
    }

    get volumeCredits() {
        let result = 0;
        result += Math.max(this.aPerformance.audience - 30, 0); // 변경됨
        if ("comedy" === this.play.type) // 변경됨
            result += Math.floor(this.aPerformance.audience / 5); // 변경됨
        return result;
    }

}

export default function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount();
    statementData.totalVolumeCredits = totalVolumeCredits();
    return statementData;

    function enrichPerformance(aPerformance) { 
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance)); 
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play; 
        result.amount = calculator.amount();
        result.volumeCredits = calculator.volumeCredits(); // 변경됨
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        data.performances
            .reduce((total, p) => total + p.volumeCredits, 0); 
    }
    ...
}

````

* 컴파일 - 테스트 - 커밋한다.
* 이제 다형성으로 바꿔보자.

````javascript
// createStatementData.js

function createPerformanceCalculator(aPerformance, aPlay) {
    switch(aPlay.type) {
        case "tragedy":
            return new TragedyCalculator(aPerformance, aPlay);
        case "comedy":
            return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error('알 수 없는 장르: ${aPlay.type}');
    }
}

class TragedyCalculator(aPerformance, aPlay) {

    get amount() { // 변경됨
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
    
}

class ComedyCalculator(aPerformance, aPlay) {

    get amount() { // 변경됨
        let result = 30000;
        if (this.performance.audience > 20) { 
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

}

class PerformanceCalculator {

    constructor(aPerformance, aPlay) { 
        this.performance = aPerformance;
        this.play = aPlay; 
    }

    get amount() {
        throw new Error('서브클래스에서 처리하도록 설계되었습니다.'); // 변경됨
    }

    get volumeCredits() {
        let result = 0;
        result += Math.max(this.aPerformance.audience - 30, 0);
        if ("comedy" === this.play.type)
            result += Math.floor(this.aPerformance.audience / 5);
        return result;
    }

}

export default function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount();
    statementData.totalVolumeCredits = totalVolumeCredits();
    return statementData;

    function enrichPerformance(aPerformance) { 
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance)); 
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play; 
        result.amount = calculator.amount();
        result.volumeCredits = calculator.volumeCredits(); // 변경됨
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        data.performances
            .reduce((total, p) => total + p.volumeCredits, 0); 
    }
    ...
}
````

* 컴파일 - 테스트 - 커밋한다.
* 다음으로는 `volumeCredits()` 함수를 옮겨보자.

````javascript
// createStatementData.js

function createPerformanceCalculator(aPerformance, aPlay) {
    switch(aPlay.type) {
        case "tragedy":
            return new TragedyCalculator(aPerformance, aPlay);
        case "comedy":
            return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error('알 수 없는 장르: ${aPlay.type}');
    }
}

class TragedyCalculator(aPerformance, aPlay) {

    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
    
}

class ComedyCalculator(aPerformance, aPlay) {

    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) { 
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    get volumeCredits() {  // 변경됨
        super.volumeCredits + Math.floor(this.aPerformance.audience / 5);
    }

}

class PerformanceCalculator {

    constructor(aPerformance, aPlay) { 
        this.performance = aPerformance;
        this.play = aPlay; 
    }

    get amount() {
        throw new Error('서브클래스에서 처리하도록 설계되었습니다.');
    }

    get volumeCredits() {
        Math.max(this.aPerformance.audience - 30, 0);
    }

}

export default function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount();
    statementData.totalVolumeCredits = totalVolumeCredits();
    return statementData;

    function enrichPerformance(aPerformance) { 
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance)); 
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play; 
        result.amount = calculator.amount();
        result.volumeCredits = calculator.volumeCredits();
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        data.performances
            .reduce((total, p) => total + p.volumeCredits, 0); 
    }
    ...
}
````

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
