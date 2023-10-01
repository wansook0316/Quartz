---
title: PNG
thumbnail: ''
draft: false
tags:
- image
- png
- compression
- graphics
- encoding
- raster
created: 2023-10-01
---

# PNG(Portable Network Graphics)

* 핵심: 비손실 압축 방법
* 원리
  * [Huffman coding](Huffman%20coding.md)를 통한 압축
  * 그렇기 때문에 반복되는 이미지가 등장할 경우 PNG가 보다 효과적
* 장점: 투명도 사용가능, 비손실 압축, 32비트 트루컬러, 크게 색상 변화가 크지 않은 이미지의 경우 사용하는 것이 좋다. 단조로운 이미지(디자인)의 경우 PNG가 보다 유리
* 단점: 느린 압축 속도, 비교적 큰 용량
