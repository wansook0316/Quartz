---
title: KeyPath
thumbnail: ''
draft: false
tags:
- swift
- keypath
- KVC
- key-value-coding
created: 2023-09-30
---

이전 글들에서 Objective C의 KeyPath와 Swift에서의 KeyPath를 한번씩 보았다. 모양이 좀 달랐었는데 왜 다른지에 대해서 알아보자. 이번 글은 WWDC 17을 기준으로 한다.

# KeyPath in Swift 3

위의 KVC, KVO in Swift 글에서 바라본 KeyPath이전에 사용되던 KeyPath가 있었다.

````swift
// Swift 3 String Key Paths

@objcMembers class Kid : NSObject {
    dynamic var nickname: String = ""
    dynamic var age: Double = 0.0
    dynamic var bestFriend: Kid? = nil
    dynamic var friends: [Kid] = []
}

var ben = Kid(nickname: "Benji", age: 5.5)
let kidsNameKeyPath = #keyPath(Kid.nickname) // Swift 3

let name = ben.valueForKeyPath(kidsNameKeyPath)
ben.setValue("Ben", forKeyPath: kidsNameKeyPath)
````

`#`을 사용한 KeyPath를 통해 Swift에서 KVC를 사용하는 방식이었다. Compile time에는 `#keyPath(Kid.nickname)`을 String으로 변경하고 Objective C Runtime을 활용해서 객체를 찾게 된다. 즉, 이렇게 깔쌈한 방식으로 KeyPath를 사용하여, 기존에 String을 사용했을 때보다 안전성을 높혔음에도 불구하고, 근본은 Objective C runtime을 사용하고 있다는 것이다. Type에 대한 정보도 없는 순수한 String이다. 그렇기 때문에 Return value도 Any로 받았어야 했다.

````swift
valueForKeyPath(_: String) -> Any
setValue(_, forKeyPath: String) -> Any
````

# New KeyPath

![](Swift_22_KeyPath_0.png)

Swift에서 제공하는 KeyPath의 모양은 위와 같이 변경되었다. 

![](Swift_22_KeyPath_1.png)

Swift이기 때문에 Type 추론도 가능하다. 또한 Sequence로 연결해서 사용하는 것 역시 가능하다.

![](Swift_22_KeyPath_2.png)

Optional도 가능하고, Subscript도 가능하다.

![](Swift_22_KeyPath_3.png)

Subscript로 직접 사용도 가능하며, Type 추론까지하면 아래와 같이 사용도 할 수 있다.

````swift
// Using Swift 4 KeyPaths
struct BirthdayParty { 
    let celebrant: Kid 
    var theme: String 
    var attending: [Kid]
}

let bensParty = BirthdayParty(celebrant: ben, theme: "Construction", attending: []) 

let birthdayKid = bensParty[keyPath: \BirthdayParty.celebrant] // == \.celebrant

bensParty[keyPath: \BirthdayParty.theme] = "Pirate" // == \.theme
````

그래서 최종적으로 변경사항을 적용하면 이와 같게 된다. Objective-C runtime을 사용하지 않고 바로 적용이 가능하다. 또한 Value type임에도 처리가 가능하다!

# KeyPath Type

![](Swift_22_KeyPath_4.png)

````swift
let birthdayKidsAgeKeyPath = \BirthdayParty.celebrant.age // KeyPath<BirthDayParty, Double>
let birthdayBoysAge = bensParty[keyPath: birthdayKidsAgeKeyPath] // Double
````

KeyPath라는 Type이 생겼다. Base Type과 Property의 실제 Type을 적어서 선언할 수 있다.

````swift
func partyPersonsAge(party: BirthdayParty,
                     participantPath: KeyPath<BirthdayParty, Kid>) -> Double {
    let kidsAgeKeyPath = participantPath.appending(\.age)
    return party[keyPath: kidsAgeKeyPath] 
}
````

Type으로 있는 KeyPath를 받아 원하는 Type을 리턴하는 함수를 만들 수도 있겠다.

# The .appending Rule

이런 특징들을 통해 KeyPath끼리 append하는 것도 가능하다.

![](Swift_22_KeyPath_5.png)

![](Swift_22_KeyPath_6.png)

보면 알겠지만, 순차적으로 Type이 맞는 경우 연산을 통해 최종적으로 원하는 KeyPath를 얻을 수 있다.

# Other KeyPaths

![](Swift_22_KeyPath_7.png)

|Type|Description|
|----|-----------|
|`AnyKeyPath`|타입이 지워진 KeyPath|
|`PartialKeyPath`|부분적으로 타입이 지워진 KeyPath|
|`KeyPath`|Read-only <br> get하는 용도로만 사용가능|
|`WriteableKeyPath`|Value type instance에 사용가능 <br> "변경 가능한" 모든 Property에 대해(`var`) read & write access 제공|
|`ReferenceWriteableKeyPath`|Reference type instance에 사용가능 <br> "변경 가능한" 모든 Property에 대해(`var`) read & write access 제공|

만약 같은 KeyPath를 계속해서 적어줘야 한다면 얼마나 불편할까?

````swift
let bensParty = BirthdayParty(celebrant: ben, theme: "Construction", attending: []) 

