---
title: Monitor
thumbnail: ''
draft: false
tags:
- operatiing-system
- monitor
- mutual-exclusion
- bank-account-problem
- producer-consumer-problem
- producer-consumer
created: 2023-10-04
---

현재 사용하는 동기화 도구인 모니터(Monitor)에 대해서 알아본다.

세마포는 실제로 매우 오래된 동기화 도구이다. 현재에는 모니터(monitor)라는 동기화 도구를 주로 사용하며, 이는 좀 더 고수준의 동기화 기능을 제공한다.

# 1. 모니터 구조

![](os-Monitor1.png)

Semaphore의 구조는 위와 같았다. 그렇다면 monitor는 무엇이 다를까?

![](os-Monitor2.png)

위는 모니터의 구조를 간단히 나타낸 그림이다. 모니터는 공유 자원 + 공유 자원 접근함수로 이루어져 있고, 2개의 큐를 가지고 있다. 각각 **mutual exclusion(상호배타) queue**, **conditional synchronization(조건동기) queue**이다.

* 상호배타 큐는 말그대로 공유 자원에 하나의 프로세스만 진입하도록 하기 위한 큐이다.
* 조건동기 큐는 이미 공유자원을 사용하고 있는 프로세스가 특정한 호출 wait()을 통해 조건동기 큐로 들어갈 수 있다.

조건동기 큐에 들어가 있는 프로세스는 공유자원을 사용하고 있는 다른 프로세스에 의해 깨워줄 수 있다. 이 역시 깨워주는 프로세스에서 특정한 호출 `notify()`을 해주며, 깨워주더라도 이미 공유자원을 사용하고 있는 프로세스가 해당 구역을 나가야 비로소 큐에 있던 프로세스가 실행된다.

# 2. monitor in java

자바는 모니터를 제공하는 대표적인 언어이며, 자바의 모든 개체는 모니터가 될 수 있다. 그렇다면 자바를 통해 모니터에 대한 예제를 살펴보자.

````java
class C {
  private int value, ...;     // 공유 변수
  synchronized void Foo() {   // 배타동기
    // ...
  }
  synchronized void Goo() {
    // ...
  }
  void H() {
    // ...
  }
}
````

위 코드는 모니터를 사용하고 있는 클래스이다. `value`와 같은 변수들은 여러 쓰레드가 공유하고 있는 변수로 볼 수 있고, `synchronized` 키워드는 배타동기를 수행하는 함수를 말한다. 즉, 해당 함수에는 단 하나의 쓰레드만 접근할 수 있다.

`Foo()` 함수와 `Goo()` 함수는 `synchronized` 키워드를 통해 상호배타 함수로 선언하였는데, 이는 \*\*"둘 다 같은 임계구역을 갖는다"\*\*는 의미이다. 다시 말해서, Foo() 함수에 한 쓰레드가 수행 중이라면, Foo() 함수뿐 아니라 Goo() 함수에도 다른 쓰레드는 접근할 수 없다. 반면에 H() 함수는 일반 함수인데, 이 함수에서는 공통 변수에 대한 업데이트를 하지 않는다는 것을 예상할 수 있다. (여러 쓰레드가 동시에 접근가능하다.)

조건동기는 특정한 메서드 호출로 사용할 수 있다.

wait(): 호출한 쓰레드를 조건동기 큐에 삽입한다.
notify(): 조건동기 큐에 있는 하나의 쓰레드를 깨워준다.
notifyAll(): 조건동기 큐에 있는 모든 쓰레드를 깨워준다.

모니터 역시, 세마포에서 할 수 있는 기능인 Mutual exclusion, Ordering을 모두 할 수 있다. 예제를 통해 이를 살펴보자.

# 3. Problem Solving by Monitor

monitor를 사용하여 지금까지 배운 문제들을 해결하는 방법에 대해 알아보자.

## 3.1 BankAccount Problem

이전에 세마포에서 살펴본 은행계좌 문제를 통해 세마포 대신 모니터를 사용해서 Mutual exclusion, Ordering을 구현해보자.

