---
title: programmers - 베스트 앨범
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- implementation
- python
created: 2023-10-02
---

# 풀이

아니, 갑자기 딕셔너리 소트 안되는게 말이냐구.. 왜 다 풀줄 아는데 꼭 저런거 때매 문제일까. 더 많이 풀어서 오류를 판단하는 눈을 길러야 한다.

# Code

````python
def solution(genres, plays):
    # 속한 노래가 많이 재생된 장르를 먼저 수록..
    # 그니까 장르중에 많이 재생된 장르부터 선택
    # 그리고 장르별로 2곡씩 모을 것. 근데 장르 수록곡이 한개면 하나만 넣는다.
    # 만약에 재생 횟수가 같으면 고유번호가 낮은 것부터 넣는다.
    
    # 장르 : [재생 횟수대로 정렬, 그다음 id로 정렬]
    # 장르 돌면서 0, 1 뽑는다. 근데 이때 장르안에 들어간 개수가 1이하인 경우 하나만 넣는다.
    
    play_dict = dict()
    genre_dict = dict()
    for i, (g, p) in enumerate(zip(genres, plays)):
        
        if g not in genre_dict:
            genre_dict[g] = 0
        genre_dict[g] += p
        
        if g not in play_dict:
            play_dict[g] = []
        play_dict[g].append((p, i))
        
    order = dict(sorted(genre_dict.items(), key=lambda x: x[1], reverse=True)).keys()
    
    for a in play_dict:
        play_dict[a] = sorted(play_dict[a], key=lambda x: (-x[0], x[1]))
    
    answer = []
    for o in order:
        answer.append(play_dict[o][0][1])
        if len(play_dict[o]) >= 2:
            answer.append(play_dict[o][1][1])
            
    return answer
````

# Reference

* [베스트 앨범](https://school.programmers.co.kr/learn/courses/30/lessons/42579)
