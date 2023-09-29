---
title: Wrapper
thumbnail: ''
draft: false
tags:
- oop
- java
- design-pattern
- wrapper
- adapter
created: 2023-09-29
---

Adapter 패턴으로 알려져있는 Wrapper 패턴에 대해 알아보자.

# 이름의 문제

* GoF: [Adapter](Adapter.md)
* 업계: Wrapper

# Wrapper

* 어떤 클래스의 메서드 시그내처가 맘에 들지 않을 때 다른 것으로 변경
* **단, 그 클래스의 메서드 시그내처를 직접 변경하지 않음**
  * 그 클래스의 소스코드가 없을 수도 있음 - 남의 라이브러리를 가져다 사용한 경우
  * 그 클래스에 의존하는 다른 코드가 있을 수도 있음 - 변경을 원치 않음
* 그 대신 새로운 클래스를 만들어 기존 클래스를 감싸는 방식으로 처리

# Wrapper 패턴 이해 방법

1. Wrap
   * 특정 클래스를 감싸 내가 원하는 메서드 시그내쳐로 바꿔서 사용
   * 선물 포장지
1. Adapt
   * 특정 클래스와 다른 클래스 사이를 이어주는 역할로 사용
   * 진짜 콘센트 사이에 꼽는 110v 어댑터를 생각해보자.

# 메서드 시그내처를 바꾸려는 이유

1. 추후 외부 라이브러리를 바꿀 때, 클라이언트 코드는 변경하지 않기 위해
1. 그냥 사용중인 메서드가 표준에 맞지 않아서
1. 기존 클래스에 없는 기능을 추가하기 위해
1. 확장된 용도: 내부 개체를 클라이언트에게 노출시키지 않기 위해
   * 특정 내부에서 사용하는 개체 A가 있다고하자.
   * 그런데 이걸 바깥쪽에서 사용할 이유가 생겼다. 
   * 그런데 모든 값을 사용할 필요는 없다.
   * 이럴 경우 감싸서 밖으로 전달하여 원하는 값에만 접근가능하도록 사용하는 경우가 있다.

# 실제 예

* 윈도우에서 사용 가능한 3D 그래픽 API는 대표적으로 두개임
  * Direct X
  * Open GL
* 두 API 모두 컴퓨터에 설치된 그래픽 카드를 이용
* 따라서 두 API에서 지원하는 기능이 매우 비슷함
  * Open GL: `clearScreen(float, float, float, float)`
  * DirectX: `clear(int, int, int, int)`
* signature가 다르지만 하는 동작은 같음
  * float - \[0.0, 1.0\] : %로 받음
  * int - \[0, 255\]

## 클라이언트 입장

````java
this.graphics.clearScreen(1.f, 0.f, 0.f, 0.f); // argb

this.graphics.clear(0, 0, 0, 255) // rgba
````

* OpenGL을 DirectX로 바꾸기로 결정했다면 모든 곳을 찾아서 고쳐야 한다.
* 심지어 파라미터 순서도 다르다.
* 메서드 이름, 순서, 값도 바뀐다. 
* **수정할 코드가 많을수록 실수할 가능성이 높아진다.**
* 이럴 때 Wrapper class를 만들면 실수할 가능성이 줄어든다.

## Wrapper Class 사용

````java
public final class Graphics {
    private OpenGL gl;

    public void clear(float r, float g, float b, float a) {
        this.gl.clearScreen(a, r, g, b);
    }
}
````

````java
// Client

Graphics graphics;

this.graphics.clear(0.f, 0.f, 0.f, 1.f);
````

* Graphics 개체의 메서드만 호출해준다.
* 만약 여기서 DirectX로 바뀐다면? Graphics의 signature는 변경하지 않고 내부만 변경하면 된다.

````java
public final class Graphics {
    private DirectX dx;

    public void clear(float r, float g, float b, float a) {
        this.dx.clear((int) (r * 255), (int) (g * 255), (int) (b * 255), (int) (a * 255));
    }
}
````

# Wrapper와 DTO

* DataBase에 저장하기 위한 데이터 모델은 그 속성의 수가 매우 많을 것이다.
* 그와 반해 화면에서 실질적으로 보여주는 데이터 속성의 수는 적다.
* 이럴 경우 Database에서 사용하는 구조를 기반으로 화면에 보여줄 수는 있다.
* 하지만 다음의 점에서 좋지 않다.
  * 필요이상의 데이터를 반환함
  * 민감한 정보 포함 가능성이 있음
* 즉, 화면에 보여지기 위한 정보만을 정사영한 모델이 필요하다.
  * 클라이언트가 필요로 하는 정보만을 반환
* 이런 경우 데이터 전송에만 사용하는 개체를 DTO(Data Transfer Object)라고 한다.

## 엄밀하게 Wrapper는 아니다.

* 감싸는 형태는 아니다.
* 하지만 Adapt 측면에서 사용한다면, 타 클래스의 데이터를 내 필요에 맞게 바꾼다는 점에서 비슷하다.
  * A에서 B로 adpat하여 전달

# Reference

* [Pocu Academy](https://pocu.academy/ko)