### 3.1.1 Mutual Exclusion

````java
class Test {
	public static void main(String[] args)
	throws InterruptedException {
		BankAccount b = new
		BankAccount();
		Parent p = new Parent(b);
		Child c = new Child(b);
		p.start();
		c.start();
		p.join();
		c.join();
		System.out.println( "\nbalance = " + b.getBalance());
	}
}

class BankAccount {
	int balance;
	synchronized void deposit(int amt) {
		int temp = balance + amt;
		System.out.print("+");
		balance = temp;
	}
	synchronized void withdraw(int amt) {
		int temp = balance - amt;
		System.out.print("-");
		balance = temp;
	}
	int getBalance() {
		return balance;
	}
}

class Parent extends Thread {
	BankAccount b;
	Parent(BankAccount b) {
		this.b = b;
	}
	public void run() {
		for (int i=0; i<100; i++)
			b.deposit(1000);
	}
}

class Child extends Thread {
	BankAccount b;
	Child(BankAccount b) {
		this.b = b;
	}
	public void run() {
		for (int i=0; i<100; i++)
			b.withdraw(1000);
	}
}
````

코드가 매우 간단해졌다..!{:.center-text}

위 코드에서 볼 수 있듯이, 세마포를 사용할 때보다 모니터를 사용하면 매우 간결하게 코드를 구현할 수 있다. 세마포를 선언하고 `number of permit` 값을 설정하는 대신, `synchronized` 키워드 하나로 이를 대체한 것을 볼 수 있다.

````
+++++++++++++++++++++++------------------------------------------+++++++++++++++
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++------------------
----------------------------------------
balance = 0
````

실행 결과는 위와 같고, balance값이 정상적으로 0을 출력한다.

### 3.1.2 Mutual Ordeing

은행계좌 문제를 살펴보기전에, ordering을 하기 위해 모니터를 어떻게 사용하는지 보자.

|P1|P2|
|::|::|
||wait()|
|section 1|section 2|
|notify()||

위 구조는 프로세스 순서를 P1, P2 순서로 실행하기 원하는 경우이며, 이는 세마포와 매우 유사한 것을 알 수 있다. 그러면 은행계좌 문제를 모니터로 구현하는데, 입금 먼저 수행, 출금 먼저 수행, 입금 출금 반복 수행 3가지를 각각 구현해보자. 그리고 위 코드에서 수정하는 부분은 순서를 정하는 입금, 출금함수이므로 이 부분을 대변하는 `BankAccount`만 수정하자.

#### 입금 먼저 수행하기

먼저 입금시작하면 기다리라고 하면된다.

````java
class BankAccount {
	int balance;
	synchronized void deposit(int amt) {
		int temp = balance + amt;
		System.out.print("+");
		balance = temp;
		notify();
	}
	synchronized void withdraw(int amt) {
		while (balance <= 0)
			try {
				wait();
			} catch (InterruptedException e) {}
		int temp = balance - amt;
		System.out.print("-");
		balance = temp;
	}
	int getBalance() {
		return balance;
	}
}
````

````
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
++++++++++++++++++++------------------------------------------------------------
----------------------------------------
balance = 0
````

#### 출금 먼저 수행하기

먼저 출금시작하면 기다리라고 하면된다.

````java
class BankAccount {
	int balance;
	synchronized void deposit(int amt) {
		while (balance == 0)
			try {
				wait();
			} catch (InterruptedException e) {}
		int temp = balance + amt;
		System.out.print("+");
		balance = temp;
	}
	synchronized void withdraw(int amt) {
		int temp = balance - amt;
		System.out.print("-");
		balance = temp;
		notify();
	}
	int getBalance() {
		return balance;
	}
}
````

````
--------------------------------------------------------------------------------
--------------------++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
++++++++++++++++++++++++++++++++++++++++
balance = 0
````

#### 입금 출금 반복 수행하기

입금 넣고 기다리고 출금 넣고 기다리고를 반복하면 된다!

