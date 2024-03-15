---
title: Error Handling
thumbnail: ''
draft: false
tags:
- error
- exception
- swift
- defer
- do-catch
- try
created: 2023-09-30
---

에러 처리는 프로그래밍에서 빼놓을 수 없다. 에러 관리를 제대로 해두어야 추후 디버깅에 있어 이득을 볼 수 있다. 미래의 나를 위한 투자?의 개념이다. 에러를 관리하는 것도 중요하지만 에러를 내는 방법, 에러를 감지하여 처리하는 방법을 아는 것 역시 중요하다. 오늘은 이러한 에러에 대해 알아보고 관리하는 방법을 배워보자. 

# 표현

````swift
enum VendingMachineError: Error {
    case invalidInput
    case insuffcientFunds(moneyNeeded: Int)
    case outOfStock
}
````

* 자판기의 동작 오류를 표현했다.

````swift
class VendingMachine {
    let itemPrice: Int = 100
    var itemCount: Int = 5
    var deposited: Int = 0
    
    // 돈을 받는 메서드
    func receiveMoney(_ money: Int) throws {
        guard money <= 0 else {
            throw VendingMachineError.invalidInput
        }
        self.deposited += money
        print("\(money)원 받음")
    }
    
    // 물건을 파는 메서드
    func vend(numberOfItems numberOfItemsToVend: Int) throws -> String {
        // 원하는 아이템의 수량이 잘못 입력되었으면 오류를 던진다.
        guard numberOfItemsToVend > 0 else {
            throw VendingMachineError.invalidInput
        }
        
        // 현재까지 넣은 돈이 구매하려는 물건의 개수 대비 금액에 비해 적으면 에러를 낸다.
        guard numberOfItemsToVend * itemPrice <= deposited else {
            let moneyNeeded: Int
            moneyNeeded = numberOfItemsToVend * itemPrice - deposited
            
            throw VendingMachineError.insuffcientFunds(moneyNeeded: moneyNeeded)
        }
        
        // 구매하려는 수량보다 비치되어 있는 아이템이 적으면 에러를 낸다.
        guard itemCount >= numberOfItemsToVend else {
            throw VendingMachineError.outOfStock
        }
        
        // 오류가 없으면 정상처리를 한다.
        let totalPrice = numberOfItemsToVend * itemPrice
        self.deposited -= totalPrice
        self.itemCount -= numberOfItemsToVend
        
        return "\(numberOfItemsToVend)개 제공함"
    }
}
````

* 오류를 던질 가능성이 있는 메서드의 경우 `throws`를 사용하여 오류 내포 함수임을 나타낸다.

# 오류 처리

* 저렇게 작성한 코드에 대해 어떻게 처리할지에 대한 코드도 작성해야 한다.
* 오류에 따라 다른 처리방법이라던지, 다른 시도를 한다던지, 사용자에게 오류를 알리고 선택을 하도록 한다던지등의 코드를 작성해야 함
* `throws`가 달려있는 함수는 `try`를 사용하여 호출한다.

## do-catch

````swift
let machine: VendingMachine = VendingMachine()

do {
    try machine.receiveMoney(0)
} catch VendingMachineError.invalidInput {
    print("입력이 잘못되었습니다.")
} catch VendingMachineError.insuffcientFunds(let moneyNeeded) {
    print("\(moneyNeeded)원이 부족합니다.")
} catch VendingMachineError.outOfStock {
    print("수량이 부족합니다.")
} // 입력이 잘못되었습니다.
````

* 가장 정석적인 방법으로 모든 오류 케이스에 대응된다.

````swift
// catch를 계속해서 쓰는 것이 귀찮다면
do {
    try machine.receiveMoney(300)
} catch /* (let error) */ { // 넘어오는 에러의 이름을 바꿔줄 수 있다. 기본은 error
    switch error {
    case VendingMachineError.invalidInput:
        print("입력이 잘못되었습니다.")
    case VendingMachineError.insuffcientFunds(let moneyNeeded):
        print("\(moneyNeeded)원이 부족합니다.")
    case VendingMachineError.outOfStock:
        print("수량이 부족합니다.")
    default:
        print("알수 없는 오류 \(error)")
    }
} // 300원 받음

````

* catch를 계속해서 쓰는 것이 귀찮다면 이렇게도 할 수 있다.

````swift
// 굳이 에러를 따로 처리할 필요가 없다면
var result: String?
do {
    result = try machine.vend(numberOfItems: 4)
} catch {
    print(error)
}
````

* 에러를 개별로 처리할 필요가 없다면 이와 같이 써도 무방하다.

## try?

* 별도의 오류 처리 결과를 통보받지 않고 오류가 발생했을 경우 결과값을 nil로 받을 수 있다.
* 즉 오류가 발생하면 nil, 발생하지 않으면 옵셔널 타입으로 리턴

````swift
let machine: VendingMachine = VendingMachine()
var result: String?

result = try? machine.vend(numberOfItems: 2)
result // Optional("2개 제공함")

result = try? machine.vend(numberOfItems: 2)
result // nil
````

## try!

* 오류가 발생하지 않을 것이라는 확신을 가질 때 사용
* 바로 값을 리턴 받을 수 있지만
* 런타임 오류가 발생

````swift
result = try! machine.vend(numberOfItems: 1)
result // 1개 제공함

//result = try! machine.vend(numberOfItems: 1)
// 런타임 오류 발생!
````

## defer

* Clean up Action
* 특정 code block을 벗어날 경우 반드시 불리게 할 수 있음
* error가 발생하면, code 실행 위치가 jump 해서 block을 빠져나가게 되는데, 이 때, 반드시 처리해야할 code를 실행하게 할 수 있음

# Reference

* [Error Handling](Development/Clean%20Code/Error%20Handling.md)
