# 동기

* 다른 블로그 호스팅 서비스(Tistory, Velog)를 사용하면, 내가 온전히 관리하지 못한다는 측면에서 아쉬움이 있었다.
* Github Page를 Jekyll을 사용해 포스팅해보았지만, 1000개가 넘어가는 시점부터 너무 느려 사용하기가 꺼려졌다.
* 그 와중에 Obsidian을 알게 되었다.
* Obsidian은 내 로컬에 Markdown 형식으로 저장되면서 확장성이 높은 문서 관리 도구이다.
* 그리고 Hugo라는 Go로 작성된 빠른 Static Page Generator가 생겼다는 것을 알았다!
* 이에 블로그 전체를 Obsidian으로 옮기면서 나의 모든 것을 관리해보자는 목표를 세웠다.

# 필요 기능

* 문서의 Export 여부에 따라 올리거나, 그렇지 않거나 할 수 있어야 한다.
* UI가 깔끔해야 한다.
* Obsidian의 기능 자체를 어느정도 반영할 수 있어야 한다.
* 웹페이지에 올라간 이후 속도가 빨라야 한다.
* 모바일 대응이 되어야 한다.

# 도구

* Hugo-Obsidian
* Quarts
* Obsidian-Export

# 방법

## 개요

* 내 Obsidian folder를 watch하고 있도록 스크립트를 짠다.
* Obsidian에 변경 사항이 생길 경우, Obsidian vault를 Markdown으로 변경한다.
  * 이 때, export-ignore에 개인 폴더를 설정하여 변환되지 않도록 한다.

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

![Screen Shot 2023-09-14 at 10.27.55 PM.png](Assets/Screen%20Shot%202023-09-14%20at%2010.27.55%20PM.png)

* 이렇게 세팅해주고, Page Repo의 설정 > Pages에 가서 등록된 도메인을 지우고 다시 설정해주자.

### HTTPS 적용

* https://blog.gaerae.com/2018/05/github-pages-custom-domains-https.html
* 위처럼 등록하면 다른 방법이 필요없이 기본지원한다.

# Quarts 설정

* Quarts는 Markdown을 가지고 Website 형식으로 변환해주는 녀석이다.
* Quarts를 통과한 결과물을 github pages로 넘겨줄 것이다.
* 이를 담을 폴더를 만들고, github repo를 remote로 설정해주자. 폴더 이름은 Publish로 한다.

````bash
git init
git remote add origin "https://github.com/wansook0316/Wansook.World" 
````

# 

# Reference

* [Quarts v4](https://github.com/jackyzha0/quartz)
* 

https://tibyte.kr/287

https://gowoonsori.com/projects/start-hugo/
https://quartz.jzhao.xyz/
https://www.ssp.sh/brain/gohugo
https://www.ssp.sh/
https://github.com/64bitpandas/amethyst

1. 깃헙 페이지 휴고를 사용하여 설치
1. 도메인 이름 변경
1. git submodule ???? 이게 뭐지

![Screen Shot 2023-09-14 at 9.33.41 PM.png](../../Assets/Screen%20Shot%202023-09-14%20at%209.33.41%20PM.png)

# DNS

https://skyksit.com/git/github-pages-custom-domain/
https://customer.gabia.com/manual/domain/287/1201
https://www.holaxprogramming.com/2017/05/15/github-page-and-custom-domain/

# 방법

1. `brew install hugo`

1. `hugo version`

1. install go. https://go.dev/

1. [hugo 설치](../../hugo%20%EC%84%A4%EC%B9%98.md)
