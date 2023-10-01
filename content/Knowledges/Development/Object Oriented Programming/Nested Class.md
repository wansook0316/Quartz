---
title: Nested Class
thumbnail: ''
draft: false
tags:
- oop
- nested-class
- java
- inner-class
created: 2023-09-29
---

Java에서의 Nested Class를 알아보며, 어떻게 변화해 왔을지 한번 생각해보자.

# Nested Class

* 클래스 안에 다른 클래스
* Java에서는 둘로 나뉜다.
  * Inner Class
    * non-static Nested Class
    * Local Class
    * Anonymous Class
  * static Nested Class

## Inner Class

### non-static Nested Class

````java
public class OuterClass {
	...
    class InnerClass {
        ...
    }
}

OuterClass outerClass = new OuterClass();
OuterClass.InnerClass innerClass = outerClass.new InnerClass();
````

* `InnerClass`는 `static` 멤버를 선언할 수 없다.
* `InnerClass`는 `OuterClass` 인스턴스와 함께 OuterClass의 내부에 존재한다.
* **`OuterClass`의 모든 변수에 접근할 수 있다.**
  * 그러면서 다른 클래스에는 접근 불가 == **강한 캡슐화**
  * 암묵적으로 `OuterClass` 인스턴스와 연결되어 있다.
* 그렇기 때문에 `InnerClass` 생성을 위해서는 먼저 **외부 클래스 객체를 생성해야 한다.**
  * **즉, 인스턴스가 독립적으로 존재할 수 없다.**
  * **의존성을 갖기 때문에 메모리 누수의 위험이 있다.**
  * ~~상당히 괴랄한 문법이다.~~

### Local Class

````java
public class LocalClassExample {

    public void methodExample() {

        class LocalClass {
            public static final int MAX = 10;
            public static final String F = "female";
        }
    }
}
````

* Block에 정의된 클래스
  * Block: 여러 statements를 감사고 있는 하나의 중괄호 쌍
  * ex) method, for, if
* `LocalClass`는 `static` 멤버를 선언할 수 없다.
  * `final static`은 가능하다.
* 자신을 감싸고 있는 block의 모든 block의 멤버에 접근가능하다.
  * 즉, method, `LocalClassExample` 등
  * 하지만 non-static으로 상위 class가 사용되었을 경우만 가능하다.

### Anonymous Class\```java

button.addActionListener(new ActionListener() {
public void actionPerformed(ActionEvent e) {
...
}
}

````

- 이름이 없는 지역 클래스와 같다.
- Swift의 Closure와 비슷하게, 선언과 동시에 초기화가 이루어진다.
- 위와 같이 GUI 애플리케이션에서 컴포넌트에 이벤트 리스너를 등록할 때 사용된다.
- 

## static nested class

```java
class OuterClass {
    private final int age;

    static class StaticNestedClass {
        private final OuterClass outer;

        int getAge() {
            return this.age; // 불가능! - non-static 가능
            return this.outer.age; // 가능!
        }    
    }
}

OuterClass.InnerClass innerClass = new OuterClass.InnterClass();
````

* `static`과 함께 선언된다.
* `static`이기 때문에 클래스 로딩 시점에 한번만 호출된다.
* 다만 여기서 `static`의 의미는 정적 멤버 함수, 변수의 의미가 아니다.
* 혹은 `static class`의 의미도 아니다.
* **해당 클래스는 자동적으로 위 개체의 reference를 받지 않겠다**의 의미이다.
* 그렇기 때문에 참조로 상위 개체의 `private` 변수에는 접근이 가능하나, 직접 접근은 안된다.
* 단 `static` 변수는 가능하다.
* `static` 사용 안했을 시에는 컴파일러가 이 작업을 해줬던 것이 전부다.
* non-nested와 다르게 **인스턴스가 독립적으로 존재할 수 있다.**
* 생성시 문법도 훨씬 깔끔해 졌다.
* 이러한 점에서 Swift와 다른 언어들은 이 타입만을 제공하는 경우가 많다.

# Nested Class의 용도

1. 서로 연관된 클래스들을 그룹 지을 수 있다.
   * 패키지도 가능하긴 하다.
   * 하지만 클래스 속에 넣는 것이 더 긴밀함을 표현할 수 있다.
1. 내포 클래스는 바깥 클래스의 `private` 멤버에 접근 가능하다.
   * 반대도 가능

# Reference

* [Pocu Academy](https://pocu.academy/ko)
* [Swift nested class properties](https://stackoverflow.com/questions/26806932/swift-nested-class-properties)
