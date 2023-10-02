---
title: BOJ - 소용돌이 예쁘게 출력하기
thumbnail: ''
draft: false
tags:
- BOJ
- algorithm
- simulation
- implementation
- cpp
created: 2023-10-02
---

***골드4*** : 구현 문제이다.

상당히 갑갑했다. 일단 무한개의 소용돌이가 생길 수 있다는 점에서 기존의 달팽이 문제처럼 생각하면 안된다라는 판단이 들었다. 발생하는 모든 숫자를 저장한다면 메모리 초과가 날 것이 분명했기 때문이다.

**그래서 이 부분을 꼭 저장해야 하나?** 하는 생각이 들었고, 문제에서 제시하는 규칙에 따라 소용돌이 를 만들어가면서 제시하는 좌표 내에 위치했을 때, 이를 저장해주는 방식으로 문제를 해결하기로 했다.

이 과정에서 생각해야 하는 중요 문제는 다음과 같았다.

1. 소용돌이를 만드는 규칙
1. 들어왔을 때, 저장하는 배열과의 관계
1. 출력시 공백 처리

## 소용돌이 규칙

|num|direction|linecount|
|:-:|:-------:|:-------:|
|1|➡|1|
|2|⬆|1|
|3|⬅|2|
|4|⬇|2|
|5|➡|3|
|6|⬆|3|
|7|⬅|4|
|8|⬇|4|
|9|➡|5|

총 4번의 방향전환 속에 고려해야 하는 점은 **몇 칸 전진?** 이다. 잘 보게 되면, 방향과 방향에 따른 count와 방향과의 관계가 나온다.

## 배열과의 관계

 > 
 > `map[y-r1][x-c1] = num;`

현재 좌표는 음수를 갖고 있는 상태이다. index는 음수일 수 없으므로 우리는 이것을 평행이동 하여 (0,0) 의 상태에 저장해야 한다. 이 때, r1, c1 만큼 평행이동 한다면 정확하게 원하는 위치에 저장할 수 있다.

## 출력시 공백 처리

내가 원하는 위치에 있는 것들을 배열에 넣을 때, 가장 긴 숫자가 무엇인지 알아야 한다. 이 때, C++에 integer의 길이는 알아내기 어려우므로 string으로 바꾸어 길이를 알아내는 방법을 사용하도록 하자.

이 길이보다 작은 숫자에 대해서는 그 차만큼 공백을 출력하여 문제가 원하는 답을 도출하자.

입출력이 많으므로 `ios_base::sync_with_stdio(false);` 를 사용하자.

## Code

````c++
// 골드4 : 백준 1022번 소용돌이 예쁘게 출력하기
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
int r1, r2, c1, c2;
int map[50][5] = {0};
int y = 0, x = 0, dir_count = 0;
int linecount = 1, step = 0, num = 1, dir = 0;
int map_count = 0, max_num = -1, maxLength = -1;
int dy[4] = {0, -1, 0, 1}, dx[4] = {1, 0, -1, 0};

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> r1 >> c1 >> r2 >> c2;
    while (true) {
        // 현재 위치가 원하는 위치인지 확인
        if (r1 <= y && y <= r2 && c1 <= x && x <= c2) {
            max_num = max(max_num, num);
            map[y-r1][x-c1] = num;
            map_count++;
            if (map_count == (r2-r1+1)*(c2-c1+1)) {
                break;
            }
        }
        // 소용돌이 좌표 등 속성 갱신
        y += dy[dir];
        x += dx[dir];
        step++;
        num++;
        // 방향 갱신
        if (step == linecount) {
            dir_count++;
            step = 0;
            dir = (dir+1)%4;
            if (dir_count == 2) {
                dir_count = 0;
                linecount++;
            }
        }
    }
    // map 안에서 갖는 최고 길이
    maxLength = int(to_string(max_num).size());

    for (int i = 0; i < r2-r1+1; i++) {
        for (int j = 0; j < c2-c1+1; j++) {
            string stringOut = to_string(map[i][j]);
            if (stringOut.size() < maxLength) {
                for (int i = 0; i < maxLength-stringOut.size(); i++) {
                    cout << " ";
                }
            }
            cout << stringOut << " ";
        }cout << '\n';
    }
}

````

# Reference

* [백준(1022번) - 소용돌이 예쁘게 출력하기](https://www.acmicpc.net/problem/1022)
