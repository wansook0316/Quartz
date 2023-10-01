---
title: Xcode Shortcuts
thumbnail: ''
draft: false
tags:
- xcode
- shortcuts
created: 2023-09-30
---

조금이라도 더 빠르게 Project file을 와리가리 하고 싶은 마음에 사용하는 단축키를 정리해본다. 언젠가는 까먹으니, 그때와서 봐야지. 이건 계속해서 업데이트하도록 하겠다.

# Shortcuts

|Option|Action|Shortcut|note|
|:----:|------|-------:|:--:|
|Xcode|Preference|⌘,||
|File|new > Project|⇧⌘N||
||new > Playground|⌥⇧⌘N||
||Add Files|⌥⌘A||
|View|Show/Hide Navigator|⌘0||
||Move Navigator Menu|⌘1~9||
||Show/Hide Inspector|⌘⌥0||
||Move Inspector Menu|⌘⌥1~4||
||Reveal in Project Navigator|⇧⌘J|파일 위치 파악|
||Reveal in Project Navigator|⇧⌘O|파일 바로 열기|
||(in code) Show Snippets|⇧⌘L|코드 창에서 Snippet 보여줌|
||(in storyboard) Show Library|⇧⌘L|UIKit Library 보여줌|
|Find|Find in workspace|⇧⌘F||
||Find Selected Symbol in workspace|⌃⇧⌘F|해당 변수를 사용하고 있는 찾아줌 (text가 아닌 symbol)|
||Find Call Hierachy|⌃⇧⌘H|해당 함수의 호출 계층을 보여줌|
||Find|⌘F||
||Find and Replace|⌥⌘F||
||Find Next|⌘G||
||Find Previous|⇧⌘G||
||Find and Select Next|⌥⌘G||
||Find and Select Previous|⌥⇧⌘G||
||Use Selection for Find|⌘E|navigator find 메뉴에 문자열 넣을 때 많이 씀|
||Use Selection For Replace|⇧⌘E|선택 부분 한번에 바꾸기|
|Folding|Fold|⌥⌘⇠||
||Unfold|⌥⌘⇢||
||Fold Methods & Functions|⌥⇧⌘⇠|특정 상위 스코프 안에 있는 method 모두 folding|
||Unfold Methods & Functions|⌥⇧⌘⇢||
||Fold Comment Blocks|⌃⇧⌘⇠||
||Unfold Comment Blocks|⌃⇧⌘⇢||
|Build, Execution|Build|⌘B||
||Clean build folder|⇧⌘K||
||Test|⌘U||
|Infomation|Show History|⇧⌘⌃A||
|Simulator|Screen Shot|⌘S||
||Record|⌘R|중단 후, 우측 하단에 나오는 영상에서 오른쪽 탭하면 gif 변환하여 저장 가능|
||Keyboard|⌘K||
||Rotate|⌘⬅||
||To Home|⌘⇧H||
||Shake|⌘⌃Z||
|Move|Move line up|⌥⌘\[||
||Move line down|⌥⌘\]||
||Back|⌃⌘⇠|뒤로 가기|
||Forward|⌃⌘⇢|앞으로 가기|
|Cursor|Multi cursor|⌥ + `drag`|Sublime text에서 ⌥⇧ + `drag`|
||Make cursor|⇧⌃ + `click`|Sublime text에서 ⌥  + `click`|
||Select Next Occurrence|⌥⌘E|Sublime text에서 ⌘D|
|Sorting|Re-indent|⌃I|코드 정렬해줌, 나는 키 매핑이 되어 있어 ⌥P로 설정함|
|Log|Clean Debug window|⌘K|디버그 창 모두 지우기|
|Debug|Console On/Off|⌘⇧Y|디버그 창 올리기/내리기|
||Debug On/Off|⌘Y|디버그 기능 On/Off|
||Next breakpoint|⌘⌃Y|다음 브레이크 포인트 넘어가기|
|New|New Editor|⌘⌃T|새로운 editor 생성|
||open current symbol in New editor|⌘⌃⌥ + Click|새 에디터에서 함수, 변수 보기|
|Edit|Edit all scope|⌘⌃E|지정 파일 한정 리네이밍|
|Source Control|Commit|⌘⌥C|커밋창 띄우기|

가끔가다가 vsc 기본설정으로 익힌 단축키들이 있는데, 여기도 있다. Preference -> Key Bindings -> Customize 하면 된다.

![](Productibility_03_XcodeShortcuts_0.png)

# Extra

## Extract Method

![](Productibility_03_XcodeShortcuts_1.png)

* 선택, 우클릭, `Refactor-Extract to method`

# Reference

* [Menu Command Shortcuts (By Menu)](https://developer.apple.com/library/archive/documentation/IDEs/Conceptual/xcode_help-command_shortcuts/MenuCommands/MenuCommands014.html)

# Update Log

* 22.04.22: initial draft
* 22.04.23: Move line, snippet 추가
* 22.04.26: Simulator Record 추가
* 22.05.11: Re-indent 추가
* 22.05.13: 뒤로가기, 앞으로 가기, 디버그 창 지우기 추가
* 22.05.16: 콘솔창 내리기/올리기, 디버그 on/off, next breakpoint
* 22.06.09: 에디터 창 새로 만들기 추가
* 23.06.27: 지정 파일 한정 리네이밍, extract method, test, commit
