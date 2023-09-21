---
title: Format
thumbnail: ''
draft: false
tags: null
created: 2023-09-21
---

# 형식을 맞추는 목적

코드 형식은 의사소통의 일환이다. 오랜 시간이 지나 원래 코드의 흔적을 찾아보기 어려울 정도로 변경되어도 **맨 처음 잡아놓은 구현 스타일과 가독성 수준은 유지보수 용이성과 확장성에 계속 영향을 미친다.**

# 적당한 행 길이를 유지하라

![](CleanCode_05_Format_0.png)

위의 Box-Plot는 프로젝트 별 파일 길이를 로그 분포로 나타낸 사진이다. 즉, 세로측이 조금만 차이나도 실제 행수는 크게 차이난다는 말이다. 여기서 알 수 있는점은 500줄을 넘지 않고 **200줄을 가지는 파일들로도 충분히 커다란 시스템을 구축할 수 있다는 말이다.**

## 신문 기사처럼 작성하라

우리가 신문 기사를 읽을 때 어떻게 읽는지 생각해보자. 먼저 제목을 보고 읽을지 말지 결정하고, 가장 최상당의 요약된 문단을 읽는다. 그리고 더 읽을지 말지 고민한다. 그 아레에는 세세한 내용들이 정리되어 있는 것이 일반적이다.

마찬가지로 소스파일도 이러한 방식으로 작성해야 한다. 이름만 보고도 올바른 모듈인지 판단할 수 있을 정도로 신경쓰자. 첫부분에는 고추상 수준 개념을 설명하고, 하위로 갈수록 세부사항을 기술하자.

## 개념을 빈 행으로 분리하라

코드의 각 줄은 수식이나 절을 나타내고, 여러 줄의 묶음은 완결된 생각 하나를 표현한다. **생각 사이에는 빈 행을 넣어 분리하여 가독성을 향상시키자.**

````java
// 빈 행을 넣지 않을 경우
package fitnesse.wikitext.widgets;
import java.util.regex.*;
public class BoldWidget extends ParentWidget {
	public static final String REGEXP = "'''.+?'''";
	private static final Pattern pattern = Pattern.compile("'''(.+?)'''",
		Pattern.MULTILINE + Pattern.DOTALL);
	public BoldWidget(ParentWidget parent, String text) throws Exception {
		super(parent);
		Matcher match = pattern.matcher(text); match.find(); 
		addChildWidgets(match.group(1));}
	public String render() throws Exception { 
		StringBuffer html = new StringBuffer("<b>"); 		
		html.append(childHtml()).append("</b>"); 
		return html.toString();
	} 
}
````

````java
/ 빈 행을 넣을 경우
package fitnesse.wikitext.widgets;

import java.util.regex.*;

public class BoldWidget extends ParentWidget {
	public static final String REGEXP = "'''.+?'''";
	private static final Pattern pattern = Pattern.compile("'''(.+?)'''", 
		Pattern.MULTILINE + Pattern.DOTALL
	);
	
	public BoldWidget(ParentWidget parent, String text) throws Exception { 
		super(parent);
		Matcher match = pattern.matcher(text);
		match.find();
		addChildWidgets(match.group(1)); 
	}
	
	public String render() throws Exception { 
		StringBuffer html = new StringBuffer("<b>"); 
		html.append(childHtml()).append("</b>"); 
		return html.toString();
	} 
}
````

## 세로 밀집도

줄 바꿈이 개념을 분리한다면, **세로 밀집도는 연관성을 의미한다.** 즉, 서로 밀접한 코드 행은 세로로 가까이 놓여야 한다는 뜻이다.

````java
// 의미없는 주석으로 변수를 떨어뜨려 놓아서 한눈에 파악이 잘 안된다.

public class ReporterConfig {
	/**
	* The class name of the reporter listener 
	*/
	private String m_className;
	
	/**
	* The properties of the reporter listener 
	*/
	private List<Property> m_properties = new ArrayList<Property>();
	public void addProperty(Property property) { 
		m_properties.add(property);
	}
````

````java
// 의미 없는 주석을 제거함으로써 코드가 한눈에 들어온다.
// 변수 2개에 메소드가 1개인 클래스라는 사실이 드러난다.

public class ReporterConfig {
	private String m_className;
	private List<Property> m_properties = new ArrayList<Property>();
	
