---
title: Spacial Data
thumbnail: ''
draft: false
tags:
- GIS
- spacial-data
- data
created: 2023-10-01
---

# Basic

## Point

* 하나의 좌표를 갖는 geometry

## LineString(Polyline)

* 두 개 이상의 좌표를 갖는 geometry

### Line

* 두개의 좌표인 경우

### LinearRing

* 첫 점과 끝점이 같은 경우

### 분류

* Simple
* Non-Simple
  - 선이 교차하는 경우
* Simple, closed
  - 교차하지 않는 다각형모양을 가진 선
  * LinearRing
* Non-Simple, closed
  - Not a LinaerRing

## Polygon

* 면
* hole을 가질 수 있다.
* 즉, Exterior Ring (n = 1)과 Interior Rings (n >= 0) 일 수 있다.

### 방향

* Exterior Ring
  - Counter-clockwise
* Interior Ring
  - Clockwise
  * 적어도 안쪽 링과 바깥쪽의 방향이 반대여야 함. 그렇지 않으면 유효하지 않음

## Multi Point

## Multi LineString

## Multi Polygon

## GeometryCollection

## Box / Bounds

* 점 2개로 정의
* 우상단, 좌하단의 점
* min, max
* left-bottom, right-top
* south-west, right-top

# Feature

* Geometry 정보 + 속성 정보 (type, name, roadType, lane)
* 형상과 속성을 갖춘 기본 데이터

# Reference

* [OGC Simple Feature Access](http://www.opengeospatial.org/standards/sfa)
