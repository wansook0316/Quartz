---
title: Async, Await
thumbnail: ''
draft: false
tags: null
created: 2023-09-22
---

Swift 5.5에서 소개된 Async/Await에 대해 공부해본다.

# 비동기 처리가 필요한 이유

thumbnail을 fetch하는 method가 있다고 하자.

1. thumbnailURLRequest: 받는 String을 바탕으로 URL Request 객체를 만듦
1. dataTask: request를 바탕으로 네트워크 요청
1. UIImage(data): 받은 요청을 바탕으로 image화
1. prepareThumbnail: 화면에 보여지기 전 image 처리

위의 4단계중 2단계인 네트워크 요청의 경우 다른 작업에 비해 상당히 지연이 많다. 그렇기 때문에 해당 작업을 다른 thread에서 돌리지 않으면, 현재 작업이 진행되고 있는 thread가 block 된다. 이는 사용자 경험에 악영향을 주고, 리소스를 낭비하는 결과를 가져온다.

# Completion Handler

이런 상황에서 concurrent programming을 하기 위해서 우리는 completion handler를 사용해왔다.

````swift
func fetchThumbnail(for id: String, completion: @escaping (UIImage?, Error?) -> Void) {
    let request = thumbnailURLRequest(for: id)
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            completion(nil, error) // 👎
        } else if (response as? HTTPURLResponse)?.statusCode != 200 {
            completion(nil, FetchError.badID) // 👎
        } else {
            guard let image = UIImage(data: data!) else {
                return // 👎 ??? 누락 (1)
            }
            image.prepareThumbnail(of: CGSize(width: 40, height: 40)) { thumbnail in
                guard let thumbnail = thumbnail else {
                    return // 👎 ??? 누락 (2)
                }
                completion(thumbnail, nil) // 👍
            }
        }
    }
    task.resume()
}
````

잘 된 것 같지만, 문제가 생겼다. image 변환이 되지 않았거나(1), thumbnail의 변환이 잘 이루어지지 않은 경우(2)에 completion handler에 `nil`을 전달했어야 했는데, 아무런 처리를 하지 않았다. 이럴 경우, 해당 함수를 호출하는 쪽에서는 image가 보이지 않아 spinner가 계속해서 돌아가고 있는 상태일 것이다. 

````swift
func fetchThumbnail(for id: String, completion: @escaping (UIImage?, Error?) -> Void) {
    let request = thumbnailURLRequest(for: id)
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            completion(nil, error) // 👎
        } else if (response as? HTTPURLResponse)?.statusCode != 200 {
            completion(nil, FetchError.badID) // 👎
        } else {
            guard let image = UIImage(data: data!) else {
                completion(nil, FetchError.badImage) // 👎
                return 
            }
            image.prepareThumbnail(of: CGSize(width: 40, height: 40)) { thumbnail in
                guard let thumbnail = thumbnail else {
                    completion(nil, FetchError.badImage) // 👎
                    return 
                }
                completion(thumbnail, nil) // 👍
            }
        }
    }
    task.resume()
}
````

당장은 위와 같이 해결할 수 있다. 하지만 문제는 completion handler의 호출이, 전적으로 **개발자의 책임**이라는 것이다. 컴파일러가 해줄 수가 없다. 호출하지 않게되면 어디서 작성을 까먹었는지 파악하기 어려워 디버깅도 어려워진다.

# Result Type

````swift
func fetchThumbnail(for id: String, completion: @escaping (Result<UIImage, Error>) -> Void) {
    let request = thumbnailURLRequest(for: id)
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            completion(.failure(error)) // ✅
        } else if (response as? HTTPURLResponse)?.statusCode != 200 {
            completion(.failure(FetchError.badID)) // ✅
        } else {
            guard let image = UIImage(data: data!) else {
                completion(.failure(FetchError.badImage)) // ✅
                return 
            }
            image.prepareThumbnail(of: CGSize(width: 40, height: 40)) { thumbnail in
                guard let thumbnail = thumbnail else {
                    completion(.failure(FetchError.badImage)) // ✅
                    return 
                }
                completion(.success(thumbnail)) // ✅
            }
        }
    }
    task.resume()
}
````

위의 코드보다 약간 더 안전하게 처리할 수 있는 방법이 있긴 하다. `Result` Type을 활용하는 것이다. 하지만 더 못생겨지고 길어져버렸다. `Future`와 같은 방식을 통해 비동기 코드를 개선하려는 노력들도 있었다. 하지만 여전히 쉽고, 간단하며, 안전한 코드를 만들지는 못했다.

