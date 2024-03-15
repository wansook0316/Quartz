---
title: Push 시 Password 물어보지 않도록 설정하기
thumbnail: ''
draft: false
tags:
- git
- push
- password
- credential
created: 2023-09-21
---

# 발생하는 경우

* 계정 패스워드를 바꿨는데 로컬 반영이 안된 경우
* 환경 등의 알지못하는 변경이 영향을 준 경우

# 해결 방법

````

git config --unset credential.helper // 

git config credential.helper store // 해당 Git directory에서 적용
git config credential.helper store --global // 전체 Git에서 적용
````

# Reference

* [push 시 Password 물어보지 않도록 설정하기](https://www.hahwul.com/2018/08/22/git-credential-helper/)
