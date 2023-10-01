---
title: typealias
thumbnail: ''
draft: false
tags:
- swift
- typealias
- generic
created: 2023-09-30
---

# Semantics Type

````swift
typealias Kilograms = Double

struct Package {
    var weight: Kilograms
}
````

# Combine Protocols

````swift
protocol ReadAccess {}
protocol WriteAccess {}

typealias AdminAccess = ReadAccess & WriteAccess
struct Teacher: AdminAccess {}
````

`Int`, `Double`은 어디서든 사용되는 타입이다. 그렇기 때문에 코드 작성시 어떤 의미로 해당 타입을 사용하는지는 코드를 읽어봐야 알 수 있다. 이런 경우 의미론적인 타입을 선언하기 위해 활용할 수 있다.

# Specializing generics

Type alias를 활용하는 다음 방법은, 코드 전반에 걸쳐, 같은 generic type을 사용하는 경우이다. 즉, 같은 generic을 사용하는데, 이 generic이 길어지는 등의 이유로 오히려 어떤 의미인지 파악하기 어렵다면 사용하자. 예를 들어, Note App을 만드는데, 그 안의 storage type을 반영하야 하는 상황을 생각해보자.

````swift
class FileStorage<Key: Hashable, Location: FileStorageLocation> {
    ...    
}

class NoteSyncController {
    init(localStorage: FileStorage<Note.StorageKey, LocalFileStorageLocation>,
         cloudStorage: FileStorage<Note.StorageKey, CloudStorageLocation>) {
        ...
    }
}
````

상당히 읽기 어렵다. 여기서 한번의 추상화를 한다면 가독성이 크게 향상될 것이다. 참, `Key: Hashable`과 같이 되어 있는 것을 generic에서 type constraints라고 한다. 해당 Type만 사용하도록 제약하는 것이다. 자세한 내용은 다음글에서 알아보자.

````swift
class FileStorage<Key: Hashable, Location: FileStorageLocation> {
    ...    
}

// Model
extension Note {
    typealias LocalStorage = FileStorage<StorageKey, LocalFileStorageLocation>
    typealias CloudStorage = FileStorage<StorageKey, CloudStorageLocation>
}

class NoteSyncController {
    init(localStorage: Note.LocalStorage,
         cloudStorage: Note.CloudStorage) {
        ...
    }
}
````

Note model안에 type alias를 두어 사용하는 측에서 가볍게 쓸 수 있도록 했다. 이렇게 하면, 구현의 세부사항 역시 Model 내부로 숨길 수 있다. 

# Type-driven Logic

각각의 object에 대한 id를 전반에서 사용할 수 있도록 만든다고 해보자. id의 특징을 `Identifiable` Protocol에 정의하고, 이를 구현체가 이를 채택함으로써 가능하게 해보자. 그런데 이 때, id를 표시하기 위해서는 이를 대표하는 값을 가져야 한다. 이럴 때 `associatedType`을 활용해서 이를 정의한다.

````swift
protocol Identifiable {
    associatedtype RawIdentifier: Codable = String

    var id: Identifier<Self> { get }
}
````

그리고 이를 준수하는 구현체를 받는 struct를 만들자.

````swift
struct Identifier<Value: Identifiable> {
    let rawValue: Value.RawIdentifier

    init(rawValue: Value.RawIdentifier) {
        self.rawValue = rawValue
    }
}
````

`Identifier` 구현체는 Identifiable을 준수하는 구현체를 rawvalue로 가진다. 

````swift
struct User: Identifiable {
    let id: Identifier<User>
    let name: String
}

struct Group: Identifiable {
    typealias RawIdentifier = Int

    let id: Identifier<Group>
    let name: String
}

let group = Group(id: Identifier<Group>(rawValue: 3), name: "wansik")
````

`Identifiable`을 준수하는 두개의 struct를 만들었다. 이 때, `User`의 경우 명시하지 않았기 때문에 RawIdentifier가 `String`으로 반영되고, `Group`의 경우 명시하여 변경할 수 있다. 즉, Protocol이 associatedType으로 type constraint가 되어 있는 경우, 이를 명시하는 방법으로 type alias를 사용할 수 있다.

추가적으로, 위와 같은 형식으로 구현할 경우, id를 type safe하게 처리할 수 있다.

# Generic Closures

````swift
typealias Handler<T> = (Result<T>) -> Void

func searchForNotes(matching query: String,
                    then handler: @escaping Handler<[Note]>) {
    ...
}
````

반복적으로 사용하는 completion Handler를 type alias로 처리할 수 있다. 조금더 의미있는 정보를 줄 수 있다. 실패시, 성공시 각각의 handler를 이런식으로 처리하면 더 읽기 좋은 코드를 만들 수 있겠다.

# Reference

* https://www.programiz.com/swift-programming/typealias
* https://betterprogramming.pub/5-ways-to-use-type-alias-in-swift-45ddce3cc941
* https://www.swiftbysundell.com/articles/the-power-of-type-aliases-in-swift/
* https://medium.com/codex/typealias-in-swift-4902f73adc6b
