---
title: Why we needed
thumbnail: ''
draft: false
tags:
- functional-programming
- java
created: 2023-10-01
---

# 소프트웨어의 혁신과 함수형 프로그래밍

* 소프트웨어를 통한 혁신은 왜 발생했는가?
* 인간의 추상적인 사고를 통해 발생한 아이디어를 컴퓨터의 극대화된 연산력을 통해 사용할 수 있게 되었기 때문.
* 이러한 시각은 크게 봐도 그렇고 개발자가 언어를 바라보든 작은 시각에서도 맞다.
* 즉, 컴퓨터와 인간의 소통을 편하게 하려는 방향으로 거시적으로, 미시적으로 발전해왔다.
* 함수형 프로그래밍도 이러한 맥락의 연장이라 생각할 수 있다.
* 새로운 문제 해결 방법이 나타났다면, 이를 익히는 것이 내 삶에도, 전체를 위해서도 맞지 않을까?

# 왜?

* 객체지향
  * 움직이는 부분을 캡슐화하여 이해를 돕는다.
  * 클래스 단위의 재사용 -> 큰 프레임워크 스타일의 재사용 선호
* 함수형
  * 움직이는 부분을 최소화하여 이해를 돕는다.
  * 세부적인 단계에서 쉽게 코드 재사용
  * 함수 수준에서의 재사용!

# 전환

````java
package com. nealford. ft. trans;
import java.util.List;
public class TheCompanyProcess {
  public String cleanNames (List<String> list0fNames) {
      StringBuilder result = new StringBuilder();
      for (int i = 0; i < listOfNames.size(); i++) {
          if (listOfNames.get(i). length () > 1) {
              result.append(capitalizeString(listOfNames.get(i))).append(",");
          }
      }
      return result. substring(0, result. length() - 1). toString();
  }

  public String capitalizeString (String s) {
    return s.substring(0, 1). toUpperCase() + s.substring(1, s. length());
  }
}
````

# Reference

* [Functional Thinking](http://www.yes24.com/Product/Goods/29029252)
