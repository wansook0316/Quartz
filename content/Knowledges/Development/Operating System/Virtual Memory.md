---
title: Virtual Memory
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

가상 메모리(Virtual Memory)에 대해 알아본다.

가상 메모리는 물리 메모리 크기의 한계를 극복하기 위해 나온 기술이다. 즉, 물리 메모리보다 큰 프로세스를 수행하기 위해 가상 메모리를 사용한다. 예를 들어, 100MB 메모리 크기에서 200MB 크기의 프로세스를 수행할 수 있도록 하는 것이다.

# 1. Demanding Paging

![](os-virtual-memory1.png)

이러한 방식이 어떻게 가능할까? 앞서 메모리 낭비 방지의 동적 할당에서도 봤듯이, **필요한 부분만 메모리에 적재**하는 것이다. 프로세스를 실행할 때, 실행에 필요한 부분만 메모리에 올리는 것이다. 이러한 프로세스의 일부분은 페이지 단위일 수도 있고, 세그먼트 단위일 수도 있지만 현재 대부분은 페이지 단위를 사용한다.

이처럼 현재 필요한(요구되어지는) 페이지만 메모리에 올리는 것을 **Demanding Paging(요구 페이징)** 이라고 한다.

## 1.1 동작

![](os-virtual-memory2.png)

1. CPU가 page table에 가서 해당 page에 접근한다.
1. 이 때, Memory에 올라온 상태가 아니면(invaild), Interupt를 발생한다.
1. OS 내부의 ISR에서 이 인터럽트를 처리하러 Disk에서 page를 찾는다.
1. 찾은 Page를 Memory에 올려 Frame화 한다.
1. page table을 업데이트 한다.
1. CPU에게 다시 수행하라고 명령한다.

가상 메모리를 만드는 방법은 대표적으로 두 가지가 존재하지만, 대부분 요구 페이징을 사용하므로 가상 메모리와 요구 페이징을 같은 용어로 사용하는 경우가 많다.

## 1.2 Page Fault(페이지 부재)

페이지 부재는 위에서 살펴본 CPU가 접근하려는 페이지가 메모리에 없는 경우이다. 즉, 페이지 테이블의 valid bit값이 0인 경우이다.

위에서 이러한 경우를 처리하는 방법을 알아보았다. 실질적으로 이 부분이 가상 메모리의 핵심적인 기능이라 할 수 있다.

### 1.2.1 Pure Demanding Paging

Pure Demanding Paging은 프로세스가 최초로 실행될 때는 어떤 페이지가 필요한지 알 수 없으므로, 아무 페이지도 올리지 않는다. 그러므로 프로그램을 실행하자마자 page fault가 발생한다. 즉, 순수하게 필요한 페이지만 올리는 것을 말한다. Pure Demanding Paging의 장점은 메모리를 **최대한 효율적으로 사용**할 수 있다. 하지만 시작부터 page fault가 발생하므로 **속도면에서 느리다**.

### 1.2.2 Prepaging

Prepaging은 pure demanding paging과 반대대는 개념이다. 프로그램을 실행할 때 필요할 것이라 판단되는 **페이지를 미리 올리는 것**이다. 이것의 장점은 page fault가 발생할 확률이 적으므로 **속도**면에서 빠르지만, 단점으로 미리 올라간 페이지를 사용하지 않는다면 **메모리가 낭비**된다.

### 1.2.3 Swapping VS Demanding Paging

Swapping와 Demanding Paging의 공통점은 둘 다 메모리와 backing store 사이를 서로 오고 가는 기능을 수행하지만, Swapping은 **프로세스 단위**로 이동하고 Demanding Paging은 **페이지 단위**로 이동하는 차이점이 있다.

### 1.2.4 유효 접근 시간(Effective Access Time)

Demending Paging은 페이지 테이블에 해당 페이지가 없으면 backing store에서 메모리로 가져오는 과정이 있다. 그렇기 때문에 페이지 테이블에 해당 페이지가 있을 때와 없을 때 시간 차이가 발생한다. 이러한 시간 차이를 고려하여 평균적으로 어느정도 소요되는지 계산하는 것을 유효 접근 시간이라 한다.

* p
  * 페이지 부재 확률(probability of a page fault = page fault rate)
* Tm
  * 메모리를 읽는 시간(DRAM)