````java
class BankAccount {
	int balance;
	boolean p_turn = true;
	synchronized void deposit(int amt) {
		int temp = balance + amt;
		System.out.print("+");
		balance = temp;
		notify();
		p_turn = false;
		try {
			wait();
		} catch (InterruptedException e) {}
	}
	synchronized void withdraw(int amt) {
		while (p_turn)
			try {
				wait();
			} catch (InterruptedException e) {}
		int temp = balance - amt;
		System.out.print("-");
		balance = temp;
		notify();
		p_turn = true;
	}
	int getBalance() {
		return balance;
	}
}
````

````
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
balance = 0
````

## 3.2 전통적 동기화 문제

[10: 전통적인 동기화 문제들](https://wansook0316.github.io/cs/os/2020/04/05/운영체제-정리-10-프로세스-동기화-3.html)을 수정해본다!

### 2.1 Producer-Consumer Problem

Semaphore를 사용하면 상호 배제 sem, 가득 차있을 때 block하는 sem, 비어있을 때 block하는 sem 총 3개를 사용했어야 했다. 하지만 이번에는 코드가 간단해진다!

````java
class Buffer {
    int[] buf;
    int size, count, in, out;
    Buffer(int size) {
        buf = new int[size];
        this.size = size;
        count = in = out = 0;
    }

    synchronized void insert(int item) {
        while (count == size)
            try {
                wait();
            } catch (InterruptedException e) {}
        buf[in] = item;
        in = (in+1)%size;
        notify();
        count++;
    }

    synchronized int remove() {
        while (count == 0)
            try {
                wait();
            } catch (InterruptedException e) {}
        int item = buf[out];
        out = (out+1)%size;
        count--;
        notify();
        return item;
    }
}

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

````
Number of items in the buf is 0
````

### 2.2 The Dining Philosopher Problem

````java
class Philosopher extends Thread {
    int id; // philosopher id
	Chopstick lstick, rstick;
    Philosopher(int id, Chopstick lstick, Chopstick rstick) {
        this.id = id;
        this.lstick = lstick;
        this.rstick = rstick;
    }

    public void run() {
        try {
            while (true) {
                lstick.acquire();
                rstick.acquire();
                eating();
                lstick.release();
                rstick.release();
                thinking();
            }
        }catch (InterruptedException e) { }
    }

    void eating() {
        System.out.println("[" + id + "] eating");
    }
    void thinking() {
        System.out.println("[" + id + "] thinking");
    }
}

class Chopstick {
    private boolean inUse = false;
    synchronized void acquire() throws InterruptedException {
        while (inUse)
            wait();
        inUse = true;
    }
    synchronized void release() {
        inUse = false;
        notify();
    }
}

class Test {
    static final int num = 5; // number of philosphers & chopsticks
    public static void main(String[] args) {
        int i;
        /* chopsticks */
        Chopstick[] stick = new Chopstick[num];
        for (i=0; i<num; i++)
            stick[i] = new Chopstick();
        /* philosophers */
        Philosopher[] phil = new Philosopher[num];
        for (i=0; i<num; i++)
            phil[i] = new Philosopher(i, stick[i], stick[(i+1)%num]);
        /* let philosophers eat and think */
        for (i=0; i<num; i++)
            phil[i].start();
    }
}
````

이 코드는 교착상태를 해결하지 않은 상태이다. 해결 하기 위해서는 `circular wait` 조건을 불만족하도록 만들면 된다. 이 부분에서는 쉽게 동기화 문제를 해결할 수 있음을 보고가면 된다.

# Reference

* [KOCW 양희재 교수님 - 운영체제](http://www.kocw.net/home/search/kemView.do?kemId=978503)
* [양희재 교수님 블로그(시험 기출 문제)](https://m.blog.naver.com/PostList.nhn?blogId=hjyang0&categoryNo=13)
* [codemcd 님의 정리글](https://velog.io/@codemcd/)
* Operating System Concepts, 9th Edition - Abraham Silberschatz
