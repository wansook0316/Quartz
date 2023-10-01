---
title: Quartz Publishing
thumbnail: ''
draft: false
tags:
- obsidian
- publishing
created: 2023-09-19
---

# 동기

* 다른 블로그 호스팅 서비스(Tistory, Velog)를 사용하면, 내가 온전히 관리하지 못한다는 측면에서 아쉬움이 있었다.
* Github Page를 Jekyll을 사용해 포스팅해보았지만, 1000개가 넘어가는 시점부터 너무 느려 사용하기가 꺼려졌다.
* 그 와중에 Obsidian을 알게 되었다.
* Obsidian은 내 로컬에 Markdown 형식으로 저장되면서 확장성이 높은 문서 관리 도구이다.
* 이에 블로그 전체를 Obsidian으로 옮기면서 나의 모든 것을 관리해보자는 목표를 세웠다.

# 필요 기능

* 문서의 Export 여부에 따라 올리거나, 그렇지 않거나 할 수 있어야 한다.
* UI가 깔끔해야 한다.
* Obsidian의 기능 자체를 어느정도 반영할 수 있어야 한다.
* 웹페이지에 올라간 이후 속도가 빨라야 한다.
* 모바일 대응이 되어야 한다.

# 도구

* [Quartz](Quartz)
  * Obsidian Markdown을 지원하는 [Static site generator](Static%20site%20generator.md)이다.
* obsidian-export
  * Obsidian안에 폴더 공개 여부를 설정해두고, 이를 바깥으로 내보낼 수 있는 도구이다.

# 개요

````mermaid
flowchart LR
A[Obsidian] --> B;
B{obsidien-export \n Publishing할 내용인가?} --> |Yes 복사 O| C;
B --> |No 복사 X| D;
C[Quartz] --> |push| E;
D[현상 유지];
E[Github repo \n forked Quartz] --> |Github Action| F;
F[HTML \n using Hugo] --> G;
G[Github Pages];

````

![](Screen%20Shot%202023-09-15%20at%2012.52.33%20PM.png)

* iCloud에 Obsidian Vault를 만든다.
* Vault가 생성된 같은 폴더에 fork한 Quartz를 clone한다.
* Obsidian으로 글을 작성한다.
* 특정 시점에 Quartz에서 sync 메서드를 통해 Publish 저장소와 동기화하여 글을 출간한다.
  * 이 때, 원하는 글만 추출한다. (obsidian-export)

# 방법

## Domain

### 구매

* 나같은 경우, 사용하고 있는 github.io는 건들고 싶지 않았다.
* 새로 도메인을 파보고 싶기도 해서, 구매를 진행했다.
* 구매는 쉽다. 다양한 도메인 사이트에 가서 사고싶은걸 일단 구매하자.
* 1년 단위로 이벤트를 하여 당장은 1년짜리를 구매했다.
* 가비아에서 진행했다.

### 설정

* [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

* 위를 보면, Domain의 권장하는 DNS세팅이 있다.
  ![](Screen%20Shot%202023-09-14%20at%2010.27.55%20PM.png)

* 이렇게 세팅해주고, Page Repo의 설정 > Pages에 가서 등록된 도메인을 지우고 다시 설정해주자.

### HTTPS 적용

* https://blog.gaerae.com/2018/05/github-pages-custom-domains-https.html
* 위처럼 등록하면 다른 방법이 필요없이 기본지원한다.

# Quarts 설정

* Quarts는 Markdown을 가지고 HTML 형식으로 변환해주는 녀석이다.
* Quarts를 통과한 결과물을 github pages로 넘겨줄 것이다.
* 이를 담을 폴더를 만들고, github repo를 remote로 설정해주자. 폴더 이름은 Publish로 한다.

````bash
git init
git remote add origin "https://github.com/wansook0316/Wansook.World" 
````

# obsidian-export

* [rust 설치](https://www.rust-lang.org/tools/install)
* `cargo install obsidian-export`
* 환경 변수 등록
* `.zshrc` > `export PATH:$PATH:$HOME/.cargo/bin` 추가.
* rust 관련 라이브러리가 설치되는 경로를 환경변수에 추가하여 CLI로 바로 실행할 수 있도록 한 것.
* `source ~/.zshrc`를 통해 영구적용하자.

# Sugar script

* obsidian을 iCloud에 놓고 쓰다보니, `Cloud/.obsidian`에 위치 시켜놓아야 여러개의 애플 디바이스에서 사용할 수 있다.
* 그렇기에 Quartz 에서 요구하는대로 `content`폴더에 Obsidian을 놓고 작업할 수가 없다.
  * 그러면 Obsidian iOS 앱에서 접근을 못한다.
* 그래서 위에서 설치한 obsidian-export을 통해, obsidian에서 내가 원하는 항목만 추출하여 `content`로 복사하려는 것이다.
* 이에 local server를 띄우고, sync 동작하는 스크립트 두개를 작성했다.

## serve.sh

````bash
#!/bin/bash

content_name="content"

vault_name="World"

echo "==== 모든 $content_name folder의 내용을 지웁니다. ===="
rm -r "./$content_name"/*

echo "==== $vault_name 의 vault에서 publishing을 원하는 항목만 $content_name folder로 옮깁니다. ===="
obsidian-export "../$vault_name" "./$content_name"


echo "==== $content_name 으로 이동한 항목을 로컬 서버에 띄웁니다. ===="
npx quartz build --serve
````

## sync.sh

````bash
#!/bin/bash

content_name="content"
vault_name="World"

echo "\n ==== 모든 $content_name folder의 내용을 지웁니다. ===="
rm -r "./$content_name"/*

echo "==== $vault_name 의 vault에서 publishing을 원하는 항목만 $content_name folder로 옮깁니다. ===="
obsidian-export "../$vault_name" "./$content_name"

echo "==== $content_name 으로 이동한 항목을 배포합니다. ===="
npx quartz sync
````

# Reference

* [quartz](https://github.com/jackyzha0/quartz)
* [obsidian-export](https://github.com/zoni/obsidian-export)
