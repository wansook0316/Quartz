---
title: Protobuf
thumbnail: ''
draft: false
tags:
- protobuf
- data
- serialization
- deserialization
- parsing
created: 2023-10-04
---

# protoc

protobuf는 데이터를 구조화하고, 이를 전송하고자 하는데 있어서 유연하고 효율적으로 작성하고 파싱하도록 지원하는 자동화 솔루션이다. json이나 xml을 생각하면 이해가 쉬운데, 사실 조금 다른 부분이 있다. protobuf는 데이터 구조를 `.proto`라는 파일로 작성하면, 이를 컴파일 해서 C++/C#/Python 등의 다양한 언어 코드 형태로 변환이 가능하다. 또한 변환된 언어 형태로 모듈까지 생성되어, 해당 언어로 데이터 구조를 전송하고 받아올 수 있도록 해준다.

C언어로 예를 들어 구조체를 정의하고, 이를 소켓을 통해 전송할 수 있게 Serialize(전송할 수 있도록 변환)하고, 변환된 데이터를 받은 후 Deserialize(파싱해서 다시 구조체의 형태로 저장) 하던 과정이 있다면, 이를 직접 코드로 다 작성해야 한다. 하지만 ProtoBuf는 데이터 구조만 정의하면 이 과정은 전부 지원해준다.

# Reference

* [protobuf documentation](https://developers.google.com/protocol-buffers)
* [Serialization, Deserialization](Serialization,%20Deserialization.md)
