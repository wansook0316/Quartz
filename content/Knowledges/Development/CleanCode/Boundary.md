---
title: Boundary
thumbnail: ''
draft: false
tags: null
created: 2023-09-21
---

우리는 시스템에 들어가는 모든 코드를 보통 직접 개발하지 않는다. 외부 패키지 구입, 오픈소스, 사내 팀의 제공 컴포넌트 사용 등 다양한 방식으로 외부 코드를 사용한다. 이 외부 코드를 우리 코드에 깔끔하게 통합하는 것은 꽤나 중요하다. 이 때 사용할 수 있는 기법과 기교를 배워보자.

# 외부 코드 사용하기

**인터페이스를 제공하는 입장과 사용하는 입장 사이에는 필연적인 긴장감이 존재한다.** 제공하는 입장에서는 범용성을 위해 다양하게 사용할 수 있도록 설계한다. 그와 반대로 사용하는 입장에서는 사용할 때 편리한 specific한 인터페이스를 원한다. 이것을 (시스템) "경계에서의 긴장"이라고 부른다. 다음의 interface를 보자.

* `clear() void – Map`
* `containsKey(Object key) boolean – Map`
* `containsValue(Object value) boolean – Map`
* `clear() void – Map`
* `containsKey(Object key) boolean – Map`
* `containsValue(Object value) boolean – Map`
* `entrySet() Set – Map`
* `equals(Object o) boolean – Map`
* `get(Object key) Object – Map`
* `getClass() Class<? extends Object> – Object `
* `hashCode() int – Map`
* `isEmpty() boolean – Map`
* `keySet() Set – Map`
* `notify() void – Object `
* `notifyAll() void – Object`
* `put(Object key, Object value) Object – Map`
* `putAll(Map t) void – Map`
* `remove(Object key) Object – Map`
* `size() int – Map`
* `toString() String – Object `
* `values() Collection – Map`
* `wait() void – Object`
* `wait(long timeout) void – Object`
* `wait(long timeout, int nanos) void – Object `

이 상태에서 Sensor class를 저장하는 Map 객체를 사용한다고 생각해보자.

````java
Map sensors = new HashMap();
Sensor s = (Sensor)sensors.get(sensorId);
````

이렇게 사용하는 방식이 코드 전반에 걸쳐있다고 생각해보자. 일단 문제가 뭐냐면, **casting의 부담을 지속하여 안게된다는 것이다.** 여기서 generic을 사용하면 가독성과 의도 모두를 챙길 수 있다.

````java
Map<String, Sensor> sensors = new HashMap<Sensor>();
Sensor s = sensors.get(sensorId);
````

이러면 끝일까? 아니다. 문제는 사용하는 측에서 필요없는 method에도 접근이 가능하다. 이런 코드가 이곳 저곳에서 중복되어 사용된다면, Map의 interface가 변경된 경우 해당 코드를 모두 찾아서 변경시켜주어야 한다. **즉, 변화에 강건하지 못한 구조다.** 이런 경우의, 좋은 해결방법은 wrapping이다.

````java
public class Sensors {
    // 경계의 인터페이스(이 경우에는 Map의 메서드)는 숨겨진다.
    // Map의 인터페이스가 변경되더라도 여파를 최소화할 수 있다. 예를 들어 Generic을 사용하던 직접 캐스팅하던 그건 구현 디테일이며 Sensor클래스를 사용하는 측에서는 신경쓸 필요가 없다.
    // 이는 또한 사용자의 목적에 딱 맞게 디자인되어 있으므로 이해하기 쉽고 잘못 사용하기 어렵게 된다.

    private Map sensors = new HashMap();
    
    public Sensor getById(String id) {
        return (Sensor)sensors.get(id);
    }
}
````

모든 Map을 이런식으로 디자인하라는 것은 아니다. 하지만, "경계에 있는 인터페이스"의 경우 시스템 전반에서 사용하는 것은 좋지 않다. 다음과 같은 원칙을 지키는 것이 좋다.

* 해당 객체를 사용하는 class 내부에 넣는다.
* 혹은 가까운 계열의 class에 넣는다.
* Map인스턴스를 공개 API의 인수로 넘기거나 반환하지 않는다.

즉, 내부에서만 사용하라는 말이다.

# 경계 살피고 익히기

