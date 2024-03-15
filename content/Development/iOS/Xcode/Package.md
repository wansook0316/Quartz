---
title: Package
thumbnail: ''
draft: false
tags:
- ios
- xcode
- package
created: 2023-10-02
---

# Package

 > 
 > Finder가 단일 파일인 것처럼 사용자에게 제공하는 디렉토리

![](XcodeProject_01_Package_Bundle_0.png)

가장 쉽게 알아볼 수 있는 것은 우리가 사용하는 Application에 있는 최종 Product! .app 이다. 클릭하면 실행이 되지만, 실제로 우측클릭을 하게되면 `Show Package Contents`라는 옵션이 있는 걸 확인할 수 있다. 클릭하면 실행이 된다는 점에서 `Package`는 Finder에게 단일 파일인 것처럼 동작한다. (Opague Directory)

이 `Package`안에는 Application을 실행하는데 필요한 코드와 리소스 파일이 있다. 하위 설명할 Bundle과 굉장히 유사하지만, 해당 단위는 Finder가 단일 파일처럼 인식하는 것에 중점이 가있는 용어라는 사실을 기억하자.

굳이 이렇게 Package라는 단위를 사용하는 이유는, 일반 사용자들이 Finder를 통해서 Application을 실행할 때, 단일 파일처럼 작동하도록 하여 내부 파일에 부정적인 영향을 미치는 것을 원천차단하기 위해서다. 즉, `Package`를 사용하는 이유는, finder를 속이기 위해서, 그리고 그 결과로 사용자 환경을 개선하기 위함이다.

이렇게 finder가 단일 파일로 간주하는 확장자는 다음과 같은 것들이 있다.

* `.app`
* `.bundle`
* `.framework`
* `.plugin`
* `.kext`

# Reference

* [Package, Bundle, NSBundle](https://hcn1519.github.io/articles/2018-12/bundle)
