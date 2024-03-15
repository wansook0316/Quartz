---
title: Interface
thumbnail: ''
draft: false
tags:
- java
- interface
- oop
- override
- deep-copy
- shallow-copy
- prototype
created: 2023-09-29
---

인터페이스는 왜 필요할까? 그리고 무엇일까?

# Interface의 사전적 의미

* inter-(상호간의) + -face(면) = interface
* 접해있는 두 물체나 공간 사이의 경계
* 사용자는 스위치를 키는 버튼에 집중
  * 이걸 누르면 어떤 일이 일어날지를 앎 (what)
  * 어떻게 그런일이 일어나는지는 모름 (how)
* 실제 동작은 구현 공간에서 일어남
  * 배선의 연결
  * 사용자는 잘 알지 못하는 공간
  * 구현자만 알고 있음
* 이미 알고 있는 개념 = 함수
  * 함수는 블랙박스임: 호출자는 내부가 어떻게 도는지 이해하려 하지 않는다.
  * 함수명과 반환형: 어떤 동작을 하는지 알려줌
  * 함수 매개변수: 어떤 데이터를 전달해야 함수가 동작하는지 알려줌
  * 그래서 함수 signature를 interface라 부르기도 함
    * 컴퓨터 분야에서 인터페이스란 매우 다양한 것을 의미함

# 함수 선언 vs 함수 구현

* 함수 선언 == 함수 signature == interface
* c와 같은 언어에서는 이해하기 쉬울 것
  * 선언과 구현이 분리되어 있으므로
* 그런데 함수 signature, interface만 존재하는 경우도 있었다.
* **함수 포인터 매개변수는 signature만 지정**

````c
void register error handler (void (*handler) (const char* msg));
void log error(const char* msg);

static void (*s_handler) (const char*) = NULL;

void register error_handler (void (*handler) (const char* msg)) // 여기
{
    s handler = handler;
}

void log error(const char* msg)
{
    if (s_handler != NULL) {
        s_handler (msg) ;
    }
}
````

* `void (*handler) (const char* msg)` 부분은 함수 signature만 있고 구현이 없다.
* OO에서 다형성도 이와 같이 동작한다.
* 결국 다형성은 구현체에 있는 함수를 호출하는 것이기 때문에, 거의 같은 방식이라 생각할 수 있다.

# 함수 포인터 매개 변수 vs. 클래스 매개변수

* 그러면 이러한 의문이 들 수 있다.
* "내가 필요한 건 실제로 구현한 메서드 함수만 알면되는데, 다형성을 사용하면서 다른 메서드들까지 딸려오게 되네..?"
* "함수 포인터가 더 나은 것 아닌가?"

|함수 포인터 매개변수|클래스 매개변수|
|-----------------------------|----------------------|
|- 어떤 함수 구현도 signature만 맞다면 다 받아줌|- 부모 클래스를 상속한 클래스면 다 받아줌 <br> - 그 중 다형성 메서드 **하나**를 호출 <br> - 실질적으로 C의 함수 포인터처럼 작동 <br> - 근데 배보다 배꼽이 더 큰..?|

* 아니 그러면 추상 클래스에서 메서드를 싹다 abstract로 만들면 되지 않을까?
* 일단 함수포인터와 완전히 같게 하기 위해서는 추상클래스의 메서드를 한개로 제한하고, 그 메서드를 abstract로 만들자.
* 그러면 상속하는 쪽에서 무조건 구현해야 하니까, 그런 추상클래스 자체를 인자로 넘기는 행위는 곧 함수 포인터와 완전히 같게 된다.
* 여기서 abstract 메서드의 개수를 늘리는 것은 결국 함수포인터 여러개를 한번에 주는 것과 같으니 사용할만 할 것

# OO 개념과 인터페이스

* 구조체: 데이터만 모아놓았던 것
* 클래스: 데이터와 동작을 모아놓은 것
* 순수 추상 클래스: 구현은 빼고 동작만 모아놓은 것 == Interface
* Interface
  * 어떠한 상태도 없음
  * 동작의 구현도 없음
  * 동작의 signature만 있음

# Interface

````java
public abstract class LoggerBase {
    public abstract void log(String message);
}

public interface ILoggable {
    void log(String message);
}
````

* class -> interface
* abstract 지우기
  * interface는 자체가 추상적
* method는 항상 public
  * 함수 포인터와 같은 개념인데 막아둔다는 것은 이상함
  * 그런데 요즘 언어에서는 다른 ACL도 들어갈 수 있어짐
  * 절대적인 것은 아니고, 이러한 흐름이 있었다 정도로 이해하는 것이 좋을듯
