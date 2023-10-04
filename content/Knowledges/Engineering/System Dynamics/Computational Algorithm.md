---
title: Computational Algorithm
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# Step 1

특정 시간에 대해서 C 벡터 함수의 해를 추정한다. 즉, 초기값을 설정한다. 이 추정치는 발산하지 않도록 잘 선택해야 한다.

# Step 2

이 추정치를 기반으로 **자코비안 행렬** 과 C 벡터함수의 해를 구한다.

# Step 3

$$
\\Delta \overset{\rightarrow}{q_i};=;-\[  C\_{q_i}\]^{-1;}\overset{\rightarrow}{C}(\overset{\rightarrow}{q\_{i}};,t)
$$

를 계산한다.

# Step 4

$$
\\overset{\rightarrow}{q\_{i+1}};=;\overset{\rightarrow}{q_i};+;\Delta \overset{\rightarrow}{q_i}
$$

를 계산한다.

# Step 5

**Step 2 ~ Step 5** 를 사용자가 지정한 임계치보다 작을 때 까지 반복한다.

$$
\|\Delta \overset{\rightarrow}{q_i}|;\<;\epsilon_1\\
;\\
OR\\
;\\
\|\overset{\rightarrow}{C}(\overset{\rightarrow}{q\_{i}};,t)|;\<;\epsilon_2
$$

# Step 6

속도 벡터를 구한다.

$$
\\overset{\cdot}{\overset{\rightarrow}{q}};=;
-\[  C\_{q}\]^{-1}\overset{\rightarrow}{C\_{t}}
$$

# Step 7

가속도 벡터 구하기

$$
\\overset{\cdot \cdot}{\overset{\rightarrow}{q}};=;
\[  C\_{q}\]^{-1}\overset{\rightarrow}{Q\_{d}}
\\
;\\
\\overset{\rightarrow}{Q\_{d}};=;-(  C\_{q} \overset{\cdot}{\overset{\rightarrow}{q}})*q \overset{\cdot}{\overset{\rightarrow}{q}};-;2  C*{qt} \overset{\cdot}{\overset{\rightarrow}{q}};-;\overset{\rightarrow}{C\_{tt}}
$$

# Step 8

**Step 1 ~ Step 7** 까지 다른 t를 설정한 뒤 반복한다.
