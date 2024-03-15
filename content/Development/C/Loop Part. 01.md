---
title: Loop Part. 01
thumbnail: ''
draft: false
tags:
- C
- loop
- for
- while
created: 2023-10-03
---

## 반복문의 필요성

* 특정 명령을 반복적으로 사용해야 함
* 규칙적으로 반복하는 일
* 동일한 내용을 반복할 때

## For

* 특정 문장을 일정한 횟수만큼 반복 시킬 때 사용

````c
#include <stdio.h>
int main() {
	int i, Sum = 0;
	
	for (i=1; i<=10; i++)
		Sum += i;
	
	printf("1부터 10까지의 합은 %d다.\n",Sum);
	
	return 0;
}

// 프로세스가 시작되었습니다..
> 1부터 10까지의 합은 55다.

// 프로세스가 종료되었습니다.
````

# while

* 횟수를 정확하게 알지는 못하지만 반복의 조건을 알고 있을 때 사용

![](Pasted%20image%2020231003195236.png)

# For vs. While

* 초기화의 위치가 다르다.
* for 문도 초기화를 앞에 할 수 있지만 모양이 없다.

![](Pasted%20image%2020231003195301.png)
