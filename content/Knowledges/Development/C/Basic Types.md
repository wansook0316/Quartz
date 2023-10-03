---
title: Basic Types
thumbnail: ''
draft: false
tags:
- C
- type
- String
- integer
- overflow
- underflow
- ASCII
- typ
- type-casting
- char
created: 2023-10-03
---

# 자료형

* 프로그램에서 선언된 변수들이 기억 공간에서 어떻게 저장되고 처리되어야 할지, 컴파일러에게 알려줌
* 종류
  * 정수형
  * 실수형
  * 문자형
  * 사용자 정의 자료형

# 정수형

* 소수점이 없는 숫자
* 음의 정수, 0 , 양의 정수

![](Pasted%20image%2020231003193516.png)

# 오버플로우(overflow)

 > 
 > 데이터 허용 범위를 넘는 값을 변수에 저장할 때, 의도한 값이 아닌 다른 값이 저장되는 것

````
#include <stdio.h>
int main(void) {
	short a = 32767, b=2, c;
	unsigned short d;
	
	c = a+b;
	d = a+b;
	
	printf("c = %d \n", c);
	printf("d = %d \n", d);
	
	
	return 0;
}

//프로세스가 시작되었습니다..
> c = -32767
d = 32769
````

# 언더플로우(underflow)

 > 
 > 데이터 허용 범위를 넘는 값을 변수에 저장할 때, 의도한 값이 아닌 다른 값이 저장되는 것

![](Pasted%20image%2020231003193522.png)

````
#include <stdio.h>
int main() {
	short a = -32767, b = -2, c;
	unsigned short d;
	
	c = a+b;
	d = a+ b;
	
	printf("c = %d\n ", c);
	printf("d = %d\n ", d);	
	return 0;
}

// 프로세스가 시작되었습니다..
> c = 32767
 d = 32767

프로세스가 종료되었습니다.


````

# 데이터 표현 단위

![](Pasted%20image%2020231003193528.png)

# 크기 구하는 함수

````
sizeof(자료형) 
````

````
#include <stdio.h>
int main() {
	short x = 1;
	int y = 2;
	long z =3;
	
	printf("short의 크기 : %d 바이트 \n", sizeof(x));
	printf("int의 크기 : %d 바이트 \n", sizeof(y));
	printf("long의 크기 : %d 바이트 \n", sizeof(z));
	printf("short의 크기 : %d 바이트 \n", sizeof(short));
	printf("int의 크기 : %d 바이트 \n", sizeof(int));
	printf("long의 크기 : %d 바이트 \n", sizeof(long));
	
	return 0;
	
}

// 프로세스가 시작되었습니다..
> short의 크기 : 2 바이트
int의 크기 : 4 바이트
long의 크기 : 8 바이트
short의 크기 : 2 바이트
int의 크기 : 4 바이트
long의 크기 : 8 바이트

프로세스가 종료되었습니다.
````

# 실수형

 > 
 > 소수점이나 지수가 있는 수

![](Pasted%20image%2020231003193540.png)

````
float a = 3.14f 
    /* 뒤에 붙는 f는 임시메모리의 크기를 말한다.
    임시 메모리의 크기를 4바이트로 결정해 달라는 의미.
    a는 앞에 float를 썼기 때문에 4바이트의 방이 이미 할당되어 있다. */
    			
float a = 3.14
    /* 뒤에 f를 안썼고,실수형이기 때문에 임시메모리는 8바이트가 형성된다
    여기서 4바이트인 a에 넣게되면 짤릴수도 있다. 
    그래서 다음과 같은 에러가 뜬다.*/
    
    // L은 롱더블로 임시메모리 할당
````

![](Pasted%20image%2020231003193600.png)

````
#include <stdio.h>
int main() {
	float x = 1.1f;
	double y = 2.2;
	long double z = 3.3L;
	
	printf("float x = %f\n", x);
	printf("double y = %f\n", y);
	printf("long double z = %lf\n", z);
	
	return 0;
}

//프로세스가 시작되었습니다..
> float x = 1.100000
double y = 2.200000
long double z = 0.000000

프로세스가 종료되었습니다.
````

# 서식 문자

* %f : float, double인 경우
* %lf : long double

````
%6.1f // 출력폭 6칸, 오른쪽 정령, 소수점 1자리까지 
````

````
#include <stdio.h>
int main() {
	int a = 20;
	float b = 5.06f;
	float c = 1234567.89f;
	
	printf("0)%d\n", 123456);
	printf("1)%d\n", a);
	printf("2)%6d\n", a);
	printf("3)%+6d\n", a);
	printf("4)%-6d\n", a);
	printf("1)%f\n", b);
	printf("2)%6.1f\n", b);
	printf("3)%+6.1f\n", b);
		printf("4)%-6.1f\n", b);
		printf("5)%6.1f\n", c);
	
	return 0;
}

// 프로세스가 시작되었습니다..
> 0)123456
1)20
2)    20
3)   +20
4)20
1)5.060000
2)   5.1
3)  +5.1
4)5.1
5)1234567.9

