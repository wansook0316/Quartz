---
title: Public Key WIF (Address)
thumbnail: ''
draft: false
tags: null
created: 2023-09-18
---

공개키 비트코인 주소 형식에 대해 알아본다. 이는 곧 "주소"이다.

# 비트코인 주소 WIF(Wallet Import Format)

* 앞에서 공개키와 비밀키, 그리고 서명, 검증 방식에 대해 알아보았다.
* 그리고 이를 직렬화하는 방법도 배웠다.
* 그렇다면 A가 B에게 비트코인을 보내려면 어떻게 해야할까?
* 공개키를 공개하고, 이에 대해 r, s값을 넘겨 검증할 수 있다.
* 즉, 공개키는 어떤 의미로 "주소"라고 생각할 수 있다.
* 실제로 비트코인이 나온 초기에는 이를 주소로 사용했다. 
* 하지만 SEC 방식의 경우 길이도 길고 (33 or 65 byte)
* 이진 형식이기 때문에 읽기도 쉽지 않다. (16진법으로 바꾼다해도 길다. - 66 or 130)
* 그렇기 때문에 이를 변형해야할 필요성이 있다.
* 이렇게 주소로 사용하기 위해 변환하는 것을 WIF(Wallet Import Format)라 한다.

# 고려 사항

1. 가독성
1. 길이
1. 보안성

# Base58

