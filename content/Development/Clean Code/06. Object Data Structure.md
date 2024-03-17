---
title: Object Data Structure
thumbnail: ''
draft: false
tags:
- data-structure
- law-of-Demeter
- heuristics
created: 2023-09-21
---

우리는 `private`을 통해 변수를 자주 정의한다. 이렇게 하는 이유는 **남들이 변수에 의존하지 않도록 만들고 싶기 때문**이다. 그럼에도 불구하고 많은 프로그래머들은 `get`, `set` 함수를 당연하게 외부에 노출하는 오류를 범한다. 

# 자료 추상화

````java
// 구체적인 Point 클래스
public class Point { 
  public double x; 
  public double y;
}
````

이 경우 `public`을 사용하여 개별적으로 값을 읽고 설정하도록 강제한다. 또 Point를 나타내는 방법 중 하나인 직교좌표계를 사용함을 은연중에 내포하고 있다. 그럼 만약 여기서 `get`, `set`에 관한 함수만 제공하고 변수를 `private`하게 만들면 감춰지는 걸까? 아니다. 여전히 구현 사항을 외부로 노출하는 셈이다. **변수 사이에 함수라는 계층을 넣는다고 구현이 감춰지지는 않는다. 구현을 감추려면 추상화가 필요하다.**

````java
// 추상적인 Point 클래스
public interface Point {
  double getX();
  double getY();
  void setCartesian(double x, double y); 
  double getR();
  double getTheta();
  void setPolar(double r, double theta); 
}
````

저자가 원하는 class는 이와 같은 방식이다. 추상 인터페이스를 제공하여 **사용자가 구현을 모른체 자료의 핵심을 조작할 수 있어야 한다.** 위 같은 경우 사용하는 입장에서는 구현이 직교좌표계로 되어 있는지 극좌표계로 되어있는지 알 방법이 없다. 

````java
// 구체적인 Vehicle 클래스
public interface Vehicle {
  double getFuelTankCapacityInGallons();
  double getGallonsOfGasoline();
}
````

두 함수를 보면, 그냥 구현되어 있는 값을 읽어서 반환하고 있음을 직관적으로 확인할 수 있다. (물론 아닐수도 있지만 변수명만 보았을 때 그러하다는 얘기)

````java
// 추상적인 Vehicle 클래스
public interface Vehicle {
  double getPercentFuelRemaining();
}
````

반면 이 경우 Percent라는 추상적인 개념으로 알려주고 있다. 이 경우, 정보가 어디서 오는지 사용자 측에서는 알 방법이 없다. 

## 요약

* 자료를 세세히 공개하는 것보다, 개념을 내포하는 추상화를 통해 표현해라.
* 이 과정에서 단순히 인터페이스나 조회/설정 함수를 사용한다고 해서 추상화를 이룰 수 없다.
* 아무 생각 없이 조회/설정 함수를 추가하는 방법은 매우 나쁘다.

# 자료 / 객체 비대칭

자료 추상화 절에서 발생한 문제의 본질은 무엇일까? 이는 **자료 구조와 객체의 차이를 구분하지 않았기 때문이다.** 그렇다면 자료 구조와 객체의 특징부터 알아보는 것이 수순에 맞을 것이다.

* 자료구조
  * 자료를 그대로 공개하며 별다른 함수는 제공하지 않는다.
* 객체
  * 추상화 뒤로 자료를 숨긴 채 자료를 다루는 함수만 공개한다.

즉, 자료구조의 경우 자료에 집중하고, 객체의 경우 함수에 집중한다는 말이다. 이렇게 보니 **두 개념은 굉장히 상반**된 것으로 보인다. 

````java
// 절차적인 도형
public class Square { 
  public Point topLeft; 
  public double side;
}

public class Rectangle { 
  public Point topLeft; 
  public double height; 
  public double width;
}

public class Circle { 
  public Point center; 
  public double radius;
}

public class Geometry {
  public final double PI = 3.141592653589793;
  
  public double area(Object shape) throws NoSuchShapeException {
    if (shape instanceof Square) { 
      Square s = (Square)shape; 
      return s.side * s.side;
    } else if (shape instanceof Rectangle) { 
      Rectangle r = (Rectangle)shape; 
      return r.height * r.width;
    } else if (shape instanceof Circle) {
      Circle c = (Circle)shape;
      return PI * c.radius * c.radius; 
    }
    throw new NoSuchShapeException(); 
  }
}
````

이 코드는 자료 구조의 입장에서 각 다각형의 넓이를 구하는 코드를 구현해 본 것이다. 자료 구조에 맞게 코드를 구성하다 보니 값에 대해 접근 가능하도록 하고, 함수는 만들지 않았다. 이 경우, `area`라는 동작을 하기 위해서는 `if`문을 통해 **절차적으로 처리**해야 한다. 

