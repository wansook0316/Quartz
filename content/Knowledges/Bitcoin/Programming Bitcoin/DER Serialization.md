---
title: DER Serialization
thumbnail: ''
draft: false
tags:
- serialization
- DER
- encoding
- Schnorr-Signature
- bitcoin
created: 2023-09-18
---

서명 역시 검증을 위해 전파될 필요가 있다. 즉, 직렬화가 필요하다.

# DER(Distinguished Encoding Rules)

* 서명에 대해 앞에서 공부했을 때 핵심은 $r, s$의 값이었다.
* 이는 private key를 공개하지 않으면서 다음의 두 정보의 입증을 위한 값들이라 할 수 있다.
  * private key를 가지고 있다는 정보
  * 내가 보내는 정보를 내가 보냈다라는 정보
* $r, s$의 경우에는 압축할 수 있는 방법이 없다.
* 이전에는 타원 곡선이 가지는 대칭성을 이용했는데, 이 경우에는 한 값에서 다른 값을 유도할 수 없기 때문이다.
* 서명을 직렬화하는 표준은 여러가지가 있을 수 있다. 이번에는 사토시가 사용했던 DER을 알아볼 것이다.

## 정의 방법

````
3045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf213
2060277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801
с31967743a9c8e10615bed

- marker - 30
- length of signature - 45
- marker for r value - 02
- r value lenth - 21
- r value (big Endian) - 00ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf213
2060277457c98f
- marker for s value - 02
- s value length - 20 
- s value (big Endian) - 7a986d955c6e0cb35d446a89d3f56100f4d7f67801
с31967743a9c8e10615bed
````

* 주의할 점은 r, s의 값을 실제로 넣을 때 첫번째 바이트가 `0x80`보다 크거나 같은 경우 `00`을 앞에 붙인 것을 사용해야 한다는 점이다.
  * 이렇게 될 경우 r, s의 길이도 변경될 수 있으니 길이 표식도 변경해주어야 한다.
  * 위에 예시를 보면 r은 00이 붙어있고, s는 아니다.
  * 길이도 달라진 것을 확인할 수 있다.
* 왜 굳이 이렇게 할까?
* **DER 형식이 음숫값도 수용가능한 일반적 형식이기 때문이다.**
* 부호있는 이진수에서 첫번째 비트가 1인 것은 **음수를 의미한다.**
  * `0x80 = 1000 0000`
* 타원 곡선 전자 서명 (ECDSA)에서는 모든 값을 양수로 받기 때문에 양수로 변환해주어야 하는 것!
  * 여기서 서명의 종류가 여러개가 될 수 있다는 것을 알 수 있다.
  * 또한 음수 값을 사용하는 서명도 있다는 것을 알 수 있다.

## 문제점

* DER 형식은 일반적인 형식이기 때문에, 서명 알고리즘에서 채택하는 프로토콜을 모두 만족 시킬 수 있어야 한다.
* 그렇기 때문에 방식이 지저분하다.
* 원래 r, s값은 256비트 정수이고, 그렇기 때문에 32바이트로 표현될 수 있다.
* 그런데 양수, 음수에 대한 값을 변환해야하는 로직이 들어가면서 33바이트로 될 수도 있다.
* 실제로 최대 DER 형식은 72바이트까지 길어질 수 있다.
* 이런 점 때문에 비트코인 커뮤니티에서는 서명 방식을 슈노어 방식으로 대체하여 고정 64비트로 가자는 의견도 있다고 한다.

## 구현

````python

class Signature:

    def __init__(self, r, s):
        self.r = r
        self.s = s

    def __repr__(self):
        return 'Signature({:x},{:x})'.format(self.r, self.s)

    def der(self):
        rbin = self.r.to_bytes(32, byteorder='big')
        # remove all null bytes at the beginning
        rbin = rbin.lstrip(b'\x00')
        # if rbin has a high bit, add a \x00
        if rbin[0] & 0x80:
            rbin = b'\x00' + rbin
        result = bytes([2, len(rbin)]) + rbin  # 정수 리스트를 bytes([])를 사용해 변환
        sbin = self.s.to_bytes(32, byteorder='big')
        # remove all null bytes at the beginning
        sbin = sbin.lstrip(b'\x00')
        # if sbin has a high bit, add a \x00
        if sbin[0] & 0x80:
            sbin = b'\x00' + sbin
        result += bytes([2, len(sbin)]) + sbin
        return bytes([0x30, len(result)]) + result

    def parse(cls, signature_bin):
        s = BytesIO(signature_bin)
        compound = s.read(1)[0]
        if compound != 0x30:
            raise SyntaxError("Bad Signature")
        length = s.read(1)[0]
        if length + 2 != len(signature_bin):
            raise SyntaxError("Bad Signature Length")
        marker = s.read(1)[0]
        if marker != 0x02:
            raise SyntaxError("Bad Signature")
        rlength = s.read(1)[0]
        r = int.from_bytes(s.read(rlength), 'big')
        marker = s.read(1)[0]
        if marker != 0x02:
            raise SyntaxError("Bad Signature")
        slength = s.read(1)[0]
        s = int.from_bytes(s.read(slength), 'big')
        if len(signature_bin) != 6 + rlength + slength:
            raise SyntaxError("Signature too long")
        return cls(r, s)
````

# 슈노르 서명

* [슈노르서명](http://wiki.hash.kr/index.php/%EC%8A%88%EB%85%B8%EB%A5%B4%EC%84%9C%EB%AA%85)
* ESCSA와 슈노르 서명 모두 거래를 보호하고 메시지 진위를 사용하기 위한 디지털 서명 방식이다.
* 슈노르 서명은 효율성과 확장성에서 장점을 가지고 있는 방식.
* 슈노르 서명은 ECDSA보다 효율적이고 빠르다.
* 여러 서명 (여러명이 한명에게 보내는 거래)을 하나의 서명으로 만들 수 있다.
* 즉, 거래의 크기를 줄일 수 있고, 블록에 더 많은 거래를 넣을 수 있기 때문에 좋다.
* ECDSA의 경우 검증과 서명을 위한 두개의 키(개인키, 공개키)를 가져야 하지만
* 슈노르 서명의 경우 하나의 키로 두개의 동작을 처리할 수 있다. 더 간단하다.
* 이 부분은 나중에 떼서 공부하도록 한다.

# Reference

* [Programming Bitcoin by Jimmy Song(O'Reilly). Copyright 2019 Jimmy Song, 978-1-492-03149-9](https://product.kyobobook.co.kr/detail/S000001810191?LINK=NVB&NaPm=ct%3Dlco3jtn4%7Cci%3Dbf430ef307d43aa5d2aed075a40675b99aea5dd1%7Ctr%3Dboksl1%7Csn%3D5342564%7Chk%3D30b6603d08172940787f2adaf8fa881b7ca80517)
* [programmingbitcoin](https://github.com/jimmysong/programmingbitcoin)
* [슈노르서명](http://wiki.hash.kr/index.php/%EC%8A%88%EB%85%B8%EB%A5%B4%EC%84%9C%EB%AA%85)
