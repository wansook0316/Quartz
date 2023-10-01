---
title: Lazy Evaluation
thumbnail: ''
draft: false
tags:
- swift
- functional-programming
- lazy-evaluation
- lazy-loading
- lazy
created: 2023-10-01
---

lazy property를 사용해본 경험이 있다. 해당 아이디어는 함수형 프로그래밍 언어에서 주로 사용한다. 이번에는 지연 계산법이 무엇인지, 그리고 Lazy와 unfold sequence에 대해 알아본다.

# Lazy Evaluation

* [Lazy Evalutation](https://ko.wikipedia.org/wiki/느긋한_계산법)
* 표현의 평가를 최대한 늦춤
* Lazy Property
  * 값을 사용하기전에는 생성하고 있지 않다가 접근하는 순간 생성
* Lazy Collection
  * Element들을 한꺼번에 미리 연산하지 않고 필요에 따라 하나씩 처리
  * Collection 내부 개수가 10만개
  * map을 통해 transform을 하는 경우
  * 만약 3번이면 30만번의 연산
    * 매우 큰 비용
    * 전부를 사용한다면 몰라도 일부만 사용한다면 비효율적
* 장점
  * 시간이 많이 걸리는 연산을 필요할 때까지 미룸
  * 무한 Collection을 만들 수 있음
    * 0, 1이 무한이 반복되는 Collection
  * map, flatMap, filter등도 lazy하게 처리해서 효율 높은 code를 만들 수 있음

## Lazy

* Lazy Property
* LazySequence
  ````swift
  let array1 = Array(0..<10000)
  let array2 = array1.lazy.map { $0 + 1 }
  print("\(array2[0])", "\(array2[4])")
  ````
  
  * line 2번에서 실제 계산하지 않음
  * 3번 line에서 0, 4만 transform하여 사용됨
  * RandomAccessCollection
    * LazyCollectionProtocol
      * LazySequenceProtocol
        * Sequence
        * 즉, Sequence의 모든 함수를 사용가능
        * 동작만 lazy하게
  * map, flatMap, filter는 값 접근 전까지 동작하지 않음
  * 아쉬운 점
    * lazy Property가 RandomAccessCollection에 존재하기 때문에, 적어도 한번은 Collection을 만들고 `.lazy`로 접근해야 함
    * 피보나치 수열 같이 초기값을 필요로 하는 Sequence를 구현하기 어려움
    * 무한 Collection을 구현할 수 없음

## UnfoldSequence

* Swift-Evolution 0094
* 어떤 가변 상태에 따라 Closure를 반복적으로 적용해서 element들이 만들어지는 sequence
* 각 element는 lazy하게 계산되며 무한의 길이를 가질 수 있음
* 사용방법
  * 무한 Sequence
    ````swift
    let seq = sequence(first: 0.1, next: { $0 * 2 }).dropFirst(5).prefix(10)
    for x in seq {
        NSLog("\(x))
    }
    ````
    
    * 만약 prefix로 제한을 걸지 않으면 for는 무한루프가 됨
    * `dropFirst(n)`는 앞의 n개를 버리는 함수
  * 피보나치 수열
    ````swift
    func next(pair: inout (Int, Int)) -> Int {
        pair = (pair.1, pair.0 + pair.1
        return pair.1)
    }
    
    var seq = sequence(state: (0, 1), next: next).prefix(20)
    
    for x in seq {
        print("\(x)")
    }
    ````
    
    * prefix 걸지않으면 overflow
    * `inout`을 사용하여 pair안의 값을 계속해서 바꿈
