---
title: Functions
thumbnail: ''
draft: false
tags: null
created: 2023-09-21
---

# Intro

프로그래밍 초창기에는 `System =  Routine + Subroutine` 이었다. Fortran, PL/1시절에는 `System = Program + SubProgram + Function` 이었다.지금은 Function만 남았다. 즉, \*\*어떠한 프로그램이든 기본 단위는 함수다. \*\*코드를 읽다보면 다음과 같은 특징들을 가지는 코드를 읽게 된다.

* 길이가 길다.
* 코드가 중복되어 있다.
* 문자열이 괴상하다.
* 낯설고 모호한 자료 유형이 있다.

이런 특징을 가지는 함수는 이해하기 매우 어렵다. 어덯게 하면 읽기 쉽고 이해하기 쉬운 함수를 작성할 수 있을까?

# 작게 만들어라

 > 
 > 작은게 최고다.

````java
public static String renderPageWithSetupsAndTeardowns( PageData pageData, boolean isSuite) throws Exception {
	boolean isTestPage = pageData.hasAttribute("Test"); 
	if (isTestPage) {
		WikiPage testPage = pageData.getWikiPage(); 
		StringBuffer newPageContent = new StringBuffer(); 
		includeSetupPages(testPage, newPageContent, isSuite); 
		newPageContent.append(pageData.getContent()); 
		includeTeardownPages(testPage, newPageContent, isSuite); 
		pageData.setContent(newPageContent.toString());
	}
	return pageData.getHtml(); 
}
````

````java
public static String renderPageWithSetupsAndTeardowns( PageData pageData, boolean isSuite) throws Exception { 
   if (isTestPage(pageData)) 
   	    includeSetupAndTeardownPages(pageData, isSuite); 
   return pageData.getHtml();
}
````

저자는 위 코드도 작다고 한다. 되도록 한 함수당 **3~5줄 내로 줄이는 것을 권장**한다.

## 블록과 들여쓰기

 > 
 > if/else/while에 들어가는 블록은 한 줄이어야 한다. 들여쓰기 수준은 2단을 넘어서면 안된다.

이렇게 되면 enclosing function(바깥을 감싸는 함수)이 작아지고, 블록 호출 안 함수 이름을 잘 짓는다면 코드 이해가 수월해진다.

# 한가지만 해라!

 > 
 > 함수는 한 가지를 해야 한다. 그 한 가지를 잘 해야 한다. 그 한가지만을 해야 한다.

지겹게 들었지만 어려운 말이다. "한 가지"의 정의가 상당히 모호하다. 

````java
public static String renderPageWithSetupsAndTeardowns( PageData pageData, boolean isSuite) throws Exception { 
   if (isTestPage(pageData)) 
   	    includeSetupAndTeardownPages(pageData, isSuite); 
   return pageData.getHtml();
}
````

위 코드는 "한 가지"만 한다고 말할 수 있을까? 혹자는 3가지를 한다고 말할 수도 있다.

1. 페이지가 테스트 페이지인지 판단한다.
1. 맞다면 설정 페이지와 해제 페이지를 넣는다.
1. 페이지를 HTML로 렌더링한다.

이런 판단의 기준은 "추상화 수준"이다. 다시 말해 얼마나 Detail을 감추어서 작성했느냐를 말한다. 즉, 최대한 추상화를 해서 나온 결과가 더이상 추상화가 불가하다면, 이는 한 가지만 하는 함수라 할 수 있을 것이다. 이는 어떻게 보면 "함수 깊이"와도 깊은 연관성이 있다고 할 수 있겠다. 우리가 함수를 만드는 이유는 큰 개념을 작은 개념으로 나누어 처리하기 위함이라는 것을 잊지 말자.

## 함수내 섹션

 > 
 > 함수를 여러 Section(의미론적 단위)으로 나눌 수 있다면, 그 함수는 여러작업을 하는 셈이다.

선언, 초기화, 동작의 세 부분이 하나의 함수 안에서 이루어지고 있다면, 여러 작업을 하고 있다는 반증이다.

# 함수당 추상화 수준은 하나로!

 > 
 > 함수가 확실히 "한 가지"만 하려면, 함수내 모든 문장의 추상화 수준이 같아야 한다.

아까 말했던 function depth와 연관이 있다는 말이 이 말이다. 사람은 추상적인 내용으로 시작해서 구체적인 내용을 읽는 것을 잘한다. 코드 역시 이런식으로 작성해야 한다. 

