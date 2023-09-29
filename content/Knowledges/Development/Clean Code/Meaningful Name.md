---
title: Meaningful Name
thumbnail: ''
draft: false
tags:
- naming
created: 2023-09-21
---

이름은 어디서든 쓰인다. 많이 사용하기 때문에 잘지으면 편하다. 몇 가지의 규칙을 알아보자.

# 의도를 분명히 밝혀라

 > 
 > 말하기는 쉽지.. 어렵거든?

저자도 안다. 하지만 이 의도가 분명한 이름을 짓는 것은 정말로 중요하다. 결국 최종적으로 절약하는 시간이 더 많기 때문이다. 나 포함해 미래에 행복해진다. **주석이 필요하면 의도를 분명히 드러내지 못했다는 것**이다.

````java
//Bad
int d; // elapsed time in days
//Good
int elapsedTimeInDays;
int daysSinceCreation;
int daysSinceModification;
int fileAgeInDays;
````

````java
// Bad
public List<int[]> getThem() {
    List<int[]> list1 = new ArrayList<int[]>();
    for (int[] x : theList) {
        if (x[0] == 4) {
            list1.add(x);
        }
    }
    return list1;
}

// Good
public List<int[]> getFlaggedCells() {
    List<int[]> flaggedCells = new ArrayList<int[]>();
    for (int[] cell : gameBoard) {
        if (cell[STATUS_VALUE] == FLAGGED) {
            flaggedCells.add(cell);
        }
    }
    return flaggedCells;
}
````

두 예시에서 핵심은, 나쁜 코드의 경우 독자에게 "가정"을 바라고 있다는 점에 있다. 좋은 코드의 경우 이름하나를 변경하게 됨으로써 어떤 의도인지 명확하게 드러난다.

# 그릇된 정보를 피하라

* `accountList`: List? 자료구조가 List인건가?
  * 컨테이너 유형을 이름에 사용하는 것을 지양하자.
  * `accountGroup`, `bunchOfAccounts`, `accounts`로 변경
* `XYZControllerOfStrings`, `XYZControllerOfContainerStrings`: 뭘 써야할지 헷갈리네..
  * 서로 흡사한 이름을 사용하지 않도록 유의하자.
  * 일관성이 떨어지는 것은 그릇된 정보다.

# 의미있게 구분하라

* 음 개수가 여러개네 `[a1, a2, …]` 써야지
  * 말도 안되고 의도가 파악되지 않는 변수는 쓰지마.
* `book` 이라는 변수가 있는데 이 이름을 쓰고 싶어. `theBook` 이렇게 하면 되겠지?
  * 중복을 제거하기 위한 목적으로 불용어를 추가하지는 말자. 무의미하다.
  * 불용어가 의미있을 떄 (ie. 지역변수)에서는 사용해도 무방하다. 유의미하게 사용하라는 말이다.
  * a처럼 붙이게 되면 검색할 때도 힘들다.
* `Name` VS `NameString`
  * 왜 굳이 String을 적어주는가? Double 타입이 될 가능성이 있어서 그런거야?
* `getActiveAccount()` VS` getActiveAccounts()` VS `getActiveAccountInfo()`
  * 뭘 써야할지 사용하는 사람이 어떻게 알아?
* `money` VS `moneyAmount`, `message` VS `theMessage`
  * 마찬가지다. 뭘 써야할지 어떻게 알아?

# 발음하기 쉬운 이름을 사용하라

 > 
 > 프로그래밍은 사회적 활동이다. 발음하기 쉬운 단어는 소통에 유용하다.

````java
// Bad
class DtaRcrd102 {
    private Date genymdhms;
    private Date modymdhms;
    private final String pszqint = "102";
    /* ... */
};

// Good
class Customer {
    private Date generationTimestamp;
    private Date modificationTimestamp;
    private final String recordId = "102";
    /* ... */
};
````

아무래도 많은 의미를 담은 단어를 사용할수록 좋다. 위의 경우 뭐라고 하는지 알 수가 없다. 지적인 대화가 가능한가?

# 검색하기 쉬운 이름을 사용하라

 > 
 > 단일 문자, 숫자를 변수명으로 하지 마라.

