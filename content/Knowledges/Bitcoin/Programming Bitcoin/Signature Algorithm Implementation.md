---
title: Signature Algorithm Implementation
thumbnail: ''
draft: false
tags: null
created: 2023-09-18
---

서명, 검증 알고리즘을 알았으니 필요한 클래스들을 작성해보자.

# Signature

````python
class Signature:

    def __init__(self, r, s):
        self.r = r
        self.s = s

    def __repr__(self):
        return 'Signature({:x},{:x})'.format(self.r, self.s)
````

* 서명의 경우 서명하는 사람이 넣어서 주는 값이다.

# Verify

* 타원 곡선 위에 있는 점을 나타내는 `S256Point`에 검증 메서드를 추가한다.

````python
class S256Point(Point): # 타원 곡선 위 점 상속
    ...

    def verify(self, z, sig):
        s_inv = pow(sig.s, N - 2, N)  # <1>
        u = z * s_inv % N  # <2>
        v = sig.r * s_inv % N  # <3>
        total = u * G + v * self  # <4>
        return total.x.num == sig.r  # <5>
````

1. 페르마의 소공식을 통해 inverse를 0을 포함한 정수 지수로 변경한다.
1. u, v를 구한다.
1. u, v 둘다 위수인 N으로 변경해주어야 한다.
1. 좌변을 계산한다. ($uG + vP$)
1. 결과값과 $r$을 비교한다.

# PrivateKey

* 서명을 생성한 `PrivateKey` 클래스를 만들자.
* 비밀키를 보관하는 클래스를 하나 만들어주고, 거기서 서명을 생성하여 검증자에게 전달하자.
* 검증자는 Public Key에 해당하는 타원위의 점(`S256Point`)$P$에 있는 메서드인 `verify`로 그 서명을 넘겨주면 끝이다.

````python
class PrivateKey:

    def __init__(self, secret):
        self.secret = secret
        self.point = secret * G  # 공개키를 계산 후 보관한다.

    def hex(self):
        return '{:x}'.format(self.secret).zfill(64)
    


    def sign(self, z):
        k = self.deterministic_k(z)  # 그냥 무작위로 결정하면 안된다. k가 들키면 e도 털린다. 서명마다 k도 달라야한다. 아니면 털린다.
        r = (k * G).x.num
        k_inv = pow(k, N - 2, N)
        s = (z + r * self.secret) * k_inv % N
        if s > N / 2: # 가변성 문제로 N/x보다 작은 s값을 사용한다.
            s = N - s
        return Signature(r, s)

    def deterministic_k(self, z): # 서명 마다 다른 k값을 명시적으로 사용하기 위한 코드
        k = b'\x00' * 32
        v = b'\x01' * 32
        if z > N:
            z -= N
        z_bytes = z.to_bytes(32, 'big')
        secret_bytes = self.secret.to_bytes(32, 'big')
        s256 = hashlib.sha256
        k = hmac.new(k, v + b'\x00' + secret_bytes + z_bytes, s256).digest()
        v = hmac.new(k, v, s256).digest()
        k = hmac.new(k, v + b'\x01' + secret_bytes + z_bytes, s256).digest()
        v = hmac.new(k, v, s256).digest()
        while True:
            v = hmac.new(k, v, s256).digest()
            candidate = int.from_bytes(v, 'big')
            if candidate >= 1 and candidate < N:
                return candidate  # <2>
            k = hmac.new(k, v + b'\x00', s256).digest()
            v = hmac.new(k, v, s256).digest()
    

````

## 가변성 문제

* 위에서 s가 N/2보다 작은 s를 서명에 포함했다.
* 왜 굳이 이러는 걸까?
* 우리가 서명을 만든다는 것은 어떠한 이산 로그 문제를 해결하는 변수를 준다는 것과 같다.
* 그리고 그 이산 로그 문제는 근본적으로 타원 곡선 위에 있게 된다.
* 타원 곡선의 특징으로는 x축 대칭이 있는데, 그렇기 때문에 같은 x값에 대해 곡선위에 있는 점은 2개가 되게 된다.
* 이는 서명으로 $r, s$값을 생성할 때도 같은 특성을 띈다.
* 즉, $r$에 대해 이산 로그 문제를 만족하는 해는 $s$, $N-s$로 두개라는 것이다. 두개의 유효한 서명이 있는 것.
* 이렇게 2개가 되어 발생하는 문제 (이건 아직 모르겠다.)를 막기 위해 작은 s를 사용한다.

# Code

## FieldElement

````python