## 내려가기 규칙

이러한 점에서 코드를 작성할 때도 상위에는 높은 수준의 추상화 수준, 하위에는 낮은 수준의 추상화 수준이 담긴 함수를 작성하는 것이 읽기 수월하다. 

# Switch 문

````java
public Money calculatePay(Employee e) throws InvalidEmployeeType {
	switch (e.type) { 
		case COMMISSIONED:
			return calculateCommissionedPay(e); 
		case HOURLY:
			return calculateHourlyPay(e); 
		case SALARIED:
			return calculateSalariedPay(e); 
		default:
			throw new InvalidEmployeeType(e.type); 
	}
}
````

문제는 이녀석이다. 이녀석을 마주할 때마다 작게 만들기가 힘들어서 고생했었다. 본질적으로 Switch문이 가지는 고질점이라 할 수 있겠다.(if/else도 마찬가지) 이러한 점에서 사실 다형성을 사용하는 것이 가장 깔끔하게 처리하는 방법이다.

````java
public abstract class Employee {
	public abstract boolean isPayday();
	public abstract Money calculatePay();
	public abstract void deliverPay(Money pay);
}
-----------------
public interface EmployeeFactory {
	public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType; 
}
-----------------
public class EmployeeFactoryImpl implements EmployeeFactory {
	public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType {
		switch (r.type) {
			case COMMISSIONED:
				return new CommissionedEmployee(r) ;
			case HOURLY:
				return new HourlyEmployee(r);
			case SALARIED:
				return new SalariedEmploye(r);
			default:
				throw new InvalidEmployeeType(r.type);
		} 
	}
}
````

Factory를 사용하여, 실제 instance를 만들어 내보낸다. Switch문은 factory내에서만 사용하도록 꽁꽁 숨김으로서 보다 깔끔한 코드를 작성할 수 있다. 물론.. 불가피한 상황도 있다. ㅠㅠ

# 서술적인 이름을 사용하라!

 > 
 > “코드를 읽으면서 짐작했던 기능을 각 루틴이 그대로 수행한다면 깨끗한 코드라 불러도 되겠다” - 워드

이전 장에서 대가들의 Clean code에 대한 이야기를 들었었는데, 이 때 말한 "짐작했던 기능"을 수행하기 위해 가장 중요한 것은 이름이다. 이 때, 아까말한 "작게 만들어라" 규칙을 적용한 작은 함수라면 그 기능이 명확하기 때문에 이름을 붙이기가 더 쉽다. **일관적인 서술형 이름(동사)를 사용한다면 순차적으로 이해하기도 쉽다.**

# 함수 인수

 > 
 > 이상적인 함수 인수는 0개이다. 차선은 1개.

Class 내부에 instance 변수로 들고있지 않고 일일히 인자로 넘겨서 구현하는 방법도 있을 것이다. 
하지만 이렇게 할 경우 가독성에는 오히려 좋지 않은데, 다음과 같은 이유가 있다.

1. 인수로 넘어올 때마다, 해당 인수가 무엇인지 생각해야 한다.
1. 함수와 인수의 추상화 수준이 다르기 때문에 이해가 어렵다.
1. 테스트시에도 인수가 있다면 여러 경우의 수를 모두 따져서 검증해야 하기 때문에 부담스럽다.
1. 출력 인수(결과값을 받기 위해 넣어주는 인수)는 더 안좋다. 리턴하는 것에 익숙하기 때문이다.

궁금증: 그런데 그럼 클래스 내부에서 공통의 상태값을 여기서 변경, 저기서 변경해도 괜찮을까? 순수함수가 보다 낫다는 말은 무슨 말일까?

## 많이 쓰는 단항(인수 1개) 방식

1. 인수에 질문을 던지는 경우: `boolean fileExists(“MyFile”);`
1. 인수를 변환하여 결과를 반환하는 경우: `InputStream fileOpen(“MyFile”);`
1. 이벤트 함수인 경우: `passwordAttemptFailedNTimes(int attempts)`
   * 이벤트 함수라는 사실이 코드에 명확히 드러나야 한다.

위의 설명한 경우가 아니라면 단항 함수는 가급적 피하도록 한다.

## 플래그 인수

 > 
 > 추하다 추해