일단 찾기 힘들다. 중복 처리되는 경우가 많아서 검색이 안된다. (숫자: 상수? 변수?) 오히려 긴 이름이 훨씬 좋다.

# 인코딩을 피하자

 > 
 > 변수에 부가 정보를 더하지 마라.

* 헝가리안 표기법
  * 변수명에 해당 변수의 Type을 적지마라
  * 요즘은 compiler가 변수 타입까지 다 점검하기 때문에 이제 필요없다.
* 멤버 변수 접두어
  * `m_property`, `m_method`와 같은 식으로 할 필요가 없다.
  * IDE가 색깔을 다르게 해준다.
  * 코드 읽는 사람도 읽다보면 `m_`은 지워버리고 읽어버린다.
  * 응.. 구닥다리다 라는 느낌이 강하게 난다.
* 인터페이스와 구현
  * 인터페이스 클래스와 구현 클래스를 나눠야 한다면 구현 클래스의 이름에 정보를 인코딩하자.

|Do / Don't|Interface class|Concrete(Implementation) class|
|:---------|:--------------|:-----------------------------|
|Don't|IShapeFactory|ShapeFactory|
|Do|ShapeFactory|ShapeFactoryImp|
|Do|ShapeFactory|CShapeFactory|

# 자신의 기억력을 자랑하지 마라

 > 
 > 음 내 지적 능력을 과시해야 겠어. 아무도 모르게 변태같은 변수를 써야지. `c`

독자가 머리속으로 한번 더 생각해 변환해야 할만한 변수명을 쓰지 말자. 전문가는 명료함을 기반으로 남들이 이해하는 코드를 내놓는다.

# 클래스 이름

 > 
 > 명사 혹은 명사구를 사용하라. 동사는 안된다.

|Good|Bad|
|----|---|
|`Customer`, `WikiPage`, `Account`, `AddressParser`|`Manager`, `Processor`, `Data`, `Info`|

# 메서드 이름

* 동사 혹은 동사구를 사용하라.
  * `postPayment`, `deletePayment`, `deletePage`, `save`
* 접근자, 변경자, 조건자는 get, set, is로 시작하자. 
  * 접근자: get
  * 변경자: set
  * 조건자: is, has, should
* 생성자를 오버로드할 경우 정적 팩토리 메서드를 사용하고 해당 생성자를 private으로 선언하자.

````java
// 첫번째 보다 두 번째 방법이 더 좋다.  
Complex fulcrumPoint = new Complex(23.0);  
Complex fulcrumPoint = Complex.FromRealNumber(23.0);  
````

# 기발한 이름은 피하라

특정 문화에서만 사용되는 재미있는 이름보다 의도를 분명히 표현하는 이름을 사용하자. 자칫하면 유머감각이 뛰어난 사람만 변수 의도를 파악할 수 있다.

````java
HolyHandGrenade → DeleteItems
whack() → kill()
````

# 한 개념에 한 단어를 사용하라

 > 
 > 추상적인 개념 하나에 단어 하나를 사용하자.

* `fetch`, `retrieve`, `get`
* `controller`, `manager`, `driver`

도대체 무슨 차이지? 구분해서 작성한다면, 읽을 때, 차이점을 한번에 확인할 수 있다.

# 말 장난을 하지마라

 > 
 > 한 단어를 두 가지 목적으로 사용하지 말자. 

````java
public static String add(String message, String messageToAppend)  // A + B의 의미
public List<Element> add(Element element)  // 기존 것에 "추가"한다는 의미
````

의미론적으로 행동이 다른 상황이나, 일반적으로 부르는 이름이 같아 발생한 문제이다. 행위가 다르다면 다른 단어를 사용하는 것이 좋다. 위 경우 `insert`, `append`와 같은 단어를 사용하는 것이 좋겠다.

# 해법 영역에서 가져온 이름을 사용하라

 > 
 > 전산용어, 알고리즘 이름, 패턴 이름, 수학 용어 등은 사용하자.

개발자라면 당연히 알고 있을 JobQueue, AccountVisitor(Visitor pattern)등을 사용하지 않을 이유는 없다.

