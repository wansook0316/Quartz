---
title: Introduction Part. 05
thumbnail: ''
draft: false
tags:
- refactoring
created: 2023-10-02
---

우리가 하고 싶었던 HTML을 만들기 위해 계산 단계와 포맷팅 단계를 분리하는 작업을 진행해보자.

# 계산 단계와 포맷팅 단계 분리하기

````javascript

function statement(invoice, plays) {
    let result = "청구 내역 (고객명: ${invoice.customer})\n";
    for (let perf of invoice.performances) {
      result += " ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n";
    }
    result += "총액: ${usd(totalAmount())}\n";
    result += "적립 포인트: ${totalVolumeCredits()}점\n";
    return result;

    function totalAmount() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += amountFor(perf);
        }
        return result;
    }

    function amountFor(aPerformance) {
        let result = 0;
        switch (playFor(aPerformance).type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
            result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
            result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`unknown type: ${playFor(aPerformance).type}`);
        }
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
            { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format(aNumber/100);
    }

    func totalVolumeCredits() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += volumeCreditsFor(perf);
        }
        return result;
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        // add volume credits
        result += Math.max(aPerformance.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }
}
````

* 지금까지 진행한 과정은 구조를 보강하는데 주안점을 두었다.
* 기능을 추가하기 전에 코드를 리팩토링 했고,
* 이제 스펙을 추가해야 한다.
* `statement()` 함수의 결과를 HTML로 변경하는 것을 처리해보자.
* HTML 버전을 만든다고 해서 `statement()` 함수를 복사해서 구현을 변경할 수는 없다.
* 계산은 동일하게 하되, 표현만 변경되게 해야 한다.
* 이런 경우 **단계 쪼개기**를 사용하자. 핵심은 중간 데이터 구조를 생성하고, 이를 다른 방식으로 표현하도록 하는 것이다.
* **단계 쪼개기**를 사용하기 위해서는 어디까지가 계산인지를 알아내어 추출해야 한다. 이 단계에서 **함수 추출하기**를 사용한다.
* 위 경우에서는 `statement()` 함수의 본문 전체를 추출하자.

````javascript
function statement(invoice, plays) {
    return renderPlainText(invoice, plays);
}

function renderPlainText(invoice, plays) {
    let result = "청구 내역 (고객명: ${invoice.customer})\n";
    for (let perf of invoice.performances) {
      result += " ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n";
    }
    result += "총액: ${usd(totalAmount())}\n";
    result += "적립 포인트: ${totalVolumeCredits()}점\n";
    return result;
}

...
````

* 다시 컴파일-테스트-커밋을 수행한다.
* 이제 중간 단계 데이터 구조를 할 객체를 만들어 넣어보자.

````javascript
function statement(invoice, plays) {
    const statementData = {};
    return renderPlainText(statementData, invoice, plays);
}

function renderPlainText(data, invoice, plays) {
    let result = "청구 내역 (고객명: ${invoice.customer})\n";
    for (let perf of invoice.performances) {
      result += " ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n";
    }
    result += "총액: ${usd(totalAmount())}\n";
    result += "적립 포인트: ${totalVolumeCredits()}점\n";
    return result;
}
````

* 이제 `invoice`, `plays`를 중간 데이터 구조로 옮기자.
* `invoice`부터 옮겨보자. 일단 필요해보이는 건 `customer` 뿐이다.

````javascript
function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    return renderPlainText(statementData, invoice, plays);
}

function renderPlainText(data, invoice, plays) {
    let result = "청구 내역 (고객명: ${data.customer})\n";
    for (let perf of invoice.performances) {
      result += " ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n";
    }
    result += "총액: ${usd(totalAmount())}\n";
    result += "적립 포인트: ${totalVolumeCredits()}점\n";
    return result;
}
````

* 다시 컴파일-테스트-커밋을 수행한다.
* 그 다음으로는 `performaces`를 옮겨보자.

````javascript
function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer; // 변경됨
    statementData.performances = invoice.performances; // 변경됨
    return renderPlainText(statementData, invoice, plays);
}

