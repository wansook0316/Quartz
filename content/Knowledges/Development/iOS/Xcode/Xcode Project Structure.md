---
title: Xcode Project Structure
thumbnail: ''
draft: false
tags:
- xcode
- ios
- project-structure
- pbxproj
created: 2023-10-02
---

내가 기존에 만들었던 강아지 밥주는 앱(DogFood ...)를 기준으로 설명해보겠다.

![](XcodeProject_17_Xcode_Project_Structure_0.png)

# PROJECT_FILE_NAME.xcodeproj

![](XcodeProject_17_Xcode_Project_Structure_1.png)

이녀석의 정체는 파일이 아니다. 디렉토리다! 우클릭후 "패키지 내용보기"로 내부를 확인할 수 있다.

![](XcodeProject_17_Xcode_Project_Structure_2.png)

들어가게 되면, 3개의 파일이 보인다. 각각 알아보자

모종의 이유로 다음과 같은 순서로 설명하겠다.

1. xcuserdata
1. project.pbxproj
1. project.xcworkspace

## xcuserdata

![](XcodeProject_17_Xcode_Project_Structure_3.png)

 > 
 > 프로젝트 자체에 크게 영향을 주지 않는 "개인 설정"을 담은 디렉토리

![](XcodeProject_17_Xcode_Project_Structure_4.png)

실제 내부를 보면, break point와 같은 것들이 들어가 있다.

## project.pbxproj

![](XcodeProject_17_Xcode_Project_Structure_5.png)

 > 
 > 프로젝트 내부 파일들의 Reference를 파일 유형에 따라 저장

* 보다보니 어디서 많이 보던 친구다.
* 협업시 conflict의 주범이다.
* 두 명 이상의 팀원이 **파일의 순서를 바꾸거나, 동시에 추가하거나** 등등의 행위를 했을 경우 충돌날 수 있다.
* 자신이 한 작업만 잘 merge하거나, 서로 얘기하고 적용하는 방법을 취해야 한다.

## project.xcworkspace

![](XcodeProject_17_Xcode_Project_Structure_6.png)

얘도 디렉토리다!

![](XcodeProject_17_Xcode_Project_Structure_7.png)

들어가보니, 또 이상한 녀석들이 있다. 하나씩 알아보자.

### xcuserdata

![](XcodeProject_17_Xcode_Project_Structure_8.png)

내부를 보니, 위에 최상위 폴더에서 보았던 `xcuserdata`와 같다.

### xcshareddata

![](XcodeProject_17_Xcode_Project_Structure_9.png)

 > 
 > workspace에 공유된 설정을 담은 디렉토리

### contents.xcworkspacedata

![](XcodeProject_17_Xcode_Project_Structure_10.png)

 > 
 > 프로젝트의 Reference를 저장하고 있는 파일

이 프로젝트는 단순한 프로젝트라 프로젝트가 연결되어 있지 않다. 하지만..

![](XcodeProject_17_Xcode_Project_Structure_11.png)

거대한 프로젝트의 경우, 모듈화를 통해 프로젝트를 나누고, 그 프로젝트들을 한 프로젝트에 다시 엮어서 관리하는 경우가 있다. 이런 경우는 위와 같이 상당히 파일이 방대해진다는 것을 알 수 있다.

# PROJECT_FILE_NAME.xcworkspace

![](XcodeProject_17_Xcode_Project_Structure_12.png)

이녀석도 디렉토리다!

![](XcodeProject_17_Xcode_Project_Structure_13.png)

어? 그런데 상당히 익숙한 화면이다. 위에 있는 `PROJECT_FILE_NAME.xcproject` 내부의 `project.xcworkspace`와 똑같이 생겼다.

그런데, 실제 `contents.scworkspacedata` 를 들어가보면 약간 다르다.

![](XcodeProject_17_Xcode_Project_Structure_14.png)

위의 `project.xcworkspacedata/contents.xcworkspacedata` 의 경우와 다르게 생겼다.

지금 설명하는 `PROJECT_FILE_NAME.xcworkspace`의 경우, `cocoaPods`가 생성해주기 때문에 다른 contents 내역을 가진다. 실제로 보면, Pods 프로젝트가 연결되어 있음을 확인할 수 있다.

CocoaPods의 `pod install`을 하면, 이 `.xcworkspace` 가 생성되는 것이다! 즉, 본래 프로젝트와 별도로 Project를 만들어서 라이브러리 의존성을 관리할 수 있도록 해주는 것. 결과적으로 내가 만든 Project, Pod Project를 엮어 `contents`에 적어두고, `PROJECT_NAME.xcworkspace`로 관리하라는 것. 그래서 cocoaPods를 사용하면 `.xcworkspace`로 작업해야 하는 것이다.

# Reference

* [Xcode 프로젝트 파일](https://hcn1519.github.io/articles/2018-06/xcodeconfiguration)
* [\[iOS - swift\] 프로젝트 개념 (xcodeproj / project.pbxproj / xcuserdata / .xcworkspace / contents.xcworkspacedata / Target / Scheme](https://ios-development.tistory.com/406?category=889410)
* [Xcode Project](https://developer.apple.com/library/archive/featuredarticles/XcodeConcepts/Concept-Projects.html#//apple_ref/doc/uid/TP40009328-CH5-SW1)