# 문제 영역에서 가져온 이름을 사용하라

 > 
 > 적절한 프로그래머 용어가 없거나 문제영역과 관련이 깊은 용어의 경우 문제 영역 용어를 사용하자.

우수한 프로그래머/설계자라면 해법 영역과 문제 영역을 구분할 수 있어야 한다. 그 중 어떤 것이 더 옳은 판단인지 결론을 내릴 수 있는 판단력을 가져야 한다.

# 의미있는 맥락을 추가하라

 > 
 > 클래스, 함수, namespace등으로 감싸서 맥락(Context)을 표현하라

그래도 불분명하다면 접두어를 사용하자.

````java
// Bad
private void printGuessStatistics(char candidate, int count) {
    String number;
    String verb;
    String pluralModifier;
    if (count == 0) {  
        number = "no";  
        verb = "are";  
        pluralModifier = "s";  
    }  else if (count == 1) {
        number = "1";  
        verb = "is";  
        pluralModifier = "";  
    }  else {
        number = Integer.toString(count);  
        verb = "are";  
        pluralModifier = "s";  
    }
    String guessMessage = String.format("There %s %s %s%s", verb, number, candidate, pluralModifier );

    print(guessMessage);
}
````

이 상황에서 마음에 들지 않는 것들은 다음과 같다.

1. 함수가 길다.
1. 세 변수를 하나의 함수 전반에서 사용한다.

이를 클래스로 분리하여 처리하면 아래와 같아진다.

````java
// Good
public class GuessStatisticsMessage {
    private String number;
    private String verb;
    private String pluralModifier;

    public String make(char candidate, int count) {
        createPluralDependentMessageParts(count);
        return String.format("There %s %s %s%s", verb, number, candidate, pluralModifier );
    }

    private void createPluralDependentMessageParts(int count) {
        if (count == 0) {
            thereAreNoLetters();
        } else if (count == 1) {
            thereIsOneLetter();
        } else {
            thereAreManyLetters(count);
        }
    }

    private void thereAreManyLetters(int count) {
        number = Integer.toString(count);
        verb = "are";
        pluralModifier = "s";
    }

    private void thereIsOneLetter() {
        number = "1";
        verb = "is";
        pluralModifier = "";
    }

    private void thereAreNoLetters() {
        number = "no";
        verb = "are";
        pluralModifier = "s";
    }
}
````

# 불필요한 맥락을 없애라

 > 
 > 음, 이 A 프로젝트니까 Class 앞에 A를 달아서 관리하면 좋겠지?

응 큰일난다. IDE에서 A를 입력하자마자 관련된 모든 클래스를 열거하게 될 것이다. 그 뿐이 아니다. a처럼 접두어를 붙이는 것은 모듈의 재사용 관점에서도 좋지 못하다. 재사용하려면 이름을 바꿔야 한다. GSDAccountAddress 대신 Address로만 해도 충분하다. 어떻게 보면 필요없는 추가 단어가 들어가게 된 것이다.

# Summary

 > 
 > 쫄지말고 말하자.

좋은 이름은 여러 능력을 요구하는 일이다.

* 설명 능력
* 문화적 배경

즉, 교육적인 측면이 가장 강하다. 이름을 바꾸지 않으려는 이유는 사회적 이유가 가장 크다. 다른 개발자가 반대할까봐. 하지만 오히려 반갑고 고마워해야 하는 것에 가깝다. 두려워하지 말고 서로의 명명을 지적하고 고치자. 그렇게 하면 이름을 외우는 것에 시간을 빼앗기지 않고 "자연스럽게 읽히는 코드"를 짜는 데에 더 집중할 수 있다.

# Reference

* [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin)
* [Yooii-Studios / Clean-Code](https://github.com/Yooii-Studios/Clean-Code)
* [Clean Code](https://book.interpark.com/product/BookDisplay.do?_method=detail&sc.prdNo=213656258&gclid=CjwKCAjw9-KTBhBcEiwAr19igynFiOxjFYKEJyaiyNEI4XXL1bFM78ki2cNQLMSxcUWU9XNks8eEThoCG6EQAvD_BwE)
* [zinc0214 / CleanCode](https://github.com/Yooii-Studios/Clean-Code)
