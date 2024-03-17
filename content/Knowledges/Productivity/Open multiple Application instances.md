---
title: Open multiple Application instances
thumbnail: ''
draft: false
tags:
- window
- application
- mac
- terminal
created: 2023-09-30
---

iOS 개발자로서 제플린이나 피그마 창을 하나만 띄워서 보는건 너무 귀찮다. 여러개 띄울수는 없을까?

# 해결 방법

````dash
open -na /Applications/Zeplin.app

open -na /Applications/Figma.app
````

* 모든 프로그램이 되는 것은 아니다.
* 안전성을 요하는 클라우드 서비스와 같은 동기화 프로그램은 해당 방법을 피하자.
