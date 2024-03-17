---
title: Alfred Workflow
thumbnail: ''
draft: false
tags:
- Alfred
- workflow
- mac
created: 2023-09-30
---

답답한 걸 싫어하는 내게 속도가 나지 않는다는 것은 정말 곤욕이다. 내가 자주 사용하는 Alfred Workflow를 공유해본다.

![](Productibility_02_AlfredWorkflow_0.png)

# Markdown Table

![](Productibility_02_AlfredWorkflow_1.png)

블로그글을 쓰거나, 기록을 해야 할 때, table만큼 좋은 게 없다. 그런데 markdown으로 쓰다보면 이걸 만드는게 여간 귀찮은게 아니다. 이녀석이 해결해준다.

````
table {colume number} {row number}
````

# AppDelete

![](Productibility_02_AlfredWorkflow_2.png)

mac은 app 지울 때, 상당히 귀찮다. 물론 application가서 휴지통 넣으면 되는데 상당히 귀찮다. 다음과 같이 지울 수 있다.

````
uninstall xcode
````

# Chrome, Whale, Safari window

![](Productibility_02_AlfredWorkflow_3.png)
![](Productibility_02_AlfredWorkflow_4.png)
![](Productibility_02_AlfredWorkflow_5.png)

키보드로 업무를 많이 하다보니, 순간적으로 웹 화면을 켜고 싶은데, 이걸 일일히 눌러서 켜는게 너무 귀찮다. 총 3개의 웹을 사용하는데 각각 매핑해놓고 쓰면 상당히 편하다. 화면 띄우고 command + L을 누르면 주소창에 커서로 바로 가서 사용이 가능하다.

# Egg timer

![](Productibility_02_AlfredWorkflow_6.png)

급하게 타이머나 알람을 킬 때 사용한다. timer, alarm 등의 명령어로 빠르게 설정이 가능하다.

# Emoji search

![](Productibility_02_AlfredWorkflow_7.png)

정말 많이 사용하는 기능ㅇ다. mac에서는 정말 찾는게 속도가 떨어지는데, 여기서 sad, happy, thumbs up과 같이 검색하여 사용하면 매우 빠르다.

# gitIgnore

![](Productibility_02_AlfredWorkflow_8.png)
![](Productibility_02_AlfredWorkflow_9.png)

이것도 정말 좋다. 저장소 만들 때 보면 넣지 않아서 우베에서 검색하고 복사해서 다시 넣는데, 이거는 한방에 가능하다. 원하는 것ㅅ들을 공백 기준으로 나열하고 clipboard에 복사하면 끝이다!

# HTTP Status Codes

![](Productibility_02_AlfredWorkflow_10.png)
![](Productibility_02_AlfredWorkflow_11.png)

http code는 항상 헷갈린다. 그 때마다 구글에 치기보다 바로바로 쳐서 확인하자. 엔터까지 치면 웹에 검색까지 해준다!

# iCloud Passwords

![](Productibility_02_AlfredWorkflow_12.png)

비밀번호를 까먹을 때가 많다. 보통 iCloud를 켜놓고 여기에서 관리하게 되는데, 바로 접근가능하게 해주는 workflow다. 비밀번호 찾기 보다 여기서 검색해서 가져와서 사용하자. 

# Kill Process

![](Productibility_02_AlfredWorkflow_13.png)

급하게 app을 강제종료하고 싶을 때가 있다. 보통 응답하지 않을 경우에 사용한다. command + option + esc 말고, 바로 지워버리자.

# Naver Search

![](Productibility_02_AlfredWorkflow_14.png)

![](Productibility_02_AlfredWorkflow_15.png)

이것도 개발할 때 많이 사용하는 것인데, 변수, 함수 이름 지을 때, 어떤 단어가 맞을지 확인해보는 용도로 많이 사용한다. 이거 확인하려고 웹창 띄우는게 싫었는데 참 좋다. 영어도 번역해준다!

# Power Thesaurus

![](Productibility_02_AlfredWorkflow_16.png)
![](Productibility_02_AlfredWorkflow_17.png)

또 많이 쓰는 녀석이 나왔다. 단어는 생각이 나는데, 느낌이 안살아서 유의어가 필요할 때, 아니면 반의어가 필요할 때 사용한다.

# Reminders

![](Productibility_02_AlfredWorkflow_18.png)

할일 관리를 나는 apple reminder로 활용한다. apple기기가 주변에 천지라서 로컬 앱을 사용하는 것이 좋더라. 깔끔하고. 근데 할일 추가할 때 급해죽겠는데 앱켜서 추가하는게 속도가 너무 떨어지더라.

이녀석을 사용하면 바로 적용이 가능하다. 기본 폴더를 설정해놓으면 거기로 들어가고, 명시하면 해당 list로 들어간다.

````
r today {work to do} in tech list
r tomorrow {work to do} 04/30
````

# Homebrew & cask for Alfred

![](Productibility_02_AlfredWorkflow_19.png)
![](Productibility_02_AlfredWorkflow_20.png)

homebrew는 linux와 mac OS를 위한 package manager이다. 무언가를 설치하려면 terminal 켜서 `brew ~` 식으로 설치해주어야 한다. App을 설치하는 명령어는 `cask` 이다. 마찬가지로 terminal로 입력해주어야 한다.

그런데 이녀석과 함께라면 바로 알프레드를 켜서 처리해버릴 수 있다! 때때로 유용하다.

# Screenshot to Yoink

이건 Yoink라는 앱이 있어야 가능한 기능이다. 스크린 샷을 찍으면 Yoink Bucket으로 바로 들어간다. 그래서 여러장을 한번에 직고 모아진 녀석들을 옮기면서 빠르게 작업이 가능하다.

# Epilogue

많은 workflow를 쓰면서 가장 많이 쓰는 녀석들만 모아봤다. 끝!

# Reference

* [Alfred Markdown Table](https://github.com/crispgm/alfred-markdown-table)
* [Alfred workflow: Open New Chrome Window](https://github.com/zhenleiji/AlfredOpenNewChromeWindow)
* [EggTimer 2](https://www.packal.org/workflow/eggtimer-2)
* [alfred-emoji](https://github.com/jsumners/alfred-emoji)
* [alfred-gitignore](https://github.com/jdno/alfred-gitignore)
* [alfred-http-status-codes](https://github.com/UpSync-Dev/alfred-http-status-codes)
* [alfred-icloud-passwords](https://github.com/leolabs/alfred-icloud-passwords)
* [alfred-process-killer](https://github.com/ngreenstein/alfred-process-killer)
* [alfnaversearch](https://github.com/Kuniz/alfnaversearch)
* [alfred-powerthesaurus](https://github.com/clarencecastillo/alfred-powerthesaurus)
* [alfred-reminders](https://github.com/surrealroad/alfred-reminders)
* [alfred-homebrew](https://github.com/fniephaus/alfred-homebrew)
* [screenshot-to-yoink](https://github.com/Irvel/screenshot-to-yoink)