* extends를 implements로 바꿈
  * `:`만을 사용하는 경우도 있음
* interface 구현하지 않으면 컴파일 오류

## Override의 문제

* 오타났을 때, 동작은 하나 의도대로 동작하지 않을 수 있음
* `shout`를 `shuot`로 썼는데 이걸 확인못하고 넘어가면 삽질하게 되는 거임
* 그럼 이런 오타를 방지하기 위해 추상 클래스를 인터페이스로 바꾸어야 하는가?
* 그건 아니다.
* override를 하는 경우 명확하게 이를 수행한다는 keyword를 추가하면 된다.
* 즉, override하는 경우 `override`와 같은 키워드를 통해서만 가능하도록 제약을 걸어버린다.
* 이렇게 되면, 코드 작성자는 `override` 없이 수행할 수 없으므로 보다 안전한 코딩이 가능해진다.
* 자바에서는 `annotation`이라는 것을 사용한다. 이는 언어의 일부로 존재하는 것이 아니다. (`@Override`)

### Java Annotation

* 프로그램에 대한 metadata를 제공
  * 프로그램의 일부가 아니어서 코드 실행에는 아무 영향을 안 미침
* 용도
  * 컴파일러에게 정보를 제공 (`@Deprecated`, `@Override`)
  * 컴파일, 혹은 배포 중에 어떤 처리를 할 수 있음

# Interface의 접근 제어자

* 추상 메서드는 `protected`를 붙일 수 있다.
* 그 때문에 외부에서 호출은 못해도 자식 클래스가 구현하도록 **강제**할 수 있다.
* 왜 인터페이스는 안되게 해두었을까?

## 왜 인터페이스는 public method만 가능할까?

* 개념상으로 인터페이스는 두면이 맞닿는 면을 말한다.
* 그렇기에 그 사이에서 필요한 모든 것들을 정의하는 것이 옳다.
* 여기서 특정 메서드는 연결점으로 사용하지 않겠다는 것이 의미적으로 이상하다.
* 이게 일반적인 얘기다.
* 주류 언어에서는 `public`으로 강제하니 동의하지 않아도 방법은 없다.
* C의 헤더파일과 비슷하다고 보면 이해가 쉽다.
  * header file을 include한 어느곳에서든 사용할 수 있다.

# Interface의 이름

* 앞에 붙은 I는 무엇인가? (`ILoggable`)
  * Interface의 약자
* `-able`과 같은 형태로 붙일 수도 있음
  * 인터페이스는 "무언가를 할 수 있다"의 표현이기 때문에

# Interface는 다중 상속의 위험이 없다

* 다중 상속의 문제는 구현이 각각 존재하기 때문에 어떤 것을 선택할지 모른다에 있다.
  * 죽음의 다이아몬드
  * A가 이름이 같은 메서드의 B, C를 다중상속한다면 구현이 두개라 어떤걸 선택할지 모른다.
* 이런 문제에서 인터페이스는 자유롭다.
* 인터페이스는 구현이 없기 때문에, A에서 구현을 해야하고 이 때 이름이 같다면 하나로 퉁칠 수 있게 된다.

## 어떻게 상속해도 Interface의 구현은 하나뿐

* Interface에서 선언한 메서드의 구현은 Class에서 생김
* Class 다중 상속은 불가능
* 따라서 한 클래스안에서 Interface의 구현은 딱 하나만 존재
* 그래서 다중 상속의 해결법으로 많이 사용함
  * 단, 단순히 그 용도는 아님

# 깊은 복사 & 얕은 복사

* java에서는 `clone()`을 사용함
  * [Prototype 패턴](https://velog.io/@wansook0316/Prototype)
* 이 방법이 어렵다 생각하여 복사 생성자 방법도 사용함
  * `public init(other point: Point)`
  * 자기 자신의 자료형을 받아 자신을 리턴함
  * 내부적으로 복사하는 코드를 만들어 사용
  * swift의 경우에는 기본 자료형이 struct로 되어있어 이 문제에서 약간더 자유롭긴함

# 정리

1. 함수 포인터처럼 인터페이스를 사용한다. (구현과 선언의 분리)
1. 다중 상속의 대안으로 인터페이스를 사용한다.

 > 
 > 핵심은 다형성, **다형성 없는 인터페이스는 의미가 없다.**

# Reference

* [Pocu Academy](https://pocu.academy/ko)