class FieldElement:

    def __init__(self, num, prime):
        if num >= prime or num < 0:
            error = 'Num {} not in field range 0 to {}'.format(
                num, prime - 1)
            raise ValueError(error)
        self.num = num
        self.prime = prime

    def __repr__(self):
        return 'FieldElement_{}({})'.format(self.prime, self.num)

    def __eq__(self, other):
        if other is None:
            return False
        return self.num == other.num and self.prime == other.prime

    def __ne__(self, other):
        # this should be the inverse of the == operator
        return not (self == other)

    def __add__(self, other):
        if self.prime != other.prime:
            raise TypeError('Cannot add two numbers in different Fields')
        # self.num and other.num are the actual values
        # self.prime is what we need to mod against
        num = (self.num + other.num) % self.prime
        # We return an element of the same class
        return self.__class__(num, self.prime)

    def __sub__(self, other):
        if self.prime != other.prime:
            raise TypeError('Cannot subtract two numbers in different Fields')
        # self.num and other.num are the actual values
        # self.prime is what we need to mod against
        num = (self.num - other.num) % self.prime
        # We return an element of the same class
        return self.__class__(num, self.prime)

    def __mul__(self, other):
        if self.prime != other.prime:
            raise TypeError('Cannot multiply two numbers in different Fields')
        # self.num and other.num are the actual values
        # self.prime is what we need to mod against
        num = (self.num * other.num) % self.prime
        # We return an element of the same class
        return self.__class__(num, self.prime)

    def __pow__(self, exponent):
        n = exponent % (self.prime - 1)
        num = pow(self.num, n, self.prime)
        return self.__class__(num, self.prime)

    def __truediv__(self, other):
        if self.prime != other.prime:
            raise TypeError('Cannot divide two numbers in different Fields')
        # self.num and other.num are the actual values
        # self.prime is what we need to mod against
        # use fermat's little theorem:
        # self.num**(p-1) % p == 1
        # this means:
        # 1/n == pow(n, p-2, p)
        num = (self.num * pow(other.num, self.prime - 2, self.prime)) % self.prime
        # We return an element of the same class
        return self.__class__(num, self.prime)

    def __rmul__(self, coefficient):
        num = (self.num * coefficient) % self.prime
        return self.__class__(num=num, prime=self.prime)
````

## Point

````python
class Point:

    def __init__(self, x, y, a, b):
        self.a = a
        self.b = b
        self.x = x
        self.y = y
        if self.x is None and self.y is None:
            return
        if self.y**2 != self.x**3 + a * x + b:
            raise ValueError('({}, {}) is not on the curve'.format(x, y))
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y \
            and self.a == other.a and self.b == other.b

    def __ne__(self, other):
        # this should be the inverse of the == operator
        return not (self == other)

    def __repr__(self):
        if self.x is None:
            return 'Point(infinity)'
        elif isinstance(self.x, FieldElement):
            return 'Point({},{})_{}_{} FieldElement({})'.format(
                self.x.num, self.y.num, self.a.num, self.b.num, self.x.prime)
        else:
            return 'Point({},{})_{}_{}'.format(self.x, self.y, self.a, self.b)

    def __add__(self, other):
        if self.a != other.a or self.b != other.b:
            raise TypeError('Points {}, {} are not on the same curve'.format(self, other))
        # Case 0.0: self is the point at infinity, return other
        if self.x is None:
            return other
        # Case 0.1: other is the point at infinity, return self
        if other.x is None:
            return self

        # Case 1: self.x == other.x, self.y != other.y
        # Result is point at infinity
        if self.x == other.x and self.y != other.y:
            return self.__class__(None, None, self.a, self.b)

        # Case 2: self.x ≠ other.x
        # Formula (x3,y3)==(x1,y1)+(x2,y2)
        # s=(y2-y1)/(x2-x1)
        # x3=s**2-x1-x2
        # y3=s*(x1-x3)-y1
        if self.x != other.x:
            s = (other.y - self.y) / (other.x - self.x)
            x = s**2 - self.x - other.x
            y = s * (self.x - x) - self.y
            return self.__class__(x, y, self.a, self.b)

        # Case 4: if we are tangent to the vertical line,
        # we return the point at infinity
        # note instead of figuring out what 0 is for each type
        # we just use 0 * self.x
        if self == other and self.y == 0 * self.x:
            return self.__class__(None, None, self.a, self.b)

        # Case 3: self == other
        # Formula (x3,y3)=(x1,y1)+(x1,y1)
        # s=(3*x1**2+a)/(2*y1)
        # x3=s**2-2*x1
        # y3=s*(x1-x3)-y1
        if self == other:
            s = (3 * self.x**2 + self.a) / (2 * self.y)
            x = s**2 - 2 * self.x
            y = s * (self.x - x) - self.y
            return self.__class__(x, y, self.a, self.b)


    def __rmul__(self, coefficient):
        coef = coefficient
        current = self  # <1>
        result = self.__class__(None, None, self.a, self.b)  # <2>
        while coef:
            if coef & 1:  # <3>
                result += current
            current += current  # <4>
            coef >>= 1  # <5>
        return result
