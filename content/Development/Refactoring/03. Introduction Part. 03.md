---
title: Introduction Part. 03
thumbnail: ''
draft: false
tags:
- refactoring
created: 2023-10-02
---

임시 변수 제거를 계속해보자. 성능과 리팩터링의 관계는 어떨까?

# statement 함수 쪼개기 (계속)

## VolumeCredits 변수 제거하기

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';

    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);

        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n';
        totalAmount += amountFor(perf);
    }
    result += '총액: ${usd(totalAmount)}\n';
    result += '적립 포인트: ${volumeCredits)점 \n';
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
        return result;
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
}


````

* `volumeCredits` 변수는 반복문을 돌며 값을 누적하고 있다. 조금더 까다로운 경우다.
* **반복문 쪼개기**로 `volumeCredits`을 더하는 부분을 빼자.
* 이는 동작 흐름을 명확히 분리하기 위한 작업이다.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';

    for (let perf of invoice.performances) {
        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n';
        totalAmount += amountFor(perf);
    }
    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);
    }
    
    result += '총액: ${usd(totalAmount)}\n';
    result += '적립 포인트: ${volumeCredits)점 \n';
    ";
    return result;
}
````

* 다시 또 컴파일 - 테스트 - 커밋한다.
* 그 다음으로 **문장 슬라이드**를 적용해서 `volumeCredits` 변수를 반복문 앞으로 옮겨보자.
* 변수 선언과 동작은 수직 위치가 가까울 수록 가독성이 높아진다.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';

    for (let perf of invoice.performances) {
        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n';
        totalAmount += amountFor(perf);
    }
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);
    }
    
    result += '총액: ${usd(totalAmount)}\n';
    result += '적립 포인트: ${volumeCredits)점 \n';
    ";
    return result;
}
````

* 다시 컴파일 - 테스트 - 커밋한다.
* `volumeCredits` 변수 역시 임시 변수이다. 이를 제거하기 위해 **함수 추출하기**를 적용해보자.
  * 혹은 **임시 변수를 질의 함수로 바꾸기**로 생각할 수도 있겠다.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';

    for (let perf of invoice.performances) {
        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n';
        totalAmount += amountFor(perf);
    }
    let volumeCredits = totalVolumeCredits();
    result += '총액: ${usd(totalAmount)}\n';
    result += '적립 포인트: ${volumeCredits)점 \n';
    ";
    return result;

    function totalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of invoice.performances) {
            volumeCredits += volumeCreditsFor(perf);
        }
        return volumeCredits;
    }
}
````

* 다시 컴파일 - 테스트 - 커밋한다.
* 또 임시 변수(`volumeCredits`)를 제거하기 위해 **변수 인라인하기**를 적용해보자.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';

    for (let perf of invoice.performances) {
        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n';
        totalAmount += amountFor(perf);
    }
    result += '총액: ${usd(totalAmount)}\n';
    result += '적립 포인트: ${totalVolumeCredits())점 \n';
    ";
    return result;

    ...

    function totalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of invoice.performances) {
            volumeCredits += volumeCreditsFor(perf);
        }
        return volumeCredits;
    }
}
````

* 다시 컴파일 - 테스트 - 커밋한다.
* 자, 잠깐 생각해보자. 우리는 for문을 두개 만들었다. 2배의 시간복잡도가 생겼다 할 수 있다.
* **하지만 이정도 중복은 성능에 미치는 영향이 미미할 때가 많다.** 
* **똑똑한 컴파일러들은 최신 캐싱 기법으로 무장하고 있어 직관을 초월하는 결과를 보여준다.**
* 물론 때때로 리팩토링이 성능에 상당한 영향을 주기도 한다.
* **하지만 그럼에도 리팩토링 한다.**
* 잘 다듬어져 있다면 성능 개선도 수월하다.

 > 
 > 리팩터링으로 인한 성능 문제는 **특별한 경우가 아니라면 일단 무시해라.**

## TotalAmount 변수 제거하기

* 같은 방식으로 처리하자.
* 반복문을 쪼개고, 초기화 문장의 위치를 옮기고, 함수를 추출하자.
* 그런데 여기서 totalAmount라는 함수 이름을 사용하려 했으나, 이미 같은 이름의 변수가 있다.
* 이런 경우 **임시 이름을 붙여준다.**

````javascript
function statement(invoice, plays) {
    let result = '청구 내역 (고객명: ${invoice.customers})\n';

    for (let perf of invoice.performances) {
        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n';
    }
    result += '총액: ${usd(appleSauce())}\n';
    result += '적립 포인트: ${totalVolumeCredits())점 \n';
    ";
    return result;

    ...

    function appleSauce() {
        let totalAmount = 0;
        for (let perf of invoice.performances) {
            totalAmount += amountFor(perf);
        }
        return totalAmount;
    }
}
````

* 다시 컴파일 - 테스트 - 커밋한다.
* 일단 이렇게 해놓고, 함수이름을 변경한다.

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
}

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
    return result;

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

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
