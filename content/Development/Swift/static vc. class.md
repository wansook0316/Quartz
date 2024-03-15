---
title: static vc. class
thumbnail: ''
draft: false
tags:
- swift
- static
- class
- functions
created: 2023-09-30
---

enum에 static 변수를 사용해서 관리를 하다가 문득 이런 생각이 들었다. Type property에는 2가지 종류, `static`, `class`가 있는데 뭐가 다른거지? 이참에 헷갈렸던 용어까지 몽땅 정리해보려 한다.

일단 `static`, `class`에 대해서 생각해보면 두가지 상황에서 사용할 수 있다. method의 경우와 property의 경우이다. 각각 설명해보겠다.

# static, class Method

![](Swift_27_staticVSClass_0.png)

 > 
 > override 가능 여부의 차이

결론부터 말하자면, `static`의 경우 `override`가 불가하고, `class`의 경우 가능하다. 그렇다는 얘기는 **`static`과 `class` 키워드의 경우 struct, enum에서는 같은 동작**을 한다는 것이다. 왜냐하면 애초에 struct와 enum은 override가 불가하기 때문이다. 나같으면 static을 사용하겠다.

````swift
class SampleClass {
    static func staticFunction() {
        print("난 static function이얌")
    }
    
    class func classFunction() {
        print("난 class function이얌")
    }
}

struct SampleStruct {
    // Working
    static func staticFunction() {
        print("난 static function이얌")
    }
    // Not Working: Class methods are only allowed within classes; use 'static' to declare a static metho
    class func classFunction() {
        print("난 class function이얌")
    }
}

enum SampleEnum {
    // Working
    static func staticFunction() {
        print("난 static function이얌")
    }
    // Not Working: Class methods are only allowed within classes; use 'static' to declare a static metho
    class func classFunction() {
        print("난 class function이얌")
    }
}
````

오 역시나, 애플이다. 아예 사용이 불가능한 녀석, 즉 struct, enum에서 `class` 키워드를 사용한 메서드를 만들려고하니 compile 에러가 뜬다. 좋다. **class에서만 `class` keyword를 사용할 수 있다.**

그러면 class 변수를 사용하면 정말로 override가 가능할까?

````swift
class SampleClass {
    // Working
    static func staticFunction() {
        print("난 static function이얌")
    }
    // Not Working
    class func classFunction() {
        print("난 class function이얌")
    }
}


class SubSmapleClass: SampleClass {
    override static func staticFunction() {
        // Compile Error!: Method does not override any method from its superclass
    }
    override class func classFunction() {
        // No Error!
    }
    
}
````

실제로 에러가 나지 않는 것을 확인할 수 있었다.

## final keyword

흠 그러면 class function에 final keyword를 적어서 override가 더이상 되지 않는다는 것을 명시하면 해결되는 문제 아닌가? 맞다. 취향 차이다. 그런데 나같으면 안쓸 것 같다. 일단 알고는 있자.

````swift

class SampleClass {
    class final func classFunction() {
        print("난 class function이얌")
    }
}


class SubSmapleClass: SampleClass {
    override class func classFunction() {
        // Compile Error!: Class method overrides a 'final' class method
    }
}
````

# static, class Property

 > 
 > 역시나 override 가능 여부의 차이

역시나 결론 부터 말하자면 같다. 하지만 조금 정확히 알 필요가 있다. 일단 Property를 어떻게 구분하는지부터 알아보자.

![](Swift_27_staticVSClass_1.png)

Property를 논리적으로 구분해보면 위와 같다. 변경 여부는 `let`, `var`를 말한다. 간단하기 때문에 경우의 수 조합에서는 제외하도록 하겠다. 여기서, 이 조합으로 만들어지는 녀석들을 만들어보면 이렇게 된다.

* Instance Stored Property
* Instance Computed Property
* Type Stored Property: 주인공
* Type Computed Property: 주인공

이 각각에 대해 간단하게 알아보면서 이해해 볼 것이다.

## Instance Stored Property

````swift
class SampleClass {
    let storedImmutableProperty: String = "인스턴스 저장 불변 프로퍼티"
    var storedMutableProperty: String = "인스턴스 저장 가변 프로퍼티"
}

struct SampleStruct {
    let storedImmutableProperty: String = "인스턴스 저장 불변 프로퍼티"
    var storedMutableProperty: String = "인스턴스 저장 가변 프로퍼티"
}
````

Instance에 "저장" 되는 녀석이다. 보통 우리가 많이 사용하는 녀석이라 생각하면 된다. 

## Instance Computed Property

````swift
class SampleClass {
    // Not Working
    let computedImmutablePropertyNOTWORKING: String { // 계산 프로퍼티는 let을 사용할 수 없다.
        return "인스턴스 계산 불변 프로퍼티"
    }
    // Working
    var computedMutableProperty: String {
        "인스턴스 계산 가변 프로퍼티"
    }
}

struct SampleStruct {
    // Not Working
    let computedImmutablePropertyNOTWORKING: String { // 계산 프로퍼티는 let을 사용할 수 없다.
        "인스턴스 계산 불변 프로퍼티"
    }
    // Working
    var computedMutableProperty: String {
        "인스턴스 계산 가변 프로퍼티"
    }
}
````