function renderPlainText(data, plays) {
    let result = "청구 내역 (고객명: ${data.customer})\n";
    for (let perf of data.performances) {
      result += " ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n";
    }
    result += "총액: ${usd(totalAmount())}\n";
    result += "적립 포인트: ${totalVolumeCredits()}점\n";
    return result;

    ... 

    function totalAmount() {
        let result = 0;
        for (let perf of data.performances) { // 변경됨
            result += amountFor(perf);
        }
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }
}
````

* 다시 컴파일-테스트-커밋을 수행한다.
* `playFor(aPerformance)` 함수를 보자.
* 결국 하는 행위는, 어떠한 공연에 대한 연극 정보를 가져오는 것이다.
* 가져온 정보는 `result`에 추가한다.
* 그런데 굳이 이렇게 할 필요없이, 바깥쪽에서 `data`를 넣어주는 시점에 `play` 정보도 알 수 있으면 좋지 않을까?
* 보다 단순한 방식이다.
* 처리해보자.

````javascript
function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance); // 변경됨
    return renderPlainText(statementData, plays);

    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance); // 얕은 복사 수행
        return result;
    }
}
````

* 다시 컴파일-테스트-커밋을 수행한다.
* 이렇게 하는 이유는 함수의 인자로 넘긴 데이터를 변경하고 싶지 않기 때문이다.
* 이제 `play`정보를 넣어주러 가보자.

````javascript
function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    return renderPlainText(statementData, plays);

    function enrichPerformance(aPerformance) { 
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result); // play 정보를 중간 데이터로 옮김
        return result;
    }

    function playFor(aPerformance) { // renderPlainText()의 중첩 함수였다가 statement()의 하위로 옮김
        return plays[aPerformance.playID];
    }
}

function renderPlainText(data, plays) {
    let result = "청구 내역 (고객명: ${data.customer})\n";
    for (let perf of data.performances) {
      result += " ${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n"; // play 정보를 사용하도록 변경
    }
    result += "총액: ${usd(totalAmount())}\n";
    result += "적립 포인트: ${totalVolumeCredits()}점\n";
    return result;

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === aPerformance.play.type) 
            result += Math.floor(aPerformance.audience / 5);
        return result;
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

    function totalAmount() {
        let result = 0;
        for (let perf of data.performances) {
            result += amountFor(perf);
        }
        return result;
    }
}
````

* 다시 컴파일-테스트-커밋을 수행한다.
* `amountFor(aPerformance)` 역시 공연 정보에 로직이 귀속되므로, 그 안에 정보를 계산해서 넣어주자.
* 변경해보자.

````javascript
function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    return renderPlainText(statementData, plays);

    function enrichPerformance(aPerformance) { 
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result); // 중간 데이터에 amount 정보를 저장
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

}

function renderPlainText(data, plays) {
    let result = "청구 내역 (고객명: ${data.customer})\n";
    for (let perf of data.performances) {
      result += " ${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n"; // play 정보를 사용하도록 변경
    }
    result += "총액: ${usd(totalAmount())}\n";
    result += "적립 포인트: ${totalVolumeCredits()}점\n";
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
            { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format(aNumber/100);
    }

    function totalAmount() {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.amount; // 중간 데이터를 사용하도록 변경
        }
        return result;
    }

    func totalVolumeCredits() {
        let result = 0;
        for (let perf of data.performances) { // 중간 데이터를 사용하도록 변경
            result += volumeCreditsFor(perf);
        }
        return result;
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        // add volume credits
        result += Math.max(aPerformance.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }

}
````

* 컴파일-테스트-커밋을 수행한다.
* 이제 적립 포인트 계산 부분을 옮기자.

````javascript
function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    return renderPlainText(statementData, plays);

    function enrichPerformance(aPerformance) { 
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result); 
        result.volumeCredits = volumeCreditsFor(result); // 중간 데이터에 volumeCredits 정보를 저장
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

    function volumeCreditsFor(aPerformance) { // 적립 포인트 계산 부분을 옮김
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }

}

