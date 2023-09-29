---
title: Transaction Input
thumbnail: ''
draft: false
tags: null
created: 2023-09-18
---

이번엔 트랙잭션 입력에 대해 알아보자.

# Inputs

````
010000000181379011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d10000000
06b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf2132060277457c98f02
207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631
e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef0100000000
1976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc
762dd5423e332166702cb75f40df79fea1288ac19430600

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

````

![](BitcoinProgramming_12_TransactionInput_0.png)

* 거래라는 것은 무엇일까?
* 위와 같이 생각하는 것이 일반적일 것이다. 하지만 아래와 같은 방식으로 생각할 수도 있다.

![](BitcoinProgramming_12_TransactionInput_1.png)

* A에서 B로 가치가 이동하는 경우를 생각해보자.
* A가 가진 자산이 분해되어 다른 곳으로 넘어간다.
* 그렇다면 한번의 거래에서 Input이 여러개가 될 수 있다는 말인가? 그렇다.
* Inputs의 개수를 표현하기 위해 Varint 형식을 사용한다.

## Previous Tx ID

* 입력에서 사용되는 비트코인은 분명 **이전 트랙잭션에서의 결과로 부터 올 것이다.**
  * 이건 자명한데, 비트코인을 금덩어리로 비유해서 생각해보자.
  * 자른다고 하더라도 거래라는 것은 시간축의 흐름에 따라 순차적으로 진행될 수 밖에 없다.
  * 즉, 동시에 하나의 금덩이로 두개의 거래를 하는 것은 불가능하다.
    * 이것을 이중 지불 문제라 한다.
    * 디지털 환경에서 이를 해결하기 어려워 디지털 화폐가 나오지 않았었다.
    * 비트코인이 이 문제를 해결했다. 이는 아직 나오지 않았다.
* 그렇기 때문에, 이전 트랜잭션을 가리킬 수 있어야 비트코인이 온 근거를 파악할 수 있다.
* 이 때 이전 트랜잭션을 나타내는 해시값은 hash256을 사용한다.
* hash256은 아직 "해시 충돌"이 거의 없기 때문에 특정 트랙잭션을 나타내는 Id의 역할을 할 수 있다.

## Previous Tx index

* 위의 설명을 보다가 "음? 이상한데"라고 생각했다면 맞다.
* "이전 트랜잭션"만을 알고서는 어떤 비트코인을 사용할지 특정 할 수 없다.
* 위의 그림을 보면, A의 비트코인이 A, B의 지갑으로 각각 이동했다.
* 그렇기 때문에 다시 A가 비트코인을 전송한다면, 이전 트랙잭션에서 2번째 Output인 A의 지갑에서 출금해야 할 것이다.
* 즉, **이전 트랙잭션에서 몇번쨰 출력**인지 알 수 있어야 한다.
* 이를 특정하는 것이 Tx index이다.
* 4바이트로 읽으면 된다.

## ScriptSig

* 입력의 유효성 검증
* 주는 쪽에서 비트코인을 사용하기 위한 서명 및 인증과 관련된 정보가 포함되어 있다. 
* 이 정보는 트랜잭션 출력(Output) 부분에서 사용된 ScriptPubKey의 스크립트와 대조되어 검증된다.
* 이제 비트코인이 어느 트랜잭션 출력에서 나왔는지를 알 수 있게 되었다.
* 그렇다면 결국 이 돈으로 "무엇을" 하겠냐를 알려주어야 한다.
* 이걸 해결하기 위한 것이 해제 스크립트이다.
* 비트코인에서 사용하는 스마트 계약 언어인 Script를 구성하는 부분이 ScriptSig이다.
* 이는 나중에 제대로 다루므로 일단은 넘어가겠다.
* 해당 필드 역시 길이가 변하기 때문에 Varint 형식으로 길이를 설정후 적어준다.

## Sequence