계산 프로퍼티의 경우에는 일종의 함수라 생각해도 무방하다. 호출되는 순간 값이 계산되어 리턴한다. 이 과정에서 instance에 계속해서 남아있지 않기 때문에 computed라 부른다.

하지만 주의할 점이 있는데, **computed property의 경우 `let`을 사용할 수 없다.**

## Type Stored Property

이제 드디어 우리가 알고 싶은 녀석들이 나온다.

````swift
class SampleClass {
    // static: Working
    static let staticStoredImmutableProperty: String = "타입 저장 불변 프로퍼티"
    static var staticStoredMutableProperty: String = "타입 저장 가변 프로퍼티"
    
    // class: Not working
    // Error: Class stored properties not supported in classes;
    class let classStoredImmutableProperty: String = "타입 저장 불변 프로퍼티"
    class var classStoredMutableProperty: String = "타입 저장 가변 프로퍼티"
}

struct SampleStruct {
    // static: Working
    static let staticStoredImmutableProperty: String = "타입 저장 불변 프로퍼티"
    static var staticStoredMutableProperty: String = "타입 저장 가변 프로퍼티"
    
    // class: Not working
    // Error: Class properties are only allowed within classes; use 'static' to declare a static property
    class let classStoredImmutableProperty: String = "타입 저장 불변 프로퍼티"
    class var classStoredMutableProperty: String = "타입 저장 가변 프로퍼티"
}

enum SampleEnum {
    // static: Working
    static let staticStoredImmutableProperty: String = "타입 저장 불변 프로퍼티"
    static var staticStoredMutableProperty: String = "타입 저장 가변 프로퍼티"
    
    // class: Not working
    // Error: Class properties are only allowed within classes; use 'static' to declare a static property
    class let classStoredImmutableProperty: String = "타입 저장 불변 프로퍼티"
    class var classStoredMutableProperty: String = "타입 저장 가변 프로퍼티"
}
````

일단 정적 타입 즉, `static`, `class`의 경우 struct, class, enum 모두에서 선언가능하기 때문에, 모두 적어보았다. 신기한 결과가 나왔는데, class에서는 **`class` 키워드로 Type Stored property를 만들 수 없었다.** `static` 키워드로만 생성이 가능했다. 다음에 나오겠지만 computed property의 경우 class에서 `class` 키워드를 사용하는 것이 가능했다.

또한 `class`라는 이름 답게, struct, enum에서는 아예 사용이 불가했다. 역시 막아두는게 좋은 판단인 듯 하다.

## Type Computed Property

````swift

class SampleClass {
    // Not Working: 계산 프로퍼티는 let이 불가함
    static let staticComputedImmutableProperty: String {
        return "타입 계산 불변 프로퍼티"
    }
    // Working
    static var staticComputedMutableProperty: String {
        return "타입 계산 가변 프로퍼티"
    }
    
    // Not Working: 계산 프로퍼티는 let이 불가함
    class let classComputedImmutableProperty: String {
        return "타입 계산 불변 프로퍼티"
    }
    // Working
    class var classComputedMutableProperty: String {
        return "타입 계산 가변 프로퍼티"
    }
}

struct SampleStruct {
    // Not Working: 계산 프로퍼티는 let이 불가함
    static let staticComputedImmutableProperty: String {
        return "타입 계산 불변 프로퍼티"
    }
    // Working
    static var staticComputedMutableProperty: String {
        return "타입 계산 가변 프로퍼티"
    }
    
    // Not Working: 계산 프로퍼티는 let이 불가함, class keyword는 class에서만 사용가능함
    class let classComputedImmutableProperty: String {
        return "타입 계산 불변 프로퍼티"
    }
    // Not Working: struct에서는 class type을 사용할 수 없음
    class var classComputedMutableProperty: String {
        return "타입 계산 가변 프로퍼티"
    }
}

enum SampleEnum {
    // Not Working: 계산 프로퍼티는 let 사용이 불가함
    static let staticComputedImmutableProperty: String {
        return "타입 계산 불변 프로퍼티"
    }
    // Working
    static var staticComputedMutableProperty: String {
        return "타입 계산 가변 프로퍼티"
    }
    
    // Not Working: 계산 프로퍼티는 let 사용이 불가함
    class let classComputedImmutableProperty: String {
        return "타입 계산 불변 프로퍼티"
    }
    // Not Working: enum에서는 class type을 사용할 수 없음
    class var classComputedMutableProperty: String {
        return "타입 계산 가변 프로퍼티"
    }
}
````

거의 모든 녀석들이 혼합된 형태다! 이걸 이해했다면 방식은 모두 이해했다고 볼 수 있다.

# 마무리

* `class` keyword는 Class type에서만 사용한다. override가 가능하기 때문이다.
* `class` keyword를 class에서 Type property로 사용하고 싶다면 **computed property**만 가능하다. stored property를 사용하고 싶다면 `static`을 사용하자.

이렇게 정리하고나니 정적 변수는 언제 사용하는 것이 좋은지에 대한 고민이 생겼다. 다음에 작성해보도록 하겠다. 끝!

# Reference

* [\[Swift\] class func vs static func](https://sujinnaljin.medium.com/swift-class-func-vs-static-func-7e6feb264147)
