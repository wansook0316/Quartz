---
title: Standard Input & Ouput
thumbnail: ''
draft: false
tags:
- C
- standard-io
- scanf
- printf
created: 2023-10-03
---

## 프로그래밍

* 사용자가 어떤 값을 컴퓨터에 넣고(입력) 처리한 결과를 사용자에게 다시 제공(출력)하는 것

````mermaid
graph LR;
A[Input] --> B{Function}
B --> C(Output)
````

# 입출력 함수

![](Pasted%20image%2020231003193120.png)

* 표준 입출력 함수: 키보드와 모니터를 통해 자료를 입출력
* 파일 입출력 함수: 특정한 파일을 통해 자료를 입출력
* 저급 입출력 함수: 운영체제 내, 시스템 호출을 통해 자료를 입출력

## 표준 입출력 함수

![](Pasted%20image%2020231003193712.png)

## 형식화된 입출력

### printf() 함수

* 표준 출력 장치인 모니터로 자료를 출력
* 도스창에 실행결과를 표시할 때 사용
  ![](Pasted%20image%2020231003193749.png)

### 제어 문자열

![](Pasted%20image%2020231003193813.png)

````cpp
#include <stdio.h>
int main() {
	printf("%s\n", "종경");
	
	printf("%s\n", "대학교");
	
	printf("%s %s\n", "종경대학교", "서울캠퍼스");
	
	printf("%-10s\n", "종경");
	
	printf("%10s\n", "대학교");
	return 0;
}

// 프로세스가 시작되었습니다..
> 종경
대학교
종경대학교 서울캠퍼스
종경
 대학교

프로세스가 종료되었습니다.
````

### scanf() 함수

* 표준 입력 장치인 키보드를 통해 자료를 입력 받을 때
* 기본 형태
  * `scanf("변환기호(Format-String)...", &변수1, &변수2, ....);`
  * 변환기호안에 포함되는 내용이 어떤 자료 형식으로 변수에 입력되는지 결정
  * `scanf("%d", %age);`
  * 변수 앞에 변수의 주소를 의미하는 기호 &를 반드시 넣어야 함

````c
#include <stdio.h>
int main() {
	int age = 0, birthyear = 0;
	
	printf("당신의 나이와 출생연도를 입력하세요.\n");
	
	scanf("%d %d", &age, &birthyear);
				
				printf("당신은 %d년에 출생한 %d세입니다.\n", birthyear, age);
				
				
	return 0;
}

// 프로세스가 시작되었습니다..
> 당신의 나이와 출생연도를 입력하세요.
24
1995
당신은 1995년에 출생한 24세입니다.

프로세스가 종료되었습니다.

````

#### 특수문자 입력

![](Pasted%20image%2020231003194008.png)

````c
#include <stdio.h>
int main() {

	printf("\t\"안녕하세요\"\n\n");
	
	printf("탈출기법을 제대로 사용한 예\n");
	
	printf("\t10 %% 5 = 0 \n\n");
	
	printf("탈출기법을 제대로 사용하지 않은 예\n");
	
	printf("\t 10 % 5 = 0 \n");
	
	
	return 0;
}

// 프로세스가 시작되었습니다..
>       "안녕하세요"

탈출기법을 제대로 사용한 예
        10 % 5 = 0

탈출기법을 제대로 사용하지 않은 예
        10 = 0

프로세스가 종료되었습니다.
````

## 문자 입출력 함수

 > 
 > 문자 1개를 키보드로 입력받아 출력하는 함수
 > ![](Pasted%20image%2020231003194106.png)

````c
#include <stdio.h>
int main() {
	char Letter_in;
	
	printf("문자 1개를 입력하세요.\n");
	
	Letter_in = getchar();
	
	putchar(Letter_in);
	
	printf("\n");
	
	return 0;
}

// 프로세스가 시작되었습니다..
> 문자 1개를 입력하세요.
v
v

프로세스가 종료되었습니다.
````

## 문자열 입출력 함수

 > 
 > 문자 여러개를 한번에 입력받고 출력하는 함수

![](Pasted%20image%2020231003194148.png)

````c
#include <stdio.h>
int main() {
char Name[20];
	
	printf("당신의 이름을 입력하세요: ");
	
	gets(Name);
	
	puts(Name);
	
	return 0;
}

// 프로세스가 시작되었습니다..
> 당신의 이름을 입력하세요: wansik
wansik

프로세스가 종료되었습니다.
````
