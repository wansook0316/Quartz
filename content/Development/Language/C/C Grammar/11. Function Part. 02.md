---
title: Function Part. 02
thumbnail: ''
draft: false
tags:
- C
- functions
- recursive-function
- recursive
created: 2023-10-03
---

# 재귀 호출

* 함수에서 그 함수를 다시 호출하는 것

# 재귀함수

* 재귀호출을 구현한 함수

````c
#include <stdio.h>

int sum(int a);

int main() {
	int input, s = 0;
	printf("양의 정수를 입력하세요 : ");
	scanf("%d", &input);
	
	s = sum(input);
	printf("재귀함수를 이용한 1부터 %d까지 합 : %d\n", input, s);
	return 0;
}

int sum(int a)
{
	if (a <= 1)
		return 1;
	else
		return a + sum(a-1);
}

// 프로세스가 시작되었습니다..
> 양의 정수를 입력하세요 : 4
재귀함수를 이용한 1부터 4까지 합 : 10

// 프로세스가 종료되었습니다.
````
