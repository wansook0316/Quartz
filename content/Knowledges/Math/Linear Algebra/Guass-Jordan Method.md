---
title: Guass-Jordan Method
thumbnail: ''
draft: false
tags:
- linear
- linear-algebra
- math
- matrix
- inverse-matrix
created: 2023-10-03
---

# Gauss Elimination

가우스 소거법은, 연립방정식의 해를 행렬을 이용해 쉽게 구하는 방법이다.

기본적으로 행벡터의 계수를 조작하여 구하는 방법으로,

**Upper Triangle Matrix, Lower Triangle Matrix** 를 만들어 구하는 방법이다.

역행렬을 구하여 답을 찾는 방식은 Cost가 많이 들어, 해를 구하는데는 적합하지 않다.

자세한 방법은 생략한다.

# Gauss-Jordan Method

가우스- 조르당 방법의 가장 큰 이점은, **역행렬** 을 구하는데에 있다.

기존의 Cramer's rule을 사용하는 것은 computing cost가 많이 들기 때문에, 이 방법이 매우 유용하다.

역행렬을 구하는데 있어 Gauss Elimination에서 한 행벡터를 조작해서 하는 방법은 동일하다.
