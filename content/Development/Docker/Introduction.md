---
title: Introduction
thumbnail: ''
draft: false
tags:
- docker
- image
- container
- virtual-machine
- linux
created: 2023-10-04
---

![](Pasted%20image%2020231004183427.png)

# 개념

 > 
 > 개발자와 시스템 관리자가 컨테이너 기술을 사용하여 어플리케이션을 개발, 배포, 실행하기 위한 플랫폼

컨테이너 기술을 리눅스에서 사용되던 기술이다. 이 때, 이 기술을 사용하여 응용프로그램을 배포하는 것을 컨테이화 시킨 것이다. 새로운 기술은 아니지만, 이를 통해 매우 편리하고 간편하게 배포하는 것이 가능하다.

컨테이너 기술은 아래와 같은 특징들이 있다.

1. 유연성 (Flexible) : 복잡한 어플리케이션들도 모두 컨테이너화 할 수 있다.
1. 경량화 (Lightweight) : 컨테이너는 호스트 커널을 활용하고 공유한다.
1. 변화 관리 편의성 (InterChangeable) : 업데이트 및 업그레이드를 즉시 배포할 수 있다.
1. 포터블 (Portable) : 로컬로 구축하고, 클라우드와 가상화에 배치가 가능하고, 어디서나 실행할 수 있다.
1. 확장성 (Scalable) : 컨테이너 복제본을 늘리고 자동 배포가 가능하다.
1. 스택화 (Stackable) : 서비스들에 대한 수직적 또는 수평적 디자인이 매우 용이하다.

## 이미지와 컨테이너

* 이미지
  * 코드, 런타임, 라이브러리, 환경 변수 및 구성 파일 등 응용프로그램을 실행하는 데 필요한 모든 것을 포함하는 실행가능 패키지
* 컨테이너
  * 이미지의 런타임 인스턴스

이 두개의 개념은 도커를 이해하는 데 매우 중요하다. class는 instance의 설계도이다. 마찬가지로 이 class에 해당하는 것이 바로 image이며, 이를 메모리단에 올린 것을 container라 한다.

## 컨테이너의 동작 방식

![](https://subicura.com/assets/article_images/2017-01-19-docker-guide-for-beginners-1/vm-vs-docker.png)*가상 머신과 도커의 차이점*

기존에 사용하던 가상 머신은, Host OS위에 Guest OS를 얹어 사용하는 방식이다. 사용법은 간단하지만 **느리다**라는 치명적인 단점을 갖고 있다.
이러한 상황을 개선하기 위해 CPU 가상화 기술을 사용한 KVM(Kernel-based Virtual Machine)이 등장했다. 하지만 여전히 성능 문제가 있었다. 이를 해결한 것이 Docker contatiner이다. 이는 바로 Host OS위에서 격리만하여 프로세스를 처리하는 방식이다.

# Reference

* [초보를 위한 도커 안내서 - 도커란 무엇인가?](https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html)
