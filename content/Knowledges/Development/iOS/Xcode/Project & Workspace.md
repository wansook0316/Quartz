---
title: Project & Workspace
thumbnail: ''
draft: false
tags:
- xcode
- project
- workspace
- ios
created: 2023-10-02
---

간단하게 프로젝트 내부를 탐험해보았다면, 각각의 제대로된 정의를 알아야 한다. 앞의 글에서 이어지니, 이해가 안되면 보고 오는 것이 좋다.

# Project

 > 
 > An Xcode project is a repository for all the files, resources, and information required to build one or more software products

 > 
 > Project는 Application을 빌드하기 위한 파일, 리소스, 정보를 담은 Repository이다.

처음 Single View application 생성하면, 프로젝트 파일이 생성된다. `PROJECT_NAME.xcodeproj` 파일이 바로 이것. 그런데 알아보았지만, 이녀석의 정체는 디렉토리였다.

* xcuserdata : project의 개인 설정 저장을 담은 디렉토리
* project.pbxproj : 프로젝트 내부 파일 Reference를 유형에 따라 기록한 파일
* project.xcworkspace : 여러개의 Project를 담아 관리하는 디렉토리

위와 같이 세개의 항목으로 구성되어 있었다. 

# Workspace

Workspace는 CocoaPods를 통해 접해봤을 것이다. 하지만 실제로 `PROJECT_NAME.scodeproj` 파일 안에도 해당 디렉토리가 있었다. cocoaPods로 `pod install`을 하는 행위가, workspace를 하나 만들어주는 행위라는 사실을 이해할 수 있었다. 해당 디렉토리 안에는 다음과 같은 것들이 있었다.

* contents.xcworkspacedata : 프로젝트들의 Reference 저장(xml)
* xcuserdata : workspace의 개인 설정을 담은 디렉토리
* xcshareddata : workspace에 공유된 설정을 담은 디렉토리

# Subproject

Xcode는 Workspace를 통해 여러개의 프로젝트를 다룰 수 있는 기능을 제공한다는 것을 알 수 있었다. 그런데 이 방법 말고, 프로젝트 내부에 Subproject를 생성하여 이를 관리할 수도 있다. 

예를 들어, 오픈 소스로 배포되는 라이브러리에서, 라이브러리의 코드가 담긴 Project와, 라이브러리를 사용하여 만든 예제 Project를 나누고 싶을 수 있는데, 이 때 Subproject로 예제 Project를 만들어 사용할 수 있다.

이 경우 Workspace로 가능하기는 하다. 하지만 차이점을 알고가는 것이 중요하다. Subproject는 이름에서도 알 수 있듯 `Sub`이기 때문에, 상위 Project와 부모-자식 관계가 형성된다. 부모는 자식 프로젝트에 대해 Reference를 가질 수 있지만, 자식은 부모에 접근이 불가하다.

반대로 Workspace의 경우, Project간 형제 관계가 형성된다. 그래서 어떤 프로젝트건 서로간의 Reference를 지닐 수 있다.

# Reference

* [Xcode 프로젝트 파일](https://hcn1519.github.io/articles/2018-06/xcodeconfiguration)
