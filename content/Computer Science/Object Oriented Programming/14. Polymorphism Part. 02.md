---
title: Polymorphism Part. 02
thumbnail: ''
draft: false
tags:
- oop
- polymorphism
- binding
- early-binding
- late-binding
- final
created: 2023-09-29
---

Early Binding과 Late Binding은 성능에서 어떤 차이가 나는가? 실제로는 어떻게 사용하는가? 알게 모르게 당연하게 사용하고 있는 다형적 메서드는 무엇이 있을까?

# 이른 바인딩 vs. 늦은 바인딩 - 성능적 측면

* 당연히 이른 바인딩이 CPU 최적화 가능성이 더 높다.
* 즉, 나은 성능을 가져올 가능성이 높다.
* 컴파일러가 어떤 함수를 호출해야 하는지 알고 있고,
* 그렇기 때문에 컴파일 중에 충분한 시간을 가지고 최적화를 할 수 있다.
* 실행중에는 이렇게 충분한 시간을 사용할 수 없다.
* 빌드 시간은 오래 걸려도 상관없다. 다만, 실행시에 오래걸리는 것은 얘기가 다르다.

# 다형성 지원 언어에서의 이른 바인딩

* 일단은 각 언어의 compiler에 따라 달라질 수 있다. 
* 그래서 각 언어 특성에 따라 공부해보아야 한다.
* `final` 키워드를 달면, 이른 바인딩으로 처리할 수 있다.

# final keyword

 > 
 > "더이상 수정할 수 없어. 그대로 가져다 사용해"

* 자식에서 override 불가
* 이른 바인딩이 가능
* 정확한 내용은 각 언어의 스펙을 확인할 것. 다만, 이런 경우 바꾸는 것이 효율적이므로 그렇게 동작할 것
* Swift의 경우에는 "Method Dispatch"를 기반으로 살펴보면 도움이 된다.

## final의 의미

 > 
 > final에 어긋나는 코드를 작성하면 모두 **컴파일 오류**

* 변수 앞
  * 더이상 변수 값을 변경할 수 없음
  * `public final int MAX_STUDENT = 10`
* 클래스 앞
  * 더이상 상속 불가
  * 자식 클래스 존재할 수 없음
  * 오버라이딩도 당연히 불가
* 메서드 앞
  * 자식 클래스에서 해당 메서드를 오버라이드할 수 없음
* 파라미터 앞
  * 아래 코드와 같은 일을 할 수 없다.
  * 내부에서 재할당을 막는 기능이다.

````java
public void save(final Person person) {
   person = new Person();
    entityManager.persist(person);
}
````

## final Best Practice

* 변수, 메서드, 클래스 가능하면 모두 `final`을 붙인다.
* 나중에 상속 및 변경해야하는 순간에 final을 뺀다.
* 예외
  * 상속 및 변경이 잦을 것으로 예상되는 클래스나 메서드
  * 외부에 제공하는 라이브러리 (즉각적으로 변경할 수 없어 귀찮아짐)
* 다만, 업계에서 실제로 이렇게까지 하는 경우는 드물다.

# Object의 다형적 메서드

* 아무생각 없이 사용했던 메서드들이 어디에 있었을까?
* 일반화의 끝판왕, `Object`에 있다.
* Java에서 사용하는 모든 Calss는 모두 `Object`에서 상속받는다.
* 그렇기에 `Object`에 있는 메서드들은 어떤 클래스에서도 오버라이딩이 가능하다.

![](ObjectOrientedProgramming_13_Polymorphism-2_0.png)

* 자주 쓰이는 메서드들 몇개만 살펴보도록 하자.

## toString()

* 해당 개체를 문자열로 표현해주는 메서드
* 기본구현: `getClass().getName() + '@' + Integer.toHexString(hashCode())`
  * `hashCode()`는 뒤에서 알아보자.
* String 경우에는 내용물을 보여주는게 좋으니 이런 경우 오버라이드하면 되겠다.
* 사실 공식 문서에는 이 메서드를 모든 클래스에서 오버라이딩하라고 권장하기는 한다.
  * ~~근데 잘 안한다..~~

## equals()

* 무엇이 같은 것이라 할 수 있을까?
* 개념적으로(내용)? 물리적으로(주소)?, 어느 정도 집합 깊이에서 같다고 정의해야 하는가?
* 이건 **만드는 놈이 정의할 수 밖에 없다.**
* 기본 구현: 단순한 주소 비교 (`this == obj`)
  * 데이터를 일일히 비교하지 않는다.
  * 컴퓨터 입장에서는 이 정의가 기본적으로 맞는 것.

