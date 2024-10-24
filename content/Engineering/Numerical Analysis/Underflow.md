---
title: Underflow
thumbnail: ''
draft: false
tags:
- round-off-error
created: 2024-10-24
---

* 반올림 때문에 값이 **0이 되는 현상**을 말한다.
* 값이 잘못해서 정확히 0이 되면 문제소지가 많다.
  * 0으로 나누기.
  * $log0$ 계산. (값이 발산함)
    * $log0$은 음의 무한대로 발산한다.
    * 근데 실제 계산에서는 `NaN(Not a Number)`로 처리한다.
    * 그렇기 때문에 값을 더 왜곡시키는 효과가 있기 때문에 피해야 한다.
