---
title: URLSessionTask
thumbnail: ''
draft: false
tags:
- swift
- URL
- URLSessionTask
- network
created: 2023-09-30
---

이전 글에서 `URLSession`, `URL`, `URLRequest` 를 생성하는 방법을 알아보았다. 이번에는 어떤 Task들이 있는지 알아보자.

# Task

Apple에서 기본적으로 제안하는 task의 종류는 총 3가지이다. 하지만 문서를 본 결과, `URLSession`에서 함수로 제안하는 task의 종류는 총 5개 였다.

* [URLSessionDataTask](https://developer.apple.com/documentation/foundation/urlsessiondatatask)
* [URLSessionDownloadTask](https://developer.apple.com/documentation/foundation/urlsessiondownloadtask)
* [URLSessionUploadTask](https://developer.apple.com/documentation/foundation/urlsessionuploadtask)
* [URLSessionStreamTask](https://developer.apple.com/documentation/foundation/urlsessionstreamtask)
* [URLSessionWebSocketTask](https://developer.apple.com/documentation/foundation/urlsessionwebsockettask)

여기서 상위 3개가 문서에서 기본적으로 설명하는 Task이다.

## URLSessionTask

![](Swift_25_URLSessionTask_0.png)

````swift
class URLSessionTask : NSObject
````

구체적으로 Task에 대해서 설명하기 전에, 그 상위에 있는 class를 알면 좋다. Task는 항상 `URLSession` 의 부분으로 있어야 한다. 즉, task를 만들려면 `URLSession` instance에 있는 method를 call하는 것으로 시작해야 한다는 말이다.

앞으로 설명할 모든 task를 만든 후에, `resume()`메서드를 call하는 것으로 시작할 수 있다. Session은 이 task 객체를 작업이 완료/실패 할 때까지 strong하게 붙들고 있다. 그렇기 때문에 굳이 필요하지 않다면 task 객체를 reference로 들고 있을 필요가 없다.

 > 
 > 모든 Task property는 KVO를 지원한다고 한다.

Task를 통해 응답을 받는 방식은 두가지가 있다. 하나는 Completion Handler, 둘째는 Delegate이다.

![](Swift_25_URLSessionTask_1.png)
![](Swift_25_URLSessionTask_2.png)

## URLSessionDataTask

````swift
class URLSessionDataTask : URLSessionTask
````

 > 
 > 다운로드한 data를 memory에 load된 app으로 직접 반환하는 task

`URLSessionDataTask`은 기본적으로 Request를 보내고 Response로 하나이상의 `NSData` 객체를 **메모리**에 받는다. `URLSession`을 만들 때, 들어가는 configuration으로 `default`, `ephemeral`에서 지원한다. 추가적으로 `shared` instance에서도 dataTask를 지원한다. 하지만 **`background` session에서는 지원하지 않는다.** 

````swift
// 사용 예시
let url = URL(string: "https://www.example.com/")!
let task = URLSession.shared.dataTask(with: url) { data, response, error in
    if let error = error {
        self.handleClientError(error)
        return
    }
    guard let httpResponse = response as? HTTPURLResponse,
        (200...299).contains(httpResponse.statusCode) else {
        self.handleServerError(response)
        return
    }
    if let mimeType = httpResponse.mimeType, mimeType == "text/html",
        let data = data,
        let string = String(data: data, encoding: .utf8) {
        DispatchQueue.main.async {
            self.webView.loadHTMLString(string, baseURL: url)
        }
    }
}
task.resume()
````

````swift
// 주요 Delegate
urlSession(_:task:didSendBodyData:totalBytesSent:totalBytesExpectedToSend:) // body 업로드 경우
urlSession(_:dataTask:didReceive:completionHandler:) // 초기 응답을 받은 경우
urlSession(_:dataTask:didReceive:) // 데이터를 받고 있는 동안
urlSession(_:dataTask:willCacheResponse:completionHandler:) // 데이터가 다 받아진 경우
````

추가 정보는 [Fetching Website Data into Memory](https://developer.apple.com/documentation/foundation/url_loading_system/fetching_website_data_into_memory)를 확인하자.

## URLSessionUploadTask

````swift
class URLSessionUploadTask : URLSessionDataTask
````

이녀석만 `URLSessionDataTask`를 상속받는다는 것이 특이하다. 이유는 기본적으로 `URLSessionDataTask`와 유사하지만, request body를 제공하는 방식이 좀 더 쉽다고 한다. 그래서 서버의 응답을 받기 전에 body에 데이터를 넣어 업로드할 수 있다. **`URLSessionDataTask`와 달리 background session을 지원한다.**

즉, 요약하면 HTTP Method `POST`, `PUT` 과 같이 body가 필요한 녀석들을 사용할 때 사용하면 된다. dataTask로도 할 수 있지만 이녀석이 보다 쉬운 방향이다. Delegate로 upload 정도를 확인할 수 있다.

````swift
// 사용 예시
struct Order: Codable {
    let customerId: String
    let items: [String]
}

// ...

let order = Order(customerId: "12345",
                  items: ["Cheese pizza", "Diet soda"])
guard let uploadData = try? JSONEncoder().encode(order) else {
    return
}

let url = URL(string: "https://example.com/post")!
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")

let task = URLSession.shared.uploadTask(with: request, from: uploadData) { data, response, error in
    if let error = error {
        print ("error: \(error)")
        return
    }
    guard let response = response as? HTTPURLResponse,
        (200...299).contains(response.statusCode) else {
        print ("server error")
        return
    }
    if let mimeType = response.mimeType,
        mimeType == "application/json",
        let data = data,
        let dataString = String(data: data, encoding: .utf8) {
        print ("got data: \(dataString)")
    }
}
task.resume()
````

delegate의 경우 `URLSessionDataTask`에서 설명한 녀석들을 잘 사용하면 된다. 이녀석은 어떻게 보면 sugar api이다. 최 대한의 예시에서는 upload시 `URLSessionUploadTask`를 사용하지 않는 예시를 적어두었다. 이 경우는 Codable을 사용하여 body를 만들었고, 하단에서는 그냥 만들었다. 크게 다르지 않기 때문에 비교하면서 보면 좋을 듯하다. 추가정보는 [Uploading Data to a Website](https://developer.apple.com/documentation/foundation/url_loading_system/uploading_data_to_a_website)를 확인하자.

## URLSessionDownloadTask

````swift
class URLSessionDownloadTask : URLSessionTask
````

이녀석은 위의 친구들과 달리 resource를 disk에 직접 다운로드한다. disk에 어떤 식으로 저장하냐면, 일단 임시 파일로 저장한다. completion handler나 delegate로 다운이 완료된 시점에 임시 파일의 URL을 얻을 수 있다. 

모든 type의 세션에서 사용가능하다. 만약 background에서 사용한다면, suspend거나 running 상태가 아닌 상황에서도 다운로드가 계속된다. (이 이유는 configuration) 추가적으로 downliad task를 pause, cancel, resume 할 수 있다. network connectivity가 문제 생긴 경우 fail되는데, 이 때 resume을 사용하면 다시 이어 받을 수 있다.

````swift
// 사용 예시
let downloadTask = URLSession.shared.downloadTask(with: request) { [weak self] url, response, _ in
    if let data = self?.cache.cachedResponse(for: request)?.data {
        completion(.success(data))
        return
    }
    if let response = response, let localURL = url,
        self?.cache.cachedResponse(for: request) == nil,
        let data = try? Data(contentsOf: localURL, options: [.mappedIfSafe]) {
        self?.cache.storeCachedResponse(CachedURLResponse(response: response, data: data), for: request)
        completion(.success(data))
    }
}
downloadTask.resume()
````

````swift
// 주요 Delegate
urlSession(_:downloadTask:didWriteData:totalBytesWritten:totalBytesExpectedToWrite:) // 다운로드 중
urlSession(_:downloadTask:didFinishDownloadingTo:) // 성공적인 다운로드
urlSession(_:task:didCompleteWithError:) // 실패한 다운로드
````

## URLSessionStreamTask

````swift
class URLSessionStreamTask : URLSessionTask
````

`URLSessionStreamTask`은 host 이름과 port 로부터 TCP/IP Connection을 설정한다. 사용해보질 못해서 나중에 추가로 반영하도록 하겠다.

## URLSessionWebSocketTask

````swift
class URLSessionWebSocketTask : URLSessionTask
````

Socket 통신을 편하게 해주는 녀석인 듯 하다. 사용해보질 못해서 나중에 추가로 반영하도록 하겠다.

# Code

마지막으로 전체 코드를 한번 훑어보자.

````swift
// Swift 5.1, iOS 13 환경에서 정상적으로 동작합니다.
class NetworkHandler {
    static func postData(urlString: String, body: String) {
        // 세션 생성, 환경설정
        let configuration = URLSessionConfiguration.default
        let defaultSession = URLSession(configuration: configuration) // URLSession(configuration: .default)

        guard let url = URL(string: urlString) else {
            print("URL is nil")
            return
        }

        // Request
        let request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        request.httpBody = try JSONSerialization.data(withJSONObject: body, options: JSONSerialization.WritingOptions.prettyPrinted)

        // dataTask
        let dataTask = defaultSession.dataTask(with: request) { (data: Data?, response: URLResponse?, error: Error?) in
            // getting Data Error
            guard error == nil else {
                print("Error occur: \(String(describing: error))")
                return
            }

            guard let data = data, 
                  let response = response as? HTTPURLResponse, 
                  response.statusCode == 200 else {
                return
            }

            // 통신에 성공한 경우 data에 Data 객체가 전달됩니다.

            // 받아오는 데이터가 json 형태일 경우,
            // json을 serialize하여 json 데이터를 swift 데이터 타입으로 변환
            // json serialize란 json 데이터를 String 형태로 변환하여 Swift에서 사용할 수 있도록 하는 것을 말합니다.
            guard let jsonToArray = try? JSONSerialization.jsonObject(with: data, options: []) else {
                print("json to Any Error")
                return
            }
            // 원하는 작업
            print(jsonToArray)
        }
        dataTask.resume()
    }
}

NetworkHandler.postData(resource: "http://www.example.com")
````

# 마무리

아직 `URLSessionStreamTask`, `URLSessionWebSocketTask`는 써보지 못해서 정리해보지 못했다. 하다보니 Serialization이 무엇인지에 대해 궁금해져서 다음에는 해당 글을 작성하도록 하겠다. 끝!

# Reference

* [URLSessionTask](https://developer.apple.com/documentation/foundation/urlsessiontask)
  * [URLSessionDataTask](https://developer.apple.com/documentation/foundation/urlsessiondatatask)
    * [Fetching Website Data into Memory](https://developer.apple.com/documentation/foundation/url_loading_system/fetching_website_data_into_memory)
  * [URLSessionUploadTask](https://developer.apple.com/documentation/foundation/urlsessionuploadtask)
    * [Uploading Data to a Website](https://developer.apple.com/documentation/foundation/url_loading_system/uploading_data_to_a_website)
  * [URLSessionDownloadTask](https://developer.apple.com/documentation/foundation/urlsessiondownloadtask)
  * [URLSessionStreamTask](https://developer.apple.com/documentation/foundation/urlsessionstreamtask)
  * [URLSessionWebSocketTask](https://developer.apple.com/documentation/foundation/urlsessionwebsockettask)
