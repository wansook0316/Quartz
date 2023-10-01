---
title: Reactive Programming
thumbnail: ''
draft: false
tags:
- reactive
- RxSwift
- combine
created: 2023-09-30
---

Promise, Rx 등 비동기 처리를 하기 위한 방법은 많다. 이를 배워보기 이전에, 왜 그러한 개념이 나왔는지, 어떠한 방식으로 개선해왔는지를 코드를 고쳐보면서 이해해보는 것이 이 포스팅의 목표이다.
최대한 개조식으로 적으려 노력했다. 첫번째 글에서는 순차적으로 네트워크 비동기 처리코드를 읽기 쉽도록 개선해보면서, 왜 이러한 개념이 나오게 되었는지를 이해해보자.

# 프로젝트 설명

<img width="493" alt="스크린샷 2021-09-22 오전 10 48 33" src="https://user-images.githubusercontent.com/37871541/134270631-84d732ff-d2a1-49b9-bde9-db5d53a86351.png">

* Load 버튼을 누르면 네트워크 통신으로 json을 받아옴
* 인디케이터 바가 오른쪽에 생기고, 로드가 끝나면 아래의 textView에 json을 보여지게 함

````swift
import RxSwift
import SwiftyJSON
import UIKit

let MEMBER_LIST_URL = "https://my.api.mockaroo.com/members_with_avatar.json?key=44ce18f0"

class ViewController: UIViewController {
    @IBOutlet var timerLabel: UILabel!
    @IBOutlet var editView: UITextView!

    override func viewDidLoad() {
        super.viewDidLoad()
        Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            self?.timerLabel.text = "\(Date().timeIntervalSince1970)"
        }
    }

    private func setVisibleWithAnimation(_ v: UIView?, _ s: Bool) {
        guard let v = v else { return }
        UIView.animate(withDuration: 0.3, animations: { [weak v] in
            v?.isHidden = !s
        }, completion: { [weak self] _ in
            self?.view.layoutIfNeeded()
        })
    }

    // MARK: SYNC

    @IBOutlet var activityIndicator: UIActivityIndicatorView!

    @IBAction func onLoad() {
        editView.text = ""
        setVisibleWithAnimation(activityIndicator, true)

        let url = URL(string: MEMBER_LIST_URL)!
        let data = try! Data(contentsOf: url)
        let json = String(data: data, encoding: .utf8)
        self.editView.text = json
        
        self.setVisibleWithAnimation(self.activityIndicator, false)
    }
}

````

* 먼저 프로젝트는 간단하다. 
* 뷰가 로드되면, 타이머를 설정해서 화면에 시간이 표시되게 한다.
* 버튼을 누르면 인디케이터를 시작하고, 데이터를 받아온 뒤에 화면에 보여준다.
* 마지막으로 인디케이터를 꺼준다.

# 첫번째 개선 사항

* 하지만 이렇게 되면 문제가 발생하는데, `String(data: encoding:)` 의 경우 동기 방식으로 데이터를 가져오기 때문에, UI Update를 할 수 없어, 모든 화면이 멈춘뒤,  데이터를 받은 뒤에 업데이트가 된다.
* 이는 Main Thread에서 UI를 업데이트하고 있기 때문에 발생하는 문제이다. 따라서 비동기로 해당 작업을 진행해야 한다.

````swift

@IBAction func onLoad() {
    self.editView.text = ""
    self.setVisibleWithAnimation(self.activityIndicator, true)

    DispatchQueue.global().async { [weak self] in
        let url = URL(string: MEMBER_LIST_URL)!
        let data = try! Data(contentsOf: url)
        let json = String(data: data, encoding: .utf8)
        
        DispatchQueue.main.async { [weak self] in
            self?.editView.text = json
            self?.setVisibleWithAnimation(self?.activityIndicator, false)
        }
        
    }
}

````

