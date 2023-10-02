---
title: Encapsulate Collection
thumbnail: ''
draft: false
tags:
- refactoring
- capsulation
- collection
- javascript
created: 2023-10-02
---

Encapsulate Collection, 컬렉션 캡슐화 하기를 알아보자.

# 요약

![](Refactoring_26_EncapsulateCollection_0.png)

# 코드

````javascript
class Person {
    get courses() {return this._courses;}
    set courses(aList) {this._courses = aList;}
}
````

````javascript
class Person {
    get courses() {return this._courses.slice();}
    addCourse(aCourse) {}
    removeCourse(aCourse) {}
}
````

# 배경

* 앞에서 가변 데이터는 캡슐화하는게 좋다 했다.
* 그러면 언제 수정되는지에 대한 것을 어느정도 통제할 수 있다.
* 그런데 실수하기 좋은 부분이 컬렉션이다.
* 레코드에서 특정 컬렉션을 접근하는 함수가 있다고 하자.
* 일단 가져갔는데, 그 가져간 콜렉션의 원소를 다른 함수에서 바꿨다.
* 참조기 때문에 원본 데이터 자체도 변경되어 버린다.
* 이렇게 되면 **원본 데이터 접근이 자유로워 어디서 변경이 일어났는지 알기 어렵기 때문에 디버깅이 어려워진다.**
* 가장 좋은 방법은 **복제본을 반환하게 만들어서 문제 발생 자체를 막는 것이다.**
  * 보통은 복제한다고 성능저하가 크지 않다.
* 아니면 읽기 전용으로 제공하거나.
* 명심해야 할 것은 **중구남방으로 방식을 다르게 하지 않는 것이다.**
* **코드베이스에서 일관성을 주어 컬렉션 함수 동작 방식을 통일해야 한다.**

# 절차

1. 컬렉션을 캡슐화 한다.
1. 컬렉션에 원소를 추가/제거하는 함수를 추가한다.
1. 정적 검사를 수행한다.
1. 컬렉션을 참조하는 부분을 모두 찾아서, 컬렉션을 캡슐화한 접근자를 사용하도록 수정한다.
1. 컬렉션 게터를 수정해서 원본 내용이 아닌 복제본을 반환하도록 한다.
1. 테스트한다.

# 예시

````javascript
class Person {
    constructor(name) {
        this._name = name;
        this._courses = [];
    }
    get name() {return this._name;}
    get courses() {return this._courses;}
    set courses(aList) {this._courses = aList;}
}

class Course {
    constructor(name, isAdvanced) {
        this._name = name;
        this._isAdvanced = isAdvanced;
    }
    get name() {return this._name;}
    get isAdvanced() {return this._isAdvanced;}
}

// Client 1
numAdvancedCourses = aPerson.courses.filter(c => c.isAdvanced).length;

// Client 2
const basicCourseNames = readBasicCourseNames(filename);
aPerson.courses = basicCourseNames.map(name => new Course(name, false));

// Client 3
for (const name of readBasicCourseNames(filename)) {
    aPerson.courses.push(new Course(name, false));
}
````

* `aPerson.courses`는 원본 컬렉션을 반환한다.
* 그렇기 때문에 이걸 변경하고 있는 Client 2, 3에서는 데이터가 변경되어 버린다.
* 원본 데이터를 어떠한 방식으로든 밖으로 뱉고 있기 때문에 제대로된 캡슐화가 되었다보기 어렵다.

````javascript
class Person {
    constructor(name) {
        this._name = name;
        this._courses = [];
    }

    get courses() {
        return this._courses.slice();
    }
    set courses(aList) {
        this._courses = aList.slice();
    }

    addCourse(aCourse) {
        this._courses.push(aCourse);
    }

    removeCourse(aCourse, fnIfAbsent = () => {throw new RangeError();}) {
        const index = this._courses.indexOf(aCourse);
        if (index === -1) fnIfAbsent();
        else this._courses.splice(index, 1);
    }
}

// Client 3
for (const name of readBasicCourseNames(filename)) {
    aPerson.addCourse(new Course(name, false));
}
````

* 일단 add, remove를 메서드로 제공하여 변경할 시 처리 코드를 내부로 격리시켰다.
* 또한 set, get을 할 시에는 원본데이터를 바꾸지 않고, 복제본을 반환하도록 하였다.

# Reference

* [Refactoring](https://product.kyobobook.co.kr/detail/S000001810241)
* [github](https://github.com/WegraLee/Refactoring)
* [martin-fowler-refactoring-2nd](https://github.com/wickedwukong/martin-fowler-refactoring-2nd)
