---
title: Polymorphism Part. 01
thumbnail: ''
draft: false
tags:
- oop
- polymorphism
- binding
- dynamic-binding
- early-binding
created: 2023-09-29
---

다형성은 무엇인가? 왜 중요한가?

# Polymorphism

 > 
 > poly + morph + ism: 다양한 + 변하다 + 상태 = 다양한 형태로 변할 수 있는 능력

* 많은 사람들이 OOP의 핵심이라 여기는 특징
* 같은 지시를 내렸는데 다른 종류의 개체가 동작을 달리 하는 것
* 어떤 함수 구현이 실행될지 **실행중에 결정된다.**
  * late binding (늦은 바인딩)
  * C에서 생각해보면 함수 포인터와 비슷함
  * 일반적인 함수 호출은 early binding
    * 컴파일 중에 결정됨
* 다형성의 혜택을 받으려면 상속 관계가 필요
  * 부모 개체에서 함수 signature를 선언
  * 자식 개체에서 그 함수를 overriding
* 다른 종류의 개체를 편하게 저장 및 처리 가능
* 상속은 다형성의 필요 조건

# 무늬 vs. 실체

````java
Animal animal = new Dog()
animal.shout()
````

* 무늬: `Animal`
* 실체: `Dog`
* 이 경우 실체에 정의된 `shout()` 함수를 호출하게 된다.
* 즉, 실제 개체에 구현된 메서드를 호출한다.
* 단, 당연히 부모 클래스에서 정의한 method signature에 대해서 다형성이 적용된다.
* 자식 클래스에서 따로 정의한 method에 대해서는 접근이 불가하다.
* 즉, overriding 한 녀석에 대해서 적용된다.
  * 당연히 선택사항이다.

## Overriding vs. Overloading

* Overriding: 상속 관계에서 자식 개체가 부모 개체에 정의된 메서드를 재정의하여 사용하는 것, Method signature는 동일
* Overloading: 같은 메서드 이름을 가지고, Parameter(매개변수)의 길이, 개수들이 달라지는 것

# 다형성의 장점

* 절차적일 경우 if문 사용하여 분기해주어야 한다.
* 자료형의 코드가 클래스 안에 들어가여 캡슐화된다.
* 유지 보수성이 높아진다.
* 새로운 클래스추가시, 클래스 코드만 추가하면 된다.
* 클라이언트가 작성할 코드가 줄어든다.

## 조건문을 사용하면 OO가 아니다?

* 극단적인 사람들임
* 주장: if는 구조적 프로그래밍의 일부니, 모든 것을 다형성을 바꿔야 한다
* "모든 것": 오답
* 완전히 잘못된 주장.
* 클래스 내부 코드를 작성할 때 조건문 없이 작성하기 매우 어렵다.
* 그리고 굳이 모든걸 OO로 만들어야 할 이유가 없다.

# 늦은 바인딩 vs. 이른 바인딩

* late binding == dynamic binding
  * 어떤 구현이 딸려올지는 모름. 실행중에 결정해줌
* early binding == static binding
  * 어떤 구현이 실행되어야 하는지 정해져있음
  * C에서 동작하는 함수 호출 방식

# C 함수 포인터와의 비교

* C에서 늦은 바인딩이 가능하기는 하다.
* 바로 함수 포인터를 사용하면 된다.

````c
// 가장 마지막에 비교 함수 포인터를 넣어줌
quickSort(users, NUM_USERS, sizeof(userdata_t), compare_age_id);

int compare_age_id(const void* p0, const void* p1) {
    const userdata_t* user0 = p0;
    const userdata_t* user1 = p1;

    if (user0->age == user1->age) {
        return user0->id - user1->id;
    }

    return user0->age - user1->age;
}
````

* quickSort같은 경우, 두 요소의 대소를 비교하는 과정에 함수포인터를 넣어준다.
* 두개의 void pointer를 parameter로 받으며, 반환형은 int여야 한다.
* 이러한 타입의 함수 포인터를 넣어주면 되고, 이 구현은 각각의 활용도에 따라 달라진다.
* 그리고 실행중에 결정된다. 그렇기 때문에 늦은 바인딩이다.

# C에서의 다형성

* 비주류 언어에서는 method signature가 동일하지 않아도 다형성을 지원할 수 있다.
* 이 말의 의미는, **C에서 하는 다형성을 말하는 것이다.**
* C는 OO언어가 아님에도 불구하고 다형성이 가능하다.
* C가 먼저 나오고 OO가 나중에 등장했다.
* 그럼 C에서 다형성과 같은 방식으로 사용하던 것을 구조적으로만 바꿔서 사용하는 것이 아닐까? 하는 생각이 들 수 있다.
* 정답이다.

# C에 없는 기능은 하드웨어에 없다.

* C는 가장 단순하고 하드웨어와 가까운 언어이다.
* 그렇기 때문에, C에 있는 이유는 하드웨어에 있을 가능성이 높다.
* 만약에 없으면 하드웨어에 없을 가능성이 높다.
* 그런데 C에 없는 기능이 Java, C#, C++에 있다. 그럼 이건 뭐지?
* **다른 프로그래머가 만들어준 기능이다.**
* 예를 들어, Java에만 있는 기능은 C의 기능을 조합해서 만든 것
* 그 기능을 만든 사람: Java Compilter와 JVM을 만든 엔지니어
* **즉, 컴파일러와 JVM이 함수 포인터 같은 것을 대신 전달해주는 것이 전부다.**

# Java와 C의 기본 함수 호출 방식 비교

* C
  * 이른 바인딩
  * 원하면 늦은 바인딩 가능(함수 포인터 전달)
* Java
  * 기본적으로는 늦은 바인딩(물론 이른바인딩도 가능하긴 함)
  * == 가상 메서드 (virtual method): C++에서 보통 사용하는 용어
    * 자식 클래스에서 동작을 overriding할 수 있는 메서드
    * **다형적인 메서드**

# Reference

* [Pocu Academy](https://pocu.academy/ko)
* [Polymorphism (computer science)](https://en.wikipedia.org/wiki/Polymorphism_(computer_science))