````

## Constants For Bitcoin

````python

A = 0
B = 7
P = 2**256 - 2**32 - 977
N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141

````

## S256Field

````python

class S256Field(FieldElement): # 유한체 상속

    def __init__(self, num, prime=None):
        super().__init__(num=num, prime=P) # 초기화시 전역 변수로 빠져있는 P를 넣어버림

    def __repr__(self):
        return '{:x}'.format(self.num).zfill(64) # 출력시 빈자리를 0으로 채우도록 함

class S256Point(Point): # 타원 곡선 위 점 상속

    def __init__(self, x, y, a=None, b=None):
        a, b = S256Field(A), S256Field(B) # a, b를 전역변수로 대체
        if type(x) == int:
            super().__init__(x=S256Field(x), y=S256Field(y), a=a, b=b)
        else:
            super().__init__(x=x, y=y, a=a, b=b)  # 무한 원점으로 초기화하는 경우 (x == None)을 위해 분기
    

    def __repr__(self):
        if self.x is None:
            return 'S256Point(infinity)'
        else:
            return 'S256Point({}, {})'.format(self.x, self.y)


    def __rmul__(self, coefficient):
        coef = coefficient % N  # nG가 0이니, 유환순환군안에서 나머지로 나누어 처리해도 무방하다. 
        return super().__rmul__(coef)

    def verify(self, z, sig):
        s_inv = pow(sig.s, N - 2, N)  # <1>
        u = z * s_inv % N  # <2>
        v = sig.r * s_inv % N  # <3>
        total = u * G + v * self  # <4>
        return total.x.num == sig.r  # <5>
    
````

## Constants For Bitcoin Signature

````python

G = S256Point(
    0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798,
    0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8)

````

## Signature

````python

class Signature:

    def __init__(self, r, s):
        self.r = r
        self.s = s

    def __repr__(self):
        return 'Signature({:x},{:x})'.format(self.r, self.s)

````

## PrivateKey

````python

class PrivateKey:

    def __init__(self, secret):
        self.secret = secret
        self.point = secret * G  # <1>

    def hex(self):
        return '{:x}'.format(self.secret).zfill(64)
 
    def sign(self, z):
        k = self.deterministic_k(z)  # <1>
        r = (k * G).x.num
        k_inv = pow(k, N - 2, N)
        s = (z + r * self.secret) * k_inv % N
        if s > N / 2:
            s = N - s
        return Signature(r, s)

    def deterministic_k(self, z):
        k = b'\x00' * 32
        v = b'\x01' * 32
        if z > N:
            z -= N
        z_bytes = z.to_bytes(32, 'big')
        secret_bytes = self.secret.to_bytes(32, 'big')
        s256 = hashlib.sha256
        k = hmac.new(k, v + b'\x00' + secret_bytes + z_bytes, s256).digest()
        v = hmac.new(k, v, s256).digest()
        k = hmac.new(k, v + b'\x01' + secret_bytes + z_bytes, s256).digest()
        v = hmac.new(k, v, s256).digest()
        while True:
            v = hmac.new(k, v, s256).digest()
            candidate = int.from_bytes(v, 'big')
            if candidate >= 1 and candidate < N:
                return candidate  # <2>
            k = hmac.new(k, v + b'\x00', s256).digest()
            v = hmac.new(k, v, s256).digest()
````

# Reference

* [Programming Bitcoin by Jimmy Song(O'Reilly). Copyright 2019 Jimmy Song, 978-1-492-03149-9](https://product.kyobobook.co.kr/detail/S000001810191?LINK=NVB&NaPm=ct%3Dlco3jtn4%7Cci%3Dbf430ef307d43aa5d2aed075a40675b99aea5dd1%7Ctr%3Dboksl1%7Csn%3D5342564%7Chk%3D30b6603d08172940787f2adaf8fa881b7ca80517)
* [programmingbitcoin](https://github.com/jimmysong/programmingbitcoin)
