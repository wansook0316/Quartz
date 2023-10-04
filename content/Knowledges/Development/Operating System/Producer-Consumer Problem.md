---
title: Producer-Consumer Problem
thumbnail: ''
draft: false
tags:
- operatiing-system
- producer-consumer-problem
- buffer
- bounded-buffer
- mutex
- busy-waiting
created: 2023-10-04
---

생산자-소비자 문제는 생산자가 데이터를 생산하면 소비자는 그 데이터를 소비하는 형태의 문제이다. 컴퓨터 환경에서 예를 보면, 컴파일러 -> 어셈블러, 웹 서버 -> 웹 클라이언트 등이 있다. 컴파일러에서 생성한 어셈블리어는 어셈블러에서 이를 소비하여 기계어를 만든다.

![](Pasted%20image%2020231004164207.png)

생산자-소비자 관계를 간단히 그림으로 나타내면 위와 같다. 이 관계의 대부분은 생산자에서 생산한 데이터 양을 소비자가 한 번에 소비하는 경우는 드물다. 생산한 데이터는 중간의 **buffer** 라는 저장 공간(메모리 공간)에 저장해두고 소비자는 여기서 필요한 만큼 가져간다. 창고와 같다.

버퍼의 크기는 현실적으로 유한하다. 그러므로 생산자는 버퍼 공간이 가득 차면 더 이상 저장할 수 없다. 소비자는 버퍼가 비어 있으면 가져올 수 없다. 이러한 유한한 버퍼 크기를 **bounded buffer** 라고 한다.

## 정리

* 생산자 소비자 문제
  * 생산자 : 데이터 생산, 소비자 : 데이터 소비
  * 컴파일러 -> 어셈블러, 파일 서버 -> 클라이언트, 웹서버 -> 웹 클라이언트
* Bounded Buffer
  * Buffer란 생산자와 소비자 사이에 존재하는 창고와 같음
  * 생산자와 소비자 사이의 속도 차이를 보완하기 위해 필요함
  * 버퍼 크기는 유한하다.
    * 생산자는 가득 차면 넣을 수 없다.
    * 소비자는 버퍼가 비면 뺄 수 없다.

# 1.1 Code

## Main

````java
class Test {
	public static void main(String[] arg) {
		Buffer b = new Buffer(100);
		Producer p = new Producer(b, 10000);
		Consumer c = new Consumer(b, 10000);
		p.start();
		c.start();
		try {
			p.join();
			c.join();
		} catch (InterruptedException e) {}
		System.out.println("Number of items in the buf is " + b.count);
	}
}
````

## Buffer Class

***이 부분을 주목해서 봐야 한다.***

````java
class Buffer {
	int[] buf; // buf: Bounded buffer
	int size;	// size: 버퍼 크기
	int count; // count: 버퍼에 저장된 데이터 개수
	int in; // in: 생산한 데이터를 담을 버퍼 인덱스
	int out; // out: 소비할 데이터를 가리키는 버퍼 인덱스
	Buffer(int size) {
		buf = new int[size];
		this.size = size;
		count = in = out = 0;
	}
	void insert(int item) {
		/* check if buf is full */
		while (count == size)
			;
		/* buf is not full */
		buf[in] = item;
		in = (in+1)%size; //  Circular Queue
		count++;
	}
	int remove() {
		/* check if buf is empty */
		while (count == 0)
			;
		/* buf is not empty */
		int item = buf[out];
		out = (out+1)%size; //  Circular Queue
		count--;
		return item;
	}
}
````

Buffer 클래스의 멤버 변수를 보면

* buf: Bounded buffer
* size: 버퍼 크기
* count: 버퍼에 저장된 데이터 개수
* in: 생산한 데이터를 담을 버퍼 인덱스
* out: 소비할 데이터를 가리키는 버퍼 인덱스

## Producer

````java
/****** 생산자 ******/
class Producer extends Thread {
	Buffer b;
	int N;
	Producer(Buffer b, int N) {
		this.b = b; this.N = N;
	}
	public void run() {
		for (int i=0; i<N; i++)
			b.insert(i);
	}
}
````

## Consumer

````java
/****** 소비자 ******/
class Consumer extends Thread {
	Buffer b;
	int N;
	Consumer(Buffer b, int N) {
		this.b = b; this.N = N;
	}
	public void run() {
		int item;
		for (int i=0; i<N; i++)
			item = b.remove();
	}
}
````

만약 생성자가 데이터를 계속 생성하여 버퍼의 마지막 인덱스로 가면 그 다음은 처음으로 되돌아간다. (circular buffer) 소비하는 것도 마찬가지이다.

main을 보면 크기가 100인 버퍼를 생성하고 2개의 쓰레드가 각각 생산자와 소비자 역할을 하여 각각 10000번씩 생산하고 소비한다. 정상적인 결과는 count값이 0이 출력되야 한다.

하지만 실제 코드를 수행하면 무한 루프에 빠지거나, count값에 전혀 예상하지 않은 값이 출력된다.