third party 코드를 사용할 때, 주의해야 하는 점은 문제가 발생했을 때, 이게 라이브러리 문제인지, 우리 코드 문제인지 파악이 쉬워야 한다는 점이다. 분명 문제가 발생한 곳이 우리책임이 아니고 라이브러리의 책임인데 디버깅에 시간을 오래 쏟는다면 이는 분명한 리소스 낭비일 것이다.

이러한 점에 착안하여 우리는 **적어도 우리가 사용할 코드에 대해서는 테스트를 할 필요가 있다.** 이게 장기적으로 더 적은 리소스를 들이는 일일 수 있다. 바로 문제점을 찾을 수 있기 때문이다. 이를 짐 뉴커크는 "테스트 공부하기"라고 부른다.

# log4j 익히기

그럼 실제로 어떤 방식으로 익히는지 예시를 보여주겠다.

````java
// 1.
// 우선 log4j 라이브러리를 다운받자.
// 고민 많이 하지 말고 본능에 따라 "hello"가 출력되길 바라면서 아래의 테스트 코드를 작성해보자.
@Test
public void testLogCreate() {
    Logger logger = Logger.getLogger("MyLogger");
    logger.info("hello");
}

// 2.
// 위 테스트는 "Appender라는게 필요하다"는 에러를 뱉는다.
// 조금 더 읽어보니 ConsoleAppender라는게 있는걸 알아냈다.
// 그래서 ConsoleAppender라는 객체를 만들어 넣어줘봤다.
@Test
public void testLogAddAppender() {
    Logger logger = Logger.getLogger("MyLogger");
    ConsoleAppender appender = new ConsoleAppender(); // 여기
    logger.addAppender(appender); // 여기
    logger.info("hello");
}

// 3.
// 위와 같이 하면 "Appender에 출력 스트림이 없다"고 한다.
// 이상하다. 가지고 있는게 이성적일것 같은데...
// 구글의 도움을 빌려, 다음과 같이 해보았다.
@Test
public void testLogAddAppender() {
    Logger logger = Logger.getLogger("MyLogger");
    logger.removeAllAppenders();
    logger.addAppender(new ConsoleAppender(
        new PatternLayout("%p %t %m%n"),
        ConsoleAppender.SYSTEM_OUT));
    logger.info("hello");
}

// 성공했다. 하지만 ConsoleAppender를 만들어놓고 ConsoleAppender.SYSTEM_OUT을 받는건 이상하다.
// 그래서 빼봤더니 잘 돌아간다.
// 하지만 PatternLayout을 제거하니 돌아가지 않는다.
// 그래서 문서를 살펴봤더니 "ConsoleAppender의 기본 생성자는 unconfigured상태"란다.
// 명백하지도 않고 실용적이지도 않다... 버그이거나, 적어도 "일관적이지 않다"고 느껴진다.
````

````java
// 조금 더 구글링, 문서 읽기, 테스트를 거쳐 log4j의 동작법을 알아냈고 그것을 간단한 유닛테스트로 기록했다.
// 이제 이 지식을 기반으로 log4j를 래핑하는 클래스를 만들수 있다.
// 나머지 코드에서는 log4j의 동작원리에 대해 알 필요가 없게 됐다.

public class LogTest {
    private Logger logger;
    
    @Before
    public void initialize() {
        logger = Logger.getLogger("logger");
        logger.removeAllAppenders();
        Logger.getRootLogger().removeAllAppenders();
    }
    
    @Test
    public void basicLogger() {
        BasicConfigurator.configure();
        logger.info("basicLogger");
    }
    
    @Test
    public void addAppenderWithStream() {
        logger.addAppender(new ConsoleAppender(
            new PatternLayout("%p %t %m%n"),
            ConsoleAppender.SYSTEM_OUT));
        logger.info("addAppenderWithStream");
    }
    
    @Test
    public void addAppenderWithoutStream() {
        logger.addAppender(new ConsoleAppender(
            new PatternLayout("%p %t %m%n")));
        logger.info("addAppenderWithoutStream");
    }
}
````

# 학습 테스트(Learning Test)는 공짜 이상이다

이런 방식으로, 먼저 테스트 코드에서 작성하면서 익히는 방식은 굉장히 효율적이다.

1. 필요한 지식만 확보하는 방법이다.
1. 이해도를 높혀주는 실험적인 방식이다.
1. 드는 비용이 없다. 그냥 해보면 된다.
1. 메인 로직에 영향을 주지 않으면서 이해도 할 수 있다.
1. third party 코드가 바뀌면 학습 테스트를 통해 "필요한 기능"이 잘 동작하는지 확인할 수 있다.

