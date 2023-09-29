---
title: Exception Part.02
thumbnail: ''
draft: false
tags:
- exception
- error
- checked-exception
- unchecked-exception
- java
created: 2023-09-29
---

예외 처리를 제대로 하지 못하는 이유는 무엇일까?

# 예외 처리를 제대로 하지 못하는 이유

* 과거에 주류이던 예외 처리 방식은 지속적으로 작동이 보장되어야 하는 프로그램에 대해 "하드웨어가 멈추는 크래시"가 무서워서 그랬을 수 있다.
* 요즘의 경우 운영체제가 해주니 예전에 비해 실익이 줄어들었다.
* 그렇기 때문에 요즘은 예외를 덜 사용하는 것이 프로그래머, 제품 품질에 더 도움이 될 수 있다.

# 예전의 주장들

* 함수에서 `null`이나 `int` 반환해서 오류 상황을 알려주는 것은 금지야!
* 함수에서 반환값은 실제 값만 반환해야해. Bool도 안돼
* 실패야? 무조건 에러 던져
* 받는쪽은 예외로 처리해.

## 하지만..

* 너무 좋은데
* 사람이 이해하기 어려워함
* 제대로 한 사람이 드물었다.

# 함수가 더이상 블랙박스가 아니게 된다.

* 그게 어려웠던 이유는, 예외를 받는쪽에서 어디서 온지 파악하기가 어렵다.
* 상위에서 받는 구조이기 때문에, 알려면 모든 함수를 다 까봐야 한다.
  * 즉, 함수가 어떻게 도는지 몰라도 된다는 규칙을 어겼다.
* 조금만 시스템이 복잡해지면, 어디서 불리는지 진짜 모른다..
* 사실 호출하는쪽에서 다른 객체에서 내뱉은 에러를 밷는다는게 **캡슐화**에도 어긋난다.
* 이런 것 때문에 주석도 달아봤는데, 사람들이 주석을 잘 안읽음 ㅋㅋ

# 자바는 대비되어 있었음

* 이렇게 어디서 에러가 나오는 상황을 방지하기 위해 Java는 예외를 두종류로 나눔
  * unchecked: 다른 언어와 동일
    * `ArithmeticException`
    * `BufferOverflowException`
    * `ClassCastException`
  * checked: Java에만 있는 예외
    * `IOException`
    * `SQLException`
    * `TimeoutException`

## Unchecked

* 어디서 어떤 예외가 나는지 한눈에 안보인다.
* `RuntimeException`을 상속
  * 이전 글에서 보았던 `UserNotFoundException`이 이를 상속해서 만든 커스텀 에러였음
  * 일반적인 다른 언어에서의 예외와 같음
* 컴파일러가 따로 검사를 안 해줘서 unchecked 예외라 부름

![](ObjectOrientedProgramming_26_Exception-2_0.png)

## Checked

* 컴파일러가 예외 처리를 제대로 하는지 확인해줌
* 어느 메서드가 어떤 예외를 던지는지 명확히 알 수 있다.
* 예외가 발생하는 코드에서 둘중 하나를 안하면 "컴파일" 오류를 준다.
  1. 발생한 예외를 그 메서드 안에서 처리해야 함 (`catch`문 안에서)
  1. 처리를 안한다면, 그 사실을 메서드 시그내처 옆에 표기
  * 해당 표시가 되어 있기 때문에 표기된 메서드를 호출하는 경우 호출자가 1, 2를 또다시 해줘야함

### 예시

