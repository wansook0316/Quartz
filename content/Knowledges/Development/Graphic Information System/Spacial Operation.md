---
title: Spacial Operation
thumbnail: ''
draft: false
tags:
- Map
- GIS
- operation
created: 2023-10-01
---

# 관계 연산 (True or False)

* Equals
  * 두 개가 완전히 동치인 경우
* Disjoint
  * 두 개가 하나도 겹치지 않는, 즉 서로소인 경우
* Intersects
  * 교집합
  * 뚫고 지나가는 경우, 겹치는 경우
* Touches
  * 테두리에 걸리는 경우
* Crosses
  * 교차할 때
  * 그런데, 비교하고자 하는 두개의 gemoetry가 서로 차원이 다르거나 (점, 선, 면) 혹은 선이어야만 연산이 성립
  * 점 & 선, 선 & 면, 선 & 선만 정의가 가능
* Within / Contains
  * 완전히 포함될 떄 성립
* Overlaps
  * 같은 차원끼리 비교 가능

# 결과 연산 (결과가 Geometry)

* Intersection
  * 교집합
* Difference
  * 차집합
* SymDifference
  * 도넛
* Union
  * 합집합
* Buffer
  * 특정 Geometry에서 x만큼 떨어진 geometry를 줌
  * 당연히 음수도 가능
* ConvexHull
  * 특정 Polygon을 감쌀 수 있는 최소 면적 다각형
* Envelope
  * 특정 Polygon을 감쌀 수 있는 최소 Box
  * a.k.a
    * Minumun Bounding Rectangle
    * Bounding Box
    * Bounds
    * Envelope
    * BOX

# [DE-9IM](https://en.wikipedia.org/wiki/DE-9IM)

* Dimensionally Extended 9-Intersection Model
* 두 지오메트리같의 공간관계를 interesection을 통해 구하는 위상 모델
* 예시
  * 두개의 Polygon이 있을 때, 연산을 다음과 같이 정의한다.
  * E (Exterior)
    * 해당 Polygon의 바깥쪽 면
  * I (Interior)
    * 해당 Polygon의 안쪽 면
  * B (Border)
    * 경계 LineString
  * dim (dimension)
    * 특정 geometry의 차원 (점: 0, 선: 1, 면: 2)
  * A, B Polygon에 대해서 각 3개의 연산 속성 (E, I, B)를 가질 수 있고 이를 모두 dim 연산을 한다면 3x3 행렬이 도출된다.
  * 이 행렬 관계의 모양을 기반으로 관계 연산의 결과를 알 수 있다.
* 한번에 2개 이상의 관계를 알아봐야 한다면 연산량 측면에서 해당 모델이 더 좋을 수 있다.

# Reference

* [DE-9IM](https://en.wikipedia.org/wiki/DE-9IM)
