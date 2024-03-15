---
title: BOJ - RGB거리(1149)
thumbnail: ''
draft: false
tags:
- BOJ
- algorithm
- dynamic-programming
- cpp
created: 2023-10-02
---

***실버1*** : 동적계획법 문제이다.

# 생각

동적 계획법하면 유명한 문제이다. 나는 동적 계획법을 풀 때 보통 두가지 방법을 많이 사용한다.

1. 상태에 대한 정의와 점화식을 직관으로 때린다. (~~감..~~)
1. 순차적으로 완전 탐색 방법으로 그려본다.

문제가 잘 안보이면 2번 방법을 선택하는데, 이 문제를 그려보면 다음과 같다.

|1|2|
|:|:|
|~~R~~||
|G|R|
|B||
|R||
|~~G~~|G|
|B||
|R||
|G|B|
|~~B~~||

1번 집에서 2번 집으로 넘어갈 때, 2번 집의 선택에 따라 1번집의 선택은 2번 집에서 선택한 색을 제외한 두가지 색으로 정해진다. 여기서 Dp의 정의 방법의 특징이 드러나는데, 사실 나는 처음 생각할 때, 1번이 선택을 하고, 2번이 어떻게 바뀌는 지를 생각했다. 하지만 그렇게 코드를 짤 경우 굉장히 귀찮고 어렵다는 것을 깨달았다. dp의 정의는 **해당 위치까지**에 어떤 의미를 주는 것이 문제를 풀이할 때 훨씬 수월하다. 이것은 수열에서 일반항의 정의와 비슷하다.

# 정의

 > 
 > `dp[N][color]` = N번 집에 color를 칠했을 때 발생하는 최소 값

color 변수를 추가한 이유는, 해당 집에 어떤 색을 칠하냐에 따른 가격을 마지막에 최종적으로 비교해주기 위함이다.

# 점화식

 > 
 > `dp[N][color1] = min(dp[N-1][color2], dp[N-1][color3]) + cost[i][color1]`

`color2, color3`는 color1이외의 두 색을 의미한다.

# Code

````c++
#include <iostream>
#include <algorithm>
using namespace std;
int N = 0;
int cost[1001][3];
int dp[1001][3] = {0};

int main(){
    cin >> N;
    for (int i = 1; i <= N; i++)
        for (int j = 0; j < 3; j++)
            cin >> cost[i][j];
    // 초기값 세팅
    for (int i = 0; i < 3; i++) dp[1][i] = cost[1][i];
    // dp
    for (int i = 2; i <= N; i++)
        for (int j = 0; j < 3; j++)
            dp[i][j] = min(dp[i-1][(j+1)%3], dp[i-1][(j+2)%3])+cost[i][j];
    // 최종적인 최소값
    cout << *min_element(&dp[N][0], &dp[N][3]) << '\n';
    return 0;
}
````

# Reference

* [백준(1149번) - 이친수](https://www.acmicpc.net/problem/1149)
