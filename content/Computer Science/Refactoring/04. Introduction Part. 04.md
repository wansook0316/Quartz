---
title: Introduction Part. 04
thumbnail: ''
draft: false
tags:
- refactoring
- nested-function
created: 2023-10-02
---

정리한 함수를 다시보자. 편함을 위해 중첩상태가 너무 많아졌다.

# 중간 점검: 난무하는 중첩함수

````javascript
function statement(invoice, plays) {
    let result = '청구 내역 (고객명: ${invoice.customers})\n';

    for (let perf of invoice.performances) {
        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n';
    }
    result += '총액: ${usd(totalAmount())}\n';
    result += '적립 포인트: ${totalVolumeCredits())점 \n';
    ";
    return result;

    function amountFor(aPerformance) {
        let result = 0;
        switch (playFor(aPerformance).type) {
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
                throw new Error('알 수 없는 장르: ${playFor(aPerformance).type}');
        }
        return result;080187
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function usd(aNumber) {
        return new Intl.NumberFormat("en-Us", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber / 100);
    }

    function totalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of invoice.performances) {
            volumeCredits += volumeCreditsFor(perf);
        }
        return volumeCredits;
    }

    function totalAmount() {
        let totalAmount = 0;
        for (let perf of invoice.performances) {
            totalAmount += amountFor(perf);
        }
        return totalAmount;
    }
}

````

* 지금까지의 결과를 보면 계산 로직을 모두 빼냈다는 것을 알 수 있다.
* 하지만 아직 함수 안에 들어가 있는 중첩함수 상태이다.

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