* 해당 코드는 이와 같이 변경하여 해결이 가능하다.
* `weak self`를 사용해서 순환참조를 방어해주었다.
* UI update의 경우 main thread에서 동작하게 하여 원하는 동작을 하게 하였다.

# 두번째 개선 사항

* 코드가 읽기 좋지 않다. 기능 별로 나누는 것이 읽기 좋다.
* 해당 함수의 동작은, 데이터를 받아오고, 화면에 보여주고. 두단계로 나눌 수 있다.
* 하지만 문제는 데이터를 받아오는 동작 자체가 비동기로 처리되기 때문에, 해당 동작이 끝난 후에 UI를 업데이트 해야한다는 제약이 존재한다는 것이다.
* 그렇기 때문에, 데이터를 비동기로 받아오되, 해당 작업이 끝난 후에 동작하는 Completion handler를 사용하여 함수를 분리한다.
* 이 방법이 보통의 swift에서 사용하는 기본 비동기 처리 방법이다.

````swift
private func downloadJson(url: String, _ completion: @escaping (String?) -> Void) {
    DispatchQueue.global().async {
        let url = URL(string: url)!
        let data = try! Data(contentsOf: url)
        let json = String(data: data, encoding: .utf8)
        
        DispatchQueue.main.async {
            completion(json)
        }
    }
}

@IBAction func onLoad() {
    self.editView.text = ""
    self.setVisibleWithAnimation(self.activityIndicator, true)
    
    downloadJson(url: MEMBER_LIST_URL) { [weak self] json in
        self?.editView.text = json
        self?.setVisibleWithAnimation(self?.activityIndicator, false)
    }
}
````