	public void addProperty(Property property) { 
		m_properties.add(property);
	}
````

## 수직 거리

함수 연관 관계를 통한 동작 방식을 이해하려고 이 함수, 저 함수를 오가면서 위 아래로 찾아 해멨던 경험이 있을 것이다. 혹은 상속관계를 줄줄히 거슬러서 올라간 경험도 있을 것이다. 별로 좋은 경험으로 남지 않았을 것이라 생각한다. 이러한 달갑지 않은 경험의 본질에는 어디에 있는지 찾고 기억하는데 있어 노력을 소모했다는 점에 있다.

이러한 점에서 우리가 소스코드를 작성할 때 **밀접한 개념을 세로에 두는 노력**이 필요하다. 두 개념이 서로 다른 파일에 속한다면 이 규칙이 통하지 않는다. 하지만 타당한 근거가 없다면 한 파일안에 해당 개념이 속하는 것이 마땅하다. 이런 경우, 같은 파일안에 속할 정도로 밀접한 두 개념이 있는 경우, 세로 거리로 연관성을 표현하자. 지나치게 멀리 떨어져 있으면 읽는 사람이 여기저기를 뒤져야 한다.

### 변수 선언

변수는 사용하는 위치에 최대한 가까이 선언하자. 우리가 설계한 함수는 매우 짧으므로 (3장: 함수) 지역 변수는 각 함수 맨 처음에 선언하자.

````java
// InputStream이 함수 맨 처음에 선언 되어있다. 얘는 사실 좀 길다

private static void readPreferences() {
	InputStream is = null;
	try {
		is = new FileInputStream(getPreferencesFile()); 
		setPreferences(new Properties(getPreferences())); 
		getPreferences().load(is);
	} catch (IOException e) { 
		try {
			if (is != null) 
				is.close();
		} catch (IOException e1) {
		} 
	}
}
````

````java
// 모두들 알다시피 루프 제어 변수는 Test each처럼 루프 문 내부에 선언

public int countTestCases() { 
	int count = 0;
	for (Test each : tests) // HERE!
		count += each.countTestCases(); 
	return count;
}
````

````java
// 드물지만, 긴 함수에서는 블록 상단 또는 루프 직전에 변수를 선언 할 수도 있다.
...
for (XmlTest test : m_suite.getTests()) {
	TestRunner tr = m_runnerFactory.newTestRunner(this, test); // HERE!!
	tr.addListener(m_textReporter); 
	m_testRunners.add(tr);

	invoker = tr.getInvoker();
	
	for (ITestNGMethod m : tr.getBeforeSuiteMethods()) { 
		beforeSuiteMethods.put(m.getMethod(), m);
	}

	for (ITestNGMethod m : tr.getAfterSuiteMethods()) { 
		afterSuiteMethods.put(m.getMethod(), m);
	} 
}
...
````

### 인스턴스 변수

인스턴스 변수는 클래스 맨 처음에 선언한다(자바의 경우). 잘 설계한 클래스는 대다수 클래스 메서드가 인스턴스 변수를 사용하기 때문이다. c++의 경우 마지막에 선언하는 것이 일반적이다. 여기서 핵심은 **어느 곳이든 잘 알려진 위치에 인스턴스 변수를 모으는 것이 중요하다는 것**이다.

````java
// 도중에 선언된 변수는 꽁꽁 숨겨놓은 보물 찾기와 같다. 십중 팔구 코드를 읽다가 우연히 발견한다. 발견해보시길.
// 요즘은 IDE가 잘 되어있어서 찾기야 어렵지 않겠지만, 더러운건 마찬가지

public class TestSuite implements Test {
	static public Test createTest(Class<? extends TestCase> theClass,
									String name) {
		... 
	}

	public static Constructor<? extends TestCase> 
	getTestConstructor(Class<? extends TestCase> theClass) 
	throws NoSuchMethodException {
		... 
	}

	public static Test warning(final String message) { 
		...
	}
	
	private static String exceptionToString(Throwable t) { 
		...
	}
	
	private String fName;

	private Vector<Test> fTests= new Vector<Test>(10);

	public TestSuite() { }
	
