---
title: Bundle
thumbnail: ''
draft: false
tags:
- swift
- xcode
- ios
- Bundle
- NSBundle
created: 2023-10-02
---

# Bundle

 > 
 > 실행 가능한 코드(executble code) + 리소스 (Resources)를 가진 계층

어떻게 보면 이 개념은 개발자를 위한 개념이다. 결국 Package내부는 Bundle과 같이 구성되어 있다. 단지, 어떤 사람을 위해서인가 (일반 사용자, 개발자)에 따라 해당 본질이 다른 단어로 불린다고 생각하면 좋을 것 같다. `package`라는 단어는 일반 사용자 사용, finder를 속이기 위함이라는 목적성을 가진 단어이고, Bundle은 개발자가 코드를 감싸는 단위로 불리운다.

가장 흔한 예로 Application을 만든다고 생각해보면, 최종 프로덕트는 우리의 소스코드가 컴파일되어 실행 파일로 만들어지고, 그 실행 파일이 가져다가 사용하는 리소스들로 구성된다. 그래서 Application은 `Package`이자 `Bundle`의 한 예이다. 대부분의 `Bundle`은 `Package`의 일종이지만, 모두 그렇지는 않다. `Framework`의 경우에는 런타임 사용 혹은 링크를 목적으로 사용되는 단일 번들이지만, 내부 디렉토리를 볼 수 없도록 막아둔 단일 패키지는 아니다. (저 위에 있는 .framework는 실제 제품으로 빼는 경우라 다름, Product의 일종임. 여기서 말하는 것은 논리적인 개념인 듯)

`Bundle`의 구조는 각각의 유형에 따라 달라진다. 다음 글에서 알아보도록 하자.

## Bundle Display Names

맥북을 사서 한글로 언어 설정을 하고 써보고, 영어로 언어 설정을 하고 써보았다. 그러면, 같은 앱이라도 표현되는 언어가 달라지는 것을 볼 수 있다. 이렇게 언어에 상관없이 Finder에 나타나는 방식을 변경할 수 있는데, 그 기능을 가능케 하는 것이 `Bundle Display Names`이다.

![](XcodeProject_01_Package_Bundle_1.png)

Finder는 이렇게 Bundle이 `.app`인 경우 확장자를 숨긴다. 또한 만약 `localized display names`를 가질 경우, 현재 언어 설정과 일치하는 이름을 표시한다.

## Advantages

실행 파일과 리소스가 묶인 단위로서 작동하기 때문에, 해당 디렉토리를 옮기는 것 만으로도 설치 및 재배치, 제거가 가능하다. 그래서 맥의 경우 드래깅해서 설치하는 것을 많이 보았을 것이다.

또 묶음 단위로 작용하기 때문에 사용자 수정의 영향을 덜 받는다. 이는 `Bundle`이자 `Package`인 Application에 관한 설명인 것 같다.