이러한 이점외에도, 이러한 경계 부근에서의 test는 새 버전으로 이전에 있어 보다 빠른 전환을 가능케한다.

# 아직 존재하지 않는 코드를 사용하기

아직 개발되지 않은 모듈이 있다고 하자. 기능은 커녕 인터페이스도 없다. 해당 모듈에 의존적인 기능이 있다면 이러한 상황은 굉장히 성가시다. 그렇다고 해서 구현이 늦어지는 것을 원하지는 않는다.

저자의 예시로 무선통신 시스템을 구축하는 프로젝트를 들어보겠다. 팀 안의 하부 팀으로 "송신기"를 담당하는 팀이 있었는데 나머지 팀원들은 송신기에 대한 지식이 거의 없었다. "송신기"팀은 인터페이스를 제공하지 않았다. 하지만 저자는 "송신기"팀을 기다리는 대신 "원하는" 기능을 정의하고 인터페이스로 만들었다. \[지정한 주파수를 이용해 이 스트림에서 들어오는 자료를 아날로그 신호로 전송하라\] 이렇게 인터페이스를 정의함으로써 메인 로직을 더 깔끔하게 짤 수 있었고 목표를 명확하게 나타낼 수 있었다. 이는 [Adapter Pattern](https://ko.m.wikipedia.org/wiki/%EC%96%B4%EB%8C%91%ED%84%B0_%ED%8C%A8%ED%84%B4)이다.

![](CleanCode_08_Boundary_0.png)

````java
public class FakeTransmitter implements Transimitter {
    public void transmit(SomeType frequency, OtherType stream) {
        // 실제 구현이 되기 전까지 더미 로직으로 대체
    }
}

public class CommunicationController {
    // Transmitter팀의 API가 제공되기 전에는 아래와 같이 사용한다.
    public void someMethod() {
        Transmitter transmitter = new FakeTransmitter();
        transmitter.transmit(someFrequency, someStream);
    }
}

````

````java
public interface Transimitter {
    public void transmit(SomeType frequency, OtherType stream);
}

// 경계 밖의 API
public class RealTransimitter {
    // 캡슐화된 구현
    ...
}

public class TransmitterAdapter extends RealTransimitter implements Transimitter { // Transimitter 인터페이스 무조건 구현
    public void transmit(SomeType frequency, OtherType stream) {
        // RealTransimitter(외부 API)를 사용해 실제 로직을 여기에 구현.
        // Transmitter의 변경이 미치는 영향은 이 부분에 한정된다.
    }
}

public class CommunicationController {
    // Transmitter팀의 API가 제공되면 아래와 같이 사용한다.
    public void someMethod() {
        Transmitter transmitter = new TransmitterAdapter();
        transmitter.transmit(someFrequency, someStream);
    }
}
````

# 깨끗한 경계

좋은 소프트웨어 디자인은 변경이 생길 경우 많은 재작업 없이 변경을 반영할 수 있어야 한다. 위에서 알아본 내용들을 정리해보자.

* 경계에서 많이 발생하는 "변경"에 대처할 수 있도록 주의해야 한다.
* 이 변경에 대처하는 방법으로는 경계에 위치한 코드를 깔끔히 분리하는 것이 있다.
  * 외부 패키지에 대해 세세하게 알 필요가 없다.
  * 이를 wrapping하는 방법을 통해 변경 범위를 제약할 수 있다.
  * 통제 불가능한 외부 패키지 의존보다 통제 가능한 우리 코드에 의존하는 것이 좋다.
* 혹은 Adapter 패턴을 사용하여 내가 원하는 인터페이스로 제공할 수 있도록 하자.

# Reference

* [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin)
* [Yooii-Studios / Clean-Code](https://github.com/Yooii-Studios/Clean-Code)
* [Clean Code](https://book.interpark.com/product/BookDisplay.do?_method=detail&sc.prdNo=213656258&gclid=CjwKCAjw9-KTBhBcEiwAr19igynFiOxjFYKEJyaiyNEI4XXL1bFM78ki2cNQLMSxcUWU9XNks8eEThoCG6EQAvD_BwE)
* [zinc0214 / CleanCode](https://github.com/Yooii-Studios/Clean-Code)
* [wojteklu/clean_code.md](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
* [Adapter Pattern](https://ko.m.wikipedia.org/wiki/%EC%96%B4%EB%8C%91%ED%84%B0_%ED%8C%A8%ED%84%B4)
