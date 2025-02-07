---
title: Ahead Of Time(AOT) Compiler
thumbnail: ''
draft: false
tags:
- layout
- ahead-of-time
- compiler
created: 2023-10-04
---

# 전체 과정

1. 개발자가 소스코드를 작성한다. (Ts, Html, css, sass, scss etc)
1. Babel을 통해 모든 브라우저에서 호환 가능한 문법의 코드로 변환한다.
1. 소스코드를 하나로 묶는 Bundling을 진행한다.
1. 원격 저장소에 Deploy한다.
1. 사용자는 Domain을 통해 원격지에게 정적 파일에 대해 Http 요청을 보낸다.
1. 프론트 서버는 준비해둔 정적 파일을 응답한다.
1. 브라우저는 원격지로부터 html, css, js, asset을 다운로드 한다.
1. 다운로드가 끝나면 다운로드 Javascript가 실행된다.

이 시점에서 두개의 방향이 갈리는 것이다. 간단히 말하면, 하나는 파일을 받아서 브라우저에서 컴파일을 하고 렌더하느냐, 아니면 바로 렌더하느냐의 차이다.

# AOT 컴파일러

* 소스 코드를 미리 컴파일 하는 방식
* 디바이스에게 미리 번역해서 저장해두고 실행만 하게 한다.
* 더 빠른 렌더가 가능하다.
* 컴파일러를 제거하여 번들 사이즈가 많이 작아진다.
* 프로덕션에서 자주 사용된다.