* 위의 고려사항을 충족하기 위해 Base58을 사용한다.
* 비슷한 것으로 URL을 축약하기 위해 Base64와 같은 것을 많이 사용한다.
* Base라는 뜻은 "진법"이라고 생각할 수 있다.
* 즉, 64진법, 58진법으로 변경하여 바이너리 데이터를 표현하는 방법이다.
  * [Encoding](https://velog.io/@wansook0316/%ED%95%B5%EC%8B%AC%EB%A7%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EB%8A%94-%EC%9D%B8%EC%BD%94%EB%94%A9-ASCII-Unicode-UTF-8-URL-Encoding-Base64)
* 그럼 비트코인에서는 왜 굳이 58을 사용할까?

## 58의 사용이유

* Base64를 사용하면, 6개의 비트를 하나의 문자로 축약할 수 있다.
  * $2^6 = 64$
* 하지만 Base64에서 사용하는 글자와 숫자는 혼동하기 쉽다.
  * 0과 O, 1과 I, -과 _ 등
* 이러한 글자를 제외하여 가독성을 향상시킨다.
* 몇개의 문자만 제외되므로 길이도 줄어든다.
* 하지만 이렇게 되면 비트의 개수와 문자와 1:1 대응이 되지 않는다.
  * 5.86비트가 하나의 문자에 대응된다.
* 이렇게 나누어 떨어지지 않는 나머지 비트의 경우 checksum을 붙여 실수를 방지하는 기능을 추가한다.
* 마지막으로 보안성까지 추가되었다.

# Code

````python
BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

def encode_base58(s):
    count = 0
    for c in s:  # 전처리이다. 0바이트의 개수를 정한다.
        if c == 0:
            count += 1
        else:
            break
    num = int.from_bytes(s, 'big') # 바이너리 데이터를 숫자로 디코딩한다.
    prefix = '1' * count # 0에 대응되는 값인 "1"을 0바이트 개수만큼 prefix로 달아둔다. 이 부분은 p2pkh에서 필요하다.
    result = ''
    while num > 0:  
        num, mod = divmod(num, 58)
        result = BASE58_ALPHABET[mod] + result # 58로 나눈 나머지를 바탕으로 문자를 결정한다.
    return prefix + result  # 결과를 더한다.

def decode_base58(s):
    num = 0
    for c in s:
        num *= 58
        num += BASE58_ALPHABET.index(c)
    combined = num.to_bytes(25, byteorder='big')
    checksum = combined[-4:]
    if hash256(combined[:-4])[:4] != checksum:
        raise ValueError('bad address: {} {}'.format(checksum, hash256(combined[:-4])[:4]))
    return combined[1:-4]
````

## 사장되는 Base58

* 딱 봐도 직관적이지는 않다.
* 58개도 여전히 많다.
* 여전히 길다.
* Bech32 표준이 [BIP0173](https://en.bitcoin.it/wiki/BIP_0173)으로 제안되었다.
* 32개의 글자로만 구성한 인코딩 방식이다.
* Segwit에서만 현재로는 사용된다.

# Hash160

* SEC 방식을 통해 공개키를 직렬화 했다.
* 이 길이가 길어 압축 SEC 방식을 도입했다. (33byte * 4 = 132bit)
* 최종적으로 이 압축 SEC에서 만든 bit를 Base58로 변환하여 클라이언트에서 사용할 것이다.
* 하지만, 이 중간단계에서 더 줄일 수는 없을까?
* 이 과정에서 Base58로 변환하기에 앞서 한단계 추가작업을 할 것이다.
  * 보안적인 문제도 있다.
* 이 과정에서 Base58인코딩 전에 Hash160을 통해 길이를 줄이고, 보안을 강화한다.
* [sha256](http://wiki.hash.kr/index.php/SHA256)과 ripemd160 해시를 연속으로 적용하는 방법을 말한다.

# 최종 정리

* 부분 부분에 대해 설명은 했지만, 전체적인 그림을 이해하기는 쉽지 않았다.
* 그래서 선형적으로 비트코인 주소를 만드는 과정을 모식도와 코드로 나타냈다.

![](BitcoinProgramming_08_PublicKeyWIF(Address)_0.png)

````python

class S256Point(Point):
...
    def address(self, compressed=True, testnet=False):
        '''Returns the address string'''
        h160 = self.hash160(compressed)
        if testnet:
            prefix = b'\x6f'
        else:
            prefix = b'\x00'
        return encode_base58_checksum(prefix + h160)

    def hash160(self, compressed=True):
        return hash160(self.sec(compressed))


def hash160(s):
    '''sha256 followed by ripemd160'''
    return hashlib.new('ripemd160', hashlib.sha256(s).digest()).digest()

def encode_base58_checksum(b):
    return encode_base58(b + hash256(b)[:4])

def hash256(s):
    '''two rounds of sha256'''
    return hashlib.sha256(hashlib.sha256(s).digest()).digest()

def encode_base58(s):
    count = 0
    for c in s:  # <1>
        if c == 0:
            count += 1
        else:
            break
    num = int.from_bytes(s, 'big')
    prefix = '1' * count
    result = ''
    while num > 0:  # <2>
        num, mod = divmod(num, 58)
        result = BASE58_ALPHABET[mod] + result
    return prefix + result  # <3>
````

* 코드가 아무래도 선형적으로 구성되어 있는 것이 아니다보니 흐름을 따라가기가 어렵다.
* 하지만 모식도를 보면 금방 이해할 수 있다.
* 테스트넷은 비트코인 소프트웨어 개발에 활용되는 비트코인 네트워크이다.

# Reference

* [Programming Bitcoin by Jimmy Song(O'Reilly). Copyright 2019 Jimmy Song, 978-1-492-03149-9](https://product.kyobobook.co.kr/detail/S000001810191?LINK=NVB&NaPm=ct%3Dlco3jtn4%7Cci%3Dbf430ef307d43aa5d2aed075a40675b99aea5dd1%7Ctr%3Dboksl1%7Csn%3D5342564%7Chk%3D30b6603d08172940787f2adaf8fa881b7ca80517)
* [programmingbitcoin](https://github.com/jimmysong/programmingbitcoin)
* [Encoding](https://velog.io/@wansook0316/%ED%95%B5%EC%8B%AC%EB%A7%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EB%8A%94-%EC%9D%B8%EC%BD%94%EB%94%A9-ASCII-Unicode-UTF-8-URL-Encoding-Base64)
* [BIP0173](https://en.bitcoin.it/wiki/BIP_0173)
* [sha256](http://wiki.hash.kr/index.php/SHA256)
* [ripemd160](http://wiki.hash.kr/index.php/RIPEMD-160)
