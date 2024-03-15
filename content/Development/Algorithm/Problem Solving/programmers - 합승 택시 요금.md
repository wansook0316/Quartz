---
title: programmers - 합승 택시 요금
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- dijkstra-algorithm
- shortest-path-problem
- floyd-warshall
- swift
- python
created: 2023-10-02
---

# 풀이

다익스트라로 한번에 성공했다. 그래도 발전이 있나보네..

스위프트로 플루이드 워셜로 다시 풀었다.

# Code

````python
# AB가 함께 모든 노드까지 가는데 걸리는 최단 거리를 구한다.
# 그리고 그 거리 각각에서 출발하여
    # 1. A가 다른 노드까지 방문하는데 걸리는 최단 거리를 구한다.
    # 2. B 상동
    # 3. A의 거리중 집까지 가는데 걸리는 최단 거리를 구한다.
    # 4. B의 거리중 상동
    
# 시간 복잡도 : 
# 첫번쨰 다익스트라 n^2 * logn
# 각각에서 걸리는 다익스트라 n^2 * logn
# 전체 : n^2 * logn * (2 n^2 * logn) = n^4 = 200^4 = 1,600,000,000 16억..
# 일단 시도해보자.
import heapq
def dijkstra(start, distance):
    global graph
    q = []
    heapq.heappush(q, (0, start))
    distance[start] = 0
    
    while q:
        dist, now = heapq.heappop(q)
        if dist > distance[now]:
            continue
        
        for _next, w in graph[now]:
            cost = dist + w
            if cost < distance[_next]:
                distance[_next] = cost
                heapq.heappush(q, (cost, _next))

def solution(n, s, a, b, fares):
    INF = 1e7
    global graph
    
    graph = [ [] for _ in range(n+1)]
    distance_with = [INF] * (n+1)
    
    for f in fares:
        u, v, w = f[0], f[1], f[2]
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    dijkstra(s, distance_with) # start에서 시작해서 모든 노드 최단 거리를 구한다.
    # print(distance_with)
    ans = 1e7
    for node in range(1, len(distance_with)):
        if distance_with[node] == INF: continue
        
        cost = distance_with[node]
        distance_a = [INF] * (n+1)
        distance_b = [INF] * (n+1)
        dijkstra(node, distance_a)
        dijkstra(node, distance_b)
        a_dist = distance_a[a]
        b_dist = distance_b[b]
        # print(cost, a_dist, b_dist)
        total_cost = cost + a_dist + b_dist
        ans = min(ans, total_cost)
    
    return ans
````

# Code2

````swift
import Foundation


func solution(_ n:Int, _ s:Int, _ a:Int, _ b:Int, _ fares:[[Int]]) -> Int {
    let maxFare = 200 * 100000
    let row = [Int](repeating: maxFare, count: n + 1)
    var graph = [[Int]](repeating: row, count: n + 1)
    var answer = Int.max
    
    for fare in fares {
        let from = fare[0]
        let to = fare[1]
        let cost = fare[2]
        
        graph[from][to] = cost
        graph[to][from] = cost
    }
    
    for node in 1...n {
        graph[node][node] = 0
    }
    
    for k in 1...n {
        for i in 1...n {
            for j in 1...n {
                graph[i][j] = min(graph[i][j], graph[i][k] + graph[k][j])
            }
        }
    }
    
    for mid in 1...n {
        answer = min(answer, graph[s][mid] + graph[mid][a] + graph[mid][b] )
    }
    
    return answer
}

// 시작 지점에서 다른 모든 연결된 노드까지의 가중치를 가지고 있음
// 각각의 도착한 지점으로 부터, a의 목적지까지의 최소거리를 더함
// 각각의 도착한 지점으로 부터, b의 목적지까지의 최소거리를 더함
// 이 짓을 모든 곳에 해본뒤 최소값 리턴

````

# Reference

* [합승 택시 요금](https://school.programmers.co.kr/learn/courses/30/lessons/72413)
