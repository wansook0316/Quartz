---
title: Data 생성자 사용해서 이미지 받아오지 않기
thumbnail: ''
draft: false
tags:
- data
- swift
- image
- UIImage
- blocking
- non-blocking
- URLSession
created: 2023-11-14
---

* `Data(contentof)`는 로컬 파일을 불러오기 위한 메서드이다.
* 애초에 동기 메서드이다.
* 가끔 이걸 `DispatchQueue`에 `Item`으로 싼뒤에 넣어 비동기 처럼 사용하는 경우가 있는데, 이러면 안된다.
* API의 존재 이유에 맞지 않기 때문이다.
* 이런 경우 `try? await URLSession.shared.data(from: URL)`을 사용하자.

# Reference

* https://stackoverflow.com/questions/76974990/why-and-how-do-datacontentsof-url-call-and-urlsession-shared-datafrom-ur