	public TestSuite(final Class<? extends TestCase> theClass) { 
		...
	}

	public TestSuite(Class<? extends TestCase> theClass, String name) { 
		...
	}
	
	... ... ... ... ...
}
````

### 종속 함수

한 함수가 다른 함수를 호출한다면 두 함수는 세로로 가까이 배치한다. 가능하면 호출하는 함수를 호출되는 함수보다 먼저 배치한다. 즉, 보통은 추상화레벨이 상위에 높을 것이므로(== 저수준 추상화함수를 호출함으로) 하위에 저수준 추상화 함수를 두자. 이렇게 하면 프로그램이 자연스럽게 읽힌다. 이런 규칙을 적용한다면 읽는 사람도 이러한 부분을 "예측"하면서 쉽게 읽을 수 있다.

````java
/*첫째 함수에서 가장 먼저 호출하는 함수가 바로 아래 정의된다.
다음으로 호출하는 함수는 그 아래에 정의된다. 그러므로 호출되는 함수를 찾기가 쉬워지며
전체 가독성도 높아진다.*/
	
/*makeResponse 함수에서 호출하는 getPageNameOrDefault함수 안에서 "FrontPage" 상수를 사용하지 않고,
상수를 알아야 의미 전달이 쉬워지는 함수 위치에서 실제 사용하는 함수로 상수를 넘겨주는 방법이
가독성 관점에서 훨씬 더 좋다*/

public class WikiPageResponder implements SecureResponder { 
	protected WikiPage page;
	protected PageData pageData;
	protected String pageTitle;
	protected Request request; 
	protected PageCrawler crawler;
	
    // 고수준
	public Response makeResponse(FitNesseContext context, Request request) throws Exception {
		String pageName = getPageNameOrDefault(request, "FrontPage");
		loadPage(pageName, context); 
		if (page == null)
			return notFoundResponse(context, request); 
		else
			return makePageResponse(context); 
		}

	private String getPageNameOrDefault(Request request, String defaultPageName) {
		String pageName = request.getResource(); 
		if (StringUtil.isBlank(pageName))
			pageName = defaultPageName;

		return pageName; 
	}
	
	protected void loadPage(String resource, FitNesseContext context)
		throws Exception {
		WikiPagePath path = PathParser.parse(resource);
		crawler = context.root.getPageCrawler();
		crawler.setDeadEndStrategy(new VirtualEnabledPageCrawler()); 
		page = crawler.getPage(context.root, path);
		if (page != null)
			pageData = page.getData();
	}
	
	private Response notFoundResponse(FitNesseContext context, Request request)
		throws Exception {
		return new NotFoundResponder().makeResponse(context, request);
	}
	
	private SimpleResponse makePageResponse(FitNesseContext context)
		throws Exception {
		pageTitle = PathParser.render(crawler.getFullPath(page)); 
		String html = makeHtml(context);
		SimpleResponse response = new SimpleResponse(); 
		response.setMaxAge(0); 
		response.setContent(html);
		return response;
	} 
...
````

### 개념적 유사성

개념적인 친화도가 높을 수록 코드를 서로 가까이 배치한다. 위에서 말한 내용들이 해당 범주에 속하는데, 즉, **한 함수가 다른 함수를 호출하는 종속성, 변수와 그 변수를 사용하는 함수**등이 그 예이다. 혹은 **비슷한 동작을 수행하는 함수 무리**도 그 예에 속할 수 있겠다.

````java
// 같은 assert 관련된 동작들을 수행하며, 명명법이 똑같고 기본 기능이 유사한 함수들로써 개념적 친화도가 높다.
// 이런 경우에는 종속성은 오히려 부차적 요인이므로, 종속적인 관계가 없더라도 가까이 배치하면 좋다.

public class Assert {
	static public void assertTrue(String message, boolean condition) {
		if (!condition) 
			fail(message);
	}

	static public void assertTrue(boolean condition) { 
		assertTrue(null, condition);
	}

	static public void assertFalse(String message, boolean condition) { 
		assertTrue(message, !condition);
	}
	
