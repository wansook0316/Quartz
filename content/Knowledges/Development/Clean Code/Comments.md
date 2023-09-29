---
title: Comments
thumbnail: ''
draft: false
tags:
- comments
created: 2023-09-21
---

# Intro

 > 
 > 나쁜 코드에 주석을 달지마라. 새로 짜라. : 브라이언 W. 커니헨, P.J. 플라우거

주석은 필요악이다. 프로그래밍 언어 자체가 표현력이 풍부하다면, 혹은 우리가 치밀하게 의도를 잘 표현했다면 주석은 전혀 필요하지 않다. 주석 없이는 자신을 표현할 방법을 찾지 못해 할 수 없이 주석을 사용한다. 그래서 주석은 반겨 맞을 손님이 아니다.

주석을 무시하는 이유가 무엇이냐고? 주석이 오래될수록 코드에서 멀어져서 거짓말을 하게 될 가능성이 커지기 때문이다. 코드는 유지보수를 해도, 주석을 계속 유지보수하기란 현실적으로 불가능하기 때문이다.

# 주석은 나쁜 코드를 보완하지 못한다

주석을 추가하는 일반적인 이유는 코드 품질이 나빠서이다. 깔끔하고 주석이 거의 없는 코드가, 복잡하고 어수선하며 주석이 많이 달린 코드보다 훨씬 좋다. 주석으로 설명하려 애쓰는 대신에 그 난장판을 깨끗이 치우는 데 시간을 보내라!

# 코드로 의도를 표현하라!

