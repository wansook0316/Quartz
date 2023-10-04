---
title: Semaphore
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

프로세스 동기화 도구에 대해 알아본다.

# Semaphore(세마포)

![](os-process-sync-21.png)

Semaphoresms 깃발이라는 네덜란드 단어이다. 옛날에는 기찻길에서 공유하는 길이 있을 때, 깃발 표식으로 오고감의 신호를 주고 받았다. 이러한 맥락에서, Critical section을 사용하는 쓰레드에 사용하는 방법의 이름으로 붙게 되었다.

위의 그림을 보면 공유하는 기찻길이 하나이다. 이 경우 공유 자원이 1이라 볼 수 있다. 하나의 기차가 지나갈 때 1을 감소시키고, 다 지나간 뒤에 1을 증가시키는 일을 반복한다. 그리고 다른 기차가 지나가려고 할 때, Semaphore가 0인 경우에는 정지하고 1인 경우에 순차적으로 지나가게 하면 해결된다. 이렇게 Semaphore가 0, 1인 경우를 Binary Semaphore라 한다.

공유 자원이 꼭 1개일 필요는 없다. 여러개의 자원인 상황도 존재한다. 가령 위의 기차 그림에서 통과해서 갈 수 있는 공유 기찻길이 5개라면, 공유자원은 5이다. 이런 경우를 counting semaphore라 한다.

## 1. 구현

![](os-process-sync-22.png)

위의 예시에서 보듯, 깃발은 총 두가지가 필요하다. 지나가는 경우에는 감소, 지나간 뒤에는 증가이다. 초기에는 P, V로 불렸다.(네덜란드에서 만들어져 네덜란드어의 약자이다.) 현재에는 P는 test를 의미하며 `acquire()` 로 사용하고, V는 increment를 의미하며 `release()` 로 사용한다. `acquire()`는 자원이 사용가능한지 확인하고, 사용가능하다면 사용하고 그렇지 않다면 대기한다. `release()`는 자원을 내놓고, 다음 자원을 실행시킨다.

자바를 통해 세마포 구조를 간단히 살펴보면 아래와 같다.

````java
class Semaphore {
  int value;      // number of permits
  Semaphore(int value) {
    // ...
  }
  void acquire() {
    value--;
    if (value < 0) {
      // add this process/thread to list
      // block
    }
  }
  void release() {
    value++;
    if (value <= 0) {
      // remove a process P from list
      // wakeup P
    }
  }
}
````

![](os-process-sync-23.png)

위 코드에서 acquire() 는 value값을 감소시키고 만약 **value값이 0보다 작으면(가용자원을 모두 사용함) 이미 해당 임계구역에 어느 프로세스가 존재**한다는 의미이므로 현재 프로세스는 접근하지 못하도록 막아야한다. 이를 list라는 기다리는 줄에 추가한 뒤 block을 걸어준다.(list는 일반적으로 큐로 되어있다.)

release() 는 value값을 증가시키고, 만약 **value값이 0보다 같거나 작으면 임계구역에 진입하려고 대기하는 프로세스가 list에 남아있다는 의미**이므로 그 중에서 하나를 꺼내어 임계구역을 수행할 수 있도록 해주어야 한다.

![](os-process-sync-24.png)

세마포를 그림으로 나타내면 위와 같다. list는 실제로 큐로 볼 수 있다. acquire()에 의해 block되는 프로세스는 세마포 내부에 있는 큐에 삽입된 후, 다른 프로세스가 임계구역을 나오면서 release()를 호출하여 **세마포 큐에 있는 프로세스를 깨워야 한다.**(다시 ready queue로 보낸다.)

