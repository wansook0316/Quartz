---
title: Unit Test
thumbnail: ''
draft: false
tags:
- unit-test
- TDD
- test-driven-development
- assert
- FIRST
created: 2023-09-21
---

지난 10년 동안 우리 분야는 눈부신 성장을 이뤘다. 97년도만 해도 TDD라는 개념을 아무도 몰랐다. 그 당시 단위 테스트는 프로그램이 돌아가는지 확인하는 일회성 코드에 불과했다. 하지만 지금은 Agile과 TDD 덕택에 단위 테스트를 자동화하는 프로그래머들이 많아졌다. **하지만, 테스트를 추가하려고 급하게 서두르는 와중에 많은 프로그래머들이 제대로 된 테스트 케이스를 작성해야 한다는 사실을 놓쳐버렸다.**

# TDD 법칙 세가지

* 첫째 법칙: 실패하는 단위 테스트를 작성할 때까지 실제 코드를 작성하지 않는다.
* 둘째 법칙: 컴파일은 실패하지 않으면서 실행이 실패하는 정도로만 단위 테스트틀 작성한다.
* 셋째 법칙: 현재 실패하는 테스트를 통과할 정도로만 실제 코드를 작성한다.

이런 방식으로 하게 되면, 처음에 로직을 짤 때 특정 케이스를 통과하는 테스트 함수를 먼저 작성하고 이에 대한 로직을 수정하기 때문에 수많은 테스트 함수가 나온다. 짧은 흐름으로 진행하기 때문에 이 하나의 과정은 30초 정도로 묶이게 된다. 문제는, 이 방식을 사용했을 때 **나오는 어마무시한 테스트 코드 양**이다.

# 깨끗한 테스트 코드 유지하기

"지저분해도 빨리" 작성할 수 있는 테스트 코드는 좋을까? 테스트만 하면 그만일까? 하지만, 이는 오히려 테스트를 안하는게 나은 결과를 가져올 수 있다. 이 이유는 실제 코드가 변화하면, 테스트 코드도 변해야 하기 때문이다. 즉, 실제 코드 변화에 따라 테스트 코드도 변해야 하는데, "지저분해도 빨리" 작성한 테스트 코드는 변경을 어렵게 만든다. 이는 곧 부담으로 이어지고, 팀의 불만으로 변화한다. 결국 이를 폐지하는 상황에 처하게 되는데, 이 테스트 케이스가 없으면 수정한 코드가 제대로 도는지 확인할 방법이 없다. 결국 이는 망가진 코드를 만든다.

![](CleanCode_09_UnitTest_0.png)

**테스트 코드는 실제 코드 못지 않게 중요하다.**

## 테스트는 유연성, 유지보수성, 재사용성을 제공한다

 > 
 > 코드에 유연성, 유지보수성, 재사용성을 제공하는 버팀목이 단위 테스트다. 테스트 케이스가 있으면, **변경이 두렵지 않기 때문이다.**

테스트 케이스가 없으면 모든 것은 잠정적인 버그다. 아키텍쳐가 유연하더라도, 설계를 아무지 잘 나눴더라도 이를 검증할 수 있는 수단이 없다면 개발자는 변경을 주저한다. 그렇기 때문에 실제 코드를 점검하는 자동화된 단위 테스트 슈트는 설계와 아키텍처를 최대한 깨끗하게 보존하는 열쇠다.

# 깨끗한 테스트 코드

그럼 어떻게 하면 깨끗한 테스트 코드를 만들 수 있을까? **가독성이 그 핵심이다.**

````java
public void testGetPageHieratchyAsXml() throws Exception {
    crawler.addPage(root, PathParser.parse("PageOne")); // 중복(addPage)!
    crawler.addPage(root, PathParser.parse("PageOne.ChildOne")); // 중복(addPage)!
    crawler.addPage(root, PathParser.parse("PageTwo")); // 중복(addPage)!

    request.setResource("root");
    request.addInput("type", "pages");
    Responder responder = new SerializedPageResponder();
    SimpleResponse response = (SimpleResponse) responder.makeResponse(new FitNesseContext(root), request);
    String xml = response.getContent();

    assertEquals("text/xml", response.getContentType());
    assertSubString("<name>PageOne</name>", xml); // 중복(assertSubString)!
    assertSubString("<name>PageTwo</name>", xml); // 중복(assertSubString)!
    assertSubString("<name>ChildOne</name>", xml); // 중복(assertSubString)!
}