만약 둘레의 길이를 구하는 `perimeter()`함수를 추가하고 싶다면 어떨까? `Geometry` 내부에 하나의 함수를 새로 만들기만 하면 끝이다. **기존 자료구조에 영향을 미치지 않는다.**

그렇다면 이번에는 새로운 도형인 오각형을 넣어본다고 생각해보자. 이 경우에는 `Geometry`에 속한 **모든 함수를 변경해주어야 한다.**

````java
// 다형적인 도형
public class Square implements Shape { 
  private Point topLeft;
  private double side;
  
  public double area() { 
    return side * side;
  } 
}

public class Rectangle implements Shape { 
  private Point topLeft;
  private double height;
  private double width;

  public double area() { 
    return height * width;
  } 
}

public class Circle implements Shape { 
  private Point center;
  private double radius;
  public final double PI = 3.141592653589793;

  public double area() {
    return PI * radius * radius;
  } 
}
````

이번에는 객체를 사용하여 만들어 보았다. 변수를 감추었고, 함수로만 외부에서 사용가능하도록 열어주었다. 

`perimeter()` 추가를 원한다면 **모든 클래스에 해당 함수를 구현**해주어야 한다. 반대로 오각형을 추가하고 싶다면, 단순히 **새로운 클래스를 만들어 그에 맞는 메서드만 구현**해주면 된다.

이렇게 자료 구조를 사용하는 방식과 객체를 사용하는 방식은 사실상 반대의 영역에 있다는 것을 확인할 수 있다. 즉, 근본적으로 양분되는 성질을 지닌다.

## 요약

# 디미터 법칙(Law of Demeter)

 > 
 > 모듈은 자신이 조작하는 객체의 속사정을 몰라야 한다.

대표적인 Heruistic 방식(경험에 기반하여 문제를 해결하거나 학습하거나 발견해 내는 방법 == ~~감, 직감~~)이다. 

![](CleanCode_06_ObjectDataStructure_0.png)

좀 더 정확하게 표현하면, **클래스 C의 메서드 f는 위에 표현된 번호에 해당하는 객체의 메서드만 호출해야 한다.**

1. Class C
1. f가 생성한 객체
1. f 인수로 넘어온 객체
1. C instance 변수에 저장된 객체

여기서 핵심은, **낯선 사람은 경계하고 친구랑만 놀라는 것이다.** 예시를 보면서 이해해보자.

## 기차 충돌

````java
final String outputDir = ctxt.getOptions().getScratchDir().getAbsolutePath();
````

사용해보았던 메서드이다. 여러 객체가 한 줄로 이어진 기차처럼 보인다고 해서 이런 코드를 \*\*기차 충돌(train wreck)\*\*이라 부른다. **일반적으로 조잡하다 여겨지는 방식**이므로 피하는 편이 좋다. 위 코드는 다음과 같이 나누는 편이 좋다.

````java
// 기차 충돌을 해결한 코드
Options opts = ctxt.getOptions();
File scratchDir = opts.getScratchDir();
final String outputDir = scratchDir.getAbsolutePath();
````

이렇게 변경된 코드를 보고 디미터 법칙을 위반하는지 확인해보자. 이 논의를 해결하기 위해서는 `ctxt`. `opts`, `scratchDir`가 **자료 구조인지 객체인지 명확하게 알아야 한다.** 결국 디미터 법칙 역시 특정 모듈의 캡슐화를 통해 정보 은닉을 잘했느냐에 대한 얘기로 귀결될 수 있기 때문이다.

만약 자료 구조라면, 당연히 내부 구조를 노출하기 때문에 디미터 법칙이 적용되지 않는다. 하지만 객체라면 내부 구조가 노출되어 있기 때문에(== 조작하는 객체의 속사정을 알고 있음) 디미터 법칙을 위반한다.

````java
final String outputDir = ctxt.options.scratchdir.absoluterPath;
````

그런데 사실 자료구조인 경우 위와 같이 변경하는 것이 좋다. 앞에서 말했듯 의미없는 `get`, `set`은 필요없다.

## 잡종 구조

말로만 들어도 혼란스러운 이런 상황은 실제 코드 양산 시 더 많은 문제를 일으킨다. 예상했겠지만 자료구조와 객체가 섞인 잡종 구조가 나온다. 섞인 상황은 다음과 같다.

* 중요한 기능을 수행하는 함수
* 공개 변수
* 공개 조회/설정 변수 (`get`, `set`)

이렇게 혼재된 상황은 객체로 설계됐음에도 불구하고 해당 클래스를 사용하는 사람이 **절차 지향적인 자료구조처럼** private 변수를 사용하고 싶게 만든다. 

