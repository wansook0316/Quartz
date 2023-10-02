---
title: Bundle Structure
thumbnail: ''
draft: false
tags: null
created: 2023-10-02
---

공식 문서를 읽어보면서, Bundle 구조에 대해서 알아보자.

# Application Bundle로 이동하는 파일들

어떤 파일들이 Application Bundle로 이동할까?

|파일|설명|
|------|------|
|`info.plist`|configuration 정보를 포함하는 구조화된 파일, 시스템은 이 파일에 의존해서 Application과 관련 파일에 대한 정보를 식별한다.|
|executable file|컴파일된 실행 파일|
|Resources|실행 파일 외부에 있는 데이터 파일 <br> image, icon, sound, nib, configuration, string(localization `lproj`), data 등|
|Others|private framework, plugin, document templates|

## iOS Application Bundle Structure

위의 표는 정말 간단하게 macOS, iOS 공통으로 이루어지는 작업이다. 이번에는 iOS에 국한해서 알아보자.

![](XcodeProject_02_Bundle_Structure_0.png)

|파일|설명|
|------|------|
|test|실행파일|
|icons|앱 아이콘과 같은 아이콘들. 꼭 있어야 한다.|
|info.plist|Bundle Id, Version Number, Display Name과 같은 App의 Configuration을 담고 있다. 필수.|
|Launch Images|앱이 시작할 때 interface를 담당하는 이미지다. 위의 사진에는 없다. 기본은 검은 화면이다.|
|nib, storyboard|로드하여 런타임에 사용할 수 있다.|

# Reference

* [Bundle Resources](https://developer.apple.com/documentation/bundleresources)
* [Implementing an iOS Settings Bundle](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/UserDefaults/Preferences/Preferences.html#//apple_ref/doc/uid/10000059i-CH6-SW14)
* [Package, Bundle, NSBundle](https://hcn1519.github.io/articles/2018-12/bundle)
* [NSBundle](https://developer.apple.com/documentation/foundation/nsbundle)
* [Bundle Programming Guide](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFBundles/AboutBundles/AboutBundles.html#//apple_ref/doc/uid/10000123i-CH100-SW1)
* [Bundle Structures](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFBundles/BundleTypes/BundleTypes.html#//apple_ref/doc/uid/10000123i-CH101-SW1)
