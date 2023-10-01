---
title: autoreleasepool
thumbnail: ''
draft: false
tags:
- swift
- autoreleasepool
- thread
created: 2023-09-30
---

autoreleasepool.. 어딘가에서 들어봤지만 언제쓰는지는 전혀 몰랐다. 한번 알아볼까?

# autoreleasepool

````swift
@IBAction func touchExecute() {
    for _ in 0...1_000_000_000 {
        let image = UIImage(named: "test")
        print("이미지 생성중... \(image.debugDescription)")
    }
}
````

이런 코드가 있다고 하자. 버튼을 누르면 1억개의 이미지가 생성된다. 지금 이 상황에서 버튼을 누르면 어떻게 될까? **화면이 멈춘다.** 기본동작이 main thread에서 이루어지기 때문이다. 그리고 메모리도 엄청나게 증가할 것이다. for 문을 벗어나기전에는 image가 메모리 위에 올라간 뒤 할당 해제되지 않기 때문이다.

````swift
@IBAction func touchExecute() {
    DispatchQueue.global().async {
        for _ in 0...1_000_000_000 {
          let image = UIImage(named: "test")
          print("이미지 생성중... \(image.debugDescription)")
        }
    }
}
````

머리를 굴려본다고, 일단 main thread를 벗어나서 스코드를 동작시켰다. (사실 이것보다 좋은 것은 operation을 만들어서 아예 concurrent하게 동작시키는게 더 빠르긴 하다) 그래서 다른 스레드에서 해당 동작을 하도록 하여 화면이 멈추는 것은 방어했다. 하지만 메모리가 증가하는 것은 변함없다. 이 상황에서 for 문 스코프 안에서 동작한 후 메모리가 해제되도록 할 수는 없을까?

````swift
@IBAction func touchExecute() {
    DispatchQueue.global().async {
        for _ in 0...1_000_000_000 {
            autoreleasepool {
                let image = UIImage(named: "test")
                print("이미지 생성중... \(image.debugDescription)")
            }
        }
    }
}
````

그 때 사용하는 것이 `autoreleasepool`이다. 해당 스코프를 벗어날 때마다 메모리를 할당시킬 수 있어, 메모리 문제를 해결할 수 있다.
