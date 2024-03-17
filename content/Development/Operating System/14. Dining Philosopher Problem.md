---
title: Dining Philosopher Problem
thumbnail: ''
draft: false
tags:
- operatiing-system
- dining-philosopher-problem
- deadlock
- starvation
created: 2023-10-04
---

식사하는 철학자 문제는 원형 테이블에 5명의 철학자와 5개의 젓가락이 있는 상황이 있다고 하자. 각 철학자는 생각하고 식사하고 생각하고 식사하고를 반복한다. 단, 식사를 하기 위해서는 2개의 젓가락이 필요하다.

![](Pasted%20image%2020231004222545.png)

이 상황을 프로그래밍을 해보자. 젓가락은 한 철학자가 가져가면 다른 철학자는 이 젓가락을 사용할 수 없다. 즉, 한 젓가락에 동시에 접근할 수 있는 철학자는 **한 명**뿐이므로 젓가락은 세마포로 만들 수 있다.**(number of permit = 1)** 한 철학자가 식사를 하려고 하면, **왼쪽 젓가락과 오른쪽 젓가락 순서**로 가져가고, 식사가 끝나면 동일하게 **왼쪽 젓가락, 오른쪽 젓가락 순서**로 내려놓는다.

# 3.1 Code

````java
import java.util.concurrent.Semaphore;

class Philosopher extends Thread {
	int id; // philosopher id
	Semaphore lstick, rstick; // left, right chopsticks
	Philosopher(int id, Semaphore lstick, Semaphore rstick) {
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

class Test {
	static final int num = 5; // number of philosphers & chopsticks
	public static void main(String[] args) {
        int i;
        /* chopsticks */
        Semaphore[] stick = new Semaphore[num];
        for (i=0; i<num; i++)
            stick[i] = new Semaphore(1);
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

**5개의 젓가락 세마포**와 **5명의 철학자 쓰레드를 생성**한다. 각 철학자 쓰레드에는 무한 반복문으로 왼쪽 젓가락과 오른쪽 젓가락을 순서대로 집은 후 식사를 하고(몇 번 철학자가 식사했다는 것을 화면에 출력), 다시 왼쪽 젓가락, 오른쪽 젓가락 순으로 내려놓고 생각을 한다.

단순히 코드를 봐서는 문제점이 없어보인다. 하지만 이를 수행하면 중간에 멈추고 더이상 실행되지 않는다.
이는 대표적인 **starvation 문제**중 하나이다. 모든 철학자가 식사를 하지 못하고 굶어죽는 상황이라고 할 수 있다.

이는 매우 드문 상황으로 모든 철학자가 동시에 식사를 하려고 왼쪽 젓가락을 집었다고 하자. 그러면 5명의 철학자가 5개의 젓가락을 모두 집어든 상황이다. 그 결과, 남아있는 젓가락은 더 이상없고 모든 철학자가 반대편 젓가락을 들기 위해 기다리고 있다. 하지만 식사할 수 있는 철학자는 없으므로 아무도 젓가락은 내려놓지 않고 하염없이 기다리고 있다.

이러한 상황을 **교착상태(deadlock)** 라고 한다. ~~오오미~~

# Reference

* [KOCW 양희재 교수님 - 운영체제](http://www.kocw.net/home/search/kemView.do?kemId=978503)
* [양희재 교수님 블로그(시험 기출 문제)](https://m.blog.naver.com/PostList.nhn?blogId=hjyang0&categoryNo=13)
* [codemcd 님의 정리글](https://velog.io/@codemcd/)
* Operating System Concepts, 9th Edition - Abraham Silberschatz
