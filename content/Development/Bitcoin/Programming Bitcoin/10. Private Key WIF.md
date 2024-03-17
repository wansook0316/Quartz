---
title: Private Key WIF
thumbnail: ''
draft: false
tags:
- private-key
- bitcoin
- serialization
- WIF
- Wallet-Import-Format
created: 2023-09-18
---

비밀키를 직렬화하는 방법을 알아보자.

# 비밀키 직렬화

* 비밀키를 직렬화할 이유는 그닥 없다.
* 네트워크로 전파할 일이 없기 때문이다. 비밀키 전파는 지갑이 털릴 수 있는 위험이 매우 크다.
* 그런데도 해당 기능이 있는 이유는, 지갑을 옮기고 싶은 경우가 있을 수 있기 때문이다.
  * 종이지갑 > 소프트웨어 지갑
* 이런 경우를 위해 WIF 포맷으로 변경할 수 있어야 한다.

![](BitcoinProgramming_10_PrivateKeyWIF_0.png)

````python

def encode_base58_checksum(b):
    return encode_base58(b + hash256(b)[:4])

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

def hash256(s):
    '''two rounds of sha256'''
    return hashlib.sha256(hashlib.sha256(s).digest()).digest()

class PrivateKey:

    def __init__(self, secret):
        self.secret = secret
        self.point = secret * G

    def wif(self, compressed=True, testnet=False):
        secret_bytes = self.secret.to_bytes(32, 'big')
        if testnet:
            prefix = b'\xef'
        else:
            prefix = b'\x80'

        if compressed:
            suffix = b'\x01'
        else:
            suffix = b''

        return encode_base58_checksum(prefix + secret_bytes + suffix)

````

# Reference

* [Programming Bitcoin by Jimmy Song(O'Reilly). Copyright 2019 Jimmy Song, 978-1-492-03149-9](https://product.kyobobook.co.kr/detail/S000001810191?LINK=NVB&NaPm=ct%3Dlco3jtn4%7Cci%3Dbf430ef307d43aa5d2aed075a40675b99aea5dd1%7Ctr%3Dboksl1%7Csn%3D5342564%7Chk%3D30b6603d08172940787f2adaf8fa881b7ca80517)
* [programmingbitcoin](https://github.com/jimmysong/programmingbitcoin)