프로세스가 종료되었습니다. 
````

# 문자형

* char : 문자형을 다루는 자료형
* 문자 1개를 작은 따옴표 ('')사이에 넣어서 사용
* 작은 따옴표 안에 있는 문자를 데이터 1개로 취급함
* 사용되는 문자는 8비트(1바이트)로 처리됨
* 내부적인 문자 코드 (아스키 코드) 에 상응하는 숫자로 바뀜
* unsigned int에 저장됨
  ![](Pasted%20image%2020231003193551.png)

# 아스키 코드 표

![](Pasted%20image%2020231003192721.png)

````
#include <stdio.h>
int main() {
	
	printf("소문자 a의 ASCII 값은 %d이다.\n", 'a');
	printf("소문자 b의 ASCII 값은 %d이다.\n", 'b');
	printf("소문자 A의 ASCII 값은 %d이다.\n", 'A');
	printf("소문자 B의 ASCII 값은 %d이다.\n\n", 'B');
	
	printf("ASCII 97은 %c이다.\n", 97);
	printf("ASCII 98은 %c이다.\n", 98);
	printf("ASCII 65은 %c이다.\n", 65);
	printf("ASCII 66은 %c이다.\n", 66);
	
	return 0;
}

// 프로세스가 시작되었습니다..
> 소문자 a의 ASCII 값은 97이다.
소문자 b의 ASCII 값은 98이다.
소문자 A의 ASCII 값은 65이다.
소문자 B의 ASCII 값은 66이다.

ASCII 97은 a이다.
ASCII 98은 b이다.
ASCII 65은 A이다.
ASCII 66은 B이다.

프로세스가 종료되었습니다.
````

````
#include <stdio.h>
int main() {
	char a ='A';
	char b = 'B';
	
	printf("변수 a는 %c로 값이 %d다.\n", a, a);
	printf("변수 b는 %c로 값이 %d다.\n", b, b);
	
	
	return 0;
}

// 프로세스가 시작되었습니다..
> 변수 a는 A로 값이 65다.
변수 b는 B로 값이 66다.

프로세스가 종료되었습니다.
````

````
#include <stdio.h>
int main() {
	
	char a = 65;
	char b = 66;
	
	printf("변수 a는 %c로 값이 %d다.\n", a, a);
	printf("변수 b는 %c로 값이 %d다.\n", b, b);
	return 0;
}

// 프로세스가 시작되었습니다..
> 변수 a는 A로 값이 65다.
변수 b는 B로 값이 66다.

프로세스가 종료되었습니다.
````

* small a(97), large A(65)만 알고 있으면 된다.

# 서식지정자

````
char a = 'A' // 작은따옴표 사용해야함
    
printf("변수 a는 %c로 값이 %d다. \n", a, a)
    
// 결과
// 변수 a는 A로 값이 65다.
    
    // %c로 할 경우 아스키코드에 상응하는 문자 출력
    // %d 쓸 경우 실제 정수 값 출력
````

````
char a = 'A' + 1 // 작은따옴표 사용해야함
    
printf("변수 a는 %c로 값이 %d다. \n", a, a)
    
// 결과
// 변수 a는 A로 값이 66다.  
````

````
```c
#include <stdio.h>
int main() {
	char a = 'A' + 1;
	char b = 'B' + 1;
	
	printf("변수 a는 %c로 값이 %d다.\n", a, a);
	printf("변수 b는 %c로 값이 %d다.\n", b, b);
	
	return 0;
}

// 프로세스가 시작되었습니다..
> 변수 a는 B로 값이 66다.
변수 b는 C로 값이 67다.

프로세스가 종료되었습니다.
````

# 형변환

## 묵시적 형변환

* 하나의 자료형을 다른 자료형으로 변환시켜 자료형을 같게 하는 것
* 변수 2개로 연산을 수행할 경우 사용함
* 임시메모리를 할당할 때에 두 변수를 확인하고, 더 큰 집합에 속하는 자료형으로 임시메모리를 할당함

![](Pasted%20image%2020231003193644.png)

````
#include <stdio.h>
int main() {
	int a = 10;
	float b = 20.07f, c;
	
	c = a + b;
	
	printf("c = %f \n", c);
	

	return 0;
}

// 프로세스가 시작되었습니다..
> c = 30.070000

프로세스가 종료되었습니다.
````

## 명시적 형변환

* 사용자가 강제로 형변환 시키는 것
* 캐스팅 연산자 사용
* 연산식 앞에 형변환 연산자()를 붙이고 ()안에는 변환시키려는 자료형

````
float a = 20.07f;
printf("a = %d \n", (int)a)
````

````
#include <stdio.h>
int main() {
	
	float a = 20.07f;
	
	printf("a = %d\n", a);
	printf("a = %d\n", (int)a);
	
	return 0;
}

// 프로세스가 시작되었습니다..
> a = 1751745880
a = 20

프로세스가 종료되었습니다.
````
