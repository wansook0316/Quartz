---
title: Coordinate System
thumbnail: ''
draft: false
tags:
- coordinate-system
- GIS
created: 2023-10-01
---

# 개요

* 한점에 대해 유일한 좌표를 부여하기 위한 체계
* 직교좌표계 (x, y, z)
* 구면좌표계 (r $\theta$, $\phi$)
* 지리좌표계 ($\lambda$, $\phi$)
  * 지표면에만 있다고 가정하고 위, 경도로만 표현하는 것
* 지심좌표계 (x, y, z)
  * 지표면 안으로 들어간다고 가정했을 때 필요

# 좌표계

* EPSG
  * 무지하게 많은 좌표계들을 한번에 알아볼 수 있는 코드
* 좌표계 변환 방식
  * 측지계가 같으면 쉽게 변환이 가능
    * 즉 준거타원체와 기준점이 같으면
  * 하지만 측지계가 다르면 복잡한 로직이 필요
    * 즉, 준거타원체도 다르고, 기준점도 다르면
  * 3-Parameter Tarnslation
    * 원점 시프트 (dx, dy, dz)
  * 7-Parameter Transformation (Helmert)
    * 원점 시프트 (dx, dy, dz)
    * 축척(원기둥 투영면 설정시, 윗면 아랫면이 구로 들어가는 정도를 나타내는 변수) 변경 ($\mu$)
    * 회전 (rx, ry, rz)
  * 10-Parameter Transformation (Molodensky-Badekas)
    * 
      * 원점 시프트 (dx, dy, dz)
    * 축척 변경 ($\mu$)
    * 회전 (rx, ry, rz)
    * 회전 지점 (px, py, pz)
