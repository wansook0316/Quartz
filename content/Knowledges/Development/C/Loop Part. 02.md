---
title: Loop Part. 02
thumbnail: ''
draft: false
tags:
- do-while
- goto
- continue
- switch
- C
created: 2023-10-03
---

## Do ~ While

* 일단 Do 안에 있는 명령문을 실행하고 나중에 while문의 조건식 비교
* 적어도 한번은 명령문을 처리함
* 마지막에 세미콜론(;)을 반드시 추가해야 함
  * 조건식을 검사하는 while(조건식)은 C 문장으로 여기기 때문

````c
#include <stdio.h>
int main() {
	int sum = 0;
	int number = 0;
	
	printf("1에서 10까지 합을 구합니다.\n");
	
	do
	{
		number++;
		sum += number;
	}
	while(number<10);
	
	printf("합은 %d입니다.\n", sum);
	
	return 0;
}

// 프로세스가 시작되었습니다..
> 1에서 10까지 합을 구합니다.
합은 55입니다.

// 프로세스가 종료되었습니다.
````

# goto

* 실행순서를 사용자가 지정한 라벨로 이동시킴
* 명령문의 실행 순서를 프로그래머가 임의로 변경하고자 할 때 사용함
* goto문은 실행 순서를 지정된 라벨로 옮겨 프로그램을 계속 수행함

````c
#include <stdio.h>
int main() {
	int sum = 0;
	int number = 0;
	
	while(1)
	{
		sum += number;
		number++;
		
		if (number > 10) goto ex1;
	}
	
	ex1:
	printf("1부터 10까지 합을 구합니다.\n");
	printf("합은 %d입니다.\n",sum);
	
	return 0;
}

// 프로세스가 시작되었습니다..
> 1부터 10까지 합을 구합니다.
합은 55입니다.

// 프로세스가 종료되었습니다.
````

# continue

* 반복문을 빠져나오지 않고, 해당 반복문의 처음으로 흐름을 옮김

## 사용예

* 1~ 10 중 홀수만 더하는 예

````c
int sum = 0, i;

for(i = 1; i <= 10; i += 2) 	// 초기값 1
    sum += i;
````

* 1~10 중 짝수만 더하는 예

````c
int sum = 0, i;

for(i = 2; i <= 10; i += 2) 	// 초기값 2
    sum += i;
````

* 두 코드의 차이점은 초기값에 달려있음. 초기값을 같게 하고 싶을 때, 이 불편함을 continue로 해결할 수 있다.

* 1~ 10 중 홀수만 더하는 예 (수정)

````c
int sum = 0, i;

for(i = 1; i <= 10; i += 2) 	// 초기값 1
    if (i % 2 == 0) continue		// 짝수면 아래 문장을 진행하지 않고 처음(증감식)으로 이동한다.
    sum += i;
````

* 1~ 10 중 짝수만 더하는 예 (수정)

````c
int sum = 0, i;

for(i = 1; i <= 10; i += 2) 	// 초기값 1
    if (i % 2 != 0) continue		// 홀수면 아래 문장을 진행하지 않고 처음(증감식)으로 이동한다.
    sum += i;
````

## continue문을 만났을 때 각 제어문의 흐름

![](Pasted%20image%2020231003195606.png)
