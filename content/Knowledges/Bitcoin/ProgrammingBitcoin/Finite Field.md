---
title: Finite Field
thumbnail: ''
draft: false
tags: null
created: 2023-09-18
---

Bitcoin Programming 책을 읽으며 이해한 내용에 대해 정리한다. 첫번째는 유한체이다.

# 환경 설치

````
// 파이썬 3.5 이상 버전 설치

// pip 설치
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

// 스크립트 실행
python3 get-pip.py

// Git 설치
// https://git-scm.com/downloads

// 책 소스코드 받기
git clone https://github.com/jimmysong/programmingbitcoin
cd programmingbitcoin

// virtualenv 설치
pip install virtualenv --user

// 가상 환경 만들기
python3 -m virtualenv venv

// 가상 환경 venv 생성 후, 내부 activate 실행 (가상 환경 만들면 해당 폴더에 이름 적은 폴더가 생긴다.)
source venv/bin/activate

// 요구 라이브러리 설치
pip install -r requirements.txt

// jupyter notebook 실행
jupyter notebook
````

# 체 (Field)

 > 
 > 사칙 연산을 집합 안에서 소화할 수 있는 집합

* 즉, 연산을 통해 나온 값 또한 해당 집합의 원소여야 한다.
* 유리수, 실수, 복소수의 경우 체의 조건을 만족한다.
* 정수는 안된다. (나눗셈 -> 유리수)
* 여기서 엄밀한 증명을 하자는 것은 아니니 직관적으로 이해하고 넘어가자.

# 유한체 (Finite field)

* 유리수체, 실수체, 복소수체의 특징은 무한 집합이다.
* 그렇다면 유한집합인 체도 있는가?
* 그 방법중 하나가 유한체이다.
* 유한체에서는 정수체(Z)에서 소수로 나눈 나머지를 관찰하는 것을 통해 유한집합체를 만들어낸다.
* 예컨데, 7과 같은 소수로 나눈 나머지가 같은 원소들은 모두 **같은 것으로 취급**하는 것이다.
  * $15≡8 (mod 7)$
* 즉, 소수로 나눈 나머지들을 원소로 하는 집합 $\mathbb Z_p$를 정의 하자.
  * $\mathbb Z_7 = {0,1,2,3,4,5,6}$
* 여기서 p를 위수(order)라 한다.

# 체의 증명