* main thread에서 작동하도록 completion handler를 넣어 문제를 해결했다.
* 여기서 `@escaping` 키워드를 사용해야 한다.
* 해당 키워드는, 함수 내에서 클로저 사용이 끝나지 않고, 함수의 리턴이 끝난 후에 클로저 사용을 하는 경우 명시적으로 적어주어야 한다.
* 해당 클로저가 콜스택이 사라진 뒤에 지워지지 않고(원래 콜스택에 쌓인 함수의 매개변수등은 함수 호출이 종료되면 메모리에서 할당 해제된다.) 추적을 계속할 수 있게 한다.
* **하지만 만약 클로저가 optional인 경우에는 해당 키워드를 사용하지 않아도 된다.**
  * 옵셔널인 경우 `@escaping`이 기본 동작이라고 한다.
  * 추가
    * 일단 기본적으로 excaping이 기본이다.
    * 그런데 함수의 파라미터로 들어올 때만 기본으로 non escaping이 된다.
      * 그 이유는 아마 콜스택의 문제일 것이다. 당연히 파라미터는 콜 스택이 끝난후에 다 지워져야 하니까
    * 그래서 특별한 경우에 대해 해당 키워드를 적어주어야 하는 것
    * 그런데, 이렇게 파라미터로 클로저를 사용하지 않는 경우 (열거형, 튜플, 구조체에서 사용하는 경우)에는 기본 동작으로 escaping이 적용된다.
    * 그러니까 파라미터로 옵셔널 클로저를 넣는 경우, 애초에 옵셔널의 정체가 enum이기 때문에 기본 동작이 escaping인 것.
    * 그래서 안써줘도 무방하다.
    * [출처](https://stackoverflow.com/questions/39618803/swift-optional-escaping-closure-parameter)

# 세번째 개선 사항

* 그런데, 이게 바로 콜백 함수를 사용한 방법이다.
* 하지만 콜백함수의 단점은, 계속해서 코드의 depth가 증가한다는 점이다.
* 동기식 프로그래밍 방법처럼, 데이터를 받고, 받은 데이터에 대해서 UI를 업데이트해준다면 얼마나 좋을까

````swift
let json = downloadJson(url)

self.editView.text = json
````

* 이런식으로 말이다.
* 결국 하고 싶은 것을 정리하면 다음과 같다.
* **비동기로 처리되는 데이터를 리턴해서 사용할 수 없을까?**
  * 리턴해서 사용하면 동기식 처리방법처럼 코드를 구성할 수 있다.
* 이러한 필요성에서 탄생한 것이 Reactive programming이다.
  * 아래에서 보면 알겠지만, 먼저 흐름을 정해놓고(타입에서 이러한 흐름을 만들어버린다.) 나중에 데이터가 변경되었을 때 연관된 작업이 실행되는 방법이다.

````swift
class 나중에생기는데이터<T> {
    // 어떠한 타입을 받아서 Void를 리턴하는 클로저를 인수로 갖는 클로저
    // 안쪽에 들어가는 클로저가 후에 데이터를 다 받으면 수행할 completion handler의 역할을 한다.
    private let task: (@escaping (T) -> Void) -> Void
    
    init(task: @escaping (@escaping (T) -> Void) -> Void) {
        self.task = task
    }
    
    func 나중에오면(_ f: @escaping (T) -> Void) {
        task(f)
    }   
}
````

* 그래서 이러한 타입을 만들었다.
* 개념적으로는 나중에 생기는 데이터라고 해두었다.
* 해당 타입을 만들어서 사용할 때는, 데이터가 발생하기 이전에 수행할 것들에 대해 처리할 클로저를 받는다.
* 그리고 실제로 실행하는 시점(나중에오면)에 실행이 끝난 뒤에 처리할 작업(completion)을 넘겨서 작업을 처리한다.

````swift
private func downloadJson(url: String) -> 나중에생기는데이터<String?> { 
    return 나중에생기는데이터() { f in
        DispatchQueue.global().async {
            let url = URL(string: url)!
            let data = try! Data(contentsOf: url)
            let json = String(data: data, encoding: .utf8)
            
            DispatchQueue.main.async {
                f(json)
            }
        }
    }
    
}

@IBAction func onLoad() {
    self.editView.text = ""
    self.setVisibleWithAnimation(self.activityIndicator, true)
    
    let json: 나중에생기는데이터<String?> = downloadJson(url: MEMBER_LIST_URL)
    
    json.나중에오면 { [weak self] json in
        self?.editView.text = json
        self?.setVisibleWithAnimation(self?.activityIndicator, false)
    }
}
````

* 이렇게 작성할 수 있다.
* 즉, 우리가 처음에 원했던 것 처럼, 비동기로 처리하는 값자체를 리턴하는 것처럼 코드를 작성할 수 있다.
* 하지만, 위의 구현사항을 보면 알겠지만, 개념적으로 리턴한 것일 뿐, 아직 로직이 실행되지 않았다는 것을 수 있다.
* 어느 시점에 실행이 되느냐? 나중에오면 이라는 키워드를 통해서, 해당 작업이 마친 이후에 할 동작을 명시할 때, 비동기적으로 실행된다.
* 이제 나중에 보면 알겠지만, 여기서 `나중에 생기는 데이터` 라는 타입 자체의 이름을 어떻게 명명하느냐에 따라 다양한 프레임워크가 발생한다.
  * Promise
  * Combine
  * RxSwift
  * Bolts
* RxSwift에서는 `나중에생기는데이터 = Observable`, `나중에오면 = Subscribe` 로 명명한다.

## Reactive Programming

 > 
 > 리액티브 프로그래밍은 데이터 흐름(data flows)과 변화 전파에 중점을 둔 프로그래밍 패러다임(programming paradigm)이다.
 > 이것은 프로그래밍 언어로 정적 또는 동적인 데이터 흐름을 쉽게 표현할 수 있어야하며, 데이터 흐름을 통해 하부 실행 모델이 자동으로 변화를 전파할 수 있는 것을 의미한다.

* 핵심
  * 하나의 컴포넌트로부터 전파
  * 받는 수신자 존재
  * `Rx = Observable + Observer + Schedulers`
* Rx는 비동기 프로그래밍을 쉽게 하기 위한 유틸리티이다.

![imAssets/134277748-9c37d69f-e9bb-47center-small}*General Marble Diagram*

# 네번째 개선 사항

* 이제는 실제 RxSwift를 사용하여 동작을 변경해보자.

````swift
private func downloadJson(url: String) -> Observable<String?> {
    
    return Observable.create() { f in
        DispatchQueue.global().async {
            let url = URL(string: url)!
            let data = try! Data(contentsOf: url)
            let json = String(data: data, encoding: .utf8)
            
            DispatchQueue.main.async {
                f.onNext(json)
            }
        }
        
        return Disposables.create()
    }
    
}

@IBAction func onLoad() {
    self.editView.text = ""
    self.setVisibleWithAnimation(self.activityIndicator, true)
    
    let disposable = downloadJson(url: MEMBER_LIST_URL)
        .subscribe { [weak self] event in
            switch event {
            case .next(let json):
                self?.editView.text = json
                self?.setVisibleWithAnimation(self?.activityIndicator, false)
            case .error(let error):
                print(error)
            case .completed:
                break
            }
        }
    
    // disposable.dispose()
    
}
````

* 변경사항은 다음과 같다.
* Observable, subscribe로 함수이름을 변경하였다.
* subscribe할 때 받는 인자가 json이 아니고 event를 받는다.
  * 해당 event는 type이 있는데, onNext, error, completed가 있다.
* Observable 객체를 선언할 때, 동작을 정의한 후에 Disposables로 리턴한다.
  * 아래에서 subscribe동작을 한 뒤에 이 Disposable 객체를 리턴받는다.
  * 해당 객체는 `dispose`라는 메서드를 가지고 있는데, 이는 위의 정의한 subscribe동작이 다른 스레드에서 끝나지 않았어도 취소할 수 있다.
  * 그래서 위의 코드를 실행시키면, `let disposable` 라인을 실행시키고 바로 `disposable.dispose()`가 실행되어 네트워크 통신을 취소시켜버려 아무런 동작도 하지 않는다.
  * disposable 같은 경우 `viewWillDisappear`에 추가하여 사용하면 뷰가 변경될 때 취소시키는 효과를 얻을 수 있다.
    * VC안에 변수로 가지고 있어야 할 것
    * 만약에 받아야 하는 것들이 많다면 배열로 가지고 있다가 배열 안에 있는 disposable에 대해 모두 dispose를 하면 된다.

## 비동기 처리 방법

두가지를 배울 것이다.

1. 비동기로 생기는 데이터를 감싸서 리턴하는 방법

````swift
private func downloadJson(url: String) -> Observable<String?> {
        
    Observable.create { emitter in
        emitter.onNext("Hello")
        emitter.onNext("world")
        emitter.onCompleted()
        
        return Disposables.create()
    }
}
````

* 하나씩 데이터를 발송하게 된다. 끝나면 끝난다는 이벤트를 발생시킨다.
* 다음은 제대로 된 사용법을 알아보자.

````swift
private func downloadJson(url: String) -> Observable<String?> {
    
    return Observable.create { emitter in
        let url = URL(string: url)!
        
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            guard error == nil else {
                emitter.onError(error!)
                return
            }
            
            if let data = data, let json = String(data: data, encoding: .utf8) {
                emitter.onNext(json)
            }
            
            emitter.onCompleted()
        }
        
        task.resume()
        
        return Disposables.create() {
            task.cancel()
        }
    }
}
````