# Async/Await

````swift
func fetchThumbnail(for id: String) ✅ async ✅ throws -> UIImage {
    let request = thumbanilURLRequest(for: id)
    let (data, response) = ✅ try ✅ await URLSession.shared.data(for: request)
    guard (response as? HTTPURLResponse)?.statusCode == 200 else {
        throw FetchError.badID
    }
    let maybeImage = UIImage(data: data)
    guard let thumbnail = ✅ await maybeImage?.thumbnail else {
        throw FetchError.badIamge
    }
    return thumbnail
}
````

1. `async`: 비동기로 로직이 처리될 거야
1. `throws`: 실패하면 에러를 던질 거야
1. `try`: dataMethod가 에러를 던지는 함수라 받아줘야 한다.
1. `await`: 비동기로 처리되고, 결과값이 올 때까지 작업 진행사항을 멈춰줘
   * 해당 단계에서 작업 thread는 suspend되는 것이 아니고, 자유롭게 다른 작업을 처리할 수 있다.
1. Property도 `async` 할 수 있다. 그 결과 사용하는 쪽에서 `await` 키워드를 추가했다.
   * initializer도 `async` 할 수 있다.

20줄 짜리 코드가 5줄로 줄었다. 코드도 순차적으로 읽힌다.

## Property Async

위에서 5번 항목에서 Property도 `async`할 수 있다 했는데, 어떻게 구현되는지 살펴보자.

````swift
extension UIImage {
    var thumbnail: UIImage? {
        get ✅ async {
            let size = CGSize(width: 40, height: 40)
            return ✅ await self.byPreparingThumbnail(ofSize: size)
        }
    }
}
````

 > 
 > 오직 읽기 전용 Property만이 `async` 키워드를 달 수 있다.

## Async Sequences

initializer, property, function 이외에도 `async` 키워드를 사용할 수 있다. 바로 for loop이다.

````swift
for await id in staticImageIDsURL.lines {
    let thumbnail = await fetchThumbnail(for: id)
    collage.add(thumbnail)
}
let result = await collage.draw()
````

이 부분은 다음 글에서 다루도록 하겠다.

# Sync & Async

![](ConcurrentProgramming_05_AsyncAwait_0.png)

`await` 키워드로 된 함수를 실행시키면, 지금까지 작업하고 있는 제어권은 system으로 넘어간다. system에서는 현재 작업 상황까지 suspend된 친구 말고, 더 중요한 녀석을 넘겨받은 제어권으로 처리한다.

system으로 code block이 넘어갔을 때, 바로 실행되지 않을 수 있다. 먼저 쌓여있는 작업을 처리한 후에야 실행된다. completion handler의 동작과 같다. 하지만 이 과정에서 `await` 키워드를 통해 하위에 작성된 instruction까지 하나의 transaction으로 실행되지 않는다는 것을 확인할 수 있다. `await` 키워드를 확인하는 순간, 해당 작업 흐름이 suspend될 수 있고, 그 사이에 다른 작업들을 처리하겠구나~ 하고 인지할 수 있다. 

# Summary

1. `async` keyword는 함수를 suspend 하도록 한다.
1. `await` keyword는 async function이 실행을 suspend할 수 있음을 표시한다.
1. suspend되는 동안 다른 작업이 실행될 수 있다.
1. 기다리고 있는 async function이 완료되면 `await` 이후 과정이 실행된다.

# Bridging from sync to async

![](ConcurrentProgramming_05_AsyncAwait_1.png)

`async` 함수를 call 하게 되면, call하는 쪽에서 위와 같은 에러가 뜬다. async 함수의 경우에는 상위 호출 함수도 `async` 키워드를 달아주어야 하기 때문이다.

이런 경우 문제를 해결하는 방법은 async `Task` function을 사용하는 것이다.

````swift
class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        Task {
            await self.asyncFuntion()
        }
    }

    internal func asyncFuntion() async {
        print("asyncFuntion!!")
    }

}
````

이는 우리가 이전에 사용하던 global dispatch queue의 `async` 함수와 비슷하게 동작한다. 해당 작업을 package화하여 다음 thread에서 즉시 실행할 수 있도록 시스템으로 전송한다. 이렇게 하면, async code를 sync context에서 실행할 수 있다.

# Reference

* [Meet async/await in Swift](https://developer.apple.com/videos/play/wwdc2021/10132/)
* [Concurrency](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)
