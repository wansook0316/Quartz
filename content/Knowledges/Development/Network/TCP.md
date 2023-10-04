---
title: TCP
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# TCP

* 이 계층에서도 TCP 헤더를 붙여 세그먼트(Segment)를 만드는 캡슐화를 진행한다.

![image](https://user-images.githubusercontent.com/37871541/126898376-a9766b3e-d350-4cb1-8d2c-4171789a607e.png){: .center-small}*TCP 헤더*

* 연결형 통신에 사용
* **연결**이라는 통신로를 확보해야 한다.
  * 가상의 통신로
* 연결을 확립하기 위해서는 TCP 헤더의 코드 비트를 확인해야 한다.
* 코드 비트는 연결의 제어 정보가 기록되는 곳이다.
* 코드 비트의 종류
  * SYN
  * ACK
  * FIN
  * etc

![image](https://user-images.githubusercontent.com/37871541/126898421-0c4c7a0c-83a0-47fe-b5dd-3b77f0c1dda0.png){: .center-small}*코드 비트*

## 3 Way Hand shake

![image](https://user-images.githubusercontent.com/37871541/126898446-9bd88662-88e1-4e89-ae8a-62406c4e78b1.png){: .center-small}*3way handshake*

* 통신 전에 컴퓨터 2에게 허락을 받는다. 연결 확립 허가를 위한 요청(SYN)을 보낸다.
* 컴퓨터 2는 1의 요청을 받은 후, 허가한다는 응답을 회신한다. (ACK) 마찬가지로 컴퓨터 1에게 데이터 전송 허가를 받기 위해 연결 확립 요청을 보낸다.(SYN)
* 컴퓨터 2의 요청에 대해 1은 허가한다는 응답으로 ACK를 보낸다.

이렇게 연결 확립을 위해 패킷 요청을 3번 교환하는 것을 <mark style='background-color: #fff5b1'> 3-way hankshake </mark> 라 한다.

## 4 way handshake

![image](https://user-images.githubusercontent.com/37871541/126898546-4e8b82f4-10c3-4396-b5bb-333e39d7d497.png){: .center-small}*4 way handshake*

* 컴퓨터 1에서 2로 연결 종료 요청을 보낸다.(FIN)
* 2에서 1로 연결 종료 응답을 보낸다.(ACK)
* 2에서도 1로 연결 종료 요쳥을 보낸다.(FIN)
* 1에서 2로 연결 종료 응답을 반환한다.(ACK)

## 일련번호와 확인 응답 번호

![image](https://user-images.githubusercontent.com/37871541/126898643-b1404c7b-2f1c-48d0-b979-31385102769a.png){: .center-small}*TCP 헤더*

* 이제 연결은 되었고, 실제 데이터를 보내고 받아야 한다.
* 이 때는 TCP 헤더의 <mark style='background-color: #fff5b1'> 일련 번호와 응답 번호를 사용한다. </mark>
* TCP는 데이터를 분할해서 보내는데, 일련번호는 송신측에서 수신측에 이 데이터가 <mark style='background-color: #fff5b1'> 몇번째 데이터 </mark>인지 알려주는 역할을 한다.
* 확인 응답 번호는 수신측이 <mark style='background-color: #fff5b1'> 몇번째 데이터를 수신했는지 </mark> 알려주는 역할을 한다.
  * 이 번호를 가지고 다음 번호의 데이터를 요청하는데 사용한다.
  * 만약 10번을 수신했다면, 다시 송신측에 11번을 달라고 요청한다.

![image](https://user-images.githubusercontent.com/37871541/126898727-636bc7aa-938e-492f-a853-b7b3fd0cb8cf.png){: .center-small}*실제 통신 과정*

1. 컴퓨터 1이 2한테 200바이트 데이터를 전송
1. 2는 200바이트 수신 후에 다음 수신 데이터 번호를 확인응답번호에 넣는다.
   * 3001 + 200 = 3201이니 이 데이터를 요청한다.
1. 1은 2로 다시 3201부터 200 바이트의 데이터를 전송한다.
1. 2는 200바이트를 수신하고 다음 수신 데이터를 번호에 넣는다.

이러한 방법을 반복하게 된다. 데이터가 항상 올바르게 전달되지는 않으므로 이 두개의 값을 사용해서 손실되거나 유실된 경우, 다시 재전송하게 되어 있다. 이를 <mark style='background-color: #fff5b1'> 재전송 제어 </mark> 라고 한다.
