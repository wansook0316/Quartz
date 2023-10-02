---
title: Programmers - 가장 큰 정사각형의 넓이
thumbnail: ''
draft: false
tags:
- algorithm
- dynamic-programming
- implementation
- programmers
- cpp
created: 2023-10-02
---

***level2*** : 구현, 또는 동적 계획법을 사용하는 문제이다.

처음 풀이로는 빠르게 풀기 위해서 그냥 단순히 구현을 했다. 입력이 1000 x 1000 이라, 완전 탐색을 수행하더라도 로직을 최대한 덜 쓰도록 짜야된다는 생각을 하면서 짰다. 그 결과 나는 최대 넓이를 구하는 것이 목표이므로, board가 가질 수 있는 최대 변의 길이로 부터 하나씩 줄이며 가능한 정사각형을 구했을 때 return 했다.

## Code1

````c++
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;


bool go(int y, int x, int len, vector<vector<int>> board){
    for (int i = y; i < len+y; i++){
        for (int j = x; j < len+x; j++){
            if (board[i][j] == 0) return false;
        }
    }
    return true;
}

int solution(vector<vector<int>> board)
{
    int now = min(int(board.size()), int(board[0].size()));
    int sizeY = int(board.size());
    int sizeX = int(board[0].size());

    while(now > 0){
        for (int i = 0; i <= sizeY-now; i++){
            for (int j = 0; j <= sizeX-now; j++){
                if (go(i, j, now, board)) return now*now;
            }
        }
        now--;
    }

    return now;
}
````

하지만 근본적으로 최악의 경우 연산 횟수가, n^4 이다. (완전한 n^4는 아니다. 하지만 연산이 중복되는 것이 너무 많다.)

1. 정사각형 판단 (n^2)
1. 가능한 시작 점의 개수 (n^2)

\*\**연산이 중복된다는 생각*\*\*과, 또, \*\**정사각형의 모양을 보니 작은 정사각형이 만들어져야 다음 정사각형이 만들어진다는 생각*\*\*을 했다. 두 생각은 다이나믹 프로그래밍의 핵심적인 발상이기 때문에 해당 문제를 다이나믹으로 다시 구상해보기 시작했다.

## 정의

|dp적용전||||dp적용후||||
|:---:------|::|::|::|:---:------|::|::|::|
|0|1|1|1|0|1|1|1|
|1|1|1|1|1|1|2|2|
|1|1|1|1|1|2|2|3|
|0|0|1|0|0|0|1|0|

 > 
 > dp\[y\]\[x\] = (y, x)의 위치를 포함하여 만들 수 있는 정사각형의 최대 변의 길이

이렇게 정의를 하게 되면, 다음 정사각형의 변의 길이는, 상, 좌, 좌상향 대각 방향의 요소의 최소값+1에 해당하는 변의 길이로 밖에 만들 수 없다.

 > 
 > dp\[y\]\[x\] = min(dp\[y-1\]\[x-1\], dp\[y\]\[x-1\], dp\[y-1\]\[x\])

dp는 항상 초기값을 세팅해주어야 하는데, **이 경우 y = 0일 때, x = 0 일 때** 값을 고정한 상태로 점화식을 적용하면 된다. 이 때, 초기값으로 부터 answer가 도출될 수 있다는 점을 주의하자. 예외에 걸릴 수 있다. (내가)

## Code2

````c++
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int solution(vector<vector<int>> board)
{
    int ans = -1;
    int sizeY = int(board.size());
    int sizeX = int(board[0].size());
    for (int i = 0; i < sizeY; i++) ans = max(board[0][i], ans);
    for (int i = 0; i < sizeX; i++) ans = max(board[i][0], ans);
    for (int i = 1; i < sizeY; i++) {
        for (int j = 1; j < sizeX; j++) {
            if (board[i][j] == 0) continue;
            else {
                int minNum = min(board[i-1][j], board[i-1][j-1]);
                minNum = min(minNum, board[i][j-1]);
                if (minNum != 0) {
                    board[i][j] = minNum+1;
                    ans = max(ans, board[i][j]);
                }
            }
        }
    }
    return ans*ans;
}
````

# Reference

* [백준(11057번) - 오르막 수](https://www.acmicpc.net/problem/11057)
* [프로그래머스 - 가장 큰 정사각형 찾기](https://programmers.co.kr/learn/courses/30/lessons/12905)