* 체 인지 확인하기 위해서는 간단히 생각했을 때 사칙 연산에 대해 닫혀있는지 확인하면 된다.
* 덧셈, 곱셈, 뺄셈에 대해서는 자명하다.
  * [모듈러 연산(Modular Arithmetic)](https://velog.io/@choihocheol/%EB%AA%A8%EB%93%88%EB%A1%9C-%EC%97%B0%EC%82%B0Modular-Arithmetic)
* 나눗셈이 문제다.

## 나눗셈

* 유한체 원소들 간의 나눗셈 결과는 어떻게 될까? 쉽게 예상하기 어렵다.
* 그렇기 때문에 곱셈으로 부터 나눗셈의 결과를 예측해보는 것이 도움이 된다.
* $F\_{19}$에 속한 원소(0~18)에 대해 확인해보자.
* $3 \cdot 7 = 21 % 19 = 2$, 즉 $2 / 7 = 3$
* 그럼 나눗셈을 할 때마다 이렇게 계산해야 할까?
* 여기서 페르마의 소정리를 사용할 수 있다.
* $n^{(p-1)} % p = 1$

## 증명

* 여기서 사칙 연산은 모듈러 연산을 말함

$$
a/b = a \cdot b^{-1}
$$

그런데,

$$
b^{p-1} = 1
b^{-1} = b^{-1} \cdot 1 = b^{-1} \cdot b^{p-1} = b^{p-2}
$$

즉,

$$
b^{-1} = b^{p-2}
$$

* 이렇게 되면 나누기를 **거듭제곱으로 변경**해서 구할 수 있다는 말이된다.

$$
2/7 = 2 \cdot 7^{(19-2)} = 2 \cdot 7^{17} = 465261027974414 % 19 = 3
$$

* 여기서 지수가 커지게 되면 계산시간은 더 길어질 가능성이 높다.
* python에서 pow 연산은 내부적으로 더 빠른 연산을 지원한다.
  * `pow(7, 17)`: 일반 속도 (7\*\*17)
  * `pow(7, 17, 19)`: 빠른 속도 (7\*\*17%19)
    * 모듈러 연산 특징을 사용하여 각 곱셈마다 값의 크기를 줄여서 계산
    * 모듈러는 음수에 적용했을 시 보수의 모듈러가 적용되어 양수로 떨어진다.

# 위수가 소수인 유한체가 유용한 이유

$$
F\_{19} = { k \cdot 0, k \cdot 1, k \cdot 2, ... k \cdot 18 } (k > 0, k \in \mathbb{Z})
$$

* 위수가 소수인 유한체의 경우, 유한체에 0이 아닌 원소 k로 전체 집합을 곱하면 그 결과는 다시 원래 집합이 된다.
  * 원소의 배열 순서는 달라지나, 집합이기 때문에 순서는 상관 없다.
* 만약 위수가 합성수라면, 곱하는 수에 따라 집합이 달라지게 된다.
  * 더 나누어 떨어져 중복되는 원소가 발생할 수 있기 때문
  * 개수가 더 작아진다.
* 소수의 특징때문에 나타나는 성질이다.

````python
prime = 19
candidates = [1, 3, 7, 13, 18, 2985]
for cand in candidates:
    result = []
    for i in range(0, 19):
        result.append((i*k)%prime)
    result.sort()
    print(result)
````

````
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
````

# 페르마의 소정리

 > 
 > p가 소수이면, 모든 정수 $a$에 대해 $a^p\equiv a\left({\rm mod}\ p\right)$이다.
 > 
 > 혹은 $p$가 소수이고 $a$가 $p$의 배수가 아니면, $a^{p-1}\equiv 1\left({\rm mod}\ p\right)$ 이다.

````python
prime = 43
result = []
for p in range(0, prime):
    element = FieldElement(p, prime)**(prime-1)
    result.append(element.num)
result.sort()
print(result)
````

````
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
````

# FieldElement Class

````python
class FieldElement:

    def __init__(self, num, prime):
        if num >= prime or num < 0: 
            error = 'Num {} not in field range 0 to {}'.format(
                num, prime - 1)
            raise ValueError(error)
        self.num = num 
        self.prime = prime

    def __repr__(self): # 개체 설명용
        return 'FieldElement_{}({})'.format(self.prime, self.num)

    def __eq__(self, other): # ==
        if other is None:
            return False
        return self.num == other.num and self.prime == other.prime 

    def __ne__(self, other): # !=
        return not (self == other)

    def __add__(self, other): # +
        if self.prime != other.prime: 
            raise TypeError('Cannot add two numbers in different Fields')
        result = (self.num + other.num) % self.prime  
        return self.__class__(result, self.prime)  

    def __sub__(self, other): # -
        if self.prime != other.prime:
            raise TypeError('Cannot subtract two numbers in different Fields')
        result = (self.num - other.num) % self.prime
        return self.__class__(result, self.prime)

    def __mul__(self, other): # *
        if self.prime != other.prime:
            raise TypeError('Cannot multiply two numbers in different Fields')
        result = (self.num * other.num) % self.prime
        return self.__class__(result, self.prime)

    def __pow__(self, exponent): # **
        n = exponent % (self.prime - 1)
        result = pow(self.num, n, self.prime) # 파이썬에서 제공하는 빠른 거듭제곱 모듈러 연산
        return self.__class__(result, self.prime)

    def __truediv__(self, other): # 실수 나눗셈 연산 (/) - 정수의 경우 __floordiv__(//)를 통해 할 수 있다.
        if self.prime != other.prime:
            raise TypeError('Cannot divide two numbers in different Fields')
        other_num = other.num**self.prime-2
        result = (self.num * other_num) % self.prime
        return self.__class__(result, self.prime)
````

# Reference

* [Programming Bitcoin by Jimmy Song(O'Reilly). Copyright 2019 Jimmy Song, 978-1-492-03149-9](https://product.kyobobook.co.kr/detail/S000001810191?LINK=NVB&NaPm=ct%3Dlco3jtn4%7Cci%3Dbf430ef307d43aa5d2aed075a40675b99aea5dd1%7Ctr%3Dboksl1%7Csn%3D5342564%7Chk%3D30b6603d08172940787f2adaf8fa881b7ca80517)
* [programmingbitcoin](https://github.com/jimmysong/programmingbitcoin)
* [모듈러 연산(Modular Arithmetic)](https://velog.io/@choihocheol/%EB%AA%A8%EB%93%88%EB%A1%9C-%EC%97%B0%EC%82%B0Modular-Arithmetic)
* [페르마의 소정리](https://namu.wiki/w/%ED%8E%98%EB%A5%B4%EB%A7%88%EC%9D%98%20%EC%86%8C%EC%A0%95%EB%A6%AC)
