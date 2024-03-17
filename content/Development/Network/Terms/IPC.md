---
title: IPC
thumbnail: ''
draft: false
tags:
- elliptic-curve
- network
- process
created: 2023-10-04
---


 > 
 > Inter Process Communication

프로세스는 완전히 독립된 실행객체이다. 서로 독립되어 있다는 것은 다른 프로세스의 영향을 받지 않는다는 장점이 있다. 그러나 독립되어 있기 때문에 별도의 설비가 없이는 서로 간에 통신이 어렵다는 문제가 있으며, 이를 위해 커널 영역에서는 IPC라는 내부 프로세스간 통신(Inter Process Communication)을 제공한다. 이 기능을 사용하여 프로세스는 프로세스간 통신이 가능케 한다.