대놓고 인수로 Bool 값을 받으면서, "저는 두가지 일을 하고 있습니다"를 광고하는 꼴이다. ~~So Sad.. 반성..~~ 차라리 함수를 나눠놓고 호출하는 것이 좋은 방식이라 한다.

## 이항 함수

 > 
 > 단항 보다 이해하기 어렵다.

`Point` 클래스의 경우에는 이항 함수가 적절하다. 2개의 인수간의 자연적인 순서가 있어야함 `Point p = new Point(x,y);` 무조건 나쁜 것은 아니지만, 인수가 2개이니 만큼 이해가 어렵고 위험이 따르므로 가능하면 단항으로 바꾸도록 하자. 굳이 인수 2개를 받기보다, 특정 Class 내부에 instance method를 만들어 단항으로 처리하는 방법도 있다.

## 삼항 함수

 > 
 > 신중히, 또 신중히 만들어라.

이항 함수보다 이해하기가 훨씬 어렵다. 위험도 2배이상 늘어난다. `assertEquals(message, expected, actual)`을 생각해보면 멈칫한다. 처음이 보통 `expected`라 생각했는데, 알고보니 `message`다.

## 인수 객체

 > 
 > 인수가 2~3개 필요하다면 독자적인 클래스 변수로 선언할 가능성을 생각해보자.

이 팁이 제일 도움이 많이 되는 것 같다. 

````java
Circle makeCircle(doudle x, double y, double radius);
Circle makeCircle(Point center, double radius);
````

트릭이라 생각할 수 있지만 그렇지 않다. 묶음으로서 어떠한 개념을 표현하고 있다.

## 인수 목록

`String.format` 같은 함수들은 인수 개수가 가변적이다. (String에 `%s` 넣는 친구) 이런 경우 인수를 List 형 인수하나로 취급하게 되면 결국 이항 함수로 취급할 수 있다. 실제 선언부를 보면 이항 함수다.

````java
public String formay(String format, Object...args)
````

## 동사와 키워드

 > 
 > 단항 함수는 함수와 인수가 동사/명사 쌍을 이루어야 한다.

````java
writeField(name);
````

 > 
 > 함수 이름에 키워드(인수 이름)을 추가하면 인수 순서를 기억할 필요가 없어진다.

````java
assertExpectedEquialsActual(expected, actual);
````

# 부수 효과를 일으키지 마라!

 > 
 > 부수 효과(Side Effect)는 못된 놈. 한 가지를 안하고 뒤에서 딴 짓한다는 말이다.

````java
public class UserValidator {
	private Cryptographer cryptographer;
	public boolean checkPassword(String userName, String password) { 
		User user = UserGateway.findByName(userName);
		if (user != User.NULL) {
			String codedPhrase = user.getPhraseEncodedByPassword(); 
			String phrase = cryptographer.decrypt(codedPhrase, password); 
			if ("Valid Password".equals(phrase)) {
				Session.initialize();
				return true; 
			}
		}
		return false; 
	}
}
````

겉으로 보기에는 무슨 문제가 있는지 전혀 모르겠다. username과 password를 확인하고 두 인수가 올바르면 true를 반환한다. 아니면 false를 반환하고. 그런데 함수 이름을 보니까 이상하다. `checkPassword` 함수 내에서 session을 초기화하고 있다. 

`checkPassword`라는 하나의 행동을 하고 있지 않고, session을 초기화하는 동작까지 하고 있다. 이렇게 코드를 작성하게 되면, `checkPassword`라는 행위는 session을 초기화해도 괜찮은 경우에만 호출가능해진다.

## 출력 인수

 > 
 > 피해라. 이게 뭐야

인수는 보통 input으로 생각한다. 그런데 여기에 출력을 담기 위한 인수를 넣어준다는 것은 우리의 보편적 상식과 맞지 않는다.

# 명령과 조회를 분리하라!

 > 
 > 함수는 "수행"하거나 "답"하거나 둘 중 하나다.

즉, 객체 상태를 변경하거나 아니면 객체정보를 반환하거나 둘 중 하나이다.

````java
public boolean set(String attribute, String value); // attribute를 찾아서 value로 setting해줘, setting되면 true로 반환해줘

if(set(“username”, “unclebob”))... // ..? 이게 무슨 말이야
````

도대체 무슨 말일까. 이건 username을 unclebob인지 확인하는 걸까, 세팅하는 걸까? `setAndCheckIfExist`라고 변경하는 방법도 있지만, 그것보다는 애초에 변경과 조회를 분리하는 것이 확실하다.