````java
// 직원에게 복지 혜택을 받을 자격이 있는지 검사한다. 
if ((emplotee.flags & HOURLY_FLAG) && (employee.age > 65)
````

````java
if (employee.isEligibleForFullBenefits())
````

어떤 코드가 나은가? 주석도 필요없이 의도가 충분히 표현되었다.

# 좋은 주석

 > 
 > 글자 값을 하는 주석을 찾아보자.

## 법적인 주석

````java
// Copyright (C) 2003, 2004, 2005 by Object Montor, Inc. All right reserved.
// GNU General Public License
````

저작권 정보, 소유권 정보, 계약 조건, 표준 라이센스, 외부 문서를 적는다.

## 정보를 제공하는 주석

````java
// 테스트 중인 Responder 인스턴스를 반환
protected abstract Responder responderInstance();

protected abstract Responder responderBeingTested(); // 이렇게 하면 주석을 없앨 수 있다.
````

다음과 같은 주석은 보다 의미있다고 할 수 있다.

````java
// kk:mm:ss EEE, MMM dd, yyyy 형식이다.
Pattern timeMatcher = Pattern.compile("\\d*:\\d*\\d* \\w*, \\w*, \\d*, \\d*");
````

## 의도를 설명하는 주석

````java
public int compareTo(Object o) {
    if (o instanceof WikiPagePath) {
        WikiPagePath p = (WikiPagePath) o;
        String compressedName = StringUtil.join(names, "");
        String compressedArgumentName = StringUtil.join(p.names, "");
        return compressedName.compareTo(compressedArgumentName);
    }
    return 1; // 오른쪽 유형이므로 정렬 순위가 더 높다.
}
````

````java
// 스레드를 대량 생성하는 방법으로 어떻게든 경쟁 조건을 만들려 시도한다. 
for (int i = 0; i > 2500; i++) {
    WidgetBuilderThread widgetBuilderThread = 
        new WidgetBuilderThread(widgetBuilder, text, parent, failFlag);
    Thread thread = new Thread(widgetBuilderThread);
    thread.start();
}
````

때때로 주석은 구현을 이해하게 도와주는 선을 넘어 결정에 깔린 의도까지 설명한다. 문제 해결 방법에는 여러가지가 있을 수 있으나, 해당 코드를 작성한 의도자체를 적어둚으로서 코드를 읽는 사람이 파악할 수 있도록 한다.

## 의미를 명료하게 밝히는 주석

````java
public void testCompareTo() throws Exception {
    WikiPagePath a = PathParser.parse("PageA");
    WikiPagePath ab = PathParser.parse("PageA.PageB");
    WikiPagePath b = PathParser.parse("PageB");
    WikiPagePath ba = PathParser.parse("PageB.PageA");
    WikiPagePath aa = PathParser.parse("PageA.PageA");
    WikiPagePath bb = PathParser.parse("PageB.PageB");
    assertTrue(a.compareTo(a) == 0); // a == a

    assertTrue(a.compareTo(b) != 0); // a != b

    assertTrue(ab.compareTo(ab) == 0); // ab == ab

    assertTrue(a.compareTo(b) == -1); // a < b

    assertTrue(aa.compareTo(ab) == -1); // aa < ab

    assertTrue(ba.compareTo(bb) == -1); // ba < bb

    assertTrue(b.compareTo(a) == 1); // b > a

    assertTrue(ab.compareTo(aa) == 1); // ab > aa

    assertTrue(bb.compareTo(ba) == 1); // bb > ba
} 
````

위의 코드를 보면, 어떤 것을 검증하는지 파악하기 어렵다. 이런 경우 어떤의미를 가지는지 명료하게 적어주는데 활용하면 유용하다.

## 결과를 경고하는 주석

````java
// 여유 시간이 충분하지 않다면 실행하지 마십시오

public void _testWithReallyBigFile() {
    writeLinesToFile(1000000000);
    response.setBody(testFile);
    response.readyToSend(this);
    String responseString = output.toString();
    assertSubString("Content-Length: 1000000000", responseString);
    assertTrue(bytesSent > 1000000000);
}
````

요즘은 `@Ignore` 속성을 이용하여 테스트 케이스를 꺼버린다. `@Ignore("실행이 너무 오래 걸린다")`

````java
public static SimpleDateFormat makeStandardHttpDateFormat() {
    // SimpleDateFormat은 스레드에 안전하지 못하다

    // 따라서 각 인스턴스를 독립적으로 생성해야 한다.

    SimpleDateFormat df = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z");
    df.setTimeZone(TimeZone.getTimeZone("GMT"));
    return df;
} 
````

## TODO 주석

````java
// TODO-MdM 현재 필요하지 않다.
// 체크아웃 모델을 도입하면 함수가 필요 없다.
protected VersionInfo makeVersion() throws Exception {
    return null;
}
````

필요하다 여기지만 당장 구현하기 어려운 업무를 기술한다. 하지만 핑계가 되어서는 안된다.

## 중요성을 강조하는 주석

````java
String listItemcontent = match.group(3).trim();
// 여기서 trim은 굉장히 중요하다. trim 함수는 문자열에서 시작 공백을 제거한다

// 문자열에 시작 공백이 있으면 다른 문자열로 인식되기 때문이다.

new ListItemWidget(this, listItemcontent, this.level + 1);
return buildList(text.substring(match.end()));
````

대수롭지 않게 여겨질 수 있으나, 상당히 중요한 경우 주석을 남겨두면 좋다.

# 나쁜 주석

대다수 주석은 이 범주에 속한다. 

## 주절 거리는 주석

````java
public void loadProperties() {
    try {
        String propertiesPath = propertiesLocation + "/" + PROPERTIES_FILE;
        FileInputStream propertiesStream = new FileInputStream(propertiesPath);
        loadedProperties.load(propertiesStream);
    } catch (IOException e) {
    // 속성 파일이 없다면 기본값을 모두 메모리로 읽어 들였다는 의미다.

    }
}
````

지나치게 추상적이다. 누가 기본 값을 메모리로 읽어 들였는가? 시기는 언제인가? 누가 예외를 던지는가? 결국 코드를 읽는 수 밖에 없다. 생산성에 전혀 도움이 되지 않는다.

## 같은 이야기를 중복하는 주석

````java
// this.closed가 true일 때 반환되는 유틸리티 메서드다.
// 타임아웃에 도달하면 예외를 던진다.
public synchronized void waitForClose(final long timeoutMillis)
throws Exception 
{
    if (!closed) {
        wait(timeoutMillis);
        if (!closed)
            throw new Exception("MockResponseSender could not be closed");
    }
} 
````

코드를 읽어도 아는 얘기를 굳이 주석을 달아두었다. 읽기 힘든 코드를 도와주지도 않는다.

````java
/**
 * 이 컴포넌트의 프로세서 지연값
 */
protected int backgroundProcessorDelay = -1;
/**
 * 이 컴포넌트를 지원하기 위한 생명주기 이벤트
 */
protected LifecycleSupport lifecycle = new LifecycleSupport(this); 
````

전혀 목적이 없다. 코드만 읽으면 되면 아는 것을 중복해서 적어두었다.

## 오해할 여지가 있는 주석

````java
// this.closed가 true일 때 반환되는 유틸리티 메서드다.
// 타임아웃에 도달하면 예외를 던진다.
public synchronized void waitForClose(final long timeoutMillis)
throws Exception 
{
    if (!closed) {
        wait(timeoutMillis);
        if (!closed)
            throw new Exception("MockResponseSender could not be closed");
    }
} 
````

주석을 보면 `true일 때 반환된다` 라고 적혀있다. 잘못 읽으면 return value가 있는 것으로 기대하고 코드를 작성할 수 있다. 하지만 `this.closed == true`가 중간에 변경된다면 메서드는 반환되지 않는다. 

## 의무적으로 다는 주석

````java
/ 
* @param title CD 제목
* (Qparam author CD 저자
* @param tracks CD 트랙 숫자
* (aparam durationlnMinutes CD 길이(단위: 분)
*/

public void addCD(String title, String author,int tracks, int durationlnMinutes) {
    CD cd = new CD();
    cd.title = title;
    cd.author = author;
    cd.tracks = tracks;
    cd.duration = durationlnMinutes;
    cdList.add(cd);
}
````

하등에 쓸모 없다.

## 이력을 기록하는 주석

````java
* 변경 이력 (U-Oct-2001부터)
* ----------------------
* 11-Oct-2001 : 클래스를 다시 정리하고 새로운 패키지인 com.jrefinery.date로 옮겼다 (DG);
* 05-Nov-2001 : getDesc ript ion () 메서드를 추가했으며
* NotableDate class를 제거했다 (DG);
````

예전에는 이게 맞았다. 소스 코드 관리 시스템이 생긴 이후에는 전혀 필요없어진 친구다.

## 있으나 마나한 주석

````java
    try {
        doSending();
    } catch (SocketException e) {
    // 정상 누군가 요청을 멈췄다

    } catch (Exception e) {
        try {
            response.add(ErrorResponder.makeExceptionString(e));
            response.closeAll();
        } catch (Exception e1) {
        // 이게 뭐야

        }
    }
}
````

분풀이를 하고 있다.

````java
private void startSending() {
    try {
        doSending();
    } catch (SocketException e) {
    // 정상 누군가 요청을 멈췄다

    } catch (Exception e) {
        addExceptionAndCloseResponse(e);
    }
}

private void addExceptionAndCloseResponse(Exception e) {
    try {
        response.add(ErrorResponder.makeExceptionString(e));
        response.closeAll();
    } catch (Exception e) {
}
}
````

분풀이 할 동안 함수 개선해라.

## 함수나 변수로 표현할 수 있다면 주석을 달지 마라

````java
//전역 목록 <smodule>에 속하는 모듈이 우리가 속한 하위시스템에 의존하는가
if (smodule.getDependSubsystems().contains(subSysMod.getSubSystem())) {
}
````

````java
ArrayList moduleDependees = smodule.getDependSubsystems();
String ourSubSystem = subSysMod.getSubSystem();
if (moduleDependees.contains(ourSubSystem)){
} 
````

저렇게 길게 늘어서서 의도 표현이 안된다고 주석을 쓰지 마라. 오히려 변수에 담아서 의도를 표현하는 것이 좋다.

## 위치를 표현하는 주석

````java
// Actions /////////////////////////////////////////////
````

필요할 때 드물게 사용하는 것이 좋다. 일반적으로 위와 같은 주석은 가독성만 낮춘다.

## 닫는 괄호에 다는 주석

````java
public class wc {
    public static void main(String[] args) {
        BufferedReader in = new BufferedReader(newInputStreamReader(System.in));
        String line;
        int lineCount = 0;
        int charCount = 0;
        int wordCount = 0;

        try {
            while ((line = in.readLineO) != null) {
                lineCount++;
                charCount += line.length();
                String words[] = line.split("\\W");
                wordCount += words.length;
            } //while
        System.out.printIn("wordCount = " + wordCount);
        System.out.printIn("lineCount = " + lineCount);
        System.out.printIn("cha rCount = " + charCount);
        } //try
````

중첩이 심하고 장황한 함수(flutter에서 봄)의 경우에는 유용하나 작고 캡슐화된 함수에는 잡음일 뿐이다.

## 공고를 돌리거나 저자를 표시하는 주석

````java
/* 완식이 추가함 */
````

소스 코드 관리 시스템이 모두 처리해준다.

## 주석으로 처리한 코드

````java
InputStreamResponse response = new InputStreamResponse();
response.setBody(formatter.getResultStream(), formatter.getByteCount());
// InputStream resultsStream = formatter.getResultStream();
// StreamReader reader = new StreamReader(resultsStream);
// response. setContent( reader. read(form atter.getByteCount( ) ) ) ;
````

이게 제일 밉살스러운 관행이다. 이런 코드는 작성하지 마라! 다른 사람들이 이를 지우기를 주저한다. 이유가 있겠지 하면서 안지우는 녀석이다. 이러다보면 엄청나게 쌓이게 된다. 소스 코드 관리 시스템을 믿고 지워버리자.

## HTML 주석

````html
/ **
* 적합성 테스트를 수행하기 위한 과업
* 이 과업은 적합성 테스트를 수행해 결과를 출력한다.

* <p/>
* <pre>
* 용법:
* &lt;taskdef name=&quot;execute-fitnesse-tests&quot;
*   classname=&quot;fitnesse.ant.ExecuteFitnesseTestsTask&quot;
````

완전 혐오다. 일단 읽기가 어렵다. 

## 전역 정보

````java
/*
* 적합성 테스트가 동직하는 포트: 기본값은 <b>8082</b>.
* (aparam fitnessePort)
*/

public void setFitnessePort(int fitnessePort)
{
    this.fitnessePort = fitnessePort;
}
````

주석을 달아야 한다면 근처 코드에만 기술해라. 위의 경우, 해당 함수 자체는 기본 포트 값을 전혀 통제하지 못한다. 즉, 바로 아래 함수에 적용되는 것이 아니고, 시스템 어딘가에 있는 다른 함수를 설명한다는 말이다.

## 너무 많은 정보

````java
/*
RFC 2045 - Multipurpose Internet Mail Extensions (MIME)
1부: 인터넷 메시지 본체 형식
6.8절. Base64 내용 전송 인코딩(Content-Transfer-Encoding)
인코딩 과정은입력 비트 중 24비트 그룹을 인코딩된 4글자로 구성된
출력 문자열로 표현한다. 왼쪽에서 오른쪽으로 진행해가며, 3개를 묶어 8비트 입력
그룹을 형성한다. 이렇게 만들어진 24비트는 4개를 묶어 6비트 그룹으로 취급하며,
각각은 base64 알파벳에서 단일 자릿수로 해석된다.
base64 인코딩으로 비트 스트림을 인코딩할 때, 비트 스트림은
MSB(Most Significant Bit) 우선으로 정렬되어 있다고 가정한다. 따라서, 스트림에서
첫 번째 비트는 첫 8비트 바이트에서 최상위 비트가 되며, 여덟번째 비트는 첫 8비트
바이트에서 최하위 비트가 된다.
*/
````

거의 백과사전 수준이다. 읽는 사람에게는 사실 전혀 필요없는 정보이다.

## 모호한 관계

````java
/*
* 모든 픽셀을 담을 만큼 충분한 배열로 시작한다(여기에 필터 바이트를 더한다) .
* 그리고 헤더 정보를 위해 200바이트를 더한다.
*/
this.pngBytes = new byte[((this.width + 1) * this.height * 3) + 200];
````

주석과 주석이 설명하는 코드는 관계가 명확해야 한다. 위 코드에서 필터 바이트는 무엇인가? 전혀 알 수 없다. 주석 자체가 다시 설명을 요구하니 안타깝기 그지없다.

## 함수 헤더

짧은 함수는 긴 설명이 필요없다. 한 가지만 잘 수행하는 짧고 이름 잘 붙인 함수는 주석으로 헤더를 추가한 함수보다 훨씬 좋다.

# 마무리

 > 
 > 주석은 상대방의 입장에서 보았을 때, 좋을지 나쁠지를 판단해서 적는 것이 중요하다.

# Reference

* [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin)
* [Yooii-Studios / Clean-Code](https://github.com/Yooii-Studios/Clean-Code)
* [Clean Code](https://book.interpark.com/product/BookDisplay.do?_method=detail&sc.prdNo=213656258&gclid=CjwKCAjw9-KTBhBcEiwAr19igynFiOxjFYKEJyaiyNEI4XXL1bFM78ki2cNQLMSxcUWU9XNks8eEThoCG6EQAvD_BwE)
* [zinc0214 / CleanCode](https://github.com/Yooii-Studios/Clean-Code)
* [wojteklu/clean_code.md](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