Bundle로 묶이게 되면서 다양한 CPU 아키텍쳐와 주소 공간 요구사항을 맞출 수 있다. 추후에 알아보겠지만 실제로 Apple은 AppStore에서 BitCode를 기반으로 다양한 디바이스에 최적화된 Bundle(여기서는 .ipa)을 만든다. ([App Thinning](https://velog.io/@wansook0316/App-Slicing))

# NSBundle

 > 
 > 디스크에 있는 Bundle directory의 Resource와 Code에 대한 표현

즉, `Bundle`에 쉽게 접근할 수 있도록 제공되는 객체이다. 생각을 해보자. 일단 `Bundle`은 유형에 따라 구조가 다르다고 했다. 그럼 이렇게 `Bundle`로 제공되는 것에 접근해서 작업을 하려면 상당히 복잡할 것이다. 이런 부분을 `NSBundle`이 해결해준다.

`NS` 키워드를 보면 알겠지만 Objective C로 만들어진 Foundation Class이다. 그럼 Objective C에서만 쓸 수 있나? 그렇다. Swift도 이를 지원하는 객체가 있다. 그런데 문제는 여기서 발생한다. 이녀석의 이름이 바뀌었다는 것이다!!!! swift 3부터!

# Bundle (Swift)

ㅠㅠ 하필 이름이 헷갈리게 똑같이 바뀌어 버렸다.. 여튼, `Bundle`은 다음과 같은 목적으로 사용된다.

1. 특정 Bundle 디렉토리를 위한 NSBundle 객체 사용(ex: main bundle)
1. NSBundle의 메소드를 통해 필요한 리소스를 저장하거나 불러오기(ex: Bundle.main.url(resource:extension:))
1. 다른 시스템 API와 리소스를 통한 인터렉션

잘 와닿지 않지만, 사실 우리가 image에서 이미지를 `init(named:)`로 가져오는 행위가 `Bundle`로 가져오는 거다. 물론 명시적으로 Bundle을 사용하지는 않았지만. 결국 내부 Asset Catalog라는 번들에서 가져오는 거니까.

## Main Bundle

 > 
 > 현재 실행중인 코드가 포함하는 Bundle directory에 접근할 수 있게 도와주는 bundle

말이 참 이상하다.. 앞의 경우 directory의 의미를 가지고, 뒤의 경우 code level에서 제공하는 API라 이해하면 되겠다. 보통은 이러한 용도로 `Bundle`을 많이 사용하게 될 것이다.

````swift
open class Bundle : NSObject {
    /* Methods for creating or retrieving bundle instances. */
    open class var main: Bundle { get }
}

// Usage
Bundle.main
````

## Usage Of Main Bundle

그럼 일단 Bundle을 사용하기 위해서는 내 프로젝트에 Resource를 넣어야 할 것이다. 이전에도 말했지만, image 같은 것은 이미 알게모르게 Bundle을 사용하고 있다고 했다. 그럼 Resource중에 아주 흔하게 사용하는 image부터 추가해보자.

![](XcodeProject_01_Package_Bundle_2.png)

이미지를 드래그해서 프로젝트에 올려두면 다음과 같은 창이 뜬다. 확인을 누르게 되면 프로젝트에 리소스가 추가되었고, 앱 전역에서 Main Bundle을 통해 이미지에 접근할 수 있다.

````swift
Bundle.main.url(forResource: "imageName", withExtension: ".png")
````

## Main Bundle이 가리키는 위치

그냥 사용하기 보다는, `Bundle.main`이라는 녀석이 정말 내 Bundle(or Package.. 디게 헷갈리네)를 가리키고 있는지 확인해보자! `Bundle.main.bundleURL`을 출력하면 알아볼 수 있다. 출력하게 되면 현재 실행하고 있는 시뮬레이터의 Hash String의 폴더 내부를 가리키고 있다는 것을 알 수 있다. 해당 String은 다음 경로에서 확인 가능하다.

* Xcode -> Window -> Devices and Simulator -> 빌드한 기기 클릭 -> identifier

````
/Users/userName/Library/Developer/CoreSimulator/Devices/...Hash String.../data/Containers/Bundle/Application/...Application Hash.../test.app
````

![](XcodeProject_01_Package_Bundle_3.png)

![](XcodeProject_01_Package_Bundle_4.png)

찾았다 요놈! 결국 Main Bundle은 내가 실행하고 있는 Target Bundle을 가리키고 있었다. 여기서 최종적으로 생성된 `test.app`은 `Package`이자 `Bundle`인 디렉토리이다.

## Copy Resources To Bundle

그럼 이제 알았다. "아 프로젝트에 각종 리소스를 다 때려넣고, 이걸가지고서 최종 프로덕트를 만들어 내는 거구나!" 맞다. 그러면 Resources들은 언제 Bundle화 될까? 답은 Build할 때이다.

![](XcodeProject_01_Package_Bundle_5.png)

Build Phase에 가면, `Copy Bundle Resources`라는 탭이 있다. 여길 보면, 내가 방금 추가한 이미지의 주소가 Reference되어 있는걸 확인할 수 있다. 보면 Launch Screen하고 Asset Catalog 등등이 들어 있다. 응? Storyboard도 Resource인가? 이건 다음 글에 알아보자..

그럼 반대로 말하면, 여기에 추가가 안되어 있으면 Project Navigator(왼쪽 파일들 나열된 거)에 추가되어 있어도 Bundle화가 안된다는 얘기인가? 그렇다. 그래서 접근했을 때 값이 `nil`이 뜨게 된다.

## Main Bundle Sub Directory

![](XcodeProject_01_Package_Bundle_6.png)

만약에 image를 방금 나같은 방식으로 그냥 최상위에 추가하지 않고, 폴더로 묶인 위와 같은 친구를 추가했다고 생각해보자.

![](XcodeProject_01_Package_Bundle_7.png)

그 다음에 이 그룹안에 있는 리소스에 접근해야 한다고 생각해서 다음과 같은 API를 활용했다.

````swift
Bundle.main.url(forResource: "wired_egg", withExtension: "jpg", subdirectory: "groupName", localization: nil)
````

![](XcodeProject_01_Package_Bundle_8.png)

하지만 아무것도 뜨지 않았다. 오히려 폴더가 다 풀려서 Bundle에 들어가 있었다! 해당 코드는 `nil`을 리턴했다.

![](XcodeProject_01_Package_Bundle_9.png)

리소스 파일이 어떻게 들어가는지 보았더니 다 풀려서 들어갔다! 내가 원하는 건 이게 아니다.

![](XcodeProject_01_Package_Bundle_10.png)

이럴 때, Create Group 옵션 말고, Create Folder Reference 옵션을 선택하면 된다.

![](XcodeProject_01_Package_Bundle_11.png)

그럼 폴더 채로 들어가면서, Reference로 Copy Bundle Resources에 들어간다.

![](XcodeProject_01_Package_Bundle_12.png)

패키지 폴더에도 내 자식들이 예쁘게 들어갔다. 

# Reference

* [Bundle Resources](https://developer.apple.com/documentation/bundleresources)
* [Implementing an iOS Settings Bundle](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/UserDefaults/Preferences/Preferences.html#//apple_ref/doc/uid/10000059i-CH6-SW14)
* [Package, Bundle, NSBundle](https://hcn1519.github.io/articles/2018-12/bundle)
* [NSBundle](https://developer.apple.com/documentation/foundation/nsbundle)
* [Bundle Programming Guide](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFBundles/AboutBundles/AboutBundles.html#//apple_ref/doc/uid/10000123i-CH100-SW1)
* [Bundle Structures](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFBundles/BundleTypes/BundleTypes.html#//apple_ref/doc/uid/10000123i-CH101-SW1)
* [Bundle](https://developer.apple.com/documentation/foundation/bundle)
