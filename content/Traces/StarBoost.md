---
title: StarBoost
thumbnail: ''
draft: false
tags:
- boost-camp
- ios
- branch
- git
- DiffableDataSource
- CoreML
- AVFoundation
- CoreData
- UserDefaults
- UIScrollView
created: 2023-10-04
---

![](138390954-265e778e-21dc-4435-878c-cf609668783b.gif)

# 설명

* 실제 동작하는 스타벅스 앱을 클론 코딩하였습니다.
* 처음으로 팀플을 진행했으며, commit convention, 브랜치 전략등을 사용해보았습니다.

# 동작 화면

![](138390954-265e778e-21dc-4435-878c-cf609668783b.gif)

# Branch Strategy

![](Pasted%20image%2020231004194900.jpg)

* S03A forked branch에 feature 별로 나뉜 변경 사항을 Merge
* Conflict 해결 후, Remote에 PR을 보내는 방식으로 진행
* 이 때, Branch를 생성할 때, namespace를 Scene 단위로 작업하여 branch의 분리를 용이하게 하고자 함

# Code Structure

* VIPER 구조를 사용하는 것을 첫번째 주의 도전과제로 정했습니다.
* Repository 패턴을 사용하여 사용자의 과금을 신경썼습니다.
* 또한 API가 복잡하여 요청까지의 결과가 오래걸린다는 점을 감안하여 빠른 반응성을 위해 Core Data를 사용하였습니다.
* 또한 최대한 외부라이브러리를 사용하지 않고 구현하는 것에 목적두었습니다.
  ![](138298478-8b544602-93f5-4343-9f4f-83fca612d3e7.jpg)

# 폴더 구조

![](138298963-f1e673ca-c073-4bf7-9183-e51815904a9f.jpg)

* 씬 별로 폴더를 나누어서 관리하였습니다.
* 하지만, 씬마다 네트워크 통신이나 저장하는 방식이 달라지지 않는 문제가 발생하여 나중에는 중복된 코드를 저장하는 공간을 마련해야 했습니다.
* 이렇게 장면별로 폴더를 나누어 관리하기 보다는, 전체적인 앱의 흐름을 기반으로 레이어를 나누어서 관리한느 것이 효율적이라는 생각을 했습니다.

## Event Scene

* 24시간 이후 이벤트 클릭시 이벤트 화면 뜨도록
* UserDefault에 값을 저장하고, 이를 추적함
* 화면 Layout 변경에 대응
  ![](137333256-ce5f71fe-a221-4445-abe6-dd9c43569735.gif)

## Home Scene

* 사용 기술
  * UICompositionalLayout
  * DiffableDataSource
* 홈화면에 표시할 데이터를 불러와 화면에 표시함
* 특정 section에 대하여 수직 스크롤 가능하도록 구현
* 상품 터치시 상세화면으로 이동
* What's New 버튼 탭시 화면으로 이동

![](137334761-8afe76fd-2ffb-4220-872f-3514bdd37336.gif)

## WhatsNewScene

* 신제품 소식 표시
* compositional layout을 사용하여 가로 화면으로 볼 수있도록 함
  ![](137334761-8afe76fd-2ffb-4220-872f-3514bdd37336%20(1).gif)
  ![](138391435-f23dab54-65d9-4c2b-86f1-d0a8a333ca30%20(1).gif)

## Payment Scene

![](138294072-4acefd71-88e1-44e6-a996-ea90f1e73676.gif)

* 랜덤으로 바코드 생성하여 화면에 표시
* 화면 진입시 3분 카운트다운후 유효기간이 만료되었음을 알리고 바코드색깔을 옅게 처리
* 실기기에서 사용시 money 버튼 터치시 카메라 실행
* 사진촬영시 지폐를 인식하여 화면에 띄움
* 1000원 마다 동전이 컵에 들어가는 애니메이션 재생
* 사용 기술
  * CoreAnimation
  * CoreML
  * Vison
  * AVFoundation

## Order Scene

![](138292530-f85959d6-103d-4669-b05d-0186bc430e27.gif)

* 음료, 푸드, 상품 탭별로 카테고리 표시 (예: 콜드브루, 머그컵 등)
* 상단의 검색창으로 카테고리 필터링 가능
* 카테고리 탭시 해당 카테고리내의 상품들을 표시
* 커스텀 SegmentedControll
* 사용 기술
  * DiffableDataSource
  * UICompositionalLayout

