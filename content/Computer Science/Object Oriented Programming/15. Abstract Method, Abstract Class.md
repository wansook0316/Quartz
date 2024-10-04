---
title: Abstract Method, Abstract Class
thumbnail: ''
draft: false
tags:
- oop
- abstract-class
- abstract-method
- polymorphism
- java
created: 2023-09-29
---

추상클래스는 왜 필요할까?

# 다형성은 멋지고 강력한 개념

* OO 4대 특성인 이유 (상속, 캡슐화, 다형성, 추상화)
* 다형성은 상속에 기반
* 상속과 다형성은 추상화에 기반 
  * 공통된 것을 뽑아내어 일반화된, 범용적인 것으로 적용
  * 여러 클래스에서 공통 분모를 뽑아 부모 클래스로 제작
  * 자식마다 달리 작동하는 구현을 부모의 method signature로 일반화
* 추상화는 조금더 복잡한 문제를 해결하기 위한 것

# 새로운 개념은 새로운 문제도 가져온다

* 추상화는 막강하지만 그로 인해 생각지 못한 문제가 발생
* **역시 사람은 직접 해보고 당해봐야 답을 찾음**
* 새로운 개념 == 위험함
* 충분한 검증이 없다면 신뢰도 없는 것.
* 테스트 용으로 사용은 가능하나, 프로덕트에 넣는 것은 신중히.
* 엄청 좋다라고 말하는 사람에게 꼭 질문해야 하는 것은 **"단점이 뭔데?"**

# 맨날 싸우는 몬스터

* 몬스터: 오우거, 유령, 트롤
* 공격하는 몬스터 종류에 따라 피해치 계산법을 다르게 적용할 예정
* 나중에 몬스터 종류를 추가할 수도 있음 == 다형성으로 설계가 적합

## 상태와 동작

* 상태
  * HP
  * 생존 여부
  * 공격력
  * 방어력
* 동작
  * 공격하다

## 실제 동작

````java
// Monster
public void attack(Monster target) {
    // 각 몬스터마다 다른 방식으로 계산하기 때문에 비어있음
}

protected void inflictDamage(int amount) {
    this.hp = Math.Max(0, this.hp - amount);
}

// Ghost
public void attack(Monster target) {
    // 피해량 계산

    target.inflicDamage(damage)
}

// Troll
public void attack(Monster target) {
    // 피해량 계산

    target.inflicDamage(damage)
}
````

# 다형성이 필요한 부분을 너무 넓게 봄

* 근데 여기서 `target.inflictDamange()`를 호출하지 않으면?
* 호출해도 hp가 안깎이는 문제가 생김
* 굳이 자식한테 이 역할까지 바라는게 맞았을까?
* 피해량만 계산하라는 책임만 구현하도록 하는 것이 맞다.

````java
// Monster
public final void attack(Monster target) {
    int damage = calculateDamage(target);
    target.hp = Math.Max(0, target.hp - damage);
}

public int calculateDamage(Monster target) {
    return 0;
}

// Ghost
public int calculateDamage(Monster target) {
    return target.getDefense() - target.getAttack();
}

// Ogre
public int calculateDamage(Monster target) {
    return this.getAttack() - target.getAttack() - target.getDefense();
}

// Troll
public int calculateDamage(Monster target) {
    return this.getAttack() - target.getDefense() / 2;
}
````

# calculateDamage를 아예 구현을 안한다면..?

* 위처럼 하면 문제가 해결될 것 같았으나..
* 사용하는쪽을 믿을 수 없다.
* `calculateDamage()`를 override를 안하면 또 문제가 생긴다.
* 이는 **이미 0을 반환하는 구현이 Monster에 있기 때문이다.**
* 구현을 강제하고 싶은데, 어떻게 하면 될까?
* 사실 **구현을 없애면 된다.**

# 구현이 없는 메서드

* signature는 있음
* 내부 코드는 없음
* 동작이 일부라도 구현되지 않은 클래스는 실체가 완성되지 않은 클래스
* not concrete
* == abstract
* 사실 C에서는 선언과 구현이 분리되어 있기 때문에 직관적으로 다가온다.
* 자바는 이게 사실 안되긴한다.

# 애초에 문제도 있다.

* Monster라는 개체를 생성할 수 있는 것이 말이되는가?
* 이는 Group을 나누기 위한 용도로서 존재한다. 즉, 추상적이고, 일반화되어 있다.
* 어느 종류에도 속하지 않는 Monster를 생성하는 건 뭔가 이상하다. 구체적인 개체만이 존재할 수 있다.
* 즉, 메서드 구현 여부와 상관없이 근본적으로 존재하는 문제다.

# 목표

1. `Monster`의 자식 클래스가 `calculateDamage()`를 무조건 구현하게 한다.
1. `Monster`는 인스턴스를 만들지 못하게 하고 싶다.

# 구현이 없는 메서드를 어떻게 만들까

* Java는 C처럼 선언과 구현이 분리되어있지 않다. 
* 구현을 그냥 없애고 `calculateDamage();` 이런식으로 쓰면 `abstract`가 빠졌다는 등의 에러를 본다.
* 그래서 method 앞에 `abstract`를 달고 컴파일 해보면, 이번에는 class가 `abstract`가 아니라는 에러를 본다.
* 즉, **Method가 abstract면 class도 abstract한 건지 확인해보아야 한다.**
* 사실 method가 abstract면, 즉 구현을 하지 않는다면 이 method가 속한 class도 추상적이라 할 수 있다.
* 만약 그것이 성립하지 않는다면 `abstract`로 선언한 함수에 대해서 `Monster` 인스턴스가 메서드를 접근할 수 있다는 말인데,
* method의 구현이 없기 때문에 성립이 불가하다.
* 즉, **Method가 abstract면 class도 abstract하다.**

# 추상 클래스

* Class diagram에서는 italic으로 표기 (class name, method name)
* `abstract class`로 만들면 됨
* 인스턴스를 만들 수 없음
* 다른 클래스의 부모 클래스가 될 수는 있음
* 반드시 추상 메서드가 들어있을 필요는 없음. 즉, 구현이 들어가 있는 함수도 있을 수 있음

# Reference

* [Pocu Academy](https://pocu.academy/ko)