* Tp
  * Page fault가 발생했을 때 소요되는 시간(대부분 backing store(하드디스크)를 읽는 시간이 차지한다. (seek time + rotational delay + transfer time)

$$
T = (1-p)Tm + p \cdot Tp
$$

#### p = 1/1,000

|용어|정의|값|
|::----|::----|:--|
|p|페이지 부재 확률|1/1000|
|Tm|메모리를 읽는 시간|200nsec|
|Tp|Disk 탐색 시간|8msec|

$$
T = 8200usec
$$

메모리를 읽는 시간에 비해 40배 정도 느리다.

#### p = 1/399,990

|용어|정의|값|
|::----|::----|:--|
|p|페이지 부재 확률|1/399,990|
|Tm|메모리를 읽는 시간|200nsec|
|Tp|Disk 탐색 시간|8msec|

$$
T = 220nsec
$$

메모리를 읽는 시간에 비해 10% 느리다.

#### 지역성의 원리(Locality of reference)

위의 예제를 보았을 때, page fault는 매우 적은 확률로 발생해야 효율적이다. 그러면 현실적으로 페이지 부재는 어느정도로 발생할까? 이는 \*\*지역성의 원리(Locality of reference)\*\*로 인해 페이지 부재 확률은 매우 낮다. 지역성의 원리는 '**메모리 접근은 시간적 지역성과 공간적 지역성을 가진다**'는 의미이다.

* 시간적 지역성
  * CPU는 어느 메모리 공간을 읽은 후, 시간이 지나도 그 공간을 다시 읽을 확률이 매우 높다는 것을 말한다.
  * 대표적인 예로 반복문이 있다. 반복문은 하나의 코드 공간을 여러 번 읽는다.
* 공간적 지역성
  * CPU가 메모리 공간을 읽을 때는 인접한 범위 내에서 읽는다는 의미이다.
  * 프로그램은 대부분 절차적인 순서로 구현되어 있어 순서대로 읽는 경우가 빈번하다.

이와 같이 페이지 부재가 현실적으로 발생할 확률은 매우 낮으므로 예제와 같이 40배로 느려지는 일을 거의 없다. 여기서 더 효율적으로 사용하기 위해서는 페이지 부재일 때 소요되는 시간을 줄일 수 있는데, backing store로 HDD를 사용하기 보다는 더욱 빠르게 동작하는 SSD나 저가 DRAM과 같은 것을 사용하는 방법이 있다.

## 1.3 페이지 교체(Page Replacement)

![](os-virtual-memory3.png)

Demanding Paging은 요구되어지는 페이지만 backing store에서 가져온다. 하지만 프로그램들이 계속 실행함에 따라 요구 페이지도 계속 늘어나고, 언젠가는 메모리가 가득 차게 될 것이다.(memory full) 여기서 다른 프로그램이 새로 실행되거나 실행중인 프로세스가 다른 페이지를 요구한다면 **이미 메모리에 있는 페이지 중 하나를 다시 backing store에 보내고(page-out), 새로운 페이지를 메모리에 올려야한다.(page-in)** 이를 페이지 교체라고 한다. 여기서 backing store로 page-out이 된 페이지를 **victim page** 라고 한다.

### 1.2.1 Victim Page(희생양 페이지)

희생양 페이지는 어떤 페이지로 하는 것이 좋을까? 먼저 생각할 수 있는 것은 메모리에 올라가 있는 페이지 중 CPU에 수정(modify)되지 않는 페이지를 고르는 것이 효율적으로 보인다. 즉, 읽기만 수행하는 페이지를 고르는 것이 이상적이다. 수정되지 않은 페이지는 page-out이 될 때 backing store에 쓰기(write) 연산을 할 필요가 없기 때문이다. backing store는 읽는 시간도 느리지만, 거기에 더해 쓰기 작업까지 한다면 더욱 비효율적일 것이다.

그러면 해당 페이지가 수정되었는지 안되었는지를 판단할 수 있어야 하는데, 이를 위해 페이지 테이블에 \*\*modified bit(=dirty bit)\*\*를 추가하여 이를 검사한다. 해당 페이지가 수정되었다면 이 비트를 1로 두고, 수정되지 않으면 0으로 둔다. 이를 이용해서 victim page는 최대한 수정되지 않은 페이지를 선택한다.

![](os-virtual-memory4.png)

위 그림은 modified bit를 추가한 페이지 테이블의 모습이다. 여기서 수정되지 않은 페이지는 0, 2, 3번 3개의 페이지가 존재하는데 이 중에서는 어떤 페이지를 선택해야 할까?

제일 간단한 방법은 랜덤하게 선택하는 것이지만, 이는 성능을 보장할 수 없다. 그 다음은 가장 먼저 메모리에 올라온 페이지를 희생양 페이지로 선택하는 것이다. 이는 아주 유명한 FIFO(First-In First-Out) 방식이다. 이 외에도 여러가지 방법이 존재한다.

# Reference

* [KOCW 양희재 교수님 - 운영체제](http://www.kocw.net/home/search/kemView.do?kemId=978503)
* [양희재 교수님 블로그(시험 기출 문제)](https://m.blog.naver.com/PostList.nhn?blogId=hjyang0&categoryNo=13)
* [codemcd 님의 정리글](https://velog.io/@codemcd/)
* [세마포 사진](https://m.blog.naver.com/wndrlf2003/220011819891)
* Operating System Concepts, 9th Edition - Abraham Silberschatz
