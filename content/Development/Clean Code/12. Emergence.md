---
title: Emergence
thumbnail: ''
draft: false
tags:
- emergence
- test
- refactoring
- duplications
- class
- methods
created: 2023-09-21
---

# 창발성

 > 
 > 단순한 결합이 복잡한 결과를 나타내는 것을

뉴런 하나만으로 의미가 있을까? 뉴런이 모여 어떠한 인식을 하기 위해서는 수십억개의 뉴련이 상호작용해야 한다. 즉, 미시적인 부분의 각각의 특성만으로는 설명할 수 없는 전체로서 나타나는 복잡한 현상을 말한다.

# 창발적 설계로 깔끔한 코드를 구현하자

창발성의 이러한 뜻에서 미루어 볼 때, 저자가 말하고자 하는 것은 어떤 좋은 규칙과 원칙에 따라 설계를 했을 때, 그것들이 모여 아주 좋은 거시적 설계가 될 수 있다는 것을 의미하고 있다. 그렇다면 이런 규칙이 있을까? 우리들 대다수는 **켄트 벡**이 제시한 단순한 설계 규칙 네가지가 설계 품질을 높여준다고 믿는다.

1. 모든 테스트를 실행한다.
1. 중복을 없앤다.
1. 프로그래머 의도를 표현한다.
1. 클래스와 메서드 수를 최소로 줄인다.

위 목록은 중요도 순이다.

# 단순한 설계 규칙 1: 모든 테스트를 실행하라

가장 중요한 것은 **의도 대로 돌아가는 시스템을 만드는 것**이다. 이를 위한 검증방법이 없다면, 시스템 설계 문서는 그만큼의 가치를 인정받기 어렵다. 테스트를 철저히 거쳐 모든 테스트 케이스를 항상 통과하는 시스템이 "테스트가 가능한 시스템"이다. 검증이 불가한 시스템은 출시하면 안된다.

테스트가 가능한 시스템을 만들려고 애쓰면 설계 품질이 높아진다. 

1. 크기가 작고 목적 하나만 수행하는 클래스가 나온다. SRP 준수 클래스는 테스트가 쉽기 때문이다.
1. 테스트 케이스가 많을 수록 코드를 쉽게 작성하도록 돕는다.
1. DI, Interface, 추상화 등을 통해 결합도를 낮춘다. 결합도가 높으면 테스트가 어렵기 때문이다.

테스트가 가능한 시스템을 만드는 것이 곧, 높은 시스템 품질을 만든다.

# 단순한 설계 규칙 2~4: 리팩터링

테스트 케이스가 모두 작성되었다면 이제 코드와 클래스를 정리해도 좋다. **코드를 정리하면서 시스템이 깨질 걱정할 필요가 없기 때문이다.** 이 단계에서는 무엇이든 적용해도 된다.

# 중복을 없애라

````java
int size() {}
boolean isEmpty{}

boolean isEmpty() {
    return 0 == size();
}
````

`isEmpty()` 메서드를 만들려고 할 때, 이전에 만든 `size()` 함수를 사용하면 중복을 줄 일 수 있다.

````java
public void scaleToOneDimension(float desiredDimension, float imageDimension) {
    if (Math.abs(desiredDimension - imageDimension) < errorThreshold)
        return;
    float scalingFactor = desiredDimension / imageDimension;
    scalingFactor = (float)(Math.floor(scalingFactor * 100) * 0.01f);
    
    RenderedOpnewImage = ImageUtilities.getScaledImage(image, scalingFactor, scalingFactor);
    // 중복 발생!
    image.dispose();
    System.gc();
    image = newImage;
}

public synchronized void rotate(int degrees) {
    RenderedOpnewImage = ImageUtilities.getRotatedImage(image, degrees);
    // 중복 발생!
    image.dispose();
    System.gc();
    image = newImage;
}
````

중복이 발생하는 부분을 아래처럼 고쳐보자.

````java
public void scaleToOneDimension(float desiredDimension, float imageDimension) {
    if (Math.abs(desiredDimension - imageDimension) < errorThreshold)
        return;
    float scalingFactor = desiredDimension / imageDimension;
    scalingFactor = (float) Math.floor(scalingFactor * 10) * 0.01f);
    replaceImage(ImageUtilities.getScaledImage(image, scalingFactor, scalingFactor));
}

public synchronized void rotate(int degrees) {
    replaceImage(ImageUtilities.getRotatedImage(image, degrees));
}

private void replaceImage(RenderedOpnewImage) {
    image.dispose();
    System.gc();
    image = newImage;
}
````

이렇게 나눠놓고 보니, 클래스가 SRP를 위반한다. 이미지 변경 시에도 해당 클래스를 건들여야 한다. 이런 경우 이를 다른 클래스로 옮기는 것이 낫겠다는 생각도 든다. 이런 소규모 재사용 부터 제대로 익혀야 대규모 재사용을 배울 수 있다.

