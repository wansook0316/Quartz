---
title: Safe Array Lookup
thumbnail: ''
draft: false
tags:
- swift
- Array
- safe
- index
- out-of-range
- crash
created: 2023-09-30
---

인덱스로 Array 아이템을 탐색하다보면 항상 마주하는 것이 있다. `Fatal error: Index out of range`. 잘못하면 런타임에 애플리케이션이 바로 죽어버리기 마련이다. 아무리 염두에 둔다하더라도 우리는 사람인 이상 실수를 하기 마련이다.

````swift
if index < array.count {
	// 작업 수행
}
````

이런식으로 방어코드를 짜주어야 하는데 여간 귀찮은게 아니다. 그리고 코드도 덜이쁘다.

# Safe

Collection Type은 [indices](https://developer.apple.com/documentation/swift/collection/1786763-indices#)라는 값을 가진다. 내부에는 유효한 값의 범위를 가지고 있다.
![](155247353-30cc931f-3cb4-41d0-aa29-ecf47659d46b.png)

이러한 점을 바탕으로 Subscript를 추가하여 사용한다면 보다 간결하고 안전하게 사용이 가능하다.

````swift
extension Collection {
    subscript(safe index: Index) -> Iterator.Element? {
        // iOS 9 이후
        guard indices.contains(index) else {
            return nil
        }
        return self[index]
        
        // iOS 8 이전 (하위호환)
        // return startIndex <= index && index < endIndex ? self[index] : nil
        // return 0 <= index && index < self.count ? self[index] : nil
    }
}
````

주의할 점은, indices가 iOS9부터 지원되기 때문에, 하위 호환을 맞추기 위해서는 위와 같이 방어 코드를 삽입해주어야 한다는 것이다.

# Reference

* [Safe (bounds-checked) array lookup in Swift, through optional bindings?](https://stackoverflow.com/questions/25329186/safe-bounds-checked-array-lookup-in-swift-through-optional-bindings/30593673#30593673)
* [\[Swift\]안전하게 배열 조회하기](http://minsone.github.io/programming/check-index-of-array-in-swift)