	static public void assertFalse(boolean condition) { 
		assertFalse(null, condition);
	} 
...
````

## 세로 순서

일반적으로 함수 호출 종속성은 아래방향으로 유지하므로, 호출되는 함수를 호출하는 함수보다 뒤에 배치한다. 자연스럽게 고차원에서 저차원으로 내려가는 코드를 만들 수 있다. 중요한 개념은 가장 위에, 세세한 사항은 마지막에.

# 가로 형식 맞추기

![](CleanCode_05_Format_1.png)

위 표는 가로에 행 길이, 세로에 로그 스케일로 표시된 행 수 분포이다. 즉, 특정 행 길이에 해당하는 라인이 몇프로나 차지하고 있는지 확인할 수 있는 표이다. 잘 보면, 20에서 60자 사이인 행이 초 행 수의 40%에 달한다. 10자 미만은 30% 정도이고, 80% 이사으이 경우 행수 점유율은 급격하게 감소한다. **프로그래머는 짧은 행을 선호한다. 가로행은 120자 정도를 유지하자**

## 가로 공백과 밀집도

````java
private void measureLine(String line) { 
	lineCount++;
	
	// 흔히 볼 수 있는 코드인데, 할당 연산자 좌우로 공백을 주어 왼쪽,오른쪽 요소가 확실하게 구분된다.
	int lineSize = line.length();
	totalChars += lineSize; 
	
	// 반면 함수이름과 괄호 사이에는 공백을 없앰으로써 함수와 인수의 밀접함을 보여준다
	// 괄호 안의 인수끼리는 쉼표 뒤의 공백을 통해 인수가 별개라는 사실을 보여준다.
	lineWidthHistogram.addLine(lineSize, lineCount);
	recordWidestLine(lineSize);
}
````

위의 코드 예시 말고도 연산자 우선 순위를 강조하기 위해 사용한다.

````java
return b*b - 4*a*c;
return (-b + pi) / (2*a)
````

이렇게 공백을 적용할 경우 수식 읽기가 매우 편하다. 하지만 코드 formatter의 대다수는 연산자 우선순위를 고려하지 못하기 때문에 같은 간격을 적용한다. (Q 괄호로 묶어주는 판단은 어떤지? 토론)

### 가로 정렬

````java
public class FitNesseExpediter implements ResponseSender {
	private		Socket		      socket;
	private 	InputStream 	  input;
	private 	OutputStream 	  output;
	private 	Reques		      request; 		
	private 	Response 	      response;	
	private 	FitNesseContex	  context; 
	protected 	long		      requestParsingTimeLimit;
	private 	long		      requestProgress;
	private 	long		      requestParsingDeadline;
	private 	boolean		      hasError;
	
	... 
````

보기에는 엄청 좋아보인다. 그런데, 실제로 읽어보면 다르다. **변수 유형을 자연스레 무시하고 이름부터 읽게 된다.** 그리고 Code formmater가 무시하고 원래대로 돌려놓는다. 선언부가 길다면 오히려 **분리해야 하는 필요성**이 있음을 말한다.

## 들여쓰기

들여쓰기는 범위로 이뤄진 **계층을 표현하기 위한 것이다.**

### 들여쓰기 무시하기

간단한 if문, while문, 짧은 함수에서 들여쓰기를 무시하고픈 유혹이 생긴다.

````java
// 이렇게 한행에 다 넣을 수 있다고 다 때려 박는 것이 멋있는 코드가 아니란 것! 알아두삼

public class CommentWidget extends TextWidget {
	public static final String REGEXP = "^#[^\r\n]*(?:(?:\r\n)|\n|\r)?";
	
	public CommentWidget(ParentWidget parent, String text){super(parent, text);}
	public String render() throws Exception {return ""; } 
}
````

````java
// 한줄이라도 정성스럽게 들여쓰기로 감싸주자. 가독성을 위해

public class CommentWidget extends TextWidget {
	public static final String REGEXP = "^#[^\r\n]*(?:(?:\r\n)|\n|\r)?";
	
	public CommentWidget(ParentWidget parent, String text){
		super(parent, text);
	}
	