````java
public final class UserNotFoundException extends Exception {
    public UserNotFoundException() {
        super();
    }

    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
````

* `Exception`을 상속 받기 때문에 checked Exception이다.

````java
public User findUser(String username) throws UserNotFoundException {
    for (User user : users) {
        if (user.getUsername().equals(username)) {
            return user;
        }
    }

    throw new UserNotFoundException(username) // 에러를 생성해서 던짐
}
````

* 위와 같이 에러를 정의한 상태에서 에러를 던지려하면, 기존과 같은 문법으로 사용할 수 없다.
* 명시적으로 어떤 에러를 던지는지 표기해야 한다.

````java
public static void main(String[] args) {
    User user = null;
    try {
        user = db.findUser("wansik")
    } catch (UserNotFoundException e) {
        e.printStackTrace();
    }

}
````

* 이전에는 그냥 호출할 수 있었는데 (`findUser`)
* 이제는 `try-catch`를 반드시 해줘야 한다.
* 만약에 `findUser`에서 `throws UserNotFoundException`을 안적어줬다면?
  * 일단 컴파일 오류난다.
  * 상위에서 처리해주는 문이 들어가야 한다.

````java
public User findUser(String username) { // 여기 빠짐
    for (User user : users) {
        if (user.getUsername().equals(username)) {
            return user;
        }
    }

    throw new UserNotFoundException(username) 
}

public static void main(String[] args) throws UserNotFoundException { // 여기에 추가해주어야 함
    User user = db.findUser("wansik")
    
}
````

* 안넣으면 컴파일 오류~

## 둘의 구분법

![](ObjectOrientedProgramming_26_Exception-2_1.png)

* 기본적으로 Exception은 Checked Exception이다.
* UnChecked Exception이 특이 케이스라고 생각하는 것이 좋다.

# Checked Exception의 존재의의

* 예전에는 Checked를 좋아했다. 의도는 좋았으나 실패했지만.
* API 제작자 입장에서는 해당 에러를 명시적으로 적음으로써 **처리해야 할 예외**임을 알려준다.
* 그런데 "처리하라"는 의미가 뭘까?

## 프로그램을 그냥 종료해라?

* 가장 상위의 JVM까지 보내서 끝내라
* 만약 그렇다면 실제로 그 예외를 받아서 처리하는 함수에는 하방에서 보내는 **모든 예외 클래스를 `throws 예외1, 예외2...` 적어주어야 한다.**

![](ObjectOrientedProgramming_26_Exception-2_2.png)

* 만약에 여기서 A까지 올라간다면..?
* 트리의 깊이가 4로 증가한다면..?

````java
public void A() throws ExceptionB, ExceptionC, ExceptionD.............
````

## 예외를 무시하고 진행해라

* 예외가 나올 수는 있는데, 무시하렴
  * 꿀꺽 삼킨다 (swallow)
* 로그 출력정도?
* 아니 그럼 왜 예외를 날려

## 프로그램을 정상 상태로 회복시켜서 동작시켜라

* 예외를 던지는데, 처리안하면 컴파일 오류까지 내는 방식으로 에러를 던졌다면
* 당연히 프로그램이 동작하도록 하라는 의미일 것
* 굳이 `checked`로 만들었다면, 회복시키라는 의미다.
* 이런 의미를 내포했던 것이 과거 Java에서 선호하던 방식이다.
  * 그래서 `Exception` 클래스가 기본적으로 `checked`였음

# 회복이란?

* 흠 그런데 회복이라는 것은 뭘까?
* **예외가 발생하기 전 상태로 돌려달라는 의미**일 가능성이 높다.
* 이게 가능할까? 모든 상태를 기억하고 있어야 한다.
* 즉, 단방향 연산의 확률이 더 높다. 역산은 어렵다.
* 진짜 어렵고 열받고 힘들다 이거. 모든 코드에서 그렇게 하겠다? 불가능.

# 예외로부터 안전한 프로그래밍

* 클래스 몇개만 있는 간단한 구조는 가능
* 복잡할 수록 어려워진다.
* 아예 이걸 시도하지 말라는 말은 아니다.
  * 여전히 필요한 곳이 일부 있다.
  * 모든 곳에서 이럴 수는 없다는 것..

# 근래의 예외 처리 트렌드

1. 그냥 unchecked 예외를 쓰자
   * 심지어 checked를 unchecked로 감사서 다시 던지자는 의견도 있음
   * 하지만 이렇게 하면 누가 어떤 예외를 던지는지는 한눈에 안보인다. (여전히)
1. 예외로부터 안전한 최선의 방법은 재부팅

* 즉, 예외 발생 이벤트로부터 시스템을 회복하지 않는다.
* 디버깅에 필요한 정보를 최대한 남기고 프로그램을 종료시킴

# 예외를 어디까지 세분화해야 하는가?

* 예전에 선호하던 방향
  * 예외를 종류별로 catch한다.
  * 예외 타입마다 처리를 다르게 해주었어야 했음
  * 주로 checked 예외를 사용
  * 즉, 문제가 발생할 때마다 그에 맞는 예외 클래스를 만들었었음
* 요즘에 좀 더 선호하는 방향
  * 모든 예외를 "한번에" 처리하자.
  * 주로 `main()`에서 한번만!
  * 따라서 다시 예외를 던지는 일도 훨씬 적어진다.
  * 여전히 던질 때는 세세한 예외 타입을 던진다. 
  * 다만 `catch`를 Exception으로 한번에 처리할 뿐이다.

# 조심할 내용들

* 대부분의 경우 프로그램은 **모든 예외로부터 회복해야 한다.**
* 프로그램을 종료시켜도 되는 유일한 경우는 프로그램을 시작할 때 뿐이다.
  * 사람이 보고 있으니까..?
  * 누군가는 재부팅을 해줘야했던 시절의 글임을 알 수 있다.
* checked 예외를 선호하던 시절의 말임
* **기본적으로 나쁜 조언이다.** 특수한 경우에만 적용된다.
* 이런 조언은 웹서버와 같이 항시 구동되야 함에도 에러가 떠서 프로그램이 죽어버리는 그 공포를 몸이 기억하기 때문이지 않을까?

# 지겨보는 사함없이 작동해야 한다면?

* 웹서버 같은 예
* 근래의 OS는 하드웨어 재부팅이 필요없다.
  * 프로그램마다 가상 메모리 제공
  * 프로그램 크래시 났다고 기계가 크래시 나는 것 아님
* 프로그램 재실행은 다른 프로그램이 담당
  * 실행중인 프로그램이 크래시가 나서 사라지면 다시 실행하도록 설정 가능
  * 재시작시 가상 메모리를 배정받은 프로그램이니 깨끗하게 시작
* 이걸 무시하고 예외로부터 안전한 프로그래밍을 시도했다가 실패했다면?
  * 프로그램이 오히려 더 이상한 상태에 빠져 더 큰 문제가 생길 수 있음
  * 이런 상태의 프로그램을 "좀비 프로그램"이라고 함

# 제어 흐름용으로 예외를 사용하지 말 것

* `goto`랑 개념이 같음
* 함수 범위에서 점프하는 것이 아니고 **호출 스택 어디로든 점프 가능**
* `goto`보다 더 기가막힌 hack
* **절대 절대 다음에 실행할 코드를 결정하는 용도로 사용하지 말 것**

## 나쁜 예

* 재귀함수 한방에 빠져나오기

````java
void search(TreeNode node, Object data) throws ResultException {
    if (node.data.equals(data)) {
        throw new ResultException(node);
    } else {
        search(node.leftChild, data);
        search(node.rightChild, data);
    }
}
````

* return이 void임
* 에러로 결과값을 catch해야 함
* 반환을 일일히 안하고 hack으로 던지는 것임

# 예외적인 상황에만 예외를 사용해야 하는 이유

* 1초마다 예외를 5개씩 던지는 프로그램을 생각해보자.
* 디버깅이 힘들어서 Exception을 체크하는 기능을 디버거에 추가해서 돌렸어
* 이제 돌리고 기다리면 어디서 예외 발생하는지 알 수 있겠지?
* 근데 프로그램 실행할 때 예외가 200개가 나온다.
* if문 대신 예외로 로직을 걸어서 계속 걸리는거야.
* 이름 말대로 사용안하면 모두가 동의하는 개념에서 벗어나는 것이기 때문에, 도구 사용에도 문제가 생길 수 있다.
* 비슷한 걸로 **컴파일 경고는 항상 고치렴**

# Reference

* [Pocu Academy](https://pocu.academy/ko)
* [exception safe programing](https://www.youtube.com/watch?v=g7dzMgrWFic)
