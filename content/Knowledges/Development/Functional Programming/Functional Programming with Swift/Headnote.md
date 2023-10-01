---
title: Headnote
thumbnail: ''
draft: false
tags:
- functional-programming
- FP
- tail-call-optimization
- swift
created: 2023-09-30
---

OOP 다음으로 떠오르는 패러다임인 FP에 대해서 알아보자. 물론 FP는 OOP보다 먼저 등장했다. 그렇다면 갑자기 왜 등장하게 되었을까? FP의 장점과 개념을 이해하면서 알아가보자.

# Functional Programming

* 자료 처리를 수학적 함수의 계산으로 취급
* 상태와 가변 데이터를 피함
  * 변수가 없다.
* Side-Effect가 없음
  * 잘못된 code로 인한 오작동의 의미가 아님
  * 실행 결과 상태 변화를 일으키는 모든 것
  * 해당 코드의 실행으로 인해 결과값을 변경시킬 수 있는 모든 것
* Function이란?
  * 변수 x와 y사이의 관계 매핑(사상)
* 떠오르는 Paradigm
  * OOP이후 가장 큰 패러다임 중 하나
  * SDK에도 들어가는 개념
  * Functional Programming 스타일을 사용한다고 해서 Functional Programming을 한다고 할 수 없음
  * 동일한 문제의 해법에 대해 새로운 시각이라 생각해야 함
* var와 loop가 없는 코드
  * 순수 함수형 프로그래밍 언어에는 변수와 loop가 없다.
  * 이 가정을 하고 구구단 코드를 만들어보자.
    ````Swift
    func gugudan(left: Int, right: Int) {
        if left > 9 || right > 0 {
            return
        }
        print("\(left) x \(right) = \(left * right)")
        
        if right <= 9 {
            gugudan(left: left, right: right+1)
        } else {
            gugudan(left: left + 1, right: 1)
        }}
    }
    
    gugudan(left: 1, right: 1)
    ````
  
  * 이렇게 재귀로 짜야 한다.
    * 재귀는 Stack Overflow나지 않나? 함수콜이 Stack에 계속 쌓이니까.
      * [Tail Call Optimization(TCO)](https://en.wikipedia.org/wiki/Tail_call)
      * [Tail Call Optimization 쉬운 설명](https://medium.com/pocs/tail-call-recursion-79176631fc1)
        * 요약
          * Stack에는 함수가 종료될 때, 돌아가야 하는 주소를 가지고 있다.
          * 그런데, 만약 함수 return 부분에 다른 함수를 호출만 하고 종료하는 경우라면, 호출한 함수로 돌아올 이유가 없다.
            * 추가 계산이 필요없기 때문
          * 이런 경우, 호출한 함수의 돌아올 주소를 Stack에 저장하지 않아 공간을 절약할 수 있다.
          * 이것을 Tail Call Optimization이라 한다.
  * 갑자기 딱, 풀려고 하니 갑자기 바보가 된 기분이 든다.
  * 사고의 전환을 해야 한다..

# 기본적인 세 종류의 Function

* **Pure Function**
  * 동일한 input에 대해 항상 동일한 output을 반환
  * Parameter이외에 연산에 필요한 정보가 없다.
    * 변화하는 전역 변수를 가져와서 쓴다던가 하는 행위 금지
  * input된 내용을 변경하지 않음
    * 파라미터의 값을 변경할 수 없음
  * Side-Effect가 없다.
    * 실행이 외부에 영향을 끼치지 않는다.
  * Thread에 안전하고, 병렬 계산이 가능하다.
* **Anomymous Function**
  * Closure, Block
* **Higher-Order Function**
  * Function을 Parameter로 받는 function
  * Function을 return value로 사용하는 Function
  * Closure를 입력받는 Function들은 Higher-Order Function
* 예시
  ````Swift
  import Foundation
  
  // Anonymous function
  let inRange: (Int) -> Bool = { (_ value: Int) -> Bool in
      return value <= 9
  }
  
  // Pure Function
  func print(left: Int, right: Int) {
      print("\(left) x \(right) = \(left * right)")
  }
  
  // higher Order Function
  func gugudan(left: Int, right: Int, checker: (Int) -> Bool) {
      if checker(left) == false || checker(right) == false {
          return
      }
      print(left: left, right: right)
      
      if checker(right + 1) {
          gugudan(left: left, right: right+1, checker: checker)
      } else {
          gugudan(left: left + 1, right: 1, checker: checker)
      }
  }
  
  gugudan(left: 1, right: 1, checker: inRange)
  ````
