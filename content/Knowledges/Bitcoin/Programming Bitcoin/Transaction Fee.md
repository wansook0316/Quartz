---
title: Transaction Fee
thumbnail: ''
draft: false
tags:
- transaction
- transaction-fee
created: 2023-09-18
---

트랜잭션에 대한 수수료는 어떻게 계산되는가?

# Transaction Fee

* 보상이 주어지지 않으면 누가 일을 할까?
* 채굴자는 거래 내역을 정리하고 블록을 만들어 추가함으로서 수수료를 받는다.
* (물론 추가적으로 채굴보상도 있다.)
* 그렇다면 이 수수료는 누가 지불하는 걸까? 
* 트랙잭션을 만들어 보낼 때 이 수수료를 추가해서 보내면 된다.
* 그렇다면, 트랜잭션은 입력과 출력으로 구성되었다 했는데, 여기서 수수료를 추가하려면
* 입력의 합이 출력의 합보다 더 크면 된다.
* 그런데, 입력에 대해 배웠을 때 입력에 대한 금액은 필드에 없었다. (출력에는 있었다.)
* 그러면 입력의 금액은 어떻게 알 수 있을까?
* 입력으로 들어온 것들에 대해 UTXO를 찾아서 금액을 확인하면 된다.
* 입력에는 이전 트랜잭션 hex가 있고, 이걸로 풀노드로 부터 찾은 뒤, 거기서 output에 해당했던 현재의 input을 찾아 금액을 읽으면 된다.
* 풀노드라면 바로 찾으면되고, 아니라면 믿을 수 있는 제 3자가 제공하는 풀노드로 부터 정보를 얻어야 한다.
* 그러려면 입력에 적혀있던 이전 트랜잭션 hex로 입력이 과거의 output으로 있었던 transaction을 가져와야 한다.
* 이를 위한 클래스를 만들어보자.

````python
class TxFetcher:
    cache = {}

    @classmethod
    def get_url(cls, testnet=False):
        if testnet:
            return 'https://blockstream.info/testnet/api/'
        else:
            return 'https://blockstream.info/api/'

    @classmethod
    def fetch(cls, tx_id, testnet=False, fresh=False):
        if fresh or (tx_id not in cls.cache):
            url = '{}/tx/{}/hex'.format(cls.get_url(testnet), tx_id)
            response = requests.get(url)
            try:
                raw = bytes.fromhex(response.text.strip())
            except ValueError:
                raise ValueError('unexpected response: {}'.format(response.text))
            if raw[4] == 0:
                raw = raw[:4] + raw[6:]
                tx = Tx.parse(BytesIO(raw), testnet=testnet)
                tx.locktime = little_endian_to_int(raw[-4:])
            else:
                tx = Tx.parse(BytesIO(raw), testnet=testnet)
            if tx.id() != tx_id:  # 네트워크에서 받아온 Transaction과 내가 요청한 Transaction을 비교
                raise ValueError('not the same id: {} vs {}'.format(tx.id(), 
                                  tx_id))
            cls.cache[tx_id] = tx
        cls.cache[tx_id].testnet = testnet
        return cls.cache[tx_id]

    @classmethod
    def load_cache(cls, filename):
        disk_cache = json.loads(open(filename, 'r').read())
        for k, raw_hex in disk_cache.items():
            raw = bytes.fromhex(raw_hex)
            if raw[4] == 0:
                raw = raw[:4] + raw[6:]
                tx = Tx.parse(BytesIO(raw))
                tx.locktime = little_endian_to_int(raw[-4:])
            else:
                tx = Tx.parse(BytesIO(raw))
            cls.cache[k] = tx

    @classmethod
    def dump_cache(cls, filename):
        with open(filename, 'w') as f:
            to_dump = {k: tx.serialize().hex() for k, tx in cls.cache.items()}
            s = json.dumps(to_dump, sort_keys=True, indent=4)
            f.write(s)
````

````python

class Tx:

    ...

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

````python
class TxIn:
    ...

    def fetch_tx(self, testnet=False):
        return TxFetcher.fetch(self.prev_tx.hex(), testnet=testnet)

    def value(self, testnet=False):
        '''Get the output value by looking up the tx hash.
        Returns the amount in satoshi.
        '''
        tx = self.fetch_tx(testnet=testnet)
        return tx.tx_outs[self.prev_index].amount

````

* fetch 메소드는 트랜잭션의 id를 받아서 해당 트랜잭션을 가져온다.
* 이 때, TxFetcher 클래스는 캐시를 사용해서 이미 가져온 트랜잭션은 다시 가져오지 않는다.
* 그리고 네트워크에서 트랜잭션을 가져올 때, 트랜잭션의 id와 네트워크에서 가져온 트랜잭션의 id가 같은지 확인한다.
* 만약, 네트워크에서 요청한 결과가 트랜잭션이 아니고, 내가 요청한 입력의 금액을 반환받았다면, 
* 제3자가 제공하는 정보를 "검증"할 방법이 없다.
* 그렇기 때문에 트랜잭션 정보 전체를 받고, 이 트랜잭션 내용에 대한 해시값을 통과시켜 검증하는 과정을 추가한다면,
* 정확히 원하는 트랜잭션임을 확인 가능하다.

# Reference

* [Programming Bitcoin by Jimmy Song(O'Reilly). Copyright 2019 Jimmy Song, 978-1-492-03149-9](https://product.kyobobook.co.kr/detail/S000001810191?LINK=NVB&NaPm=ct%3Dlco3jtn4%7Cci%3Dbf430ef307d43aa5d2aed075a40675b99aea5dd1%7Ctr%3Dboksl1%7Csn%3D5342564%7Chk%3D30b6603d08172940787f2adaf8fa881b7ca80517)
* [programmingbitcoin](https://github.com/jimmysong/programmingbitcoin)
