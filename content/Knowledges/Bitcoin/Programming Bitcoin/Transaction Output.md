---
title: Transaction Output
thumbnail: ''
draft: false
tags:
- transaction-output
- ScriptPubKey
- UTXO
- locktime
created: 2023-09-18
---

트랙잭션 출력에 대해 알아보자.

# Outputs

````
010000000181379011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d10000000
06b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf2132060277457c98f02
207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631
e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef0100000000
1976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc
762dd5423e332166702cb75f40df79fea1288ac19430600

Outputs: 02a135ef0100000000
1976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc
762dd5423e332166702cb75f40df79fea1288
  - Output counts(Varint): 02
    - First
      - Bitcoin amounts: a135ef0100000000
      - ScriptPubKey: 1976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac
    - Second
      - Bitcoin amounts: 99c3980000000000
      - ScriptPubKey: 1976a9141c4bc762dd5423e332166702cb75f40df79fea1288
````

## Bitcoin Amount

* 비트코인의 양을 나타낸다.
* 총액은 2100개, 2100조 사토시를 나타낸다.
* 2100조는 $2^32$보다 크기 때문에 8바이트로 표현한다.
* 리틀 엔디안으로 표현한다.

## ScriptPubKey

* ScriptPubKey는 비트코인 트랜잭션의 출력(Output) 부분에 해당하는 스크립트이다. 
* 즉, 트랜잭션에서 받는 쪽이 비트코인을 받을 수 있는 주소와 관련된 정보가 포함되어 있다. 
* 이 정보는 ScriptSig에서 사용되는 서명 및 인증 정보와 대조되어 검증된다.

## UTXO

* 출력에 포함되지는 않으나 중요한 개념이라 설명한다.
* UTxO는 Unspent Transaction Output의 약자이다.
* 트랜잭션을 공부해봤으니, 트랜잭션이 입력과 출력으로 구성되어 있다는 것을 알 수 있다.
* 그렇다면, 가장 마지막에 있는 출력들이 있을 것이다.
* 이녀석들은 아직 입력으로 들어가지 않은 상태이다.
* 이 미사용 트랜잭션 출력의 전체 집합을 UTXO라고 한다.
* 결국 이건 **현재 유통중인 모든 비트코인을 의미한다.**
* 네트워크 상의 풀 노드는 UTXO 집합을 항상 최신으로 유지해야 한다.
* 왜냐하면 검증시, 결국 사용가능한 코인인지 확인하는 것은 이걸 보고 할 수 밖에 없기 때문이다.
* 이는 곧 이중 지불의 방지 방법이 된다. 모두 연결되어 있고, 가장 마지막 출력으로부터 지급 과정을 확인할 수 있기 때문이다.

## TxOut

````python
class TxOut:

    def __init__(self, amount, script_pubkey):
        self.amount = amount
        self.script_pubkey = script_pubkey

    def __repr__(self):
        return '{}:{}'.format(self.amount, self.script_pubkey)

    @classmethod
    def parse(cls, s):
        '''
        Byte 스트림을 받아서 트랜잭션 출력을 파싱하고 TxOut 객체를 반환한다.
        '''
        # amount is an integer in 8 bytes, little endian
        amount = little_endian_to_int(s.read(8))
        # use Script.parse to get the ScriptPubKey
        script_pubkey = Script.parse(s)
        # return an instance of the class (see __init__ for args)
        return cls(amount, script_pubkey)

    def serialize(self):  # <1>
        '''Returns the byte serialization of the transaction output'''
        result = int_to_little_endian(self.amount, 8)
        result += self.script_pubkey.serialize()
        return result
````

# Locktime

````
010000000181379011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d10000000
06b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf2132060277457c98f02
207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631
e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef0100000000
1976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc
762dd5423e332166702cb75f40df79fea1288ac19430600

Locktime: ac19430600
````

* Locktime은 트랜잭션의 입력이나 출력에 포함되는 것이 아니라, 트랜잭션 자체에 포함된다.
* 트랜잭션 전파 후 실행을 지연시키는 방법이다.
* 만약 600,000 블록이 지나면 실행되도록 설정하면, 600,000 블록이 지나기 전까지는 블록에 포함될 수 없다.
* "빈번한 거래" 상황을 위해 고안되었다.
* 이전에 보았던 TxIn의 sequence와 함께 사용된다.
* 4바이트로 표현되며, 리틀 엔디안으로 표현된다.
* 주요 문제는 Locktime에 도달했을 때, 수신자가 트랜잭션이 유효한지 확신할 수 없다는 점이다.
* 이는 시간이 많이 지나 부도가 난 수표와 비슷하다.

# Reference

* [Programming Bitcoin by Jimmy Song(O'Reilly). Copyright 2019 Jimmy Song, 978-1-492-03149-9](https://product.kyobobook.co.kr/detail/S000001810191?LINK=NVB&NaPm=ct%3Dlco3jtn4%7Cci%3Dbf430ef307d43aa5d2aed075a40675b99aea5dd1%7Ctr%3Dboksl1%7Csn%3D5342564%7Chk%3D30b6603d08172940787f2adaf8fa881b7ca80517)
* [programmingbitcoin](https://github.com/jimmysong/programmingbitcoin)
