---
title: URI
thumbnail: ''
draft: false
tags:
- URI
created: 2023-10-01
---


 > 
 > Uniform Resource Identifier

아무래도 URL, URN의 상위 개념이다보니, 추상적인 의미를 더 많이 가진다고 생각하면 된다. 즉, 특정 정보를 **식별**할 수 있는 문자열이라면 URI라 생각할 수 있다. 물론 다음과 같은 형식을 만족할 경우에 한해서다.

````
scheme:[//[user[:password]@]host[:port]][/path][?query][#fragment]
````

어떤 protocol을 사용할 것인지 scheme에 적고, author의 정보를 적은 뒤, host 위치, port 정보, path 정보, query 등을 적는 양식을 가지고 있다. 이렇게 보면 익히 알고 있는 URL과 뭐가 다르냐고 물어볼 수 있겠지만 조금만 참자. 기억해야 할 것은 상위 개념이라는 것이다.
