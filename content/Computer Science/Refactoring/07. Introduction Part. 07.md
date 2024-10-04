---
title: Introduction Part. 07
thumbnail: ''
draft: false
tags:
- refactoring
- polymorphism
created: 2023-10-02
---

마지막으로 변경된 코드를 보며 생각해보자.

# 상태 점검: 다형성을 활용하여 데이터 생성하기

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

* 이번 수정으로 연극 장르별 계산 코드들을 함께 묶었다.
* 새로운 장르를 추가하려면 서브클래스 작성 후 팩토리 함수에 추가만 하면 된다.

# 마치며

* 다음과 같은 기법을 적용해봤다.
  * 함수 추출하기: 로직을 일단 그대로 떼서 함수로 뺌
  * 변수 인라인 하기: 임시 변수를 사용하기 않고 함수 자체를 호출하도록 변경
  * 함수 옮기기: 더 좋은 위치의 모듈로 이동
  * 조건부 로직을 다형성으로 바꾸기
* 좋은 코드를 가늠하는 확실한 방법은 **얼마나 수정하기 쉬운가**이다.
* 이번 예시를 통해 **리팩터링 하는 리듬**을 배웠으면 한다.
* **단계를 생각보다 굉장히 작게 나누었다.**
* 여러개의 단계를 넘기고 한번에 처리하려는 유혹을 줄이고, 단순하게 처리했다.
* **오히려 더 잘게 나눠야 빨리 처리할 수 있다.**
* 이 작은 단계들이 모여 큰 변화를 가져온다. 이 점을 명심하자.

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
