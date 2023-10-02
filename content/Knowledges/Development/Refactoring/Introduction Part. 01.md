---
title: Introduction Part. 01
thumbnail: ''
draft: false
tags: null
created: 2023-10-02
---

리팩토링 1장을 시작해본다.

# 들어가면서

* 예시가 먼저나온다. 리팩터링이 뭔지 알려주는 단계이다.
* 이 책은 리팩터링이 무엇인지 알려주고, 이를 객체지향 방식으로 개선하는 것을 소개한다.
* 가장 핵심인 부분은 뒤의 카탈로그이다. 수시로 찾아보면서 적용하는 방식으로 사용해라. (마치 디자인 패턴 같네)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)에 소스가 있다.
* **개념을 이해해야 처한 상황에 적용할 수 있다.**

# 자, 시작해보자.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: sfinvoice.customers) \n';
    const format = new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;
        switch (play.type) {
            case "tragedy": // 비극
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy": // 희극
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error('알 수 없는 장르: sfplay.typer');
        }

        //포인트를 적립한다.
        volumeCredits += Math.max(perf audience - 30, 0);
        //희극 관객 5명마다 추가 포인트를 제공한다.
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
        //청구 내역을 출력한다.
        result += '${play.name}: ${format(thisAmount / 100)} (${perf.audience}석)\n';
        totalAmount += thisAmount;
    }
    result += '총액: ${format (totalAmount/100)}\n';
    result += '적립 포인트: ${volumeCredits)점 \n';
    ";
    return result;
}
````

# 예시 프로그램을 본 소감

* 한 함수가 50줄이 넘어가고, 추상화가 안된 코드가 있다고 하자.
* 코드가 굉장히 지저분하다.
* 그런데 지저분하다고 고친다는 것은 당위성이 충분할까?
* 사실 컴파일러 입장에서는 별 중요한게 아니다.
* 하지만 우리는 **사람**과 함께 일한다.
* 사람은 코드의 미적 상태에 민감하다.

 > 
 > 프로그램이 새로운 기능을 추가하기에 편한 구조가 아니라면, 먼저 기능을 추가하기 쉬운 상태로 **리팩터링하고 나서 원하는 기능을 추가한다.**

# 리팩터링의 첫 단계

* 테스트 코드들 부터 마련한다.
* 이는 굉장히 중요하다.
* 사람은 누구나 실수할 수 있다.
* `statement` 함수를 보면, 결국 공연로 청구서를 만드는 작업이다.
* 이런 경우 결과값을 미리 몇개 작성해두고 (json) 테스트 프레임워크로 단축키 하나로 동작할 수 있게 설정하자.

 > 
 > 리팩터링하기 전에, 제대로 된 테스트부터 마련한다. 테스트는 반드시 자가진단하도록 만든다.

## statement 함수 쪼개기

* 일단 `statement`함수를 리팩터링 해보자.
* 이렇게 긴 함수의 경우에는 **전체의 동작을 각각의 부분으로 나눌 수 있는 지점을 찾는다.**
* 중간 부분의 `switch`문을 보자.

````javascript
switch (play.type) {
    case "tragedy": // 비극
        thisAmount = 40000;
        if (perf.audience > 30) {
            thisAmount += 1000 * (perf.audience - 30);
        }
        break;
    case "comedy": // 희극
        thisAmount = 30000;
        if (perf.audience > 20) {
            thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
    default:
        throw new Error('알 수 없는 장르: sfplay.typer');
}
````

* 한 번의 공연에 대한 요금을 계산하고 있다.
* 이는 코드를 분석해서 얻은 정보다. 휘발성이 높다.
* 그렇기 때문에, 해당 코드에 추가적인 의미를 부여하여 함수로 빼두자.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: sfinvoice.customers) \n';
    const format = new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;
        thisAmount = amountFor(perf, play);
        
        //포인트를 적립한다.
        volumeCredits += Math.max(perf audience - 30, 0);
        //희극 관객 5명마다 추가 포인트를 제공한다.
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
        //청구 내역을 출력한다.
        result += '${play.name}: ${format(thisAmount / 100)} (${perf.audience}석)\n';
        totalAmount += thisAmount;
    }
    result += '총액: ${format (totalAmount/100)}\n';
    result += '적립 포인트: ${volumeCredits)점 \n';
    ";
    return result;

    func amountFor(pert, play) {
        let thisAmount = 0;
        switch (play.type) {
            case "tragedy": // 비극
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy": // 희극
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error('알 수 없는 장르: sfplay.typer');
        }
        return thisAmount;
    }
}


````

* 이렇게 리팩토링 했다면, 바로 컴파일 한다.
* **조금씩 수정하여 피드백 주기를 짧게 가져가는 습관이 실수하는 재앙을 피하는 길이다.**

 > 
 > 리팩토링은 프로그램 수정을 작은 단계로 나눠 진행한다.

* 이렇게 수정했다면, 바로 로컬 버전 관리 시스템에 커밋한다.
* 하나의 리팩터링을 문제 없이 끝낼 때마다 커밋한다. 그래야 이전 상태로 빨리 되돌릴 수 있다.
* **일단 옮겨서 동작하는 것을 확인했으니** (이부분이 중요..), 내부 함수의 표현을 변경해보자.
* `thisAmount` -> `result`

````javascript
func amountFor(pert, play) {
    let result = 0;
    switch (play.type) {
        case "tragedy": // 비극
            result = 40000;
            if (perf.audience > 30) {
                result += 1000 * (perf.audience - 30);
            }
            break;
        case "comedy": // 희극
            result = 30000;
            if (perf.audience > 20) {
                result += 10000 + 500 * (perf.audience - 20);
            }
            result += 300 * perf.audience;
            break;
        default:
            throw new Error('알 수 없는 장르: sfplay.typer');
    }
    return result;
}
````

* 다음으로는 `aPerf`가 애매하니 이걸 `aPerformance`로 바꾸자.

````javascript
func amountFor(aPerformance, play) {
    let result = 0;
    switch (play.type) {
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
            throw new Error('알 수 없는 장르: sfplay.typer');
    }
    return result;
}
````

* 부정관사를 붙이면 좋다고 한다.
* 그런데 이 부분은 언어의 코드 컨벤션에 따라 달라질 듯 하다.

 > 
 > 사람이 이해하도록 작성하는 프로그래머가 진정한 실력자다.

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
