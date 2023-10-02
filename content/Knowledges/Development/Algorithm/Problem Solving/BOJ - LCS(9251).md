---
title: BOJ - LCS(9251)
thumbnail: ''
draft: false
tags:
- BOJ
- algorithm
- dynamic-programming
- cpp
created: 2023-10-02
---

***골드5*** : 동적계획법 문제이다.

# 풀이

 > 
 > dp\[i\]\[j\] = (i, j)번째 수열의 원소를 포함했을 때, 가지는 최장 수열의 길이

 > 
 > dp\[i\]\[j\] = max(dp\[i-1\]\[j-1\]~dp\[0\]\[0\])

하지만 실제 구현을 이런식으로 하게 되면, $O(n^4)$ 로 시간 초과가 날 것이다. 따라서 i번째 원소를 업데이트 한 이후에, dp의 값이 사용이 되는지 확인할 필요가 있다.

무조건적으로 이전 원소(i)를 본 뒤에는 값이 큰 상태로 유지되며, 다음 상태의 최장 길이는 이 값으로부터 도출될 수 밖에 없다. 따라서 최적화가 가능하다.

# Code

````c++

#include <iostream>
#include <string>
using namespace std;
int dp[1001] = {0,};

int main(){
    string a, b;
    cin >> a >> b;
    
    for (int i = 0; i < a.size(); i++) {
        int temp[1001];
        for (int j = 0; j < b.size(); j++) {
            temp[j] = dp[j];
        }
        for (int j = 0; j < b.size(); j++) {
            if (a[i] == b[j]) {
                int maxvalue = 0;
                for (int k = 0; k < j; k++) {
                    if (temp[k] > maxvalue) {
                        maxvalue = temp[k];
                    }
                }
                
                dp[j] = maxvalue+1;
                
            }
        }
//        for (int k = 0; k < b.size(); k++) {
//            cout << dp[k] << " ";
//        }
//        cout << '\n';
    }
    
    int ans = 0;
    for (int i = 0; i < b.size(); i++) {
        if (ans < dp[i]) {
            ans = dp[i];
        }
    }
    
    cout << ans << '\n';
    return 0;
}

````

# Reference

* [백준(9251번) - LCS](https://www.acmicpc.net/problem/9251)
