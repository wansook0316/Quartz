---
title: Builder
thumbnail: ''
draft: false
tags:
- oop
- design-pattern
- builder
- java
- fluent-interface
created: 2023-09-29
---

빌더 패턴은 무엇일까? 무엇을 조심해야 할까? 어떤식으로 활용하는 것이 좋을까?

# Builder

* 개체의 생성과정을 그 개체의 클래스로부터 분리하는 방법
* 개체의 부분부분을 만들어 나가다 준비가되면 그제서야 개체를 생성

# StringBuilder

* 단순한 것은 이걸 사용해서 원하는 문자열을 만들 수 있다.
* 하지만 복잡해진다면?
* 예를 들어 하나의 String에 100개의 변수를 넣어 String을 만들어야 한다면?

````java
StringBuilder builder = new StringBuilder(4096);
builder.append(heading);
builder.append(newLine);
builder.append(newLine);

builder.append(leadingParagraph);
builder.append(newLine);

for (KeyValue kv: data) {
    builder.append(" * ");
    builder.append(kv.getKey());
    builder.append(": ");
    builder.append(kv.getValue());
    builder.append(newLine);
}

String document = builder.toString();
````

* 이럴 때 `StringBuilder`를 사용하면 편하다.
* overloading된 메서드가 있어서 다양한 자료형도 받을 수 있다.
* 심지어 성능도 더 빠르다. 알아서 효율적으로 합쳐준다.
  * 다만 내부가 어떻게 도는지 알면 더 좋음
* 마지막에 `toString()`을 통해 결과물을 가져옴

# 문제점

* 코드가 잘 읽히나 2%부족
* 작성자의 의도: 제목을 넣고 줄을 바꾸고 싶다.
* 근데 저 위에 코드만 봐서는 독립적인 3개의 컴포넌트를 추가하는 느낌임

# Fluent interface

^fa27cf

* GoF에는 없음
* 최근에 builder 패턴의 발전된 방식

````java
StringBuilder builder = new StringBuilder(1024 * 1024);
builder.append(heading)
       .append(newLine)
       .append(newLine);

builder.append(leadingParagraph)
       .append(newLine);

for (KeyValue kv: data) {
    builder.append(" * ");
           .append(kv.getKey());
           .append(": ");
           .append(kv.getValue());
           .append(newLine);
}

String document = builder.toString();
````

* 반환 타입을 자기자신을 넘겨주는 방식!
  * (Walnut이 builder pattern으로 구현되었다는 것을 알 수 있었음)

## 자기 스스로를 반환한다고...?

* 함수 Signature만 봐서는 이상하다.
  * 클라이언트 측에서 해당 개체를 들고 있는데 왜 `return this`를 하지?
  * 이상하지만 이제는 상식으로 취급된다.

# 잘못 사용하는 빌더 패턴

````java
public final class Employee {
    private String firstName;
    private String lastName;
    private int id;
    private int yearStarted;
    private int age;

    public Employee(String firstName, String lastName, int id, int, yearStarted, int age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.id = id;
        this.yearStarted = yearStarted;
        this.age = age;
    }
}

Employee wansik = new Employee("Wansik", "Choi", 1, 1995, 28);
Employee howon = new Employee("Kim", "Howon", 30, 1993, 2);
````

* 직원 정보를 입력하는 클래스가 있다고 해보자.
* 근데 두번째는 문제가 있다.
* 성과 이름을 바꿔서 넣었다. 그리고 나이와 Id도!
* 이런 경우는 당연히 컴파일러가 잡아줄 수 없다.
* 이런 것을 builder로 해결해보자.

````java
Employee howon = new EmployeeBuilder(1)
                     .withAge(30)
                     .withStartingYear(1993)
                     .withName("Howon", "Kim")
                     .build();
````

* 이렇게 하면 메서드 이름으로 넣으니 잘못된 값을 전달할 가능성이 적어진다.
* 하지만, 이건 잘못된 해결법

## 만약에 실수한다면?