* 세션을 만들고 시작한다.
* 만약에 구독을 취소 한다면(Disaposable) 세션도 종료해야 한다.
  * 해당 작업을 Disposable에 묶어 둔다.
* 세션 내부에서는 에러가 날 경우, error를 방출한다.
* 데이터를 받은 경우 다음 데이터로 방출한다.
* 그런데 이렇게 하면 이전에 만들었던 아래 코드에서 에러가 생긴다.

````swift
@IBAction func onLoad() {
  self.editView.text = ""
  self.setVisibleWithAnimation(self.activityIndicator, true)
  
  _ = downloadJson(url: MEMBER_LIST_URL)
      .subscribe { [weak self] event in
          switch event {
          case .next(let json):
              self?.editView.text = json
              self?.setVisibleWithAnimation(self?.activityIndicator, false)
          case .error(let error):
              print(error)
          case .completed:
              break
          }
      }
  
}
    
````

* 이전에는 나중에오면 함수 안에서 main 스레드에서 동작시키도록 했지만, 지금 Rx의 경우 subscribe 동작을 할 때, URLSession을 실행시킨 그 스레드에서 동작을 실행시키도록 설정되어 있다.
* 그렇기 때문에 지금 같은 경우 UIupdate를 하기 위해서는 스레드를 변경해주어야 한다.

