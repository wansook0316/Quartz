---
title: Binary Files
thumbnail: ''
draft: false
tags:
- xcode
- compile
- binary
- mach-O
- ELF
- PE
- executable
- universal-binary
- lipo
- CPU
- architecture
created: 2023-10-02
---

실제 컴파일, 링킹이 끝난 뒤의 결과물에 대해서는 잘 모르는 것 같다. 실행 파일은 어떻게 구성되어 있는 걸까?

우리가 사용하는 프로그램들은, 바이너리화되어 있는 파일의 형태로 존재한다. 그런데, 이 실행파일의 형태는 OS에 따라 다른 형태로 존재한다. 터미널에서 우리가 사용하는 `ls`의 binary file 정보를 쳐보자.

````
file /bin/ls
/bin/ls: Mach-O universal binary with 2 architectures: [x86_64:Mach-O 64-bit executable x86_64] [arm64e:Mach-O 64-bit executable arm64e]
````

Mach-O? 이건 처음 들어보는 것 같고, x86, arm64는 들어본 것 같다. 후자는 cpu architecture를 말한다. x86은 인텔에서만든 cpu 아키텍쳐이고, arm은 apple 실리콘 작품이다. 그럼 이후로는 실행 파일의 형태에 대해서 알아보자.

# Executable File Format