````java
Person person0 = new Person("wansik", "choi");
Person person1 = new Person("wansik", "choi");
Person person2 = person0;

System.out.println(person0.equals(person1)); // false
System.out.println(person0.equals(person2)); // true
````

### 같다는 의미는 다를 수 있다.

* iphone 두대는 같은 것인가? 일련번호 기준으로 하면 다른 것이 될 수도 있지 않은가?
* 이렇게 클래스마다 같다는 의미는 제작의도에 따라 달라진다.
* 따라서 Class 내부 데이터를 비교해야 한다면 오버라이딩이 필요하다.
* **이 때, `hashCode()`도 반드시 같이 오버라이딩해야 한다.**

### 예시

````java
public boolean equals(Object obj) {
    if (obj == this) { // 아예 주소가 같은 경우
        return true;
    }

    if (obj == null || !(obj instanceof Person)) { // null || Person이 아닌 경우 - 사실 여기에 hashCode도 있어야 함
        return false;
    }

    Person p = (Person) obj;
    return this.firstName.equals(p.firstName) && this.lastName.equals(p.lastName); // 내용 비교
}

Person person0 = new Person("wansik", "choi");
Person person1 = new Person("wansik", "choi");
Person person2 = person0;

System.out.println(person0.equals(person1)); // true
System.out.println(person0.equals(person2)); // true
````

* 사실 hashCode 비교까지 같이 들어가는 것이 더 좋다. 
* 아래 예시로 적어두었다.

## hashCode()

* 어떤 개체를 대표하는 해시값을 32비트 정수로 변환
  * 동치인 두 개체는 해시값이 같다.
  * 동치가 아닌 두 개체도 해시값이 같을 수 있다. (해시 충돌)
* **같은 데이터가 있다면, 해시값은 항상 같아야 한다.**
  * 그렇기 때문에 `equals()`를 오버라이드했다면 이녀석도 챙겨주어야 완벽한 것.
  * 다만, 두 데이터가 다른 경우에도 해시값이 같을 수 있다.
* 기본 구현: 개체의 주소를 반환

### Object에 이 메서드가 있는 이유

* 주 목적: `HashMap`에서 사용하려고.
  * Key로 사용
* 부수 효과
  * 빠른 비교용으로 사용 가능 (클래스가 제대로 구현한 경우)
    * 다른 프로그래머가 이런식으로 사용할 수도 있음
    * 그렇기 때문에 `equals()`와 pair로 구현해주어야 함
  * 단, 두 개체가 **같지 않음**만 빠르게 판단 가능

### 예시

````java
public int hashCode() {
    return this.firstNAme.hashCode() ^ (this.lastName.hashCode() << 16); // XOR, Shift 사용
}
````

* xor 연산 사용
* 근데 그렇게 되면 firstName과 lastName의 내용이 상호교환되어 들어간 경우와 hash값이 같게 나옴
* shift를 통해 해결
* 하나의 예시일 뿐 옳은 것은 아님
* 좋은 hash 함수는 구글에 한번 검색해볼 것

````java
public boolean equals(Object obj) {
    if (obj == this) { // 아예 주소가 같은 경우
        return true;
    }

    if (obj == null || !(obj instanceof Person || this.hashCode() != obj.hashCode())) { // null || Person이 아닌 경우 || HashCode가 다른 경우
        return false;
    }

    Person p = (Person) obj;
    return this.firstName.equals(p.firstName) && this.lastName.equals(p.lastName); // 내용 비교
}

Person person0 = new Person("wansik", "choi");
Person person1 = new Person("wansik", "choi");
Person person2 = person0;

System.out.println(person0.equals(person1)); // true
System.out.println(person0.equals(person2)); // true

HashSet<Person> people = new HashSet<>();

people.add(person0)

System.out.println(people.contains(person0)); // true : 주소가 같음
System.out.println(people.contains(person1)); // true : 내용이 같음
````

* `equals()`에 `hashCode()`까지 반영된 버전이다.
* 이 경우 HashMap에서 사용하더라도 문제가 없이 의도한대로 동작한다.

# Reference

* [Pocu Academy](https://pocu.academy/ko)
* [Polymorphism (computer science)](https://en.wikipedia.org/wiki/Polymorphism_(computer_science))
* [자바에서 메서드 파라미터에 final 키워드](https://okky.kr/articles/682182)
* [Object class in Java](https://www.javatpoint.com/object-class) 
* [What are Hash Functions and How to choose a good Hash Function?](https://www.geeksforgeeks.org/what-are-hash-functions-and-how-to-choose-a-good-hash-function/)
