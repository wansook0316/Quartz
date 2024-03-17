---
title: HTTP State code
thumbnail: ''
draft: false
tags:
- HTTP
- state
- state-code
created: 2023-10-01
---

|Code|Infomation|Range|Description|
|:--:|:--------:|:---:|:----------|
|1xx|Informational|100, 101|<li>100: Continue </li> <li> 101: Switching Protocols </li>|
|2xx|Successful|200~206|<li> 201: Created </li> <li> 202: Accepted  (대기열 긴 경우, 요청은 받았어! ^^ 이 용도..) </li>|
|3xx|Redirection|300~307|<li> 301: Moved Permanently</li> <li> 302: Found (이전 Moved Temporarily) </li> <li> 307: Temporary Redirect (Recommaned)</li> <li> 308: Permanent Redirect (Recommaned)</li>|
|4xx|Client Error|400~417|<li> 400: Bad Request (구문 인식 불가)</li>  <li> 403: Forbidden (금지됨) </li> <li> 404: Not found </li>|
|5xx|Server Error|500~505|<li> 500: 서버 오류</li>|