## Category Scene

![](138292873-1261d79d-ce65-4a62-85e7-41f024747524.gif)

* 카테고리내의 상품들을 표시
* 상품 선택시 상세 화면으로 이동
* 원래는 코어데이터에 저장하지 않고 네트워크 요청만으로 처리하고 싶었으나 반응성 문제때문에 코어데이터에 저장하고 로드하는 방식으로 변경
* 사용 기술
  * DiffableDataSource
  * UICompositionalLayout
  * CoreData

## Detail Scene

![](138293001-347a2e4d-d2a5-4ed7-a112-1c22a9aba0e8.gif)

* 최대한 스타벅스 앱과 비슷한 UI를 가지도록 구현
* 스크롤뷰의 contentOffset.y 와 이미지뷰의 topConstraint를 활용하여 스크롤시 이미지가 같이 올라가도록 구현
* 특정위치까지 스크롤을 내렸을때 NavigationBar를 스타벅스 앱처럼 하고 싶었으나 구현실패
* navigationController.navigationBar.barTintColor 를 변경할 수 없었음. + 다른 여러가지 문제
* 하트 누를시 CoreData의 해당 아이템의 favorite bool값을 변경
* 주문하기 누를시 1초후 로컬 푸시알림이 옴 (앱 최초실행시 권한 설정 alert 띄움)
* 사용 기술
  * DiffableDataSource
  * UICompositionalLayout
  * CoreData

## Favorite Scene

![](138293310-ee99fcb7-4f76-4c26-9e39-4d07522179b2.gif)

* CoreData의 상품중 favorite bool값이 true 인 것만 표시
* 하트, 주문하기 버튼 상세화면과 동일하게 동작. (+ 하트 터치시 바로 목록에서 제거)

# 문제 상황

* 상세화면을 실제 앱과 똑같이 구현하는것이 어려웠음
  
  * ScrollView vs CollectionView
  
  * NavigationBar 알파, 색상 조절
  
  * scrollView offset에 따른 이미지 위치 조정
  
  * 디테일 화면.. 도대체 어떻게 구현할 수 있을까
    ![](138300793-cdea2a16-715e-49e1-ae1c-3881b3334a74.gif)
    
    * 문제1: 상세화면 뷰가 전부 내려와 있을때는 바운스동작을 하면서도 스크롤을 올릴때는 사진과 같이 올라갑니다. 저희는 스크롤뷰의 오프셋을 사진의 topConstraint와 동기화 하는식으로 구현했습니다.
    * 문제2: 네비게이션 바가 사진의 중간정도를 넘어가게되면, alpha가 변하면서 기존의 색으로 돌아옵니다. 그래서 navigation Bar의 titleView와 barTintColor의 alpha 값을 변경하는 방식으로 구현하려 했습니다. 그런데, titleView는 적용이 되지만, barTintcolor는 적용이 되지 않았습니다. `navigationController.navigationBar.barTintColor = Color..` stackoverflow에 barTintcolor not working이라 쳤더니, 생각보다 많은 분들이 에러라 하는걸 보았습니다.
    * 문제3: 실제 스타벅스앱을 켜서 상세화면을 킨다음, 네비게이션 바가 있어야만 할곳부터 스크롤을 하면 스크롤이 됩니다. 하지만, 실제로 저희가 만들어보았을 때는, VC의 View가 Navigation Controller의 하위에 위치하게 되어, 스크롤이 불가했습니다.
    다른 부분보다 가장 어려웠던 부분이 이 세부화면이었던 것 같습니다. 읽어 주셔서 감사합니다!

* API가 불친절해서 힘들었음
  
  * 그에따른 비효율적 구조 발생
* 폴더 구조가 씬별로 되어 있어, 후반부에 중복되는 코드가 발생
  
  * 레이어 별로 관리하는 것이 효율적이라 생각함
* Core 데이터 저장, 불러오기가 비동기 처리라 콜백함수가 필요했음
  
  * 꼭 기억해야 할 부분

# Framework

* [SwiftLint](https://github.com/realm/SwiftLint)
* [SnapKit](https://github.com/SnapKit/SnapKit)

# Template Generator

* \[iOS-VIPER-Xcode-Templates\](
* https://github.com/infinum/iOS-VIPER-Xcode-Templates)