public void testGetPageHieratchyAsXmlDoesntContainSymbolicLinks() throws Exception {
    WikiPage pageOne = crawler.addPage(root, PathParser.parse("PageOne")); // 중복(addPage)!
    crawler.addPage(root, PathParser.parse("PageOne.ChildOne")); // 중복(addPage)!
    crawler.addPage(root, PathParser.parse("PageTwo")); // 중복(addPage)!

    PageData data = pageOne.getData();
    WikiPageProperties properties = data.getProperties();
    WikiPageProperty symLinks = properties.set(SymbolicPage.PROPERTY_NAME);
    symLinks.set("SymPage", "PageTwo");
    pageOne.commit(data);

    request.setResource("root");
    request.addInput("type", "pages");
    Responder responder = new SerializedPageResponder();
    SimpleResponse response = (SimpleResponse) responder.makeResponse(new FitNesseContext(root), request);
    String xml = response.getContent();

    assertEquals("text/xml", response.getContentType());
    assertSubString("<name>PageOne</name>", xml); // 중복(assertSubString)!
    assertSubString("<name>PageTwo</name>", xml); // 중복(assertSubString)!
    assertSubString("<name>ChildOne</name>", xml); // 중복(assertSubString)!
    assertNotSubString("SymPage", xml);
}

public void testGetDataAsHtml() throws Exception {
  crawler.addPage(root, PathParser.parse("TestPageOne"), "test page"); // 중복(addPage)!

  request.setResource("TestPageOne"); request.addInput("type", "data");
  Responder responder = new SerializedPageResponder();
  SimpleResponse response = (SimpleResponse) responder.makeResponse(new FitNesseContext(root), request);
  String xml = response.getContent();

  assertEquals("text/xml", response.getContentType());
  assertSubString("test page", xml); // 중복(assertSubString)!
  assertSubString("<Test", xml); // 중복(assertSubString)!
}
````

`addPage`, `assertSubString`의 중복이 너무 많다. 또 자질구레한 사항까지 작성해두어 표현력이 떨어진다.

````java
public void testGetPageHierarchyAsXml() throws Exception {
    makePages("PageOne", "PageOne.ChildOne", "PageTwo");

    submitRequest("root", "type:pages");

    assertResponseIsXML();
    assertResponseContains("<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>");
}

public void testSymbolicLinksAreNotInXmlPageHierarchy() throws Exception {
    WikiPage page = makePage("PageOne");
    makePages("PageOne.ChildOne", "PageTwo");

    addLinkTo(page, "PageTwo", "SymPage");

    submitRequest("root", "type:pages");

    assertResponseIsXML();
    assertResponseContains("<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>");
    assertResponseDoesNotContain("SymPage");
}

public void testGetDataAsXml() throws Exception {
    makePageWithContent("TestPageOne", "test page");

    submitRequest("TestPageOne", "type:data");

    assertResponseIsXML();
    assertResponseContains("test page", "<Test");
}
````

잡다하고 세세한 코드를 거의다 없앴다는 것에 주목하자. 리팩토링한 코드는 Build-operate-check 패턴을 사용했다. 

* Build: 테스트 자료를 만든다. (given)
* Operate: 테스트 자료를 조작한다. (when)
* Check: 조작한 결과가 올바른지 확인한다. (then)

관례적으로 우리가 사용하는 given, when, then을 생각하면 되겠다.

## 이중 표준

일단 이중 표준이 무슨 의도로 적었는지 부터 이해해보자. Test Code는 물론 잘 작성해야 하지만 실제 코드처럼 작성할 필요는 없을 수 있다. 즉, Test code가 가지고 있는 특징을 더 잘 표현하는 것이 좋은 코드일 수 있다. 이런 의미에서 각 코드의 위치(실제, 테스트)에 따라 적용되어야 하는 표준은 다를 수 있다는 말이다.

