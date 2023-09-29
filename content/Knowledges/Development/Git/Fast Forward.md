---
title: Fast Forward
thumbnail: ''
draft: false
tags:
- git
created: 2023-09-29
---

작업 하는 와중에 develop branch를 origin에서 pull하려다가 `Fast Forward if possible`이라는 것을 보게되었다. 이건 무엇인가?

# 알아볼 녀석

![](Git_01_FastForward_0.png)

git kraken에는 pull 버튼 아래에 옵션을 선택할 수 있다. 여기서 Fast forward가 무엇인지 알아보는 것이 이 포스팅의 목표이다.

# Objective

1. Hotfix branch를 만들어 급한 불을 끈 뒤, master에 반영한다.
1. 기존에 작업하고 있던 issue를 처리하고 master에 반영한다.

git문서에서는 위 두가지 작업을 하면서 fast forward와 merge에 대해 설명한다.

![](Git_01_FastForward_1.png)

일단 초기 상태는 3개의 커밋이 master에 있다고 하자. CS가 들어오지 않은 상태이니, 업무 처리를 위해 issue를 하나 들고 왔다.

![](Git_01_FastForward_2.png)
![](Git_01_FastForward_3.png)
master브랜치의 가장 최신 커밋을 기준으로 branching 한 후, 작업을 이어갔다. C3 commit이 생성되었다.

![](Git_01_FastForward_4.png)

올 것이 왔다. CS가 들어왔고 hotfix가 나가야 한다. master branch로 switch한 후, hotfix branch를 만들어주고 이동하자. 문제를 해결한 뒤 commit하여 C4가 생겼다.

![](Git_01_FastForward_5.png)

이제 hotfix branch를 master에 반영해야 한다. merge를 하여 반영해주자.

````bash
$ git checkout master
$ git merge hotfix
Updating f42c576..3a0874c
Fast-forward
 index.html | 2 ++
 1 file changed, 2 insertions(+)
````

결과를 보게되면 `Fast-forward`라는 문구가 출력된 것을 확인할 수 있다. 

내부적으로 git은 merge시 branch의 base commit이 무엇인지 확인한다. 이 경우, master와 hotfix의 ancester가 C2로 같고, master의 가장 최신 커밋이 hotfix의 시작 커밋과 같은 경우 그냥 branch pointer를 hotfix branch의 최신 커밋으로 이동만 하면 된다. 이런 것을 `fast-forward`라 한다.

![](Git_01_FastForward_6.png)

이제 hotfix를 마쳤으니, hotfix branch를 지우고 issue branch로 돌아가 작업을 이어가자. issue branch에서 새로운 커밋인 C5를 생성했다.

![](Git_01_FastForward_7.png)

이제 issue branch를 master에 반영해 줄 차례이다. 마찬가지로 ancester commit을 찾는다. 이 경우, 일단 master branch에 있는 C4가 가장 최신 커밋으로 branch pointer를 그냥 옮기는 것으로는 문제를 해결할 수 없다. 즉, fast-forward를 사용할 수 없다. 이 경우 git은 3-way merge 방식을 사용한다. 자세한 내용은 다음 포스팅에서 다루기로 하자. 간단하게 말하면, A branch의 가장 최신 commit, B branch의 가장 최신 commit과 ancester commit 세개를 가지고 합친 commit을 만들어 반영하는 방식이다.

![](Git_01_FastForward_8.png)

이렇게 merge를 마치고 나면 master에는 합쳐진 commit이 반영되고 새로운 commit C6가 만들어진다. 보통 `Merge ~`로 시작하는 commit의 정체가 이녀석이다.

# 마무리

이렇게 간단하게 fast-forward에 대해 알아보았다. 다음에는 merge가 어떤 원리로 이루어지는 지에 대해 알아보려 한다. 끝!

# Reference

* [3.2 Git 브랜치 - 브랜치와 Merge 의 기초](https://git-scm.com/book/ko/v2/Git-%EB%B8%8C%EB%9E%9C%EC%B9%98-%EB%B8%8C%EB%9E%9C%EC%B9%98%EC%99%80-Merge-%EC%9D%98-%EA%B8%B0%EC%B4%88)
