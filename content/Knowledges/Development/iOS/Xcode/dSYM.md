---
title: dSYM
thumbnail: ''
draft: false
tags:
- crash
- symbol
- debugging
- bitcode
- dSYM
- framework
created: 2023-10-02
---

앱스토어에서 크래시가 나서 Reject을 당하면 Crash Report를 함께 준다. 해당 파일을 열어보면 이상한 숫자들만 가득하다.

# dSYM

 > 
 > debug symbol file

App을 Release한 뒤에 Crash를 진단할 수 있게 도와주는 파일이다. Release 뒤에 Crash가 어디서 났는지 진단할 수 있으려면 binary를 기반으로 다시 source code line이 어디인지 알 수 있어야 한다. 해당 파일은 그 정보를 담고 있다.

우리가 앱을 빌드하면 최종적으로 binary file이 나온다. App Executable, frameworks, app extension 등 모두 binary로 output이 나온다. 이렇게 binary로 나오는 친구들은 모두 dSYM file을 가지고 있다. 즉, binary와 dSYM은 같은 Build UUID로 묶어서 다니는 친구들이다.

만약에 같은 source에서 두개의 binary를 만드는데 Xcode 버전이 다르거나, Build setting이 다른 경우, Build UUID가 다르게 된다. 그렇게 되면 dSYM도 달라지게 된다. 즉, 빌드에 따라 dSYM이 바뀌기 때문에, 내가 빌드한 product의 dSYM을 잘 관리하는 게 중요하다.

# 생성 방법

![](XcodeProject_12_dSYM_0.png)

 > 
 > Xcode -> Project -> Build Settings -> Build Options >‘DEBUG_INFORMATION_FORMAT’ -> ‘DWARF with dSYM File’

프로젝트를 처음으로 만들면 위와 같이 이미 Release의 경우 dSYM file을 만들도록 설정되어 있다.

# 확인 방법

````
Xcode > Preferences > Location > Archives
Xcode > Window > Organizer
~/Library/Developer/Xcode/Archives
````

결국 Archive 폴더에 가서, `xcarchive` 파일을 패키지 내용 보기로 열면 된다. 해당 폴더 안에 `dSYMs` 라는 폴더가 있을 것이다.

![](XcodeProject_12_dSYM_1.png)

# BitCode와 dSYM

![](XcodeProject_12_dSYM_2.png)

기존에는 완전히 컴파일된 실행파일과 dSYM 파일 모두를 AppStore에 올렸다. 그렇게 되니 파일이 두개라 아무래도 관리가 어려웠다. [이전 글](https://velog.io/@wansook0316/Bitcode)에서 BitCode에 대해서 배웠는데, 이 BitCode는 Intermediate Representation(IR), 즉 중간언어로서 다양한 Architecture에 맞는 실행파일을 만들기 위해 만들어졌다고 말했었다. 이 옵션을 켠다면, 그럼 dSYM 파일을 만드는 책임은 AppStore에서 해주면 되지 않을까?

![](XcodeProject_12_dSYM_3.png)

그게 맞다. 실제로 Organizer의 Archive에 들어가보면, dSYMs를 다운로드 받을 수 있다. 하지만 주의할 점이 있는데, 이렇게 Download를 하게 되면 최종 Product에서 필요한 dSYM을 받게 된다. 원하는 동작이다. 그런데 위에서 `.xcarchive`내부에서 dSYM을 확인할 수 있다 했는데, **이 dSYM과 AppStore dSYM은 다른 파일이다.**

잘 생각해보면 그 이유를 알 수 있다. BitCode로 만드는 과정도 Compile의 일종이기 때문에, 이에 대응되는 dSYM이 생성된다. 그리고 BitCode를 binary로 만들 때도 컴파일이니 생성된다. 가장 위에서 binary형태로 만드는 과정, 즉 컴파일과정에서 dSYM이 Pair로 같이 생성된다고 했기 때문에, bitcode를 만들때 발생하는 dSYM과 AppStore에서 binary를 만들때 발생하는 dSYM은 다른 파일이다. 이점을 기억해 두자.

# Framework와 dSYM

[Library](https://velog.io/@wansook0316/Library), [Framework](https://velog.io/@wansook0316/Framework)글을 읽고 왔다면, static library와 dynamic library의 차이는 알고 있을 것이라 생각한다. 

static library의 경우 app executable에 포함되기 때문에 해당 library의 dSYM은 생성되지 않는다. 반대로 dynamic library는 생성된다. dynamic library, 즉 framework는 binary framework로서 동작하기 때문에, 해당 framework자체가 하나의 product이다. 그렇기 때문에 dSYM이 생성되는 것이 당연하다.

# Crash Organizer

![](XcodeProject_12_dSYM_4.png)

Crash Organizer는 충돌 관련한 데이터를 확인할 수 있는 기능이다. 자세한 건 Reference의 WWDC2021 영상을 보도록 하자.

# 마무리

이제 dSYM 단어가 나와도 크게 쫄지 않고 문서를 읽을 수 있을 것 같다. 끝!

# Reference

* [Diagnosing Issues Using Crash Reports and Device Logs](https://developer.apple.com/documentation/xcode/diagnosing-issues-using-crash-reports-and-device-logs)
* [Building Your App to Include Debugging Information](https://developer.apple.com/documentation/xcode/building-your-app-to-include-debugging-information#Build-Your-App-With-Symbol-Information)
* [About Crashes organizer](https://help.apple.com/xcode/mac/current/#/dev861f46ea8)
* [\[Xcode\]dSYM 파일은 어디 있나요?](http://minsone.github.io/mac/ios/where-is-the-dsym-file-in-xcode)
* [iOS dSYM 이란 무엇인가](https://jjhyuk15.medium.com/ios-dsym-%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80-69516fa7ce99)
* [Triage TestFlight crashes in Xcode Organizer](https://developer.apple.com/videos/play/wwdc2021/10203/)
