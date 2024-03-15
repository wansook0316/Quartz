---
title: URL, URLRequest
thumbnail: ''
draft: false
tags:
- URL
- swift
- URLSession
- URLRequest
- URLComponent
created: 2023-09-30
---

`URLSession`을 만들었다면, 그 안에 들어갈 URL과 Request를 정의해야 한다. 이번에도 문서를 보며 알아보자.

# URL

````swift
let url = URL(string: "http://www.example.com")
````

세션을 만들었다면, 이제 Resource의 위치를 적어줄 차례다. `URL`로 만들 수 있다. Apple에서 제공하는 `URL`은 local file, remote resource 모두에 접근가능하다. local로 작성한 경우네는 파일의 마지막 수정 날짜 변경과 같이 파일 속성을 직접 조작할 수도 있다.

`URL`은 local file을 참조할 때 선호되는 방법이다.파일에서 데이터를 읽거나, 쓰는 객체에는 경로 이름 대신 대부분 `URL`을 받는 method들이 있다. 예를 들어 `String.init(contenstOf:encoding:)`, `Data.init(contentsOf:options:)` 가 있다.

## URL Component

URL은 생각보다 복잡하다. 읽을 수는 있지만 연속된 문자의 나열로 인해 파팍!하고 뭐가 뭔지 파악하기는 어려울 수 있다. 이러한 부분에 대해서 쉽게 다룰 수 있도록 URL을 구문분석하는 struct가 이녀석이다. [RFC 3986](https://www.ietf.org/rfc/rfc3986.txt)에 따라 parsing 한다. 기존 URL로 만들어진 객체로부터 Component를 쉽게 얻을 수 있고, 그 반대도 가능하다.

### Generating

````swift
var urlComponents = URLComponents(string: "https://itunes.apple.com/search?")!

var mediaQuery = URLQueryItem(name: "media", value: "music")
var entityQuery = URLQueryItem(name: "entity", value: "song")
var termQuery = URLQueryItem(name: "term", value: "The Weekend")

urlComponents.queryItems?.append(mediaQuery)
urlComponents.queryItems?.append(entityQuery)
urlComponents.queryItems?.append(termQuery)

var requestURL = urlComponents.url! // https://itunes.apple.com/search?media=music&entity=song&term=The%20Weekend
````

그냥 url 자체를 입력해서 처리할 수도 있겠지만, 혹시 모를 실수를 방지하려면 `URLComponent`를 사용하는 것도 좋은 방법이다.

### Parsing

````swift
let url = "https://itunes.apple.com/search?media=music&entity=song&term=The%20Weekend"
        
let urlComponents = URLComponents(string: url)

print(urlComponents?.scheme)
print(urlComponents?.host)
print(urlComponents?.path)
print(urlComponents?.query)

let items = urlComponents?.queryItems ?? []
for item in items {
    print("name : \(item.name), value : \(item.value)")
}

// Optional("https")
// Optional("itunes.apple.com")
// Optional("/search")
// Optional("media=music&entity=song&term=The Weekend")
// name : media, value : Optional("music")
// name : entity, value : Optional("song")
// name : term, value : Optional("The Weekend")
````

url 정보를 기반으로 parsing도 가능한데, 위와 같이 다양한 정보를 바로바로 가져다가 사용할 수 있다. parsing 정보를 확인하고 싶다면, [URLComponents](https://developer.apple.com/documentation/foundation/urlcomponents)를 참고하자.

# URLRequest

`URL`을 만들었다면 이제 이를 기반으로 Request를 만들어야 한다. `URLRequest`에서는 request에 대한 정보만을 기술한다. 실제로 이 정보를 가지고 요청의 결과를 얻기 위해서는 `URLSession`을 사용해야 한다. 기본적으로 다음과 같은 생성자를 가진다.

````swift
init(url: URL, cachePolicy: URLRequest.CachePolicy = .useProtocolCachePolicy, timeoutInterval: TimeInterval = 60.0)
````

여기서 Cache 정책을 정할 수 있는데, 기본 값은 `NSURLRequest.CachePolicy.useProtocolCachePolicy`이다. 동작을 확인하고 싶다면 [NSURLRequest.CachePolicy](https://developer.apple.com/documentation/foundation/nsurlrequest/cachepolicy)를 참고하자.

````swift
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.addValue("application/json", forHTTPHeaderField: "Content-Type")
request.addValue("application/json", forHTTPHeaderField: "Accept")
request.httpBody = try JSONSerialization.data(withJSONObject: body, options: JSONSerialization.WritingOptions.prettyPrinted)
request.allowsCellularAccess = true
````

위와 같이 header 추가, http body 추가와 같은 것들을 할 수 있다. 이전에 configuration에서 cellular 접근 권한등을 설정할 수 있다고 했는데, `URLRequest`에서도 해당 Request에 대해서만 따로 설정할 수도 있다.

# 마무리

URL과 Request를 만드는 방법을 알아보았다. 그럼 다음글에서는 실제로 Task로 네트워크 통신을 해보자. 끝!

# Reference

* [URL](https://developer.apple.com/documentation/foundation/url)
  * [URLComponents](https://developer.apple.com/documentation/foundation/urlcomponents)
* [URLRequest](https://developer.apple.com/documentation/foundation/urlrequest)
  * [init(url:cachePolicy:timeoutInterval:)](https://developer.apple.com/documentation/foundation/urlrequest/2011457-init)
  * [NSURLRequest.CachePolicy](https://developer.apple.com/documentation/foundation/nsurlrequest/cachepolicy)
