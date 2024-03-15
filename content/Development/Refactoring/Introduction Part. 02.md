---
title: Introduction Part. 02
thumbnail: ''
draft: false
tags:
- refactoring
- naming
created: 2023-10-02
---

임시 변수를 없애는 방법을 알아보자.

# statement 함수 쪼개기 (계속)

## play 변수 제거하기

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';
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
                throw new Error('알 수 없는 장르: ${play.type}');
        }
        return result;
    }
}
````

* `amountFor` 함수의 인자를 보던 도중, `play`가 필요없다는 것을 알게 되었다.
* play는 `aPerformance`에서 얻을 수 있다.
* 이런 경우 **임시 변수를 질의 함수로 바꾸기**를 사용한다.
* 즉, 임시로 변수로 할당해 놓는 경우, "해당 값을 가져와!" 라는 의도의 함수로 변경해서 처리한다는 말이다.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';
    const format = new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        const play = playFor(perf);
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
                throw new Error('알 수 없는 장르: ${play.type}');
        }
        return result;
    }

    func playFor(aPerformance) {
        return plays[aPerformance.playID];
    }
}


````

* 다시 또 컴파일 - 테스트 - 커밋한다.
* 그리고 "변수 인라인 하기"를 적용한다.
  * 굳이 변수로 빼지 않고, 바로 함수호출의 결과를 사용하는 방법
* `play` -> `playFor(perf)`로 변경한다.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';
    const format = new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        let thisAmount = 0;
        thisAmount = amountFor(perf, playFor(perf));
        
        //포인트를 적립한다.
        volumeCredits += Math.max(perf audience - 30, 0);
        //희극 관객 5명마다 추가 포인트를 제공한다.
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${format(thisAmount / 100)} (${perf.audience}석)\n';
        totalAmount += thisAmount;
    }
    result += '총액: ${format (totalAmount/100)}\n';
    result += '적립 포인트: ${volumeCredits)점 \n';
    ";
    return result;

    func amountFor(aPerformance, play) {
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

    func playFor(aPerformance) {
        return plays[aPerformance.playID];
    }
}
````

* 다시 또 컴파일 - 테스트 - 커밋한다.
* 일단 단순하게 함수로 죄다 대체해버린다.
* 생각해보니, 임시 변수를 함수로 대체함으로써, 일반화되게 다른 함수에서도 사용할 수 있게 만들었다는 것을 알 수 있다.
* 처음에는 왜 굳이? 라 생각했으나, 이 행위가 결국 **함수에서 의존성을 제거하는 행동**이라는 것을 알 수 있었다.
* **이렇게 놓고 보니, `amountFor` 함수의 `play` 인자는 더 이상 필요없다는 것을 알 수 있다.**
* 이를 삭제해주자.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';
    const format = new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        let thisAmount = 0;
        thisAmount = amountFor(perf);
        
        //포인트를 적립한다.
        volumeCredits += Math.max(perf audience - 30, 0);
        //희극 관객 5명마다 추가 포인트를 제공한다.
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${format(thisAmount / 100)} (${perf.audience}석)\n';
        totalAmount += thisAmount;
    }
    result += '총액: ${format (totalAmount/100)}\n';
    result += '적립 포인트: ${volumeCredits)점 \n';
    ";
    return result;

    func amountFor(aPerformance) {
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

    func playFor(aPerformance) {
        return plays[aPerformance.playID];
    }
}

````

* 다시 또 컴파일 - 테스트 - 커밋한다.
* 자, 이렇게 놓고 생각해보자. 누군가는 이렇게 말할 수 있다.
* "이전에는 `statement`에서 `play`를 얻어서 `amountFor`에게 전달했었는데, 이제는 `amountFor`가 `play`를 얻어서 사용하고 있다."
* "그러면서 **조회 빈도가 3배나 늘었다.** 이건 성능에 문제가 있을 수 있다."
* **하지만 이렇게 변경해도 성능에 큰 영향은 없다. 심각하게 느려지더라도 제대로 리팩터링 되었다면 성능 개선이 훨씬 수월하다.**
* 그럼에도 이렇게 지역 변수부터 제거하는 것은 추출하기가 매우 쉬워진다는데에 있다.
* **추출 작업 전에는 거의 항상 지역 변수부터 제거한다.**
* 이제 `amountFor` 함수에 필요한 인자를 모두 처리했으니, 이걸 호출했던 친구를 보자.
* `thisAmount = amountFor(perf);` 이렇게 사용하고 있고, 이건 단순히 값을 더하기 위해 사용중이다.
* 즉, 임시로 변수에 할당 중이다.
* 그럼 뭘해야 한다? -> 변수 인라인 하기.
* `thisAmount` 변수를 제거하고, `amountFor` 함수의 결과를 바로 대입하자.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';
    const format = new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        //포인트를 적립한다.
        volumeCredits += Math.max(perf audience - 30, 0);
        //희극 관객 5명마다 추가 포인트를 제공한다.
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience}석)\n';
        totalAmount += amountFor(perf);
    }
    result += '총액: ${format (totalAmount/100)}\n';
    result += '적립 포인트: ${volumeCredits)점 \n';
    ";
    return result;
}
````

