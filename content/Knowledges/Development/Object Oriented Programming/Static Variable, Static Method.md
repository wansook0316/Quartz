---
title: Static Variable, Static Method
thumbnail: ''
draft: false
tags:
- oop
- static
- singleton
created: 2023-09-29
---

모든 것을 OO로 해결할 수 있을까? 그것에 대항하는 `static`에 대해 알아보자.

# Static Method

OO에서는 모든 것이 개체속에 있어왔다. 그렇기 때문에 불편함이 발생했다.

1. 단순한 계산도 개체를 만들어서 처리해야 하나?: 절댓값 구하기
1. 클래스 단위에서 무언가하고 싶다면?: 클래스에서 총 몇개의 개체를 만들었나?

이전에 C에서는 전역 변수가 있었다. 그리고 OO 언어에는 static이 있다.

* static method의 소유주는 instance가 아니고 class 이다.
* Class diagram에서는 **밑줄**을 통해 나타낼 수 있다.
* **인스턴스와 관련 없이 매개변수로만 들어온 값을 기반으로 처리할 수 있다면 고려해보자.**
  * `isNullOrWhiteSpace(MyString)`과 같은 함수는 사실 instance method로 만들어도된다.
  * 하지만 static으로 만들어도 된다. 외부 변수와의 상호작용이 없기 때문에.

## Initialization

* Java의 Math클래스를 생각해보자.
* 이 녀석은 내부에 static 함수를 만들어 두어, 이곳 저곳에서 전역적으로 사용하기 위한 목적으로 만들어졌다.
* 그런데 실제 사용에 있어서는 `math.abs(-3)`과 같은 형태로 사용할 수 있다.
  * 여기서 `math`는 Math 인스턴스를 말함
* 이건 의도한 것과 다르게 동작하는 것이다.
* 내부적으로 인스턴스에서 호출하더라도 내부 method가 없고, 어차피 Class에 있는 static 함수를 호출하는 것이 자명하니 이렇게 동작하는 것이다. (class: instance = 1:\* 관계)
* 즉, 스코프 범위를 세부적인 것에서부터 포괄적인 것으로 찾으면서 있을 경우 반환하는 방식이다.
  * static은 class 위계에 있는 scope에 있을 거니 찾을 수 있다.
* 하지만 이런 스타일은 의도한 바가 아니기 때문에, 위와 같이 static 함수의 묶음을 모아두기 위한 용도로 사용하기 위해서는 다른 조치가 필요하다.
* 바로 생성자를 `private`하게 만드는 것이다.

## C#과 Swift

* 위와 같이 처리하면 컴파일 오류가 나게 되어, 원하는 목적을 달성할 수 있게 된다.
* 하지만, 이 방식은 뭔가 꼼수느낌이 강하다.
* Java와 달리 C#에서는 `static class`를 제공한다.

````C#
public static class Math
{
    public static int abs(int n)
    {
        return n < 0 ? -n : n;
    }

    ...
}
````

* class 앞에 `static` signiture를 달게되면, 자동적으로 인스턴스를 만들 수 없게 된다.
* 이 부분은 swift에서 [Constant Manangement](https://velog.io/@wansook0316/Constant-Management)를 정리했던 것과 유사하다.
* Swift는 이러한 static class가 없다.
* 그렇기 때문에 만약 위와 같은 방식을 사용하려면 Java의 방식과 같이 private Initializer로 처리해야 한다.
* 하지만 우리에게는 **Enum이 있다...!**

# Static에 대한 비판

1. static은 순수한 OO가 아니다.
1. OOP가 절차적 프로그래밍을 대체한다 해놓고 static 쓰는 것은 모순이다.

* 결론적으로 `static`을 쓰는게 OO의 개념과 먼것은 사실이다.
* 즉, `static`은 어찌보면 개체 지향으로 모든 것을 할 수 없다는 것이 증명된 산물이다.
* 잘못된 것은 아니고, 선택적 개념으로 사용하면 좋은 것. 그 이상 그 이하도 아니다.

# Singleton의 등장

* 위와 같은 비판의 맥락에서 `static`을 사용하지 않고 그와 비슷한 효과를 내기 위한 방법을 찾게 된다.
* 개체이긴 한데, `static`과 같은 역할을 하는 녀석, 그것을 singleton 패턴이라 한다.
* 하지만 여전히 욕을 먹었다.

# Reference

* [Pocu Academy](https://pocu.academy/ko)
* [Constant Manangement](https://velog.io/@wansook0316/Constant-Management)
