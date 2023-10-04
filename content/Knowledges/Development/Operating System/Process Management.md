---
title: Process Management
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

프로세스의 정의, CPU 스케쥴러, 멀티 프로그래밍에 대해 알아본다.

# 1. 프로세스(Process)

프로세스는 메인 메모리에 할당되어 실행중인 상태인 프로그램을 말한다. 프로그램은 일반적으로 하드디스크(보조기억장치)에 저장되어 아무 일도 하지 않는 상태이다. 프로세스는 실행하면서 stack pointer, data, text, register 등이 끊임없이 변한다. 프로세스는 job, task 등으로 불리기도 한다.

## 1.1 프로세스의 생성과 종료

프로세스는 프로세스에 의해 만들어진다. 컴퓨터가 부팅이 되면 운영체제가 메모리에 올라오는데 **운영체제가 처음으로 수행하는 일 중에 하나는 최초의 프로세스를 생성하는 것**이다. 이렇게 처음 만들어진 프로세스가 다른 프로세스를 만들고 그 프로세스가 또 다른 프로세스를 만드는 과정을 반복한다.

![](os-process1.png)

위와 같이 최초의 프로세스는 **Init**이다. 이 이름은 운영체제마다 다르고, init은 UNIX 운영체제 기준 이름이다. 여기서 여러 다른 프로세스들이 생성되면 위와 같은 그림처럼 트리 모양으로 나타낼 수 있다.여기서 프로세스를 생성한 쪽을 부모 프로세스, 만들어진 프로세스를 자식 프로세스라고 한다. 같은 부모를 갖는 자식 프로세스 끼리는 서로 Sibling(형제) 프로세스라고 한다.

프로세스는 각각 고유의 번호를 갖는데 이를 \*\*PID(Process Identifirer)\*\*라고 한다. PID는 일반적으로 정수형(integer)으로 표현한다. PPID는 부모의 PID를 말한다.

### 1.1.1 프로세스 생성

새로운 프로세스를 만드는 시스템 콜이 존재하는데, 이는 fork() 라 한다. 만들어진 프로세스에서 어떠한 파일을 실행하려면 exec() 시스템 콜을 사용한다.

### 1.1.2 프로세스 종료

프로세스를 종료하는 시스템 콜은 exit() 이다. 한 프로세스가 종료되면 해당 프로세스가 사용한 모든 자원(메모리, 파일, I/O 등)을 회수해야한다. 이러한 회수된 자원과 권한은 모두 운영체제로 되돌아가야한다.

## 1.2 프로세스의 구조