function renderPlainText(data, plays) {
    let result = "청구 내역 (고객명: ${data.customer})\n";
    for (let perf of data.performances) {
      result += " ${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n";
    }
    result += "총액: ${usd(totalAmount())}\n";
    result += "적립 포인트: ${totalVolumeCredits()}점\n";
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
            { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format(aNumber/100);
    }

    function totalAmount() {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.amount; 
        }
        return result;
    }

    func totalVolumeCredits() {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.volumeCredits; // 중간 데이터를 사용하도록 변경
        }
        return result;
    }
}
````

* 컴파일-테스트-커밋을 수행한다.
* 마지막으로 총합(적립 포인트, amount)을 구하는 부분을 옮기자.

````javascript
function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(); // 총합을 구하는 부분을 옮김
    statementData.totalVolumeCredits = totalVolumeCredits(); // 총합을 구하는 부분을 옮김
    return renderPlainText(statementData, plays);

    function enrichPerformance(aPerformance) { 
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result); 
        result.volumeCredits = volumeCreditsFor(result); // 중간 데이터에 volumeCredits 정보를 저장
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

    function volumeCreditsFor(aPerformance) { // 적립 포인트 계산 부분을 옮김
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function totalAmount(data) {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.amount; 
        }
        return result;
    }

    func totalVolumeCredits(data) {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.volumeCredits; // 중간 데이터를 사용하도록 변경
        }
        return result;
    }

}

function renderPlainText(data, plays) {
    let result = "청구 내역 (고객명: ${data.customer})\n";
    for (let perf of data.performances) {
      result += " ${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n";
    }
    result += "총액: ${usd(data.totalAmount)}\n";
    result += "적립 포인트: ${data.totalVolumeCredits}점\n";
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
            { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format(aNumber/100);
    }

}
````

* 컴파일-테스트-커밋을 수행한다.
* 이렇게까지 하니, **반복문을 파이프라인으로 바꾸기**까지 적용할 수 있는 상태가 되었다.

````javascript
function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount();
    statementData.totalVolumeCredits = totalVolumeCredits();
    return renderPlainText(statementData, plays);

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
            .reduce((total, p) => total + p.amount, 0); // 반복문을 파이프라인으로 바꾸기
    }

    func totalVolumeCredits(data) {
        data.performances
            .reduce((total, p) => total + p.volumeCredits, 0);  // 반복문을 파이프라인으로 바꾸기
    }

}

function renderPlainText(data, plays) {
    let result = "청구 내역 (고객명: ${data.customer})\n";
    for (let perf of data.performances) {
      result += " ${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n";
    }
    result += "총액: ${usd(data.totalAmount)}\n";
    result += "적립 포인트: ${data.totalVolumeCredits}점\n";
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
            { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format(aNumber/100);
    }

}
````

* 컴파일-테스트-커밋을 수행한다.
* 다음으로는 `statementData`를 생성하는 부분을 분리하자.

````javascript
function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));

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

function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount();
    statementData.totalVolumeCredits = totalVolumeCredits();
    return statementData;
}

function renderPlainText(data) {
    let result = "청구 내역 (고객명: ${data.customer})\n";
    for (let perf of data.performances) {
      result += " ${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n";
    }
    result += "총액: ${usd(data.totalAmount)}\n";
    result += "적립 포인트: ${data.totalVolumeCredits}점\n";
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
            { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format(aNumber/100);
    }

}
````

* 컴파일-테스트-커밋을 수행한다.
* 이제 파일까지 분리해보자.

````javascript
// statement.js

import createStatementData from './createStatementData.js';

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    let result = "청구 내역 (고객명: ${data.customer})\n";
    for (let perf of data.performances) {
      result += " ${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n";
    }
    result += "총액: ${usd(data.totalAmount)}\n";
    result += "적립 포인트: ${data.totalVolumeCredits}점\n";
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
            { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format(aNumber/100);
    }
}

````

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

* 컴파일-테스트-커밋을 수행한다.
* 이제 HTML 버전을 작성해보자.

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

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