	public String render() throws Exception {
		return ""; 
	} 
}
````

한줄에 넣은 것보다 개행한 것이 훨씬 잘 읽힌다.

## 가짜 범위

빈 while 문이나 for문을 접하는 경우 빈 블록을 들여쓰고 괄호로 감싸자. 

````java
while (dis.readbuf, 0, readBufferSize) != -1)
;
````

이렇게 해야 눈에 띈다고 한다. (?? 질문)

# 팀 규칙

코딩 스타일을 의논하여(괄호를 어디에 넣을지, 네이밍은 어떻게 할지 등) IDE Formatter로 지정하여 구현하는 것이 옳은 방식이다. **좋은 소프트웨어 시스템은 읽기 쉬운 문서로 이뤄지고, 읽기 쉬운 문서는 스타일이 일관적이고 매끄러워야 한다.**

# 밥 아저씨의 형식 규칙

끝으로 저자가 사용하는 규칙이 적용된 코드를 첨부한다.

````java
public class CodeAnalyzer implements JavaFileAnalysis { 
	private int lineCount;
	private int maxLineWidth;
	private int widestLineNumber;
	private LineWidthHistogram lineWidthHistogram; 
	private int totalChars;
	
	public CodeAnalyzer() {
		lineWidthHistogram = new LineWidthHistogram();
	}
	
	public static List<File> findJavaFiles(File parentDirectory) { 
		List<File> files = new ArrayList<File>(); 
		findJavaFiles(parentDirectory, files);
		return files;
	}
	
	private static void findJavaFiles(File parentDirectory, List<File> files) {
		for (File file : parentDirectory.listFiles()) {
			if (file.getName().endsWith(".java")) 
				files.add(file);
			else if (file.isDirectory()) 
				findJavaFiles(file, files);
		} 
	}
	
	public void analyzeFile(File javaFile) throws Exception { 
		BufferedReader br = new BufferedReader(new FileReader(javaFile)); 
		String line;
		while ((line = br.readLine()) != null)
			measureLine(line); 
	}
	
	private void measureLine(String line) { 
		lineCount++;
		int lineSize = line.length();
		totalChars += lineSize; 
		lineWidthHistogram.addLine(lineSize, lineCount);
		recordWidestLine(lineSize);
	}
	
	private void recordWidestLine(int lineSize) { 
		if (lineSize > maxLineWidth) {
			maxLineWidth = lineSize;
			widestLineNumber = lineCount; 
		}
	}

	public int getLineCount() { 
		return lineCount;
	}

	public int getMaxLineWidth() { 
		return maxLineWidth;
	}

	public int getWidestLineNumber() { 
		return widestLineNumber;
	}

	public LineWidthHistogram getLineWidthHistogram() {
		return lineWidthHistogram;
	}
	
	public double getMeanLineWidth() { 
		return (double)totalChars/lineCount;
	}

	public int getMedianLineWidth() {
		Integer[] sortedWidths = getSortedWidths(); 
		int cumulativeLineCount = 0;
		for (int width : sortedWidths) {
			cumulativeLineCount += lineCountForWidth(width); 
			if (cumulativeLineCount > lineCount/2)
				return width;
		}
		throw new Error("Cannot get here"); 
	}
	
	private int lineCountForWidth(int width) {
		return lineWidthHistogram.getLinesforWidth(width).size();
	}
	
	private Integer[] getSortedWidths() {
		Set<Integer> widths = lineWidthHistogram.getWidths(); 
		Integer[] sortedWidths = (widths.toArray(new Integer[0])); 
		Arrays.sort(sortedWidths);
		return sortedWidths;
	} 
}
````

# 요약

* 형식은 팀에서 협의한 방향으로 한다.
* 개념을 모아서 적용하는 것이 좋다.
* 고수준에서 저수준으로 코드를 짜라.
* 행 수는 40-80, 행 길이은 120

# Reference

* [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin)
* [Yooii-Studios / Clean-Code](https://github.com/Yooii-Studios/Clean-Code)
* [Clean Code](https://book.interpark.com/product/BookDisplay.do?_method=detail&sc.prdNo=213656258&gclid=CjwKCAjw9-KTBhBcEiwAr19igynFiOxjFYKEJyaiyNEI4XXL1bFM78ki2cNQLMSxcUWU9XNks8eEThoCG6EQAvD_BwE)
* [zinc0214 / CleanCode](https://github.com/Yooii-Studios/Clean-Code)
* [wojteklu/clean_code.md](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