* 이건 뭘까?
* 이는 "매우 빈번한 거래"를 표현하기 위해 만들었다.
* 뒤에 나올 "Locktime"이라는 개념과 "Sequence"를 통해 빈번한 거래시 블록체인에 즉각 반영하지 않고 최종 결과를 거래함으로써 효율성을 도모하기 위해 추가했다.
* 빈번한 거래가 10번이 있다고 했을 떄, sequence 값은 거래마다 1씩 증가하게 된다.
* 그러다가 Locktime이 유효한 상태가 될 경우, 하나의 트랜잭션으로 묶어 기록하도록 한다.
* 좋은 생각이나 악용하기 쉬울 수 있다.
* A와 B가 거래를 하는데, A가 채굴자라고 하자.
  * 채굴자는 거래를 모아 블록체인에 실제로 기록을 할 수 있는 게임에 참여할 수 있는 집단이라 생각하면 된다.
* sequence가 올라갈 때, B가 A에게 돈을 주는 트랜잭션만 꼽아서 먼저 체인에 넣어버릴 수 있다.
* 하지만 이런 발상 자체는 매우 훌륭하여 라이트닝 네트워크의 토대가 되었다.
  * 수수료를 낮출 수 있음
  * 속도를 높힐 수 있음

## TxIn

````python
class TxIn:
    def __init__(self, prev_tx, prev_index, script_sig=None, sequence=0xffffffff):
        self.prev_tx = prev_tx
        self.prev_index = prev_index
        if script_sig is None:
            self.script_sig = Script()
        else:
            self.script_sig = script_sig
        self.sequence = sequence

    def __repr__(self):
        return '{}:{}'.format(
            self.prev_tx.hex(),
            self.prev_index,
        )

    @classmethod
    def parse(cls, s):
        '''
        byte 스트림을 받아서 시작부분의 트랜잭션 입력을 파싱한다.
        TxIn 객체를 반환한다.
        '''
        # prev_tx is 32 bytes, little endian
        prev_tx = s.read(32)[::-1]
        # prev_index is an integer in 4 bytes, little endian
        prev_index = little_endian_to_int(s.read(4))
        # use Script.parse to get the ScriptSig
        script_sig = Script.parse(s)
        # sequence is an integer in 4 bytes, little-endian
        sequence = little_endian_to_int(s.read(4))
        # return an instance of the class (see __init__ for args)
        return cls(prev_tx, prev_index, script_sig, sequence)

    def serialize(self):
        '''Returns the byte serialization of the transaction input'''
        result = self.prev_tx[::-1]
        result += int_to_little_endian(self.prev_index, 4)
        result += self.script_sig.serialize()
        result += int_to_little_endian(self.sequence, 4)
        return result

    def fetch_tx(self, testnet=False):
        return TxFetcher.fetch(self.prev_tx.hex(), testnet=testnet)

    def value(self, testnet=False):
        '''Get the output value by looking up the tx hash.
        Returns the amount in satoshi.
        '''
        tx = self.fetch_tx(testnet=testnet)
        return tx.tx_outs[self.prev_index].amount

    def script_pubkey(self, testnet=False):
        '''Get the ScriptPubKey by looking up the tx hash.
        Returns a Script object.
        '''
        tx = self.fetch_tx(testnet=testnet)
        return tx.tx_outs[self.prev_index].script_pubkey

````

# Reference

* [Programming Bitcoin by Jimmy Song(O'Reilly). Copyright 2019 Jimmy Song, 978-1-492-03149-9](https://product.kyobobook.co.kr/detail/S000001810191?LINK=NVB&NaPm=ct%3Dlco3jtn4%7Cci%3Dbf430ef307d43aa5d2aed075a40675b99aea5dd1%7Ctr%3Dboksl1%7Csn%3D5342564%7Chk%3D30b6603d08172940787f2adaf8fa881b7ca80517)
* [programmingbitcoin](https://github.com/jimmysong/programmingbitcoin)