![](os-process2.png)
[출처 : https://mintnlatte.tistory.com/](https://mintnlatte.tistory.com/396){: .center-text}

![](os-process3.png)
[출처 : https://rookieboxsite.wordpress.com](https://rookieboxsite.wordpress.com/2017/10/20/프로세스-메모리-구조/){: .center-text}

### 1.2.1 Stack

* 프로그램의 지역 변수, 함수, return 주소를 포함한다.
* 함수 호출을 하면 해당 주소가 스택영역에 저장되어 있다가 return하면 pop된다.

### 1.2.2 Heap

* 힙 영역에는 프로그램이 실행되는 동안 동적으로 사용할 데이터들이 저장된다.
* c언어의 malloc을 이용해서 메모리를 동적할당하면 힙 영역에 저장된다.(free시키지 않으면 힙 영역에 계속 들어 있음)

### 1.2.3 Data

* 데이터 영역에는 전역 변수와 정적 지역 변수가 포함되어 있다.
  데이터 영역은 **BSS**, **Data**로 나눠진다.
* BSS는 초기화 되지 않은 변수들이 저장
  초기화 된 변수들이 저장된 영역으로 0으로 자동 초기화해 준다.
* Data는 초기값을 설정한 전역 변수와 정적 변수를 위한 영역이다.

#### BSS,Data로 구분하는 이유?

* 초기화 된 데이터는 초기값을 저장해야 함으로 Data영역에 저장되서 Rom에 저장된다. 하지만 초기화 되지 않은 데이터 까지 Rom에 저장되면 큰 size의 rom이 필요하므로 구분한다 ( 초기화 되지 않은 데이터는 ram에 저장하자)

### 1.2.4 Text

* 해당 코드가 저장되는 영역이다.
* 힙과 ,스택영역에서 오버플로우가 발생할 것을 대비해서 힙/스택의 아래부분에 위치한다.
* 실행 순서등이 저장되어 있다.
* 읽기 전용이다.
* 다른 프로세스에서 참조 가능하다.

### 1.2.5 정리

|크기 변화|O|X|
|:------------|:|:|
||Stack|Text|
||Heap|Data|
|||Bss|

* Text
  * Program Counter(다음번에 실행될 명령어의 주소를 저장하는 레지스터 : CPU에게 줄 예정)
  * 프로그램 코드
* Data
  * 전역 변수 저장
  * 스태틱 변수 저장
* Heap
  * 메모리 관리
  * 동적 메모리 할당 (system call로 관리)
  * 메모리에 접근하기 때문에 주의해야 함
* Stack
  * 임시 데이터 저장
  * 지역 변수
  * 반환 주소

## 1.3 프로세스 상태

* New: 프로그램이 메인 메모리에 할당된다.
* Ready: 할당된 프로그램이 초기화와 같은 작업을 통해 실행되기 위한 모든 준비를 마친다.
* Running: CPU가 해당 프로세스를 실행한다.
* Waiting: 프로세스가 끝나지 않은 시점에서 I/O로 인해 CPU를 사용하지 않고 다른 작업을 한다. (해당 작업이 끝나면 다시 CPU에 의해 실행되기 위해 ready 상태로 돌아가야 한다.)
* Terminated: 프로세스가 완전히 종료된다.

![](os-process4.png)

위 그림은 **프로세스 상태 전이도**의 모습이다. new에서부터 프로세스가 어떤 작업에 의해 상태가 변하는지 나타낸다. running에서 ready로 변할 때는 time sharing system에서 해당 프로세스가 CPU시간을 모두 소진하였을 때 인터럽트에 의해 강제로 ready상태로 변하고, CPU는 다른 프로세스를 실행시킨다.

## 1.4 PCB(Process Control Block)

PCB는 **프로세스에 대한 모든 정보가 모여있는 곳**으로, Task Control Block(TCB) 이라고도 한다. PCB안에는 프로세스의 상태, 프로세스 번호(PID), 해당 프로세스의 program counter(pc), register값, MMU(Memory Management Unit)정보, CPU점유 시간 등이 포함되어 있다. PCB는 **운영체제 내부**의 프로세스를 관리하는 코드 부분에 저장되어 있다.

![](os-process5.png)

CPU는 한 프로세스가 종료될 때까지 수행하는 것이 아니라 여러 프로세스를 중간 중간에 바꿔가면서 수행한다. 그러므로 CPU는 수행중인 프로세스를 나갈 때, 이 프로세스의 정보를 어딘가에 저장하고 있어야 다음에 이 프로세스를 수행할 때 이전에 수행한 그 다음부터 이어서 작업할 수 있다. 이러한 정보를 저장하는 곳이 PCB이다.

## 1.5 프로세스 큐(Queue)

프로세스의 생애 주기를 생각해보면, DISK, Memory, cpu등을 거치게 된다. 갈수록 좁아지는 공간과, 한정된 자원 때문에 **병목현상**이 발생할 수 밖에 없다. 그렇기 때문에 우리는 먼저 실행된 프로세스와 같은 **규칙에 따라 이 프로세스들을 줄세워 관리**해야 한다. 이러한 순서를 Queue로 관리한다.

![](os-process6.png)

* Job Queue: 하드디스크에 있는 프로그램이 실행되기 위해 메인 메모리의 할당 순서를 기다리는 큐이다.
* Ready Queue: CPU 점유 순서를 기다리는 큐이다.
* Device Queue: I/O를 하기 위한 여러 장치가 있는데, 각 장치를 기다리는 큐가 각각 존재한다.

### Scheduling(스케쥴링)

위와 같이 여러 큐가 존재하는데, 각 큐 내부에 저장된 실제 데이터는 각 프로세스의 **PCB**가 저장되어 있다. 그리고 이러한 순서를 기다리는 공간이 있다면 이 순서를 정해주는 알고리즘이 있어야 한다. 이러한 알고리즘을 \*\*스케줄링(Scheduling)\*\*이라 한다.

* Job Queue - Job Scheduler(Long-term scheduler)
* Ready Queue - CPU Scheduler(Short-term scheduler)
* Device Queue - Device Scheduler

Job queue의 순서를 정해주는 job scheduler를 long-term scheduler라고도 하는데, 이는 이 스케줄링이 발생하는 시간이 비교적 오래걸리기 때문이다.(대략 초~분) 반면에 ready queue의 스케줄러를 short-term scheduler라고도 하는데, 이는 스케줄링이 발생하는 시간이 매우 짧기 때문이다. CPU scheduling은 말 그대로 프로세스가 CPU를 점유하는 순서를 정해주는데 이는 매우 빠른 시간안에 이루어져야한다. 현대 컴퓨터가 여러 프로그램을 동시에 사용하는 것과 같은 효과를 주는 이유가 이 스케줄링 속도가 매우 빠르게 이루어지기 때문이다.

# 2. 멀티 프로그래밍

멀티프로그래밍은 단일 프로세서(CPU) 환경에서 메모리에 다수의 프로세서들을 올려둔 상태로, CPU가 쉬는 동안 다른 프로세서에게 CPU자원을 할당하여 동시에 실행하는 것처럼 보이게 하는 방법이다. 이에 관한 용어에 대해 정리해 보자.

## 2.1 Degree of multiprogramming

Degree of multiprogramming 는 현재 메모리에 할당되어 있는 프로세스 개수를 말한다.

## 2.2. I/O bound process VS CPU bound process

프로세스는 I/O bound process 와 CPU bound process 로 나뉜다.

* I/O bound process: 해당 프로세스에서 I/O(입출력) 작업이 차지는 비중이 높은 프로세스를 말한다.
  
  * Word processor
* CPU bound process: 해당 프로세스에서 CPU 작업(계산)이 차지는 비중이 높은 프로세스를 말한다.
  
  * Super computer

운영체제, 정확히 말하면 job scheduler 는 이러한 프로세서의 특징을 감안하여 I/O bound process와 CPU bound process를 적절히 분배해서 메모리에 할당해주어야 한다.

## 2.3 Medium-term scheduler

Medium-term scheduler는 말그대로 short-term보다는 덜 발생하지만, long-term보다는 자주 발생하는 scheduler이다. 하는 일은 운영체제가 실행하는 동안 주기적으로 메인 메모리에 있는 전체 프로세스를 검사하여 직접적으로 CPU와 일을 하지 않는 프로세스를 찾아 보조기억장치로 옮기는 것이다. 옮기는 기준은 여러가지 있겠지만 대표적으로 장기간 사용하지 않는 프로세스가 있다.

### Swapping

일하지 않는 프로세스를 쫒아내는 행위를 Swapping이라 부르는데, 이는 메인 메모리에서 장시간 사용하지 않는 프로세스를 하드디스크(Swap device = Backing store, 일반적으로 하드디스크는 File system + Backing store 로 구성되어 있다.)로 옮겨주고(Swap out ), 나중에 이 프로세스가 다시 사용되려고 하면 하드디스크에서 해당 프로세스를 다시 메인 메모리에 할당해준다.(Swap in)

Swap out을 통해 메인 메모리의 공간이 생기므로 이를 더욱 효율적으로 사용할 수 있다. 만약 swap out된 프로세스가 다시 swap in으로 메인 메모리에 할당하려고 할 때 이전의 공간으로 할당되는 것을 보장하지는 않는다. 왜냐하면 위에 말했듯이 swap out으로 생긴 메모리 공간은 **다른 프로세스가 사용할 수 있기 때문**이다.

## 2.4 Context Switching(문맥 전환)

Context switching은 CPU가 한 프로세스에서 다른 프로세스로 옮겨가는 것을 말한다. 즉, 한 프로세스가 실행중인 것을 멈추고 다른 프로세스가 실행되는 것이다.

* Scheduler
  * 여기서 스케줄러는 CPU Scheduler를 말하며, CPU가 어느 프로세스를 선택할지 정한다.
* Dispatcher
  * 실제 context switching이 발생하면 CPU의 내부 데이터를 새로 시작되는 데이터로 바꿔준다. 이 과정에서 현재 실행하고 있는 프로세스의 PCB에 현재까지 작업과정으로 갱신하고, 새로 시작되는 프로세스의 PCB 데이터를 CPU로 복원(Restore)하는 작업을 한다.
* **Context switching overhead**
  * Context switching이 발생할 때마다, dispatcher에서 수행하는 작업을 매번 수행해야하며 이 모든 것은 overhead(부담)이다. 그리고 문맥 전환은 매우 자주 발생하는 작업이므로 overhead를 줄이기 위해서는 dispatcher를 구현하는 코드에 대한 효율을 최대한 높여주어야한다.

### Reference

* [KOCW 양희재 교수님 - 운영체제](http://www.kocw.net/home/search/kemView.do?kemId=978503)
* [양희재 교수님 블로그(시험 기출 문제)](https://m.blog.naver.com/PostList.nhn?blogId=hjyang0&categoryNo=13)
* [codemcd 님의 정리글](https://velog.io/@codemcd/)
* [프로세스의 구조](https://velog.io/@pa324/운영체제-프로세스-메모리-구조-18k3jfidll)
* Operating System Concepts, 9th Edition - Abraham Silberschatz
