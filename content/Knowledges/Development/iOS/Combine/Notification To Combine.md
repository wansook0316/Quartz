---
title: Notification To Combine
thumbnail: ''
draft: false
tags: null
created: 2023-09-22
---

Lagacy를 Combine 전환하면서 배웠던 Tip들을 적어본다. Notification Cetner에 걸었던 Observer를 Publisher로 전환하는 것에 대한 글이다.

# publisher(for:object:)

iOS 13부터 Notification Center에서 기본적으로 제공한다. `addObserver` 했던 것을 이 property를 사용하여 변경할 수 있다. 기존에는 VC를 넘어가는 경우에 `removeObserver`를 항상해줬어야 했는데, 이렇게 할 경우 코드가 보다 간결해지고 로직을 읽기 쉬워진다는 장점이 있다.

# Publisher 사용하기

````swift
override func viewWillAppear() {
    super.viewWillAppear()
    let notification = Notification.Name("MyNotification")
    self.observer = NotificationCenter.default.addObserver(forName: notification, object: nil, queue: nil) { notification in
        // Some Action
    }

    // 또는

    self.observer = NotificationCenter.default.addObserver(self, selecter: #selector(self.reloadData(), name: notification, object: nil))
}

override func viewWillDisappear() {
    super.viewWillDisappear()
    NotificationCenter.default.removeObserver(self.observer)
}
````

기존의 경우 위와 같이 사용했을 것이다. 즉, 어딘가에서 `addObserver`를 해주고, `removeObserver`를 해주었어야 했다.

````swift

func addSubscribers() {
    let notificationName = Notification.Name("MyNotification")
    NotificationCenter.default.publisher(for: notificationName, object: nil).publisher
        .receive(on: DispatchQueue.main)
        .sink { [weak self] notification in
            self.reloadData(notification)
        }
        .store(in: &self.cancellables)
}
````

이렇게 사용하면, 해당 VC가 할당해제되는 순간 `self.cancellables`가 메모리에서 해제되면서 subscriber들이 모두 제거된다. 그래서 추가적으로 `removeObserver`를 해줄 필요가 없다.

# Notification Combine 전환하기

특정 하나의 객체에서 다양한 publisher를 보내주어야 하는 경우가 있다. 다양한 곳에서 요청이 들어오기 때문에 singleton으로 제작하는 판단이 옳았을 경우이다. 이런 경우, 각각의 화면에서 위와 같이 `NotificationCenter.default.publisher`와 같이 등록해서 사용한다면 중복된 코드도 많고 가독성이 떨어질 것이다. 

이런 경우, singleton 객체에 publisher를 아예 달아버려서, 다양한 화면에서 직접 접근하여 사용하도록 하는 것이 좋겠다. 특정 데이터가 업데이트 된 시기에, 변경된 값을 제공하는 publisher를 만든다고 생각해보자. 

````swift
final class DataManager {
    static let shared = DataManager()

    static let notificationName = Notification.Name(rawValue: "DataChange")

    private func someUpdateFunction() {
        // Do some jobs
        NotificationCenter.default.post(name: Self.notificationName, object: self, userInfo: ["update": update])
    }
}

final class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        self.observer = NotificationCenter.default.addObserver(forName: DataManager.shared.notifiactionName)
    }

    override func viewDidDisappear() {
        super.viewDidDisappear()
        NotificationCenter.default.removeObserver(self.observer)
    }
}
````

기존 같은 경우에는, 이런식으로 특정 객체에서 보낸 메시지를 Observer를 등록하여 받은 뒤 처리했다고 생각해보자. 코드는 대강 짠 것이다.

````swift
internal protocol DataManageable: AnyObject {
    var updatedPublisher: AnyPublisher<Update, Never> { get }
}

final class DataManager: DataManageable {
    static let shared = DataManager()

    private updatedSubject = PassthroughSubject<Update, Never>()

    internal updatedPublisher: AnyPublisher<Update, Never> {
        self.updatedSubect.eraseToAnyPublisher()
    }

    private func someUpdateFunction() {
        // Do some jobs
        NotificationCenter.default.post(name: Self.notificationName, object: self, userInfo: ["update": update])
        self.updateSubject.send(update)
    }
}

final class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        DataManager.shared.updatedPublisher
            .receive(on: DispatchQueue.main)
            .sink { [weak self] updatedInfo in
                // Do Some Logic..
            }
            .store(in: &self.cancellables)
    }
}

````

여기서 배울만한 점은 두개이다.

1. Protocol을 사용해서 interface를 만든 뒤에 처리할 수 있다.
1. `eraseToAnyPublisher`를 통해서 사용하는 쪽에서는 어떤 Publisher 타입인지 알지 못하게 할 수 있다. 즉, 수동적으로 만들어버릴 수 있다.

코드는 별게 없지만, 배울점이 있는 코드이다.

# 실제 사용예

````swift
NotificationCenter.default
    .publisher(for: UIDevice.orientationDidChangeNotification)
    .filter { _ in UIDevice.current.orientation == .portrait }
    .sink { _ in print("Orientation changed to portrait!") }
````

# 마무리

아직은 Combine에 대해서 제대로 공부하지 못해서 잘 알지 못하지만, 당분간 바로 사용할 수 있는 것을 기준으로 정리하고 있다. 추후 Network, Error Handling, Operator등에 대해 공부해서 글을 작성해야 할 듯하다. 끝!
