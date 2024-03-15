---
title: DerivedData
thumbnail: ''
draft: false
tags:
- xcode
- ios
- DerivedData
created: 2023-10-02
---

DerivedData를 맨날 지우라는데 이녀석이 뭔지 간단하게 알아보자.

# DerivedData

빌드가 안되어 오류를 Google에 쳐보면 StackOverflow에서 "Clean DerivedData" 하라는 말이 많다. 이녀석은 도대체 무엇일까.

![](XcodeProject_23_DerivedData_0.png)

일단 이 친구는 `~/Library/Developer/Xcode/DerivedData` 여기에 기본적으로 위치해 있다. finder에서 `이동 > 폴더로 이동...`에서 바로 접근가능하다. 해당 위치는 Preference > Locations에서도 확인 가능하다.

DerivedData는 Xcode가 Build 중간 과정, index 등을 저장하는 위치이다. 그래서 중간에 파일의 구조가 변경되거나 하면 빌드 문제가 발생할 수 있다. 프로젝트가 복잡할 수록 이런 경향은 더 많아진다.

Jenkins와 관련되서 CI 작업을 수행할 때 문제가 많이 발생하는 듯 하다. 추후 CI 관련 작업을 할 때, 보완하여 정리하면 좋을 듯 하다. 자세한 내용은 참고를 확인하자.

# Reference

* [Xcode Derived Data](https://mgrebenets.github.io/mobile%20ci/2015/02/01/xcode-derived-data)
