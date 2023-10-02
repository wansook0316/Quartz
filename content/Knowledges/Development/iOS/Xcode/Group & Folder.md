---
title: Group & Folder
thumbnail: ''
draft: false
tags:
- xcode
- ios
- group
- folder
created: 2023-10-02
---

Xcode에 파일을 추가하다보면, Create groups, Create folder reference와 같은 선택지를 마주하게 된다. 이녀석의 의미는 무엇일까??

![](XcodeProject_24_CreateGroupCreateFolderRefs_0.png)

바로 이녀석이다.

# Create groups

* Finder에 폴더가 생긴다.
* 회색 아이콘이다.
* Group을 만들어준다.
* **Finder에서 프로젝트의 새로 생긴 폴더에 들어가 거기에 다른 파일들을 넣어도, Xcode Project에는 반영되지 않는다.**
* 대부분은 이 타입이다.
* 이렇게 하면, 그룹의 각 파일이 속해야 할 타겟을 선택할 수 있다.
* 또한 특정 파일이 프로젝트에 잘못 추가되는 것을 방지할 수 있다.

# Create folder references

* Finder에 폴더가 생긴다.
* 파랑 아이콘이다.
* 생긴 폴더에 파일을 추가하면 즉각 Xcode에 반영된다.
* 즉, 폴더와 완전이 1대1 매칭된다.
* 그렇기 때문에, Finder에서 파일을 지우거나, Project에서 지우면 양방향에 동시 반영된다.
* 별도 파일이 아닌, 전체 폴더에 대해서 타겟을 지정할 수 있다.

# Which One to Choose?

대부분은 Group을 사용하게 될 것이다. 하지만, 어떻게 동작하는지 알고 있다면, 프로젝트를 구성할 때 좀 더 좋은 판단을 할 수 있다. folder reference는 다음과 같은 상황에서 사용할 수 있다.

* 개발자 팀 외부의 누군가가, 해당 프로젝트에 Asset을 추가하는 경우.
  * reference로 해두면 폴더에 넣기만 해도 프로젝트에 바로 반영되어 쉽게 작업 가능하다.
* 빌드 프로세스 도중 Asset을 바꿔서 사용하는 경우. 
  * 예를 들어, 가장 최근에 발생한 파일을 사용해야 한다면, reference로 건 뒤 즉각적으로 반영하게 하면 좋다.

# Reference

* [Xcode: Groups And Folder References](https://thomashanning.com/xcode-groups-folder-references/)
