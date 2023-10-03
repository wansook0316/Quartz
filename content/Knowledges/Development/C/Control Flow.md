---
title: Control Flow
thumbnail: ''
draft: false
tags:
- C
- control-flow
- switch
created: 2023-10-03
---

# 제어문

* 프로그램의 실행을 인위적으로 조절할 수 있는 문장

# 제어문의 종류

![](Pasted%20image%2020231003194928.png)

# If

![](Pasted%20image%2020231003194936.png)

## 조건 연산자

* 유일하게 피연산자가 3개인 삼항 연산자
* 선택문(if)문과 같이 행동함

````c
#include <stdio.h>
int main() {
	int min, max;
	int x = 10, y = 20;
	
	max = (x>y) ? x : y;
	min = (x>y) ? y : x;
	
	printf("두 수 %d과 %d 중에 큰 수는 %d이다.\n", x, y, max);
	printf("두 수 %d과 %d 중에 작은 수는 %d이다.\n", x, y, min);
	return 0;
}

// 프로세스가 시작되었습니다..
> 두 수 10과 20 중에 큰 수는 20이다.
두 수 10과 20 중에 작은 수는 10이다.

// 프로세스가 종료되었습니다.
````

# Switch

![](Pasted%20image%2020231003194950.png)
![](Pasted%20image%2020231003194954.png)

````c
#include <stdio.h>
int main() {
	int input;
	
	printf("양수를 입력하세요.\n");
	scanf("%d", &input);
	
	if (input >= 0)
	{
		if (input % 2 == 0)
			printf("입력한 수 %d은 짝수입니다.\n", input);
		else
			printf("입력한 수 %d은 홀수입니다.\n", input);
	}
	else
	{
		printf("입력한 수 %d은 음수입니다.\n", input);
	}
	
						 
	return 0;
}

// 프로세스가 시작되었습니다..
> 양수를 입력하세요.
77
입력한 수 77은 홀수입니다.

````

## default

* 예외처리를 위한 문장

## break

* 제어문 강제 종료
* Break가 없다면 선택적 문장만 실행시킬 수 없다.
  ![](Pasted%20image%2020231003195020.png)
