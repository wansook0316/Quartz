---
title: Singleton
thumbnail: ''
draft: false
tags:
- oop
- singleton
created: 2023-09-29
---

디자인 패턴의 가장 첫번째인 싱글톤을 알아보자.

# Singleton 정의

* 특정 클래스에서 만들 수 있는 인스턴스 수를 하나로 제한
* 조건
  * 프로그램 실행 중에 최대 하나만 있어야 함
    * Setting, file system
  * 전역적 접근 지점을 제공해야 함

# Singleton의 비공식적 정의

* static 사용에 대한 비판을 해결하는 패턴
* 즉, OO에서 전역 변수 및 전역 함수를 만드는 법

# Singleton

![](ObjectOrientedProgramming_08_Singleton_0.png)

* 더 자세한 설명은, [Singleton](Knowledges/Development/Design%20Patterns/Singleton.md)를 참고하자.
* Class Diagram이 어색하다면, [여기](https://velog.io/@wansook0316/Class-Diagram)를 참고하자.

# Singleton Example

이전에 살펴본 `Math` Class를  [Singleton](Knowledges/Development/Design%20Patterns/Singleton.md)으로 바꾼뒤 사용하면 다음과 같이 된다.

````java
int absValue = Math.abs(-2); // static 없으므로 컴파일 오류

Math math = Math.getInstance();
int minValue = math.min(-2, 1);
int maxValue = Math.getInstance().max(3, 100);
````

# Singleton vs. static

## static으로 못하는 일

1. 다형성을 사용할 수 없다.
1. Signiture를 그대로 둔 채, multiton 패턴으로 바꿀 수 없다.
   * 즉, instance가 한개인 상황(singleton)에서 여러개인 상황(multiton)으로 바꿀 수 없다.
1. 개체의 생성 시점을 제어할 수 없다.
   * Java의 `static`은 프로그램 실행시 초기화됨
   * 물론 singleton도 생성 시기를 제어하는데 어려움이 있음

## Singleton 개체의 생성 시기

* `getInstance()` 메서드를 호출될 때 생성된다.
* 하지만 보통 다양한 개체에서 해당 메서드를 호출한다.
* 그렇기 때문에, 어떤 개체가 먼저 사용하느냐에 따라 해당 객체의 생성시점은 달라진다.

### 초기화 순서를 보장하는 방법

* 보통은 문제가 없다.
* 하지만 외부 API를 사용하는 경우 순서가 유의미 할 수도 있다.
* 이런 경우 프로그램 시작 시 여러 싱글턴의 `getInstance()`를 순서대로 호출하여 순서를 보장할 수 있다.
  * `B.getInstance(); C.getInstance(); A.getInstance()`

## 싱글턴 생성시 인자가 필요한 경우

* 마찬가지로 프로그램 시작 시 인스턴스를 만들어 나중에 사용하는 개체들의 인스턴스를 보장하면 된다.
* Swift에서는 이러한 경우 어떻게 해야할지.. [공식 문서](https://developer.apple.com/documentation/swift/managing-a-shared-resource-using-a-singleton)에도 이렇게 나와 있어 파악하기가 어렵다 ㅠ

## Singleton의 변형

* 현재의 구현으로는 표현이 어렵다.
* 그래서 실무에서는 다른 변형을 사용하기도 한다.
* 즉, 이러한 점에서 디자인 패턴은 그저 가이드라인 이라는 것.

````Java
// 프로그램 실행시 호출
public static void createInstance(Dependency1 dep1, Dependency2 dep2) {
    assert(instance == null): "do not create instance twice";

    instance = new Singleton(dep1, dep2)
}

// 프로그램 종료시 호출
public static void deleteInstance() {
    assert(instance != null): "no instance to delete";

    instance = null;
}

// 인스턴스가 필요한 경우 호출
public static Singleton getInstance() {
    assert (instance != null): "no instance was created before getInstance()";

    return instance;
}
````

* 그래서 위와 같이 사용한다.
* **생성과 반환 시점을 분리한다.**
* 이 과정에서 `assert`문을 사용하여, 초기 사용시에 instance가 만들어졌는지 런타임에 확인한다.
  * 디버깅이 조금 편해진다.
* 이 때, `getInstance()` 역시 변경되었다.
  * `createInstance()` 코드가 먼저 호출되었다는 가정으로 동작하는 코드
  * 언제나 유효한 상태를 추구하는 OO 정신에는 위배됨
* 실행시 초기화, 종료시 청소하는 함수는 빼먹기 어려운 함수. 그래서 그나마 용인 가능
  * **하지만 이 실수를 하지 않도록 나를 만드는게 더 우선이 되어야 함**
* 괜히 이런 문제를 잡자고 더 어렵게 만드는 것은 **오버 엔지니어링**
  * 안전 수칙으로 해결될 수 있는 문제를 기술적으로 푸는 것은, 
  * 근본적으로 **"문제를 효율적으로 해결"하자는 엔지니어의 신조에 어긋난 것**

# Singleton은 안티패턴인가?

 > 
 > 안티패턴: 안좋은 방법 - 예) 매직 넘버, 매직 스트링

1. 근본적으로 static과 같잖아
1. 싱글턴을 안쓰고 같은 일 할 수 있잖아
   * 근데 쓸데 없이 복잡해짐
   * 모든 것이 개체여야만 하는 실용적 이유가 있는가? 없으니 패스

## 모든 것은 도구에 불과

* 특정 문제에 잘 맞는 도구를 사용하면 그만이다.
* 싱글톤도 그런 도구중 하나이다.

# Reference

* [Pocu Academy](https://pocu.academy/ko)
* [Singleton](Knowledges/Development/Design%20Patterns/Singleton.md)
* [Class Diagram](https://velog.io/@wansook0316/Class-Diagram)
* [Managing a Shared Resource Using a Singleton](https://developer.apple.com/documentation/swift/managing-a-shared-resource-using-a-singleton)
