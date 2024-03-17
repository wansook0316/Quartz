---
title: C char Type
thumbnail: ''
draft: false
tags:
- C
- char
created: 2024-01-02
---

# Primitive Types

* char
* short
* int
* long
* float
* double
* long double

# unsigned, signed

* 부호 여부에 따라 자료형 앞에 적어준다.
  * `unsigned char`, `unsigned int`
* 안넣으면 기본적으로 `signed`
  * 예외 : `char`

# char

* 최소 8비트인 정수형
* 표준에서 8비트 이상이라고 정의되어 있음..
* 그렇다는 건 어떤 컴파일러를 사용하냐에 따라 char 비트수가 다를 수 있다는 얘기..

## char 비트수 찾기

````c
#inclued <limits.h>

int main(void) {
	char char_side = CHAR_BIT;
	return 0;
}
````

* 이렇게 하면 알 수 있다.

# Byte?

* C 표준은 기본 자료형의 정확한 바이트 수를 강요하지 않는다.
  * 각 컴파일러에서 알아서 하라고 함
* 거기에 **1Byte를 `CHAR_BIT`만큼이라고 정의함**
  * 즉, 1Byte가 8bit가 아닐 수도 있다는 말
* **즉, C언어에서 Byte라는 개념은 `char`의 크기를 말한다.**
  * 지금 사용하는 기계에 컴퓨터가 저장할 수 있는 가장 작은 단위

# char의 signed/unsigned

* 결국 `char`자료형도 정수형임
* 그러니 부호여부를 따져야 할 것.
* 그럼 signed, unsigned 생략하면 기본이 뭘까?
* **C 표준에서는 그런거 안정함**
* **컴파일러 구현따라 정해진다.**
* `<limits.h>`에서 `CHAR_MIN`을 보면 기본 char의 구조를 알 수 있다.
* 가장 작은 값 출력했을 때, `-128`로 나오면, 아 기본이 signed구나로 알 수 있기 때문.

# char 사용법

* 벌써 머리아프다.
* 만약 문자열의 범위가 ASCII라면, 부호여부가 상관이 없다.
  * char가 8bit > $2^8$, 256까지 표현가능하니.
  * 부호가 있다해도 $2^7$이라 다 표현가능하다.
* 그런데 이 이상으로 넘어가는 경우에는 `unsigned`를 해줘야 될 것이다.
* 그래야 **다른 플랫폼에서도 정상작동한다.**

# 정리

포팅에 문제 없는 범위

|unsigned char|char|signed char|
|-------------|----|-----------|
|0~255|0~127|-127~127|

* signed char는 왜 -127 이지? -128이어야 하는데?
* 혹시 옛날 컴퓨터가 1의 보수를 쓸수도 있으니까.
* 참고: [Complement Number (보수)](Complement%20Number%20(보수).md)
