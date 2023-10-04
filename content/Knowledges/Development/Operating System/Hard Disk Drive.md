---
title: Hard Disk Drive
thumbnail: ''
draft: false
tags:
- HDD
- operatiing-system
created: 2023-10-04
---

![](os-file-allocation1.png)

위 그림은 하드디스크의 구조이다.

* platter
  * 실제 데이터를 기록하는 자성을 가진 원판이다. platter는 그림과 같이 여러 개가 존재하고 앞뒤로 사용할 수 있다. 한 platter는 여러 개의 track으로 이루어져 있다.
* track
  * platter의 동심원을 이루는 하나의 영역이다.
* sector
  * 하나의 track을 여러 개로 나눈 영역을 sector라 한다. sector size는 일반적으로 512 bytes이며 주로 여러 개를 묶어서 사용한다.
* cylinder
  * 한 cylinder는 모든 platter에서 같은 track 위치의 집합을 말한다.

앞서 sector는 여러 개로 묶어서 사용한다고 했는데, 이를 \*\*블록(block)\*\*이라 한다. 하드디스크는 블록 단위로 읽고 쓰기 때문에 **block device** 라고 불리기도 한다.

하드디스크가 블록 단위로 읽고 쓰는 것을 확인할 수 있는 간단한 방법은 메모장 프로그램에서 알파벳 a만을 적고 저장해보자. a는 character로 1byte 크기를 갖는데, 실제 저장된 텍스트 파일의 속성을 확인하면 디스크에 **4KB(하나의 block size)** 가 할당되는 것을 확인할 수 있다.(실제 디스크 할당 크기는 운영체제마다 다르다.)

따라서 디스크는 비어있는 블록들의 집합이라고 볼 수 있다.(pool of free blocks) 그렇다면 운영체제는 각각의 파일에 대해 **free block**을 어떻게 할당할까? 다음글에서 알아보자.

# Reference

* [KOCW 양희재 교수님 - 운영체제](http://www.kocw.net/home/search/kemView.do?kemId=978503)
* [양희재 교수님 블로그(시험 기출 문제)](https://m.blog.naver.com/PostList.nhn?blogId=hjyang0&categoryNo=13)
* [codemcd 님의 정리글](https://velog.io/@codemcd/)
* Operating System Concepts, 9th Edition - Abraham Silberschatz
