---
title: Completion in main thread
thumbnail: ''
draft: false
tags:
- main-thread
- completion
- callback
- swift
- GCD
- grand-central-dispatch
created: 2023-10-01
---

Completion은 main에서 호출해주는 것이 좋다.

# 이유

* api를 호출하고, 결과가 도착한 경우 completion을 호출하는 함수가 있다고 하자.
* 도착한 시점에 해당 코드를 사용하는 클라이언트에서 넣은 completion을 그냥 호출한다면 어떻게 될까?
* 클라이언트가 수행할 동작이 만약 UI 업데이트를 하는 동작일 경우, main에서 동작할 수 있도록 추가해주어야 한다.

````swift
private func test() {
    self.service.fetch { [weak self] data in
        DispatchQueue.main.async {
            self.updateUI(with data)
        }
    }
}
````

* 당장은 괜찮지만, 해당 service를 여러곳에서 사용한다면 모든 곳에 `DispatchQueue.main.async` 가 필요해진다.
* app과 같은 곳에서 다른 thread를 사용해서 처리할 곳이 얼마나 될까?
* 보통은 api 호출 후 UI 업데이트가 일반적일 것이다.
* 백엔드와 같이 성능이 중요한 작업이 아니라면, 당장 적용해야 하는 작업의 방식에 맞추는게 보다 좋다.
* 즉, UI 개발의 경우에는 completion을 api 호출하는 쪽에서 main에서 돌려주는 것이 보다 코드의 지저분함과 안정성을 높일 수 있는 방법이다.

````swift

internal func fetch(completion: (data: String) -> Void) {
    // 데이터 받은 후,

    DispatchQueue.main.async {
        completion(data)
    }
}
````
