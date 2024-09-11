---
title: Base64 Url Safe
thumbnail: ''
draft: false
tags:
- encoding
- decoding
- base64
created: 2024-07-17
---


 > 
 > [Base64](base64.md)에서 URL에서 사용하는 문자열을 제외한 Encoding 방식

* +, /, = 가 URL에서 사용하는 문자임
  * 
    * : 띄어쓰기, 
  * / :  경로구분자, 
  * = : name과 value사이에 쓰는 기호 (Query)
* 이에 아래와 같이 문자를 변경함

![](20240717135703.png)

## Reference

* [RFC4648](https://datatracker.ietf.org/doc/html/rfc4648#section-5)