이런 구조는 새로운 함수는 물론이고 새로운 자료 구조도 추가하기 어렵다. 양쪽 세상에서 단점만 모아놓은 구조다. 그러므로 되도록 이런 구조는 피하도록 하자. **프로그래머가 함수나 타입을 보호할지 공개할지 확신하지 못해 (더 나쁘게는 무지해) 어중간하게 내놓은 설계에 불과하다.**

## 구조체 감추기

````java
final String outputDir = ctxt.getOptions().getScratchDir().getAbsolutePath();
````

그럼 `ctxt`. `opts`, `scratchDir` 이 객체라면 어떨까? 일단 디미터 법칙은 위배한 것은 알겠고, 어떻게 변경할지 생각해보자. 아래와 같이 변경하면 좋을까?

````java
// ctxt 객체에 공개해야 하는 메서드가 너무 많음: 너무 추상화함
ctxt.getAbsolutePathOfScratchDirectoryOption();
// 자료구조를 반환하는 느낌으로 사용하고 있다.
ctxt.getScratchDirectoryOption().getAbsolutePath()
````

이 경우 둘다 마음에 안든다. 원론적으로 왜 절대 경로가 필요한지 확인해보자.

````java
String outFile = outputDir + "/" + className.replace('.', '/') + ".class"; 
FileOutputStream fout = new FileOutputStream(outFile); 
BufferedOutputStream bos = new BufferedOutputStream(fout);
````

임시 디렉터리의 절대 경로를 얻으려는 이유가 **임시 파일을 생성하기 위한 목적이라는 것을 알았다.** 그렇다면, 이 임시 파일 자체를 생성하는 책임을 `ctxt` 에 넘기면 어떨까?

````java
BufferedOutputStream bos = ctxt.createScratchFileStream(classFileName);
````

보다 적당하게 변경되었다. **내부 구조를 드러내지 않으며 모듈은 몰라야하는 여러객체를 탐색할 필요가 없다.** 디미터 법칙도 위반하지 않는 객체 지향방식을 만들었다.

# 자료 전달 객체

````java
public class Address { 
    public String street; 
    public String streetExtra; 
    public String city; 
    public String state; 
    public String zip;
}
````

자료 구조체의 전형적인 형태는 공개 변수만 있고 함수가 없는 클래스이다. 이를 \*\*자료 전달 객체(Data Transfer Object)\*\*라 한다. 

## 활성 레코드

활성 레코드는 DTO의 특수한 형태다. 공개 변수가 있거나 비공개 변수에 getter/setter가 있는 자료 구조지만, 대게 save나 find와 같은 탐색 함수도 제공한다.

불행히도 활성 레코드에 비즈니스 규칙 메서드를 추가해 이런 자료 구조를 객체로 취급하는 개발자가 흔하다. 하지만 이렇게 하게 되면 잡종 구조가 나오게 된다.

해결책은 당연하다. **활성 레코드는 자료 구조로 취급한다.** 비즈니스 규칙을 담으면서 **내부 자료를 숨기는 객체는 따로 생성**한다. (여기서 내부 자료는 활성 레코드의 인스턴스일 가능성이 높다.)

# 결론

||자료 구조 사용 방식|객체 사용 방식|
|::|:--------------------------|:-------------------|
|연관된 패러다임|절차적|객체지향적|
|특징|자료를 공개적으로 나타냄|동작을 공개하고 자료를 숨김|
|장점|자료구조 변화 없이 새로운 함수 추가 쉬움|기존 함수를 변형하지 않으면서 새로운 클래스를 추가하기 쉬움|
|단점|새로운 자료구조를 추가하기 어려움. 모든 함수를 고쳐야 함|새로운 함수를 추가하기 어려움. 모든 클래스에 추가해주어야 함|
|선택 기준|새로운 동작을 추가하는 유연성 필요시|새로운 자료 타입을 추가하는 유연성 필요시|

* 객체 지향 코드에서 어려운 변경은 절차적 코드에서 쉬우며, 절차적 코드에서 어려운 변경은 객체 지향 코드에서 쉽다. (Trade-Off)
* 상황에서 맞게 두 방식을 선택하여 적용하는 것이 좋다.
* 무조건적으로 모든 것이 객체라는 생각은 미신이다.
* 객체 호출은 나와 가까운 **친구들과 하자.** 외부인은 거리를 두자.

# Reference

* [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin)
* [Yooii-Studios / Clean-Code](https://github.com/Yooii-Studios/Clean-Code)
* [Clean Code](https://book.interpark.com/product/BookDisplay.do?_method=detail&sc.prdNo=213656258&gclid=CjwKCAjw9-KTBhBcEiwAr19igynFiOxjFYKEJyaiyNEI4XXL1bFM78ki2cNQLMSxcUWU9XNks8eEThoCG6EQAvD_BwE)
* [zinc0214 / CleanCode](https://github.com/Yooii-Studios/Clean-Code)
* [wojteklu/clean_code.md](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
