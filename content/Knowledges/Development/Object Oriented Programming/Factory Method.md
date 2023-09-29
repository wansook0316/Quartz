---
title: Factory Method
thumbnail: ''
draft: false
tags:
- oop
- design-pattern
- factory-method
- static
- static-method
created: 2023-09-29
---

팩토리 메서드는 무엇일까? 무엇이 좋을까?

# Factory Method

* 사용할 클래스를 정확히 몰라도 개체 생성을 가능하게 해주는 패턴

````java
public final class Cup {
    private int sizeMl;

    private Cup(int sizeMl) {
        this.sizeMl = sizeMl;
    }

    public static Cup createOrNull(CupSize size) {
        switch (size) {
            case SMALL:
                return new Cup(355);
            case MEDIUM:
                return new Cup(473);
            case LARGE:
                return new Cup(651);
            default:
                assert(false) : "Unhandled CupSize:" + size;
                return null;
        }
    }
}
````

* 생성자가 `private`이라 생성을 무조건 정적 함수를 통해서 해야함
* 해당 정적 함수에서 컵의 용량을 결정함

# 생성자 대신 정적 메서드 사용의 장점

* `null`을 반환할 수 있다.
* 생성자는 생성 불가능한 경우 예외를 던질 수 밖에 없다.
  * swift는 nilable initializer가 가능하다.

# 다형적인 팩토리 메서드 패턴

* 컵 사이즈는 나라마다 다르다.
* 같은 small, medium, large여도 각 나라마다 해당 규격이 다를 수 있기 때문
* 이런 경우 어떻게 구현할까?

## 방법

1. `createOrNull`에 매개 변수로 `country`를 넣는다.
   * OO 적인 방법은 아님
1. `createOrNull`을 다형적으로 만든다.
   * `Country`에서 이를 재정의하여 사용
   * OO 적인 방법

## 예시

````java
// Cup

public final class Cup {
    private int sizeMl;

    Cup(int sizeMl) { // Package 접근 제어자
        this.sizeMl = sizeMl;
    }

    public int getSize() {
        return this.sizeMl;
    }
}

// 왜 인터페이스 사용 안함? - 데이터가 들어갈 가능성이 높다고 판단했기 때문
public abstract class Menu {
    // 다른 메서드 생략
    public abstract Cup createCupOrNull(CupSize size); // 가상 생성자라고 볼 수 있음
}

public class AmericanMenu extends Menu {
    @Override
    public Cup createCupOrNull(CupSize size) {
        switch (size) {
            case SMALL:
                return new Cup(473);
            case MEDIUM:
                return new Cup(621);
            case LARGE:
                return new Cup(887);
            default:
                assert(false) : "Unhandled CupSize:" + size;
                return null;
        }
    }
}

// Korean 생략
````

* `createCupOrNull(CupSize size)`는 가상 생성자라고 볼 수 있음

## 다형적인 팩토리 메서드 패턴 2

* `Cup`도 추상적일 수 있다.

````java
public abstract class Cup {
    private int sizeMl;

    protected Cup(int sizeMl) {
        this.sizeMl = sizeMl;
    }

    public int getSize() {
        return this.sizeMl;
    }
}

public final class GlassCup extends Cup {
    GlassCup(int sizeMl) {
        super(sizeMl);
    }
}

public final class PaperCup extends Cup {
    private Lid lid;

    PaperCup(int sizeMl, Lid lid) {
        super(sizeMl);

        this.lid = lid;
    }
}

// 종이컵을 반환하는 것으로 변경됨
public class AmericanMenu extends Menu {
    @Override
    public Cup createCupOrNull(CupSize size) {
        switch (size) {
            case SMALL:
                return new PaperCup(473);
            case MEDIUM:
                return new PaperCup(621);
            case LARGE:
                return new PaperCup(887);
            default:
                assert(false) : "Unhandled CupSize:" + size;
                return null;
        }
    }
}
````

* 구체적인 것부터 만들어서 필요하면 추상화해라
* 처음부터 추상적인 패턴을 사용하지 마라. 

# 팩토리 메서드의 장점

* 클라이언트는 본인에게 익숙한 인자를 통해 개체 생성이 가능하다.
  * ml가 아닌, 사이즈로 생성 가능
* 오류일시 `null`을 반환할 수 있다.
* 다형적으로 개체 생성이 가능하다.
  * 그래서 **가상 생성자 패턴**이라고도 한다.

# Reference

* [Pocu Academy](https://pocu.academy/ko)