위에서 살펴본 것처럼 세마포는 일반적으로 **Mutual exclusion**을 위해 사용된다.  
[운영체제 정리 08: 프로세스 동기화 \<1. 발생 이유와 목적>](https://wansook0316.github.io/cs/os/2020/04/01/운영체제-정리-08-프로세스-동기화-1.html)

### Bank Account Problem(은행 계좌 문제) 해결

이전 글에서 보았던 은행 계좌 문제에 세마포를 적용해보자. 위에서 임계구역은 BankAccount 클래스 내부의 입출력하는 부분인 것을 보았다. 여기에 세마포를 적용해보면 아래와 같다.

````java
import java.util.concurrent.Semaphore;  // 세마포를 사용하기 위해 파일 가장 위에 추가해야 한다.

class BankAccount {
	int balance;

	Semaphore sem;
	BankAccount() {   // BankAccount 클래스의 생성자가 호출되면 세마포를 만든다.
		sem = new Semaphore(1);  // value 값을 1로 초기화한다.
	}

	void deposit(int amount) {
		try {
			sem.acquire();   // 임계구역에 들어가기를 요청한다.
		} catch (InterruptedException e) {}
	    /* 임계 구역 */
		int temp = balance + amount;
		System.out.print("+");
		balance = temp;

		sem.release();   // 임계구역에서 나간다.
	}
	void withdraw(int amount) {
		try {
			sem.acquire();
		} catch (InterruptedException e) {}
	    /* 임계 구역 */
		int temp = balance - amount;
		System.out.print("-");
		balance = temp;

		sem.release();
	}
	int getBalance() {
		return balance;
	}
}
````

value 값은 임계구역에 몇 개의 프로세스를 접근할 것인지 정하는 것과 같다. 지금은 임계 구역에 하나의 프로세스만 접근가능하기 때문에 1 로 초기화 한다. (위 코드를 제외한 부분은 동일하다.) 이 코드를 수행하면 아래와 같은 결과가 나온다.

````java
// +,- 출력 생략
balance = 0
````

정상적으로 잔액이 0원이 나온 것을 확인할 수 있다. 이 코드는 임계구역의 문제를 해결하였으므로 몇 번을 수행하여도 같은 결과값이 출력된다.

## 2. Ordering

세마포는 mutual exclusion뿐 아니라 ordering을 하기 위해서도 사용한다. 즉, 프로세스의 실행 순서를 원하는 순서로 설정 할 수 있다.

예를 들어, 프로세스가 P1, P2 두 개가 있다고 가정하자. 원하는 순서는 P1, P2 순으로 실행하기를 원한다. 그러면 아래와 같이 설정해줄 수 있다.

````
// 초기 semaphore 값 = 0
sem value = 0
````

|P1|P2|
|::|::|
||sem.acquire()|
|section 1|section 2|
|sem.release()||

### P1이 먼저 실행된 경우

1. Section 1 이전에 아무런 동작이 없으므로 바로 수행한다.
1. sem.release() 를 만나면 value값을 1 증가시키고, 세마포 큐에 있는 프로세스를 깨워주는데 현재에는 큐에 프로세스가 없으므로 아무 동작도 하지 않는다.
1. P2가 실행된다.
1. P2의 sem.acquire() 를 만나면 현재 value값은 1이고 이를 1감소시키면 0이 된다. value = 0이면 block을 하지 않으므로, 무사히 Section 2가 수행된다.

### P2가 먼저 실행된 경우

1. Section 2 이전에 sem.acquire() 가 있으므로 이를 수행하는데, 현재 value값은 0이고 이를 1 감소 시키면 -1 이 된다. value값이 음수면 해당 프로세스를 block시킨다.(세마포 큐에 삽입한다.)
1. P1이 실행되면 Section 1이 바로 수행된다.
1. sem.release() 를 만나면 value값을 1 증가시키고, 세마포 큐에 있는 P2 프로세스를 깨워준다.(현재 value = 0)
1. P2의 Section 2가 수행된다.

위에서 두 가지 경우를 살펴보았듯이, P1, P2 둘 중 어느 것을 먼저 실행하여도 결과적으로 **P1 -> P2 순서**로 수행하는 것을 알 수 있다.

### 입금 출금 순서로 은행계좌 문제 해결하기

위에서 계속 살펴봤던 은행계좌 문제에서 ordering을 적용해보자. 프로세스의 실행 순서는 반드시 입금, 출금 순서로 수행해야한다.

````java
class BankAccount {
	int balance;

	Semaphore sem, semOrder;
	BankAccount() {
		sem = new Semaphore(1);
		semOrder = new Semaphore(0);   // Ordeing을 위한 세마포
	}

	void deposit(int amount) {
		try {
			sem.acquire();
		} catch (InterruptedException e) {}
		int temp = balance + amount;
		System.out.print("+");
		balance = temp;
		sem.release();
		semOrder.release();   // block된 출금 프로세스가 있다면 깨워준다.
	}
	void withdraw(int amount) {
		try {
			semOrder.acquire();   // 출금을 먼저하려고 하면 block한다.
			sem.acquire();
		} catch (InterruptedException e) {}
		int temp = balance - amount;
		System.out.print("-");
		balance = temp;
		sem.release();
	}
	int getBalance() {
		return balance;
	}
}
````

위처럼 코드를 수정할 수 있다. Ordering을 위한 semOrder 세마포 변수를 선언하고, 출금하는 동작 앞에 `acquire()`, 입금하는 동작 뒤에 `release()` 를 추가하였다.

````
+++++++++++++++++++++++++------------+++++-----++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++------------------------------------------
----------------------------------------
balance = 0
````

실행 결과는 위와 같다. **+(입금)가 맨 앞에서 실행**한 모습을 볼 수 있다.(입금, 출금 횟수는 100번으로 줄였다.)

만약, 입금, 출금, 입금, 출금, ... 교대로 출력하도록 하려면 세마포를 두 개 사용하여 아래와 같이 구현할 수 있다.

````java
void deposit(int amount) {
	try {
		sem.acquire();
		int temp = balance + amount;
		System.out.print("+");
		balance = temp;
		sem.release();
		semWithraw.release();
		semDeposit.acquire();   // 입금후에는 반드시 출금을 해야 하므로 자신을 block한다.
	} catch (InterruptedException e) {}
}
void withdraw(int amount) {
	try {
		semWithraw.acquire();  // 입금보다 먼저 수행하는 것을 막는다.
		sem.acquire();
	} catch (InterruptedException e) {}
	int temp = balance - amount;
	System.out.print("-");
	balance = temp;
	sem.release();
	semDeposit.release();  // 출금 수행이 완료되면 block되었던 입금 프로세스를 깨워준다.
}
int getBalance() {
	return balance;
}
````

````
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
balance = 0
````

# Reference

* [KOCW 양희재 교수님 - 운영체제](http://www.kocw.net/home/search/kemView.do?kemId=978503)
* [양희재 교수님 블로그(시험 기출 문제)](https://m.blog.naver.com/PostList.nhn?blogId=hjyang0&categoryNo=13)
* [codemcd 님의 정리글](https://velog.io/@codemcd/)
* Operating System Concepts, 9th Edition - Abraham Silberschatz