````java
Employee howon = new EmployeeBuilder(1)
                     .withAge(30)
                     .withName("Howon", "Kim")
                     .build();
````

* 자바에서는 초기값이 0이다. 따라서 0년부터 일한 직원이 된다.
* **개체는 생성부터 유효한 상태여야 하는데 이를 어겼다.**
* 이건 디자인 패턴을 잘못 사용한 경우다.
* 근데 이런식으로 만든 SDK가 많아졌다..
  * G모사조차도..
* `StringBuilder`는 유효한 개체만 반환했다.
  * `String`만 다뤘기 때문에, 언제 호출해도 유효한 `String`개체가 나온다.

## 해결 방법 1

* 파라미터를 빼먹지 않으면 되는 문제다.
* 그렇기 때문에 파라미터 자체를 가지는 다른 클래스를 만들어서 관리하자.

````java
public final class Employee {
    private String firstName;
    private String lastName;
    private int id;
    private int yearStarted;
    private int age;

    public Employee(CreateEmployeeParams params) {
        this.firstName = params.first;
        this.lastName = params.lastName;
        this.id = params.id;
        this.yearStarted = params.yearStarted;
        this.age = params.age;
    }
}

CreateEmployeeParams params = new CreateEmployeeParams();
params.firstName = "Howon";
params.lastName = "Kim";
params.id = 1;
params.age = 30;
params.yearStarted = 1993;

Employee howon = new Employee(params)
````

* 순수한 데이터만 담은 구조체처럼 만들어서 전달하는 방식이다.
  * swift라면 당연히 struct로 만들겠지
  * DTO
* 잘못 사용한 Builder 패턴 보다는 이게 좀 더 명확하고 좋다.
* 인자 순서(firstName, lastName) 잘못 넣는 문제는 수정할 수 있다.
* 근데 그나마 낫다는 거지 여전히 인자를 빼먹을 수 있다는 문제가 있다.
* 굳이 `with~`, `build()` 호출하고 하는 방식을 쓸 이유가 없다는 말을 하고 싶은 것

## 해결 방법 2

* named parameter
* 인자에 이름을 달아버리는 방법
* 위의 모든 문제를 고칠 수 있다.
* Swift에서 변수 인자를 명시적으로 보여주는 것을 말한다.

````swift
Employee(firstName: "Howon", lastName: "Kim", id: 1, yearStarted: 1993, age: 30);
````

## 정리

* 위와 같이 **언어 자체에서 지원해줘야 하는 것**들이 있다.
* 언어에서 지원하지 않는 기능(named parameter)때문에 builder를 사용한다면 꼼수로 사용하는 것이다.
* builder pattern은, 어느 상태에서 적용해도 개체의 유효성이 보장될 경우에 사용해야 한다.
* 예를 들어, `UIView`에 다양한 요소를 넣을 수 있지만, 넣지 않아도 `UIView`자체가 의미있는 경우가 있겠다.

# 다형적인 빌더 패턴

* `.csv` 파일이 있다고 생각해보자.
* 이걸 HTML, markdown으로 각각 변환하고 싶다.

![](ObjectOrientedProgramming_20_Builder_0.png)

````java
CsvReader reader = new CsvReader(csvText);
HtmlTableBuilder builder = new HtmlTableBuilder();

reader.writeTo(builder);

HtmlDocument html = builder.toHtmlDocument();
````

````java
CsvReader reader = new CsvReader(csvText);
MarkdownTableBuilder = builder = new MarkdownTableBuilder();

reader.writeTo(builder);

String mdText = builder.toMarkDownText();
````

1. CsvReader에 문자열을 넣어준다.
1. 어떤 타입의 Builder를 만들지 선택
1. CsvReader는 같은 타입에서 처리해버린다. 각각의 Builder에서 처리 방법만 다를뿐이다. (다형적 호출)
1. 마지막으로 builder에서 CsvReader에서 명령한 결과를 조합하여 결과를 얻는다. (다형적 호출 X)

# Reference

* [Pocu Academy](https://pocu.academy/ko)