* [Comparison of executable file formats - wikipedia](https://en.wikipedia.org/wiki/Comparison_of_executable_file_formats)

* **Mach-O** : **Mach O**bject File Format
  * Mach kernel을 기본으로 하는 OS들에서 사용하는 실행파일, 목적파일, 라이브러리, 코어덤프 파일 포멧
  * Mach kernel을 사용하는 OS :  macOS, iOS, tvOS, watchOS, NeXTSTEP
* **PE**: **P**ortable **E**xecutable
  * Windows OS의 실행파일, 목적파일, 라이브러리(DLL) 파일 포멧
  * 실행파일 확장자: `.EXE`
* **ELF**: **E**xecutable and **L**inkable **F**ormat
  * Unix 계열 실행파일, 목적파일, 라이브러리 파일 포멧
  * DWARF: 표준 디버깅 파일 포멧 - 'Debugging With Attributed Record Formats' 
* **a.out**: **A**ssembler **Out**put 
  * 오래된 Unix-like OS의 실행파일, 목적파일, 라이브러리에서 사용되는 파일 포멧
  * a.out은 일부 complier나 linker들에 output 이름을 지정하지 않았을 때 default output name으로 사용됨
    * 실제로 a.out format을 사용하지는 않음

# Mach-O Terminology

WWDC16, Optimizing App StartUp Time에 있는 내용이다.

* File Types
  * Executable
    * 앱 실행을 위한 main binary
  * Dylib
    * dynamic library (a.k.a DSO, DLL)
  * Bundle
    * 링크될 수 없는 Dylib, `dlopen()`으로 실행된다.
    * plug-ins
* Image
  * 실행 가능한 dylib, bundle 의미
* Framework
  * resource, header와 함께 directory가 있는 dylib

여기서 헷갈리는게 용어다. Framework는 그자체로 Bundle이다. 그리고 그 Bundle안에 있는 Resource들을 `NSBundle`로 가져와서 사용가능하다. 여기서 Bundle은 또 다른 의미이다. 문맥에 따라 이해하는 것이 필요하다.

# CPU Architectures

Build Setting의 **Excluded Architectures**에서 설정 가능하다.

|architecture|적용 기기|비고|
|:----------:|:---:--------|::----|
|**armv7**|iPhone 4s, iPad3, iPad Mini1, ~iPod Touch5|32bit|
|armv7s|iPhone 5, iPhone 5C, iPad4|32bit, armv7 호환|
|**arm64**|iPhone 5S ~ iPhone X \[Max\], <br />iPad Air1 ~ 2, iPad Pro1 ~ 2, ~iPad7, ~iPad Mini4<br />~iPad Touch7|64bit|
|arm64e|iPhone XR,  iPhone XS \[Max\], iPhon 11 \[Pro \[Max\]<br /> iPad Pro3, iPad Air3, iPad Mini5|64bit, arm64 호환|
|i386|32bit 기기에 대응하는 Simulator|32bit|
|x86_64|64bit 기기에 대응하는 Simulator, Mac|64bit|

# Universal binary (Fat binary)

![](https://user-images.githubusercontent.com/37871541/153685409-e02f06fc-b896-4bfd-a982-cccb7cb7811c.png)

 > 
 > 두 개 이상의 아키텍쳐를 지원하는 바이너리 파일(실행 파일)

 > 
 > 서로 다른 아키텍쳐로 빌드된 바이너리를 하나의 바이너리로 붙여 놓은 것 (concatenating)

* Xcode > Build Settings > Architectures > Build Active Architecture Only

해당 옵션을 키냐/끄냐에 따라 output되는 app의 아키텍쳐가 달라진다. 보통 Debug는 on, Release는 off이다. Debug는 보통 simulator, 특정 device 타겟으로만 빌드하고 사용하기 때문에 굳이 다른 아키텍쳐에 대해 빌드할 필요가 없다. 하지만 realease 시는 임의의 기기에 대응해야 하기 때문에, 여러개 아키텍쳐로 하나로 합쳐져 있는 실행파일을 만들어야 한다. 이런 렇게 여러 아키텍쳐를 대응하는 실행파일을 \*\*Universal binary(fat binary)\*\*라 한다.

````bash
# Simulator, Build Active Architecture Only : Yes 
$ file testFramework
testFramework: Mach-O 64-bit executable x86_64

# Simulator, Build Active Architecture Only, Apple Silicon Mac : Yes 
$ file testFramework
testFramework: Mach-O 64-bit executable arm64

# Simulator, Build Active Arhitecture Only : No
$ file testFramework
testFramework: Mach-O universal binary with 3 architectures: [x86_64:Mach-O 64-bit executable x86_64] [i386:Mach-O executable i386] [arm64:Mach-O 64-bit executable arm64]
testFramework (for architecture x86_64):     Mach-O 64-bit executable x86_64
testFramework (for architecture i386):       Mach-O executable i386
testFramework (for architecture arm64):      Mach-O 64-bit executable arm64

# Generic iOS Device, Build Active Architecture Only : No
$ file testFramework
testFramework: Mach-O universal binary with 2 architectures: [arm_v7:Mach-O executable arm_v7] [arm64:Mach-O 64-bit executable arm64]
testFramework (for architecture armv7):      Mach-O executable arm_v7
testFramework (for architecture arm64):      Mach-O 64-bit executable arm64
````

simulator를 없애니 i386 아키텍쳐가 사라졌다. 또 각각의 옵션에 따라 바이너리가 다르게 생성된 것을 확인할 수 있다.

# Universal Dynamic Framework

 > 
 > Universal binary (library) + Resources

이전에 apple에서의 Framework는 library에 resource가 합쳐진 형태라 했다. 마찬가지로 Universal Dynamic Framework 그렇게 생각할 수 있다. 그럼 Framework 배포는 어떤식으로 하는 걸까? 모든 기기에서 사용이 가능해야 할텐데, 모든 실행파일을 Universal binary로 만들어 배포하는 걸까? 그렇다.

````bash
$ cd RxSwift.framework
$ file RxSwift
RxSwift: Mach-O universal binary with 4 architectures: [i386:Mach-O dynamically linked shared library i386] [x86_64] [arm_v7] [arm64]
RxSwift (for architecture i386):        Mach-O dynamically linked shared library i386
RxSwift (for architecture x86_64):      Mach-O 64-bit dynamically linked shared library x86_64
RxSwift (for architecture armv7):       Mach-O dynamically linked shared library arm_v7
RxSwift (for architecture arm64):       Mach-O 64-bit dynamically linked shared library arm64
````

서드파티 중 유명한 RxSwift를 가져와서 확인해보면, Simulator를 위한 architecture와 iOS Device를 위한 architecture가 모두 포함되어 있음을 확인할 수 있다.

# App Store Connect Upload Error

그럼 저 상태로 app store에 올리면 어떻게 될까?

 > 
 > "Unsupported Architecture. Your executable contains unsupported architecture '\[x86_64, i386\]'." 

ㅠㅠ 저 아키텍쳐에 대한 것을 제거해주어야 한다. 이런 것은 **Strip**이라 한다. Framework에서 필요없는 아키텍쳐를 지우고 다시 합치는 과정을 말한다.

## `lipo` command

````
$ man lipo
---
NAME
       lipo - create or operate on universal files

SYNOPSIS
       lipo input_file command [option...]

DESCRIPTION
       The  lipo  tool  creates or operates on ``universal'' (multi-architecture) files. Generally, lipo reads a single input file and writes to a single output file,
       although some commands and options accept multiple input files.  lipo will only ever write to a single output file, and  input  files  are  never  modified  in
       place.
````

````bash
# 필요한 architecture들만 추출
$ lipo -extract armv7 RxSwift -o RxSwift_armv7
$ lipo -extract arm64 RxSwift -o RxSwift_arm64
# 분리한 binary 합치기
$ lipo -o RxSwift-merged -create RxSwift_armv7 RxSwift_arm64
# 잘 strip되었는지 확인
$ lipo -info RxSwift-merged
Architectures in the fat file: RxSwift-merged are: armv7 arm64
# 정리
$ rm RxSwift_arm* 
$ mv RxSwift-merged RxSwift
````

# Reference

* [stackoverflow - Submit to App Store issues: Unsupported Architecture x86](https://stackoverflow.com/questions/30547283/submit-to-app-store-issues-unsupported-architecture-x86)
* [hmac - duplicate symbol 이슈](https://oss.navercorp.com/api-gateway/api-gateway-hmac/issues/29)
* [Framework Programming Guide](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Frameworks.html)
* [Comparison of executable file formats - wikipedia](https://en.wikipedia.org/wiki/Comparison_of_executable_file_formats)
* [Optimizing App Startup Time (WWDC16)](https://developer.apple.com/videos/play/wwdc2016/406/)
* [stackoverflow - Submit to App Store issues: Unsupported Architecture x86](https://stackoverflow.com/questions/30547283/submit-to-app-store-issues-unsupported-architecture-x86)
* [Comparison of executable file formats - wikipedia](https://en.wikipedia.org/wiki/Comparison_of_executable_file_formats)
