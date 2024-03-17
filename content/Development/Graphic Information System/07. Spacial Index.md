---
title: Spacial Index
thumbnail: ''
draft: false
tags:
- data
- data-structure
- search
- GIS
created: 2023-10-01
---

# 점, 선, 면

* Box로 만든 뒤에 저장

# 저장은 어떻게?

## [Grid](https://en.wikipedia.org/wiki/Grid_(spatial_index))

* 전체 공간을 Tessellation하여 셀로 나누고, 데이터를 셀에 넣는 방식
  * Tessellation
    * 일정한 형태의 도형들로 평면을 빈틈없이 채우는 것을 말함
      * a.k.a
        * 쪽매맞춤
        * 쪽매붙임
* 공간을 다 특정도형으로 쪼개고, 또 그 안에서 쪼개는 방식으로 저장하는 것
* 무조건적으로 다 분할해야 함

## [QuadTree](https://medium.com/@waleoyediran/spatial-indexing-with-quadtrees-b998ae49336)

* 전체 공간을 재귀적으로 가로/세로 2등분하여 4개의 자식 노드를 가진 트리 구조를 사용하는 공간 인덱스
* 4개의 노드를 가지도록 분할하여 저장
* 특정 geometry가 해당 분할 공간에 하나만 있다면, Grid와 달리 세부 분할하여 저장되지 않고 해당 노드에 저장되어 깊이가 더 깊이 안들어감
* OcTree(3차원)

## [KD-Tree](https://www.snisni.net/98)

* 데이터가 점인 경우 사용할 수 있는 자료구조
* 각 레벨 마다 하나의 차원을 정렬하는 트리형태의 공간 인덱스
* Binary Tree인데, 각 Level에 따라서,
  - 짝수 Level: X좌표를 가지고 왼쪽 오른쪽 분할
  - 홀수 Level: Y좌표를 가지고 왼쪽 오른쪽 분할
* 결국 공간을 항상 2분할 하는 그림이 됨

## [R(Rectangle)-Tree](https://ko.wikipedia.org/wiki/R_트리)

* B-tree에 기반한 공간 인덱스
* 밸런싱, 페이징 같은 B-tree 특성 유지
* 데이터 베이스에서 주로 사용

# 탐색 알고리즘

* 가장 가까운 Geometry를 찾아라.
* 지금 박스로 추상화했는데, 박스의 중심과 거리를 재는 것이 맞을까?
* 원하는 결과와 다른 결과가 나올 수 있다.
* 그래서 k라는 변수를 하나 추가하여 문제를 해결한다.
* k는 자료구조에서 탐색을 진행할 때, 가장 가까운 녀석으로부터 boundary를 말한다.
* 만약 3이면 min, next, next까지 총 3개를 보는 것
* 적당한 k를 찾는 것은 huristic
* 즉 KNN을 수행후 실제 거리를 구하는 것.

# Reference

* [Grid](https://en.wikipedia.org/wiki/Grid_(spatial_index))
* [QuadTree](https://medium.com/@waleoyediran/spatial-indexing-with-quadtrees-b998ae49336)
* [KD-Tree](https://www.snisni.net/98)
* [R(Rectangle)-Tree](https://ko.wikipedia.org/wiki/R_트리)
