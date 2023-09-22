---
title: Transaction
thumbnail: ''
draft: false
tags: null
created: 2023-09-18
---

비트코인의 트랜잭션에 대해 알아보자.

# Transaction

* 앞에서 네트워크 혹은 디바이스에 이동하기 위한 공개키와 비밀키의 직렬화 방법에 대해 알아보았다.
* 물론 그에 대한 파싱까지 같이 배웠다.
* 현재까지 특정 개인이 얼마의 비트코인을 보냈다는 사실(문서)을 증명할 수 있고 (서명/검증 알고리즘)
* 이를 네트워크에 태워, 불특정 다른 노드들이 이 정보를 받아 해독(Decode)할 수 있음을 배웠다.
* 그런데, "얼마의 비트코인을 보냈다"라는 사실에 대해서는 어떻게 구성되었는지 모른다.
* 우리는 이러한 형태의 행위를 소위 "거래"라는 단어로 인식하고 있다.
* 그렇다면 비트코인에서의 거래는 어떤식으로 구성되어 있을까?
* A, B 두명의 사람의 계좌에 적히는 것처럼 되어 있을까?
  * A: 보낸이(A), 받는이(B) 금액(30000)
* 그 거래를 처리하는데 있어 기술적인 제약은 없는가? 그걸 어떻게 해결할까?
* 이에 대해서 알아보겠다.

# Transaction Components

1. Version
1. Inputs
1. Outputs
1. Locktime

````
010000000181379011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d10000000
06b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf2132060277457c98f02
207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631
e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef0100000000
1976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc
762dd5423e332166702cb75f40df79fea1288ac19430600

Version: 01000000 (4bytes)
Inputs: 0181379011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d10000000
06b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf2132060277457c98f02
207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631
e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff
  - Input counts(Varint): 01
  - Previous Tx ID(hash256): 81379011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1
  - Previous Tx index: 0000000
0
  - ScriptSig(Varint): 3045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf2132060277457c98f02
207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631
e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278a
  - Sequence: feffffff

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
Locktime: ac19430600
````

# Version

* 버전은 트랙잭션의 버전을 의미한다.
* 비트코인이 작동하는 방식은 기본적으로 네트워크이다.
* 네트워크에 참여하는 노드들은, 각자 코어 프로그램을 설치하고 정해진 규약에 따라 들어오는 거래를 처리한다.
* 이는 곧 코어 프로그램이 업데이트된다고 해서 모든 노드들이 최신 프로그램을 사용하는 것이 아님을 말한다.
* 만약 거래(Transaction)을 구성하는 방법이 변경되었을 경우, 그 정보를 알려주지 않는다면 노드들은 이를 어떻게 처리할지 알 수 없다.
* 그렇기에 트랜잭션에 추가되는 부가기능을 관리하기 위해 버전을 추가한다.

# Inputs

* 여러개의 입력을 가질 수 있다.
* 이전 트랜잭션의 출력을 참조하여 해당 비트코인의 소유권을 확인한다.
* 소유권을 확인하기 위한 스크립트를 포함한다.

# Outputs

* 여러개의 출력을 가질 수 있다.
* 

# Locktime

* 트랜잭션의 유효기간을 설정한다.
* 빈번한 거래 상황을 고안하여 추가되었다.

# Codes

````python
class Tx:

    def __init__(self, version, tx_ins, tx_outs, locktime, testnet=False):
        self.version = version
        self.tx_ins = tx_ins  # <1>
        self.tx_outs = tx_outs
        self.locktime = locktime
        self.testnet = testnet  # <2>

    def __repr__(self):
        tx_ins = ''
        for tx_in in self.tx_ins:
            tx_ins += tx_in.__repr__() + '\n'
        tx_outs = ''
        for tx_out in self.tx_outs:
            tx_outs += tx_out.__repr__() + '\n'
        return 'tx: {}\nversion: {}\ntx_ins:\n{}tx_outs:\n{}locktime: {}'.format(
            self.id(),
            self.version,
            tx_ins,
            tx_outs,
            self.locktime,
        )

    def id(self):  # <3>
        '''Human-readable hexadecimal of the transaction hash'''
        return self.hash().hex()

    def hash(self):  # <4>
        '''Binary hash of the legacy serialization'''
        return hash256(self.serialize())[::-1]
    # end::source1[]

    @classmethod
    def parse(cls, s, testnet=False):
        '''
        스트림을 받아서 트랜잭션을 파싱하고 Tx 객체를 반환한다.
        '''
        # s.read(n) will return n bytes
        
        # 버전
        # version is an integer in 4 bytes, little-endian
        version = little_endian_to_int(s.read(4))

        # 입력
        # num_inputs is a varint, use read_varint(s)
        num_inputs = read_varint(s)
        # parse num_inputs number of TxIns
        tx_ins = []
        for _ in range(num_inputs):
            tx_ins.append(TxIn.parse(s))

        # 출력
        # num_outputs is a varint, use read_varint(s)
        num_outputs = read_varint(s)
        # parse num_outputs number of TxOuts
        tx_outs = []
        for _ in range(num_outputs):
            tx_outs.append(TxOut.parse(s))
        
        # 록타임
        # locktime is an integer in 4 bytes, little-endian
        locktime = little_endian_to_int(s.read(4))
        # return an instance of the class (see __init__ for args)
        return cls(version, tx_ins, None, None, testnet=testnet)

    def serialize(self):
        '''Returns the byte serialization of the transaction'''
        result = int_to_little_endian(self.version, 4)
        result += encode_varint(len(self.tx_ins))
        for tx_in in self.tx_ins:
            result += tx_in.serialize()
        result += encode_varint(len(self.tx_outs))
        for tx_out in self.tx_outs:
            result += tx_out.serialize()
        result += int_to_little_endian(self.locktime, 4)
        return result

    def fee(self):
        '''Returns the fee of this transaction in satoshi'''
        # initialize input sum and output sum
        input_sum = 0
        output_sum = 0
        # use TxIn.value() to sum up the input amounts
        input_sum = sum([tx_in.value() for tx_in in self.tx_ins])
        # use TxOut.amount to sum up the output amounts
        output_sum = sum([tx_out.amount for tx_out in self.tx_outs])
        # fee is input sum - output sum
        fee = input_sum - output_sum
        return fee
````

* 수수료 같은 경우 Transaction의 구조를 이해한 후에 다른 글로 정리하겠다.

# Reference

* [Programming Bitcoin by Jimmy Song(O'Reilly). Copyright 2019 Jimmy Song, 978-1-492-03149-9](https://product.kyobobook.co.kr/detail/S000001810191?LINK=NVB&NaPm=ct%3Dlco3jtn4%7Cci%3Dbf430ef307d43aa5d2aed075a40675b99aea5dd1%7Ctr%3Dboksl1%7Csn%3D5342564%7Chk%3D30b6603d08172940787f2adaf8fa881b7ca80517)
* [programmingbitcoin](https://github.com/jimmysong/programmingbitcoin)
