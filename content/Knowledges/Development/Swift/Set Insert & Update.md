---
title: Set Insert & Update
thumbnail: ''
draft: false
tags: null
created: 2023-09-30
---

Collection 중 Set을 사용하다가 문득, `insert`와 `update`의 차이가 뭔지 궁금해졌다!

# Insert

 > 
 > Inserts the given element in the set if it is not already present.

 > 
 > 해당 요소가 없는 경우 삽입

````swift
@discardableResult mutating func insert(_ newMember: Element) -> (inserted: Bool, memberAfterInsert: Element)
````

엥? 튜플을 리턴하는 것을 볼 수 있다. 아하 그러면 내가 요소를 insert 했을 때, 정말 들어갔는지 안들어갔는지 확인해볼 수 있겠다.

````swift
var testSet: Set<String> = ["wansook", "bansook", "egg"]

print(testSet.insert("iOS"))
print(testSet.insert("wansook"))

````

````
(inserted: true, memberAfterInsert: "iOS")
(inserted: false, memberAfterInsert: "wansook")
````

요소가 없는 경우에는 잘 들어가고, 있는 경우에는 들어가지 않았음을 명확하게 확인할 수 있었다.

# Update

 > 
 > Inserts the given element into the set unconditionally.

 > 
 > 무조건적으로 삽입

````swift
@discardableResult mutating func update(with newMember: Element) -> Element?
````

원형이 다르다. 무조건적으로 삽입하기 때문에, 즉 새로운 값으로 대체된다. 이로인해 반환되는 값은 항상 "새 값"이다. 그런데 반환 값이 Optional인데?

그렇다면 언제 제값을 반환하고 언제 nil을 반환할까?

````swift
var testSet: Set<String> = ["wansook", "bansook", "egg"]

print(testSet.update(with: "iOS"))
print(testSet.update(with: "wansook"))
````

````
nil
Optional("wansook")
````

아하! Set에 없는 원소를 update하는 경우, nil을 반환하고, 이미 있을 경우 대체된 녀석을 반환한다.

즉, 새롭게 반환되었을 경우, 그 요소를 반환한다. 새롭게 반환되지 않은 경우에는 nil을 반환한다.

# 마무리

생각보다 별 것 없을 줄 알았지만 내부 동작이 달라서 신선했다. 끝!

# Reference

* [insert(\_:)](https://developer.apple.com/documentation/swift/set/3128848-insert)
* [update(with:)](https://developer.apple.com/documentation/swift/set/3128861-update)