let birthdayKid = bensParty[keyPath: \BirthdayParty.celebrant] // == \.celebrant

bensParty[keyPath: \BirthdayParty.theme] = "Pirate"
bensParty[keyPath: \BirthdayParty.theme] = "Villan"
bensParty[keyPath: \BirthdayParty.theme] = "Hero"
````

이런 경우 이를 Type으로 정의한 뒤 재사용하면 편할 것 같다. 이런 경우 `writeableKeyPath`를 사용해야 한다. Value Type의 Property에 대해 write까지 가능해야하기 때문이다.

````swift
struct BirthdayParty { 
    let celebrant: Kid 
    var theme: String 
    var attending: [Kid]
}

let bensParty = BirthdayParty(celebrant: ben, theme: "Construction", attending: []) 

let birthdayKid = bensParty[keyPath: \BirthdayParty.celebrant] // == \.celebrant

let writeableKeyPath = \BirthdataParty.theme

bensParty[keyPath: writeableKeyPath] = "Pirate"
bensParty[keyPath: writeableKeyPath] = "Villan"
bensParty[keyPath: writeableKeyPath] = "Hero"
````

이런식으로 다양한 KeyPath가 준비되어 있다. 지금 같은 경우는 수정하는 작업(write)을 하고 있기 때문에 자동으로 타입 추론하여 writeableKeyPath가 된 상태이다. 그래서 변수명도 그렇게 지어주었다.

````swift
class BirthdayParty { // Changed
    let celebrant: Kid 
    var theme: String 
    var attending: [Kid]
}

let bensParty = BirthdayParty(celebrant: ben, theme: "Construction", attending: []) 

let birthdayKid = bensParty[keyPath: \BirthdayParty.celebrant] // == \.celebrant

let referenceWriteableKeyPath = \BirthdataParty.theme

bensParty[keyPath: referenceWriteableKeyPath] = "Pirate"
bensParty[keyPath: referenceWriteableKeyPath] = "Villan"
bensParty[keyPath: referenceWriteableKeyPath] = "Hero"
````

이번에는 Class로 변경해주었다. 이 경우에는 type 추론하여 ReferenceWriteableKeyPath으로 변경된다.

````swift
class BirthdayParty { 
    let celebrant: Kid 
    let theme: String // Changed
    var attending: [Kid]
}

let bensParty = BirthdayParty(celebrant: ben, theme: "Construction", attending: []) 

let birthdayKid = bensParty[keyPath: \BirthdayParty.celebrant] // == \.celebrant

let keyPath = \BirthdataParty.theme

bensParty[keyPath: keyPath] = "Pirate" // Cannot Assign through subscript: 'keypath' is a read-only key path
bensParty[keyPath: keyPath] = "Villan" // Cannot Assign through subscript: 'keypath' is a read-only key path
bensParty[keyPath: keyPath] = "Hero"   // Cannot Assign through subscript: 'keypath' is a read-only key path
````

만약 변경하고자 하는 property의 선언이 `let`으로 변경되면 어떨까? 이 경우에는 type 추론이 동작하여 `KeyPath`로 변경된다. 이 경우, write 동작이 불가하다.

# Key Path 함수로 사용하기

Swift5.2 에서는 Key Path Expressions 을 함수로 사용할 수 있도록 하는 Proposal이 구현되었다. `\Root.value`를 적음으로써 `(Root) -> Value`의 와 같은 함수 형태로 사용할 수 있다. 여기서 [rootType](https://developer.apple.com/documentation/swift/anykeypath/2894205-roottype)은 keypath가 가지고 있는 타입 이름이다. 

해당 이슈 발제자는, `users.map { $0.email }`과 같은 구문이 있을 때, 보다 깔끔하게 표현하는 방법이 있다 했고, 그 답이 keyPath라 했다. 최종적으로 `users.map(\.email)`과 같이 사용하는 것을 제안했고, 이를 keypath를 입력했을 시 이를 clouser 형태로 변환하는 것으로 가능하게 하자고 했다.

````swift
// You write this:
let f: (User) -> String = \User.email

// The compiler generates something like this:
let f: (User) -> String = 
{ 
    kp in { 
        root in root[keyPath: kp] 
    } 
}(\User.email)
````

`\User.email`이라고 적을 시, Compiler가 이를 아래와 같은 function으로 생성하고, 이를 통해 위에 적은 동작을 가능하게 하자 제안했다. 실제로 구현되어 사용이 가능하다.

# 마무리

이렇게 저번 글에서 제대로 알아보지 못했던 KeyPath에 대해서 정리해보았다. 끝!

# Reference

* [What's New in Foundation](https://developer.apple.com/videos/play/wwdc2017/212/)
* [what's the difference between single key and keypath?](https://stackoverflow.com/questions/4269568/whats-the-difference-between-single-key-and-keypath)
* [value(forKeyPath:)](https://developer.apple.com/documentation/objectivec/nsobject/1416468-value)
* [setValue(\_:forKeyPath:)](https://developer.apple.com/documentation/objectivec/nsobject/1418139-setvalue)
* [SE-0249](https://github.com/apple/swift-evolution/blob/master/proposals/0249-key-path-literal-function-expressions.md)
* [rootType](https://developer.apple.com/documentation/swift/anykeypath/2894205-roottype)
