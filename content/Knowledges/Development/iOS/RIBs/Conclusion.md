---
title: Conclusion
thumbnail: ''
draft: false
tags:
- RIBs
- architecture
created: 2023-10-01
---

* 일단 해당 내용을 다 따라가면서 쳐보는 것을 추천한다.
* 아무래도 framework라고 공식 문서에 적혀있는 것으로 보아 진입장벽이 있을 것으로 보인다.
* 오히려 핵심 아이디어만 가져와서 사용하고, 유연하게 적용하는 것이 좋지 않을까하는 생각이다.
* 핵심 아이디어는 Protocol로 서로를 모두 격리조치하여 영향을 적게 끼치도록 하는 점이라는 생각이 들었다.
* 의존성 주입 방식도 깔끔한 것 같다.
* 가장 좋은 점은 RIB을 하나의 단위로 관리할 수 있다는 점이었다. 서로 분업하기가 용이해 보였다.
* 아, 추가적으로 Presenter라는 친구도 있는데 이녀석은 Optional이라 제외했다. 참고.

# Reference

* [uber/RIBs](https://github.com/uber/RIBs)
* [RIBs Architecture 도입 시리즈 1편: RIBs란?](https://blog.mathpresso.com/1-ios-ribs-architecture-af9834956daf)
* [RIBs란?](https://zeddios.tistory.com/937)
