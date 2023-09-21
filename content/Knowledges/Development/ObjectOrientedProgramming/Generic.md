---
title: Generic
thumbnail: ''
draft: false
tags:
- oop
- template
created: 2023-09-19
---

* 변수, 클래스, 구조체 등을 선언할 때, 해당 객체 내부에서 사용하는 타입을 고정하지 않고 임의의 타입을 사용할 수 있도록 하는 것
* 실제 사용하는 시점에 사용하는 타입을 결정한다.

````swift
struct Stack<T> {
    private var items: [T] = []
    
    mutating func push(_ item: T) {
        items.append(item)
    }
    
    mutating func pop() -> T? {
        return items.popLast()
    }
    
    func peek() -> T? {
        return items.last
    }
    
    var isEmpty: Bool {
        return items.isEmpty
    }
    
    var count: Int {
        return items.count
    }
}

// Int 타입의 스택 생성
var intStack = Stack<Int>()
intStack.push(1)
intStack.push(2)
intStack.push(3)
````