## 적립 포인트 계산 코드 추출하기

* 일단 지금까지 결과를 보자.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';
    const format = new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        //포인트를 적립한다.
        volumeCredits += Math.max(perf.audience - 30, 0);
        //희극 관객 5명마다 추가 포인트를 제공한다.
        if ("comedy" === playFor(perf).type)
            volumeCredits += Math.floor(perf.audience / 5);
        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience}석)\n';
        totalAmount += amountFor(perf);
    }
    result += '총액: ${format (totalAmount/100)}\n';
    result += '적립 포인트: ${volumeCredits)점 \n';
    ";
    return result;
}
````

* 지역 변수를 없앤 효과가 보이는가?
* 지역 변수가 있다면, 함수를 추출할 때 있어 고려해야하는 대상이 추가되는 셈이다.
* 그런데, 이렇게 해두니, 함수의 결과로 대체되어, 적립포인트를 추출하기 더 편해졌다. (`volumeCredits` 계산)
* 일단 값을 계산하는 로직을 추출하고, 이 결과를 더하도록 변경해보자.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';
    const format = new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);

        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience}석)\n';
        totalAmount += amountFor(perf);
    }
    result += '총액: ${format (totalAmount/100)}\n';
    result += '적립 포인트: ${volumeCredits)점 \n';
    ";
    return result;
}

...

function volumeCreditsFor(perf) {
    let volumeCredits = 0;
    //포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);
    //희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === playFor(perf).type)
        volumeCredits += Math.floor(perf.audience / 5);
    return volumeCredits;
}
````

* 다시 또 컴파일 - 테스트 - 커밋한다.
* 단순히 옮기고 동작하니, `volumeCreditsFor`함수 내부 변수를 `result`로 고치자.

````javascript
function volumeCreditsFor(perf) {
    let result = 0;
    //포인트를 적립한다.
    result += Math.max(perf.audience - 30, 0);
    //희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === playFor(perf).type)
        result += Math.floor(perf.audience / 5);
    return result;
}
````

## Format 변수 제거하기

* 현 상황을 한번 보자.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';
    const format = new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);

        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience}석)\n';
        totalAmount += amountFor(perf);
    }
    result += '총액: ${format (totalAmount/100)}\n';
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

    function volumeCreditsFor(perf) {
        let result = 0;
        //포인트를 적립한다.
        result += Math.max(perf.audience - 30, 0);
        //희극 관객 5명마다 추가 포인트를 제공한다.
        if ("comedy" === playFor(perf).type)
            result += Math.floor(perf.audience / 5);
        return result;
    }
}

````

* 임시 변수는 자신이 속한 함수 안에서만 의미가 있기 때문에, 길고 복잡해져 문제를 일으키기 쉽다.
* 다음으로 만만한 건 이제 `format` 이다.
* 이걸 분리하고 모두 적용해보자.

````javascript
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: ${invoice.customers})\n';

    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);

        //청구 내역을 출력한다.
        result += '${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience}석)\n';
        totalAmount += amountFor(perf);
    }
    result += '총액: ${format (totalAmount/100)}\n';
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

    function format(aNumber) {
        return new Intl.NumberFormat("en-Us", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber);
    }
}


````

* 다시 또 컴파일 - 테스트 - 커밋한다.
* 그런데 이름이 걸린다. `format`이라는 이름은 너무 일반적이다.
* 적절한 이름인 `usd`로 변경하자. 또한 변환 로직(`/100`)도 `usd`함수 안으로 옮기자.

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

* 다시 또 컴파일 - 테스트 - 커밋한다.
* 긴 함수를 작게 쪼개는 리팩터링은 **이름을 잘 지어야만 효과가 있다.**
* 단번에 좋은 이름을 짓기는 쉽지 않다. 당장의 최선을 사용하다 바꾸도록 하자.

## Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
