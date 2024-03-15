---
title: Markdown Toggle
thumbnail: ''
draft: false
tags:
- markdown
- toggle
created: 2023-09-30
---

# Expander control

github의 issue나 pull request 올릴 때, 정보를 숨기고 싶은 경우가 있다. 그런 경우 toggle을 사용하면 유용하다. expander control이라고도 하는데, 접기/펼치기 를 가능케해서 그런 이름이 붙었다.

하지만 마크다운에서 토글은 지원하지 않는다. 그렇기 때문에 html의 태그를 사용해서 토글 기능을 사용할 수 있다. 이 기능을 제공하는 html의 태그가 바로 details이다.

````html
<details>
<summary>제목</summary>
<div>

내용

</div>
</details>
````

<details>
<summary>Toggle Test</summary>
<div>

짜잔~!

</div>
</details>

# Reference

* [마크다운 - Expander control(접기/펼치기) 만들기](https://inasie.github.io/it%EC%9D%BC%EB%B0%98/%EB%A7%88%ED%81%AC%EB%8B%A4%EC%9A%B4-expander-control/)