````java
if (attrivuteEdists("username")) {
    setAttribute("username", "unclebob");
}
````

# 오류 코드보다 예외를 사용하라!

오류 처리는 보통 "명령"의 동작을 수행할 때 발생한다. 삭제, 업데이트, 생성 등의 작업시의 오류를 어떻게 처리할까? 만약 문자열로 처리한다고 하면 다음과 같다.

````java
if (deletePage(page) == E_OK) {
	if (registry.deleteReference(page.name) == E_OK) {
		if (configKeys.deleteKey(page.name.makeKey()) == E_OK) {
			logger.log("page deleted");
		} else {
			logger.log("configKey not deleted");
		}
	} else {
		logger.log("deleteReference from registry failed"); 
	} 
} else {
	logger.log("delete failed"); return E_ERROR;
}
````

이 방식은 일단 문제가 있는데, 명령문을 사용했음에도 반환값이 있다는 것이다. 그리고 그 반환값을 기반으로 오류코드를 처리해야 하기 때문에 로직을 작성하는데 상당히 불편하다.

````java
public void delete(Page page) {
	try {
		deletePageAndAllReferences(page);
  	} catch (Exception e) {
  		logError(e);
  	}
}

private void deletePageAndAllReferences(Page page) throws Exception { 
	deletePage(page);
	registry.deleteReference(page.name); 
	configKeys.deleteKey(page.name.makeKey());
}

private void logError(Exception e) { 
	logger.log(e.getMessage());
}
````

여기서 오류 처리를 사용하게 되면, 오류 처리 로직을 작성하기 이전에 문맥상 방해받을 일도 없고 코드도 상당히 깔끔해진다. 오류처리도 한 가지 작업이라는 것도 명심하자.

## Error.java 의존성 자석

````java
public enum Error { 
	OK,
	INVALID,
	NO_SUCH,
	LOCKED,
	OUT_OF_RESOURCES, 	
	WAITING_FOR_EVENT;
}
````

오류를 처리하는 곳곳에서 오류코드를 사용한다면 enum class를 쓰게 되는데 이런 클래스는 의존성 자석이므로, 새 오류코드를 추가하거나 변경할 때 코스트가 많이 필요하다. 그러므로 예외를 사용하는 것이 더 안전하다. 즉 Exception class를 파생해서 만들어서 사용하는 방식으로 사용해라.

# 반복하지 마라!

 > 
 > 중복은 소프트웨어에서 모든 악의 근원이다.

# 구조적 프로그래밍

1. 모든 함수와 함수 내 모든 블록에 입구와 출구는 하나씩만 존재해야 한다.
1. 함수는 return 문이 하나여야 한다.
1. break, continue 안된다.
1. goto는 죽어도 안된다.

위와 같은 방식을 구조적 프로그래밍이라 한다. Dijkstra가 제창한 원칙이다. 하지만 함수가 작을 경우, 위의 규칙은 별다른 효용이 없다. 작을 경우에는 return, break, continue 사용은 문제 없다. 오히려 단일 입/출구 규칙보다 의도 표현이 쉬워질 때가 많다.

# 함수를 어떻게 짜죠?

 > 
 > 처음부터 할 수 없다.

글짓기와 비슷하다. 생각들을 기록하고, 읽기 좋게 다듬는다. 초안은 서투르지만 정리할 수록 좋은 문장이 나온다. 코드도 그렇다.

# 결론

 > 
 > 함수를 잘 작성하는 것보다, 시스템이라는 이야기를 풀어가는 것이 진정한 목표임을 잊지마라.

그 과정에서 함수를 잘 작성하는 것은 이야기를 풀기 위한 좋은 방법이다. 그 흐름에서 좋은 수단으로 생각하는 것이 목적을 잊지 않는데 도움이 될 것이다.

# Reference

* [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin)
* [Yooii-Studios / Clean-Code](https://github.com/Yooii-Studios/Clean-Code)
* [Clean Code](https://book.interpark.com/product/BookDisplay.do?_method=detail&sc.prdNo=213656258&gclid=CjwKCAjw9-KTBhBcEiwAr19igynFiOxjFYKEJyaiyNEI4XXL1bFM78ki2cNQLMSxcUWU9XNks8eEThoCG6EQAvD_BwE)
* [zinc0214 / CleanCode](https://github.com/Yooii-Studios/Clean-Code)
* [wojteklu/clean_code.md](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