다음으로는 TEMPLATE METHOD이다. TEMPLATE METHOD 패턴은 고차원 중복을 제거할 목적으로 자주 사용하는 기법이다. 예를 살펴보자.

````java
public class VacationPolicy {
    public void accrueUSDDivisionVacation() {
        // 지금까지 근무한 시간을 바탕으로 휴가 일수를 계산하는 코드
        // ...
        // 휴가 일수가 미국 최소 법정 일수를 만족하는지 확인하는 코드
        // ...
        // 휴가 일수를 급여 대장에 적용하는 코드
        // ...
    }
  
    public void accrueEUDivisionVacation() {
        // 지금까지 근무한 시간을 바탕으로 휴가 일수를 계산하는 코드
        // ...
        // 휴가 일수가 유럽연합 최소 법정 일수를 만족하는지 확인하는 코드
        // ...
        // 휴가 일수를 급여 대장에 적용하는 코드
        // ...
    }
}
````

최소 법정 일수를 계산하는 코드만 제외하면 두 메서드는 거의 동일하다. 최소 법정 일수를 계산하는 알고리즘은 직원 유형에 따라 살짝 변한다. 여기에 TEMPLATE METHOD 패턴을 적용해 눈에 들어오는 중복을 제거한다.

````java
abstract public class VacationPolicy {
    public void accrueVacation() {
        caculateBseVacationHours();
        alterForLegalMinimums();
        applyToPayroll();
    }
    
    private void calculateBaseVacationHours() { /* ... */ };
    abstract protected void alterForLegalMinimums();
    private void applyToPayroll() { /* ... */ };
}

public class USVacationPolicy extends VacationPolicy {
    @Override protected void alterForLegalMinimums() {
        // 미국 최소 법정 일수를 사용한다.
    }
}

public class EUVacationPolicy extends VacationPolicy {
    @Override protected void alterForLegalMinimums() {
        // 유럽연합 최소 법정 일수를 사용한다.
    }
}
````

하위 클래스는 중복되지 않는 정보만 제공해 `accrueVacation` 알고리즘에서 빠진 '구멍'을 메운다.

# 표현하라

1. 좋은 이름을 선택한다.
1. 함수와 클래스 크기를 가능한 줄인다.
1. 표준 명칭을 사용한다. 디자인 패턴은 의사소통과 표현력 강화가 주요 목적이다. 유사한 이름을 사용해라.
1. 단위 테스트 케이스를 꼼꼼히 작성한다.

위의 방법론보다 더 중요한 것은 **노력**이다. 많은 고민을하고 만들어진 작품을 조금 더 자랑하자. 주의는 대단한 재능이다.

# 클래스와 메서드 수를 최소로 줄여라

중복을 제거하고, 의도를 표현하고, SRP를 준수한다는 기본적인 개념도 극단으로 치달으면 득보다 실이 많아진다. 클래스와 메서드 크기를 줄이자고 조그만 클래스와 메서드를 수없이 만드는 사례도 없지 않다. 그래서 이 규칙은 함수와 클래스 수를 가능한 한 줄이라고 제안한다.

때로는 무의미하고 독단적인 정책 탓에 클래스 수와 메서드 수가 늘어나기도 한다. 클래스마다 무조건 인터페이스를 생성하라고 요구하는 구현 표준이 좋은 예다. 자료 클래스와 동작 클래스는 무조건 분리해야 한다고 주장하는 개발자도 좋은 예다. **가능한 독단적인 견해는 멀리하고 실용적인 방식을 택해야 한다.**

목표는 함수와 클래스 크기를 작게 유지하면서 동시에 시스템 크기도 작게 유지하는 데 있다. 하지만 이 규칙은 간단한 설계 규칙 **네 개 중 우선순위가 가장 낮다.** 다시 말해, 클래스와 함수 수를 줄이는 작업도 중요하지만, **테스트 케이스를 만들고 중복을 제거하고 의도를 표현하는 작업이 더 중요하다는 뜻이다.**

# 결론

경험을 대신할 단순한 개발 기법이 있을까? 당연히 없다. 하지만 이 장, 아니 이 책에서 소개하는 기법은 저자들이 수십 년 동안 쌓은 경험의 정수다. 단순한 설계 규칙을 따른다면 (오랜 경험 후에야 익힐) 우수한 기법과 원칙을 단번에 활용할 수 있다.

# Reference

* [창발](https://ko.wikipedia.org/wiki/%EC%B0%BD%EB%B0%9C)
* [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin)
* [Yooii-Studios / Clean-Code](https://github.com/Yooii-Studios/Clean-Code)
* [Clean Code](https://book.interpark.com/product/BookDisplay.do?_method=detail&sc.prdNo=213656258&gclid=CjwKCAjw9-KTBhBcEiwAr19igynFiOxjFYKEJyaiyNEI4XXL1bFM78ki2cNQLMSxcUWU9XNks8eEThoCG6EQAvD_BwE)
* [zinc0214 / CleanCode](https://github.com/Yooii-Studios/Clean-Code)
* [wojteklu/clean_code.md](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