````java
@Test
public void turnOnLoTempAlarmAtThreashold() throws Exception {
    hw.setTemp(WAY_TOO_COLD); 
    controller.tic(); 
    assertTrue(hw.heaterState());   
    assertTrue(hw.blowerState()); 
    assertFalse(hw.coolerState()); 
    assertFalse(hw.hiTempAlarm());       
    assertTrue(hw.loTempAlarm());
}
````

위 코드는 환경 제어 시스템에 속한 테스트 코드이다. 대충 보면 온도가 떨어지면 경보, 온풍기, 송풍기가 가동되는지 확인하는 코드라는 것을 알 수 있다. 그런데 이녀석을 읽기가 상당히 어렵다. 먼저 인수부터 읽어야 하고, 앞의 assert문을 통해 true, false를 분간해야 한다. 

````java
@Test
public void turnOnLoTempAlarmAtThreshold() throws Exception {
    wayTooCold();
    assertEquals("HBchL", hw.getState()); 
}
````

그래서 위와 같이 코드를 개선했다. uppercase와 lowercase를 통해 On/Off를 분간했다. 이 방식은 앞서 [Meaningful Names](https://velog.io/@wansook0316/Meaningful-Names#%EA%B7%B8%EB%A6%87%EB%90%9C-%EC%A0%95%EB%B3%B4%EB%A5%BC-%ED%94%BC%ED%95%98%EB%9D%BC)의 "그릇된 정보를 피하라" 규칙에 위배된다. 하지만 코드를 읽어보자. 아주 직관적으로 해석되는 것을 확인할 수 있다.

````java
@Test
public void turnOnCoolerAndBlowerIfTooHot() throws Exception {
    tooHot();
    assertEquals("hBChl", hw.getState()); 
}
  
@Test
public void turnOnHeaterAndBlowerIfTooCold() throws Exception {
    tooCold();
    assertEquals("HBchl", hw.getState()); 
}

@Test
public void turnOnHiTempAlarmAtThreshold() throws Exception {
    wayTooHot();
    assertEquals("hBCHl", hw.getState()); 
}

@Test
public void turnOnLoTempAlarmAtThreshold() throws Exception {
    wayTooCold();
    assertEquals("HBchL", hw.getState()); 
}
````

너무나 읽기 쉽다.

````java
public String getState() {
    String state = "";
    state += heater ? "H" : "h"; 
    state += blower ? "B" : "b"; 
    state += cooler ? "C" : "c"; 
    state += hiTempAlarm ? "H" : "h"; 
    state += loTempAlarm ? "L" : "l"; 
    return state;
}
````

`getState`의 경우에는 굉장히 효율이 낮게 작성되어 있다. 효율을 높이려면 StringBuffer가 더 적합하다. 하지만 **실제 환경에서는 문제가 될 수 있으나 테스트 환경에서는 문제가 되지 않는다.** 보통의 테스트 환경은 자원이 제한적일 가능성이 낮기 때문이다. 

**이것이 이중 표준의 본질이다. 실제환경에서는 절대로 안되지만 테스트 환경에서는 전혀 문제없는 방식이 있다.**

# 테스트 당 assert 하나

assert를 하나만 사용해야 한다고 주장하는 학파가 있다. 확실히 코드를 보면 이해하기 빠르고 쉽다.

````java
public void testGetPageHierarchyAsXml() throws Exception { 
  givenPages("PageOne", "PageOne.ChildOne", "PageTwo");
  
  whenRequestIsIssued("root", "type:pages");
  
  thenResponseShouldBeXML(); 
}

public void testGetPageHierarchyHasRightTags() throws Exception { 
  givenPages("PageOne", "PageOne.ChildOne", "PageTwo");
  
  whenRequestIsIssued("root", "type:pages");
  
  thenResponseShouldContain(
    "<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>"
  ); 
}
````

하지만 이렇게 되면 필연적으로 **중복되는 코드가 많아진다.** Template Method 패턴을 사용하면 중복을 제거할 수 있다. given/when 부분을 부모 클래스에 두고 then 부분을 자식 클래스에 두면 된다. 하지만 배보다 배꼽이 더크다. 오히려 assert문을 어려번 사용하는 것이 좋다고 생각한다.

## 테스트 당 개념 하나

위의 방식보다 조금더 이치에 맞는 것은 이것이다. 잡다한 개념을 연속으로 테스트하는 함수는 피하자.

````java
/**
 * addMonth() 메서드를 테스트하는 장황한 코드
 */
public void testAddMonths() {
    SerialDate d1 = SerialDate.createInstance(31, 5, 2004);

    SerialDate d2 = SerialDate.addMonths(1, d1); 
    assertEquals(30, d2.getDayOfMonth()); 
    assertEquals(6, d2.getMonth()); 
    assertEquals(2004, d2.getYYYY());
    
    SerialDate d3 = SerialDate.addMonths(2, d1); 
    assertEquals(31, d3.getDayOfMonth()); 
    assertEquals(7, d3.getMonth()); 
    assertEquals(2004, d3.getYYYY());
    
    SerialDate d4 = SerialDate.addMonths(1, SerialDate.addMonths(1, d1)); 
    assertEquals(30, d4.getDayOfMonth());
    assertEquals(7, d4.getMonth());
    assertEquals(2004, d4.getYYYY());
}
````

위는 세개의 개념을 테스트 하고 있다.

1. 30일로 끝나는 달 + 1 month = 일이 31이면 안된다.
1. 
   * 2 months시 두번째가 31이면 최종 결과는 31이어야 한다.
1. 31일로 끝나는 달 + 1 month = 일이 31이면 안된다.

여러 개념을 테스트하고 있기 때문에 이경우는 분리해야 한다.

# F.I.R.S.T.

깨끗한 테스트가 따르는 규칙이다.

## Fast

테스트는 빨라야 한다. 빠르지 않으면 자주 돌릴 엄두를 못낸다. 코드를 마음껏 정리하기도 어려워진다.

## Independent

각 테스트는 서로 의존하면 안된다. 독립적으로 어떠한 순서로 실행해도 괜찮아야 한다. 의존성이 있으면 문제를 파악하기 어려워진다.

## Repeatable

어떠한 환경에서도 반복 가능해야 한다. 실제 환경, QA 환경, 네트워크 연결 유무 환경 등에서 모두 실행가능해야 한다. 그렇지 않으면 테스트 코드의 실패 원인을 변명할 거리가 생긴다. 또 환경에 의존적이기 때문에 실행 불가능하다는 단점도 생긴다.

## Self-Validating

테스트는 성공 아니면 실패로 결과가 나와야 한다. 테스트가 스스로 성공 여부를 가늠하지 않는다면 판단은 주관적이 되고, 수작업 평가가 필요하게 된다.

## Timely

테스트는 적시에 작성되어야 한다. 단위 테스트는 테스트하려는 실제 코드를 구현하기 직전에 구현한다. 만약 반대가 되면, 실제 코드가 테스트하기 너무 어려워 보일 가능성이 크다.

# 결론

* 테스트 코드는 실제 코드 만큼이나 프로젝트 건강에 중요하다.
* 실제 코드의 유연성, 유지보수성, 재사용성을 보존하고 강화하기 위해 존재한다.
* 지속적으로 깨끗하게 관리할 책임이 있다.

# Reference

* [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin)
* [Yooii-Studios / Clean-Code](https://github.com/Yooii-Studios/Clean-Code)
* [Clean Code](https://book.interpark.com/product/BookDisplay.do?_method=detail&sc.prdNo=213656258&gclid=CjwKCAjw9-KTBhBcEiwAr19igynFiOxjFYKEJyaiyNEI4XXL1bFM78ki2cNQLMSxcUWU9XNks8eEThoCG6EQAvD_BwE)
* [zinc0214 / CleanCode](https://github.com/Yooii-Studios/Clean-Code)
* [wojteklu/clean_code.md](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
