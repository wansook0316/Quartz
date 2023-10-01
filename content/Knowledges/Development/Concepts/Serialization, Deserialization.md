---
title: Serialization, Deserialization
thumbnail: ''
draft: false
tags:
- serialization
- deserialization
created: 2023-10-01
---

# Serialization & Deserialization

![](TechTalks_15_SerializationDeserialization_0.png)

 > 
 > 데이터 구조나 오브젝트 상태를 동일하거나 다른 컴퓨터 환경에 저장(이를테면 파일이나 메모리 버퍼: persistence)하고 나중에 재구성할 수 있는 포맷으로 변환하는 과정

쉽게 생각하면, 내가 가지고 있는 이 객체 구조를 어딘가에 저장할 수 있도록 변환하는 과정을 말한다. 일단 이 질문으로부터 출발해야 한다. 

 > 
 > 내가 구성한 객체 상태 그대로를 다른 사람에게 전달할 수 없을까?

이러한 질문에 대한 해결방법으로 나온 것이 직렬화이다. 이를 통해서 객체의 상태를 저장(Serialization)하고 특정 위치에 해당 객체를 다시 만들 수 있다.(Deserialization)  `swift`에는 객체 그래프를 archiving을 통해 저장해 둔 뒤 이를 불러올 수 있는 방법이 있다. `NSKeyedArchiver`라는 친구인데, 이건 나중에 다뤄보도록 하겠다. 지금은 개념만 알아보자. 다음에 Persistence 전체에 대해 한번 알아보도록 하겠다.

# 직렬화는 왜 필요한가?

 > 
 > 형식 데이터(Int, Char, Float)는 통신이 가능하나, 객체는 불가하기 때문.

객체 인스턴스는 결국 힙 영역에 할당되어 있고, 스택에서 이 힙 메모리를 참조하는 구조로 되어 있다. 그럼 이 인스턴스 자체를 복사해서 넘겨주고 싶을 때, 이 메모리의 주소를 넘겨줄 것인가? 만약 값타입 (Int, Char, Float)의 경우에는 값을 전달하면 되기 때문에 문제가 없다. 하지만 객체의 경우에는 특정 메모리 주소 자체가 아무런 의미도 가지지 못한다. 말 그대로 인스턴스의 구조자체를 넘겨받아야 의미가 있다.

이러한 점에서 직렬화는 참조 형식 데이터를 값 형식 데이터로 변환해주어, 서로 통신이 가능한 구조로 변환한다.

# 직렬화 종류

||csv, json, xml|binary|
|--|--------------|------|
|장점|- 사람이 읽을 수 있는 형태 <br> - 최근 많이 사용|- 저장 공간 효율적으로 사용 가능 <br> - 파싱 시간 빠름(데이터 양 많을 때 사용) <br> - i.e: Protocol Buffer, Apache Avro|
|단점|- 파싱 시간 오래 걸림(데이터 적을때 사용) <br> - 저장 공간 효율성 떨어짐|- 사람이 읽을 수 없음|

# 요약

* 직렬화는 참조 데이터에 대해 통신 가능한 형태로 가공하여 이를 파싱하여 해당 상태를 복사할 수 있도록 하기 위해 필요한 개념이다.
* 직렬화 종류에는 csv, json, xml, binary 등이 있다. 데이터 양에 따라 변경하여 사용하자.

하다보니, 개념은 굉장히 간단해서 할 얘기가 없었다. 이를 기반으로 추후 Swift에서 사용하는 Persistence에 대해 정리할 예정이다. 끝!

# Reference

* [직렬화](https://ko.wikipedia.org/wiki/%EC%A7%81%EB%A0%AC%ED%99%94)
* [What Is Serialization?](https://hazelcast.com/glossary/serialization/)
