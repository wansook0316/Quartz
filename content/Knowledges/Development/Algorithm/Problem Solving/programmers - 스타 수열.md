---
title: programmers - 스타 수열
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- python
- greedy
created: 2023-10-02
---

# 풀이

어떻게 해야 이런 문제를 풀 수 있을까. 

* 일단 조합과 같은 생각은 n이 작을 때 한다.
* 완전 탐색 방법을 먼저 생각한다.
* **순차적**인 방법 (indexing) 생각
* 문제를 제대로 읽기

일단 처음에는 모든 가지수를 만들고, 이에 대해 2씩 접근하여 문제를 해결하려 했다. 하지만 당연히 시간초과가 나기 때문에 다른 방법을 생각해야 했다. 그리고 처음에 글을 잘못읽어서 2씩 보는 것이 아니고 2의 배수만큼 모두 확인했을 때 결정이 되는 줄 알았다.

애초에 그리디한 문제라는 것이 좀 눈에 보였다. 그리디 문제를 많이 안풀어봐서 어떻게 해야할 지 감을 못잡은 것 같다. 

일단 2씩 보면서, 적어도 하나의 교집합 원소가 있다는 것에서 키워드를 찾아야 한다. 그래서 이 키를 제안한다는 생각을 해야 한다. 그리고 그 제안한 key에 대해 가능한 후보를 찾아야 한다.

그런데, 해당 문제는 가능한 후보를 찾는 것이 아닌 길이를 제안하는 것이다. 그렇기 때문에 특정 문자에 대해 부분 수열을 찾았을 때, 발생할 수 있는 다른 부분 수열과 서로 길이가 같은지 판단해야 한다.

````
1 0 0 1 0 0 1 0

1 0 0 1 0 1
1 0 0 1 1 0
````

1을 교집합 원소로 가정했을 때 가장 긴 부분 수열의 후보는 위와 같다. 수열은 달라도 길이는 같다. 이 부분을 짚고 넘어가야 한다.

만약 이부분이 확립이 되었다면, 배열안에 존재하는 모든 원소에 대해 순차적으로 진행하며 가장 긴 수열을 만들면 된다. 이 때 2 pointer로 진행하면서 값을 넣어준다. 이 부분이 그리디 하다. 즉 답이 정해져있다는 것. 모든 가지수를 판단할 필요가 없이, 특정 수열이 정해져 있다.. 이런 생각을 하는 것이 아직 너무 어렵다.

하지만 이렇게 될 경우 시간 초과가 난다. 그렇기 때문에 굳이 볼 필요가 없는 원소에 대해서는 거를 필요가 있는데, 그런 부분을 넣어주면 시간안에 들어올 수 있다.

# Code

````python
from collections import Counter
def solution(a):
    cand = dict(Counter(a).most_common())
    ans = 0
    for num in cand:
        if ans > cand[num]*2: continue
        temp = []
        i, j = 0, 1
        while i < len(a) and j < len(a):
            if a[i] == num:
                if a[i] == a[j]: # 다음 것도 num일 경우
                    j += 1
                else:
                    temp.append(a[i])
                    temp.append(a[j])
                    i = j+1
                    j += 2
            else:
                if a[j] == num:
                    temp.append(a[i])
                    temp.append(a[j])
                    i = j+1
                    j += 2
                else:
                    j += 1
        ans = max(ans,len(temp))
    return ans
````

# Reference

* [스타수열](https://school.programmers.co.kr/learn/courses/30/lessons/70130)