이 문제 당연하게도 동기화 문제이다. 생산자와 소비자가 동시에 접근하는 **공통 변수인 buf, count 를 두 프로세스가 동시에 업데이트**하기 때문이다. 다시 말하면 **임계구역에 동시에 접근**한 것이다.

# 1.2 동기화 해결

해결방법은 앞서 배웠던 세마포를 사용하여 mutual exclusion을 보장하는 것이다. 임계구역을 동시에 접근하는 것을 방지하고 하나의 프로세스만 허용해야한다. `sem`이라고 선언하지 않고 `mutex`라 선언한다. 지금 만드는 semaphore는 \*\**mut*\*\*ual \*\**ex*\*\*clusion을 막는 역할을 하기 때문이다.

## Buffer Class

````java
class Buffer {
	int[] buf;
	int size;
	int count;
	int in;
	int out;
	Semaphore mutex;   // 세마포 선언

	Buffer(int size) {
		buf = new int[size];
		this.size = size;
		count = in = out = 0;
		mutex = new Semaphore(1);
	}

	void insert(int item) {
		/* check if buf is full */
		while (count == size)
			;
		/* buf is not full */
		try {
            mutex.acquire();
            buf[in] = item;
            in = (in+1)%size;
            count++;
            mutex.release();
		} catch(InterruptedException e) {}
	}

	int remove() {
		/* check if buf is empty */
		while (count == 0)
			;
		/* buf is not empty */
		try {
			mutex.acquire();
			int item = buf[out];
			out = (out+1)%size;
			count--;
			mutex.release();
			return item;
		} catch(InterruptedException e) {}

		return -1;
	}
}
````

위는 임계구역에 세마포를 추가한 코드이다. **임계구역은 위에서 말했듯이 buf, count 에 접근하는 영역**이므로 insert(), remove() 함수 내부에 선언한 것을 볼 수 있다.

# 1.3 Busy waiting

여기서 한 가지 더 문제점이 있다. 바로 busy waiting 이다. 위에서 busy waiting은 생산과 소비하기 전에 **버퍼가 가득 찼는지 비어 있는지 확인하는 무한 반복문**을 말한다. 이는 아무 일도 하지 않으면서 무한으로 반복하여 CPU를 점유하고 있으므로 매우 비효율적이다. 이를 해결할 수 있는 것도 세마포이다.

````java
class Buffer {
	int[] buf;
	int size;
	int count;
	int in;
	int out;
	Semaphore mutex, full, empty;

	Buffer(int size) {
		buf = new int[size];
		this.size = size;
		count = in = out = 0;
		mutex = new Semaphore(1);
		full = new Semaphore(0);
		empty = new Semaphore(size);
	}

	void insert(int item) {
		try {
            empty.acquire();    // 버퍼의 비어있는 공간을 1 감소시킨다.(비어있는 공간이 없으면 block)
            mutex.acquire();
            buf[in] = item;
            in = (in+1)%size;
            count++;
            mutex.release();
            full.release();    // 버퍼의 찬 공간을 1 증가시킨다.
          } catch(InterruptedException e) {}
	}

	int remove() {
		try {
            full.acquire();    // 버퍼의 찬 공간을 1 감소시킨다.(버퍼가 모두 비어있으면 block)
            mutex.acquire();
            int item = buf[out];
            out = (out+1)%size;
            count--;
            mutex.release();
            empty.release();   // 버퍼의 비어있는 공간을 1 증가시킨다.
            return item;
          } catch(InterruptedException e) {}
		return -1;
	}
}
````

busy waiting을 없애기 위해 두 개의 세마포를 더 추가하였다.

* empty: 버퍼에서 비어있는 공간의 **개수**(초기값 size)
* full: 버퍼에서 차있는 공간의 **개수**(초기값 0)

추가한 세마포 변수는 위와 같고, empty는 초기화할 때 버퍼는 모두 비어있으므로 버퍼의 크기로 초기화하고 full은 초기 버퍼에는 아무런 데이터가 없으므로 0으로 초기화한다.

데이터를 생성하기 전에 비어있는 공간이 있는지 확인한다. 없다면 empty세마포의 value값이 -1이 되므로 block이 되고, 있다면 임계구역 내부로 진입하여 데이터를 생성한다. 생성이 완료되면 full세마포의 value값을 1 증가시킨다.(소비자는 반대로 동작한다고 볼 수 있다. 코드참고) 이 코드를 실행시켜보면 정상적으로 결과값이 0이 출력되는 것을 확인할 수 있다.

# Reference

* [KOCW 양희재 교수님 - 운영체제](http://www.kocw.net/home/search/kemView.do?kemId=978503)
* [양희재 교수님 블로그(시험 기출 문제)](https://m.blog.naver.com/PostList.nhn?blogId=hjyang0&categoryNo=13)
* [codemcd 님의 정리글](https://velog.io/@codemcd/)
* Operating System Concepts, 9th Edition - Abraham Silberschatz