````swift
@IBAction func onLoad() {
    self.editView.text = ""
    self.setVisibleWithAnimation(self.activityIndicator, true)
    
    _ = downloadJson(url: MEMBER_LIST_URL)
        .subscribe { [weak self] event in
            switch event {
            case .next(let json):
                DispatchQueue.main.async {
                    self?.editView.text = json
                    self?.setVisibleWithAnimation(self?.activityIndicator, false)
                }
            case .error(let error):
                print(error)
            case .completed:
                break
            }
        }
    
}
````

* 이렇게!

## Observable의 생명주기

1. Create
1. Subscribe
1. onNext
1. onCompleted, onError
1. Disposed

여기서 알아야 하는 점은, 아까도 말했지만, Create 되었다고 동작하는게 아니다. Subscribe가 되었을 때 동작한다. 즉, 구독을 실행할 때 데이터들이 생성되서 전달되는 것. `debug()` 함수를 추가해서 동작을 확인할 수 있다.

````swift
@IBAction func onLoad() {
    self.editView.text = ""
    self.setVisibleWithAnimation(self.activityIndicator, true)
    
    _ = downloadJson(url: MEMBER_LIST_URL)
        .debug()
        .subscribe { [weak self] event in
            switch event {
            case .next(let json):
                DispatchQueue.main.async {
                    self?.editView.text = json
                    self?.setVisibleWithAnimation(self?.activityIndicator, false)
                }
            case .error(let error):
                print(error)
            case .completed:
                break
            }
        }
    
}
````

````
2021-09-22 13:11:23.037: ViewController.swift:109 (onLoad()) -> subscribed
2021-09-22 13:11:24.252: ViewController.swift:109 (onLoad()) -> Event next(Optional("[{\"id\":1,\"name\":\"Gladys Brugden\",\"avatar\":\"https://robohash.org/a ....

2021-09-22 13:11:24.279: ViewController.swift:109 (onLoad()) -> Event completed
2021-09-22 13:11:24.279: ViewController.swift:109 (onLoad()) -> isDisposed
````

### 순환참조 이슈

* 결국 클로저를 활용해서 이러한 로직을 만들어냈다.
* 그러면 따라오는 문제가 뭐냐면, 순환참조다.
* 일단 순환참조가 발생할 수 밖에 없는데, 어느 시점에 그럼 클로저때문에 발생하는 reference count가 줄어드느냐.
* 즉, 언제 클로저가 사라지느냐.
* on complete가 되면 사라진다.
* 하지만 혹시 모르니 `[weak self]`를 명시적으로 적는게 나아보인다.

# Reference

* [시즌2 오프라인 모임](https://www.youtube.com/watch?v=iHKBNYMWd5I&t=3963s)
* [RxSwift+MVVM 4시간에 끝내기](https://github.com/iamchiwon/RxSwift_In_4_Hours)
* [swift-optional-escaping-closure-parameter](https://stackoverflow.com/questions/39618803/swift-optional-escaping-closure-parameter)
* [Combine](Combine.md)
