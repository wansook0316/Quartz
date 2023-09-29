---
title: Class
thumbnail: ''
draft: false
tags:
- class
- capsulation
- abstract-data-types
- SOLID
- cohesion
created: 2023-09-21
---

이전 장들에서는 Code, Code Block, 함수 구현 방법, 함수들의 연관 방식을 알아보았지만, 이번에는 조금더 고차원의 얘기를 할까 한다.

# 클래스 체계

Java Convention에 따르면 가장 먼저 변수 목록이 나온다. static public, static private, private instance, (public instance), public function, private function 순으로 전개된다. 즉, 추상화 단계가 순차적으로 내려간다.

## 캡슐화

변수와 유틸리티 함수는 가능한 공개하지 않는 것이 좋다. 하지만 그렇다고 반드시 숨겨야 하는 것은 아니다. 테스트를 위해 protected로 접근을 허용하기도 한다. 하지만 명심해야 하는 것은 **비공개 상태를 유지할 온갖 방법을 강구하고, 캡슐화를 풀어주는 결정은 최후의 수단이라는 것이다.**

# 클래스는 작아야 한다!

역시 함수와 마찬가지로 작아야 한다. 함수의 경우에는 물리적인 행수로 이를 가늠했다. **클래스의 경우는 맡은 책임을 측정한다.**

````java
// 어마어마하게 큰 슈퍼 만능 클래스

public class SuperDashboard extends JFrame implements MetaDataUser {
	public String getCustomizerLanguagePath()
	public void setSystemConfigPath(String systemConfigPath) 
	public String getSystemConfigDocument()
	public void setSystemConfigDocument(String systemConfigDocument) 
	public boolean getGuruState()
	public boolean getNoviceState()
	public boolean getOpenSourceState()
	public void showObject(MetaObject object) 
	public void showProgress(String s)
	public boolean isMetadataDirty()
	public void setIsMetadataDirty(boolean isMetadataDirty)
	public Component getLastFocusedComponent()
	public void setLastFocused(Component lastFocused)
	public void setMouseSelectState(boolean isMouseSelected) 
	public boolean isMouseSelected()
	public LanguageManager getLanguageManager()
	public Project getProject()
	public Project getFirstProject()
	public Project getLastProject()
	public String getNewProjectName()
	public void setComponentSizes(Dimension dim)
	public String getCurrentDir()
	public void setCurrentDir(String newDir)
	public void updateStatus(int dotPos, int markPos)
	public Class[] getDataBaseClasses()
	public MetadataFeeder getMetadataFeeder()
	public void addProject(Project project)
	public boolean setCurrentProject(Project project)
	public boolean removeProject(Project project)
	public MetaProjectHeader getProgramMetadata()
	public void resetDashboard()
	public Project loadProject(String fileName, String projectName)
	public void setCanSaveMetadata(boolean canSave)
	public MetaObject getSelectedObject()
	public void deselectObjects()
	public void setProject(Project project)
	public void editorAction(String actionName, ActionEvent event) 
	public void setMode(int mode)
	public FileManager getFileManager()
	public void setFileManager(FileManager fileManager)
	public ConfigManager getConfigManager()
	public void setConfigManager(ConfigManager configManager) 
	public ClassLoader getClassLoader()
	public void setClassLoader(ClassLoader classLoader)
	public Properties getProps()
	public String getUserHome()
	public String getBaseDir()
	public int getMajorVersionNumber()
	public int getMinorVersionNumber()
	public int getBuildNumber()
	public MetaObject pasting(MetaObject target, MetaObject pasted, MetaProject project)
	public void processMenuItems(MetaObject metaObject)
	public void processMenuSeparators(MetaObject metaObject) 
	public void processTabPages(MetaObject metaObject)
	public void processPlacement(MetaObject object)
	public void processCreateLayout(MetaObject object)
	public void updateDisplayLayer(MetaObject object, int layerIndex) 
	public void propertyEditedRepaint(MetaObject object)
	public void processDeleteObject(MetaObject object)
	public boolean getAttachedToDesigner()
	public void processProjectChangedState(boolean hasProjectChanged) 
	public void processObjectNameChanged(MetaObject object)
	public void runProject()
	public void setAçowDragging(boolean allowDragging) 
	public boolean allowDragging()
	public boolean isCustomizing()
	public void setTitle(String title)
	public IdeMenuBar getIdeMenuBar()
	public void showHelper(MetaObject metaObject, String propertyName) 
	
	// ... many non-public methods follow ...
}
````

너무 크다. 그렇다면 몇개의 메서드만 추리면 괜찮을까?

````java
// 메소드를 5개로 줄인다고 하더라도 여전히 책임이 많다..

public class SuperDashboard extends JFrame implements MetaDataUser {
	public Component getLastFocusedComponent()
	public void setLastFocused(Component lastFocused)
	public int getMajorVersionNumber()
	public int getMinorVersionNumber()
	public int getBuildNumber() 
}
````

겉으로는 작아보여서 좋지만, 세세히 보면 이 클래스는 두개의 책임을 가지고 있다. 첫째, 버전 정보를 추적한다. 둘째, UI 컴포넌트를 관리한다.

이렇게 **책임이 여러개인 경우를 확인할 수 있는 간단한 방법은 작명이다.** 이름 짓기가 곤란하다면, 클래스 크기가 너무 커서 그렇다. `Processor`, `Manager`, `Super`와 같이 모호한 단어가 있다면 여러 책임을 떠안겼다는 증거다. 또 `if`, `and`, `or`, `but`과 같은 단어없이 25자 안에 표현되어야 한다.

## 단일 책임 원칙

단일 책임 원칙은 클래스나 모듈을 변경할 이유가 **단 하나여야 한다는 원칙이다.** 하지만 위에서 말했듯 `SuperDashBoard`의 경우 책임이 두개이기 때문에 변경이유도 두가지다.

````java
// 이 코드는 작아보이지만, 변경할 이유가 2가지이다.

public class SuperDashboard extends JFrame implements MetaDataUser {
	public Component getLastFocusedComponent()
	public void setLastFocused(Component lastFocused)
	public int getMajorVersionNumber()
	public int getMinorVersionNumber()
	public int getBuildNumber() 
}
````

이런 경우 분리를 통한 추상화를 적용하는 것이 더 좋다.

````java
// 위 코드에서 버전 정보를 다루는 메서드 3개를 따로 빼서
// Version이라는 독자적인 클래스를 만들어 다른 곳에서 재사용하기 쉬워졌다.

public class Version {
	public int getMajorVersionNumber() 
	public int getMinorVersionNumber() 
	public int getBuildNumber()
}
````

SRP는 객체지향설계에서 더욱 중요한 개념이고, 지키기 수월한 개념인데, 개발자가 가장 무시하는 규칙 중 하나이다. 이는 대부분의 프로그래머들이 돌아가는 소프트웨어에 초점을 맞추기 때문이다. 전적으로 올바른 태도이기는 하지만, 돌아가는 소프트웨어가 작성되면 깨끗하고 체계적인 소프트웨어라는 다음 관심사로 전환을 해야한다.

시스템을 구성하는데 있어 결국 돌아가는 부품의 개수는 비슷하다. 그렇다면 그 부품(component)들을 어떻게 관리하고 싶은가? 작은 서랍을 여러개 두고 이름표를 붙여서 관리하고 싶은가, 큰 서랍하나에 모두 넣어버리고 싶은가? 당연히 작은 클래스 여럿으로 이뤄진 시스템이 더 바람직하다. 

## 응집도(Cohesion)

**클래스는 인스턴스 변수 수가 작아야 한다.** 모든 인스턴스 변수를 메서드마다 사용한다면 가장 응집도가 높을 것이다. 이를 선호하는 이유는, **클래스 내부에 있는 메서드와 변수가 서로 의존하며 논리적인 단위로 묶이기 때문이다.**

````java
// Stack을 구현한 코드, 응집도가 높은 편이다.

public class Stack {
	private int topOfStack = 0;
	List<Integer> elements = new LinkedList<Integer>();

	public int size() { 
		return topOfStack;
	}

	public void push(int element) { 
		topOfStack++; 
		elements.add(element);
	}
	
	public int pop() throws PoppedWhenEmpty { 
		if (topOfStack == 0)
			throw new PoppedWhenEmpty();
		int element = elements.get(--topOfStack); 
		elements.remove(topOfStack);
		return element;
	}
}
````

"클래스 인스턴스 변수는 적게, 함수는 짧게" 전략을 따르다보면 몇몇 메서드만이 사용하는 인스턴스 변수가 많아진다. 이렇게 되면 그 메서드와 변수들을 묶어서 분리해야 한다는 신호다. 응집도가 높다는 말이기 때문이다.

## 응집도를 유지하면 작은 클래스 여럿이 나온다

큰 함수를 작은 함수 여럿으로 나누기만 해도 클래스 수가 많아진다. 예를 들어 보자.

* 변수가 아주 많은 큰 함수가 하나 있다.
* 큰 함수 일부를 작은 함수로 빼내고 싶다.
* 빼내려는 코드가 큰 함수에 정의 된 변수를 많이 사용한다.
* 변수들을 새 함수에 인수로 넘겨야 하나? 아니!
* 변수들을 클래스 인스턴스 변수로 승격 시키면 인수가 필요없다. But! 응집력이 낮아진다. 즉, 작은 함수에서만 사용하는 변수가 되버린다.
* 몇몇 함수가 몇몇 인스턴스 변수만 사용한다면 독자적인 클래스로 분리해도 된다!

이렇게 큰 함수를 작은 함수로 분리하다 보면 종종 작은 클래스로 쪼갤 기회가 생긴다.

````java
// 이 하나의 크고 더러운 함수를 여러 함수와 클래스로 잘게 나누면서 적절한 이름을 부여해보자!

package literatePrimes;

public class PrintPrimes {
	public static void main(String[] args) {
		final int M = 1000; 
		final int RR = 50;
		final int CC = 4;
		final int WW = 10;
		final int ORDMAX = 30; 
		int P[] = new int[M + 1]; 
		int PAGENUMBER;
		int PAGEOFFSET; 
		int ROWOFFSET; 
		int C;
		int J;
		int K;
		boolean JPRIME;
		int ORD;
		int SQUARE;
		int N;
		int MULT[] = new int[ORDMAX + 1];
		
		J = 1;
		K = 1; 
		P[1] = 2; 
		ORD = 2; 
		SQUARE = 9;
	
		while (K < M) { 
			do {
				J = J + 2;
				if (J == SQUARE) {
					ORD = ORD + 1;
					SQUARE = P[ORD] * P[ORD]; 
					MULT[ORD - 1] = J;
				}
				N = 2;
				JPRIME = true;
				while (N < ORD && JPRIME) {
					while (MULT[N] < J)
						MULT[N] = MULT[N] + P[N] + P[N];
					if (MULT[N] == J) 
						JPRIME = false;
					N = N + 1; 
				}
			} while (!JPRIME); 
			K = K + 1;
			P[K] = J;
		} 
		{
			PAGENUMBER = 1; 
			PAGEOFFSET = 1;
			while (PAGEOFFSET <= M) {
				System.out.println("The First " + M + " Prime Numbers --- Page " + PAGENUMBER);
				System.out.println("");
				for (ROWOFFSET = PAGEOFFSET; ROWOFFSET < PAGEOFFSET + RR; ROWOFFSET++) {
					for (C = 0; C < CC;C++)
						if (ROWOFFSET + C * RR <= M)
							System.out.format("%10d", P[ROWOFFSET + C * RR]); 
					System.out.println("");
				}
				System.out.println("\f"); PAGENUMBER = PAGENUMBER + 1; PAGEOFFSET = PAGEOFFSET + RR * CC;
			}
		}
	}
}
````

이 코드를 나눠보자.

````java
// 실행 환경을 책임진다.
package literatePrimes;

public class PrimePrinter {
	public static void main(String[] args) {
		final int NUMBER_OF_PRIMES = 1000;
		int[] primes = PrimeGenerator.generate(NUMBER_OF_PRIMES);
		
		final int ROWS_PER_PAGE = 50; 
		final int COLUMNS_PER_PAGE = 4; 
		RowColumnPagePrinter tablePrinter = 
			new RowColumnPagePrinter(ROWS_PER_PAGE, 
						COLUMNS_PER_PAGE, 
						"The First " + NUMBER_OF_PRIMES + " Prime Numbers");
		tablePrinter.print(primes); 
	}
}

````

````java
// 숫자 목록을 주어진 행과 열에 맞춰 페이지에 출력한다.

package literatePrimes;

import java.io.PrintStream;

public class RowColumnPagePrinter { 
	private int rowsPerPage;
	private int columnsPerPage; 
	private int numbersPerPage; 
	private String pageHeader; 
	private PrintStream printStream;
	
	public RowColumnPagePrinter(int rowsPerPage, int columnsPerPage, String pageHeader) { 
		this.rowsPerPage = rowsPerPage;
		this.columnsPerPage = columnsPerPage; 
		this.pageHeader = pageHeader;
		numbersPerPage = rowsPerPage * columnsPerPage; 
		printStream = System.out;
	}
	
	public void print(int data[]) { 
		int pageNumber = 1;
		for (int firstIndexOnPage = 0 ; 
			firstIndexOnPage < data.length ; 
			firstIndexOnPage += numbersPerPage) { 
			int lastIndexOnPage =  Math.min(firstIndexOnPage + numbersPerPage - 1, data.length - 1);
			printPageHeader(pageHeader, pageNumber); 
			printPage(firstIndexOnPage, lastIndexOnPage, data); 
			printStream.println("\f");
			pageNumber++;
		} 
	}
	
	private void printPage(int firstIndexOnPage, int lastIndexOnPage, int[] data) { 
		int firstIndexOfLastRowOnPage =
		firstIndexOnPage + rowsPerPage - 1;
		for (int firstIndexInRow = firstIndexOnPage ; 
			firstIndexInRow <= firstIndexOfLastRowOnPage ;
			firstIndexInRow++) { 
			printRow(firstIndexInRow, lastIndexOnPage, data); 
			printStream.println("");
		} 
	}
	
	private void printRow(int firstIndexInRow, int lastIndexOnPage, int[] data) {
		for (int column = 0; column < columnsPerPage; column++) {
			int index = firstIndexInRow + column * rowsPerPage; 
			if (index <= lastIndexOnPage)
				printStream.format("%10d", data[index]); 
		}
	}

	private void printPageHeader(String pageHeader, int pageNumber) {
		printStream.println(pageHeader + " --- Page " + pageNumber);
		printStream.println(""); 
	}
		
	public void setOutput(PrintStream printStream) { 
		this.printStream = printStream;
	} 
}
````

````java
// 소수 목록을 생성한다.
package literatePrimes;

import java.util.ArrayList;

public class PrimeGenerator {
	private static int[] primes;
	private static ArrayList<Integer> multiplesOfPrimeFactors;

	protected static int[] generate(int n) {
		primes = new int[n];
		multiplesOfPrimeFactors = new ArrayList<Integer>(); 
		set2AsFirstPrime(); 
		checkOddNumbersForSubsequentPrimes();
		return primes; 
	}

	private static void set2AsFirstPrime() { 
		primes[0] = 2; 
		multiplesOfPrimeFactors.add(2);
	}
	
	private static void checkOddNumbersForSubsequentPrimes() { 
		int primeIndex = 1;
		for (int candidate = 3 ; primeIndex < primes.length ; candidate += 2) { 
			if (isPrime(candidate))
				primes[primeIndex++] = candidate; 
		}
	}

	private static boolean isPrime(int candidate) {
		if (isLeastRelevantMultipleOfNextLargerPrimeFactor(candidate)) {
			multiplesOfPrimeFactors.add(candidate);
			return false; 
		}
		return isNotMultipleOfAnyPreviousPrimeFactor(candidate); 
	}

	private static boolean isLeastRelevantMultipleOfNextLargerPrimeFactor(int candidate) {
		int nextLargerPrimeFactor = primes[multiplesOfPrimeFactors.size()];
		int leastRelevantMultiple = nextLargerPrimeFactor * nextLargerPrimeFactor; 
		return candidate == leastRelevantMultiple;
	}
	
	private static boolean isNotMultipleOfAnyPreviousPrimeFactor(int candidate) {
		for (int n = 1; n < multiplesOfPrimeFactors.size(); n++) {
			if (isMultipleOfNthPrimeFactor(candidate, n)) 
				return false;
		}
		return true; 
	}
	
	private static boolean isMultipleOfNthPrimeFactor(int candidate, int n) {
		return candidate == smallestOddNthMultipleNotLessThanCandidate(candidate, n);
	}
	
	private static int smallestOddNthMultipleNotLessThanCandidate(int candidate, int n) {
		int multiple = multiplesOfPrimeFactors.get(n); 
		while (multiple < candidate)
			multiple += 2 * primes[n]; 
		multiplesOfPrimeFactors.set(n, multiple); 
		return multiple;
	} 
}
````

일단 나누게 되니 프로그램이 길어졌다. 이는 서술적인 변수 이름 사용, 함수 선언, 클래스 선언, 공백 추가, 형식 변경 등의 이유 때문이다. 이렇게 바로 처음부터 재구현을 한 것이 아니다. 앞장에서 말한 TDD를 적용하여, 한번에 하나씩 수차례에 걸쳐 변경한 결과이다.

# 변경하기 쉬운 클래스

시스템은 변경이 불가피하다. 그리고 변경마다 의도대로 동작하지 않을 위험이 있다. 깨끗한 시스템은 클래스를 체계적으로 관리해 변경에 따르는 위험을 최대한 낮춘다.

````java
// 해당 코드는 새로운 SQL문을 지원할 때 손대야 하고, 기존 SQL문을 수정할 때도 손대야 하므로 SRP위반

public class Sql {
	public Sql(String table, Column[] columns)
	public String create()
	public String insert(Object[] fields)
	public String selectAll()
	public String findByKey(String keyColumn, String keyValue)
	public String select(Column column, String pattern)
	public String select(Criteria criteria)
	public String preparedInsert()
	private String columnList(Column[] columns)
	private String valuesList(Object[] fields, final Column[] columns) private String selectWithCriteria(String criteria)
	private String placeholderList(Column[] columns)
}
````

클래스 일부에서만 사용되는 비공개 메서드는 코드 개선의 잠재적인 여지가 있음을 보여준다. 분리하자.

````java
// 공개 인터페이스를 전부 SQL 클래스에서 파생하는 클래스로 만들고, 비공개 메서드는 해당 클래스로 옮기고,
// 공통된 인터페이스는 따로 클래스로 뺐다.
// 이렇게 하면 update문 추가 시에 기존의 클래스를 건드릴 이유가 없어진다.

	abstract public class Sql {
		public Sql(String table, Column[] columns) 
		abstract public String generate();
	}
	public class CreateSql extends Sql {
		public CreateSql(String table, Column[] columns) 
		@Override public String generate()
	}
	
	public class SelectSql extends Sql {
		public SelectSql(String table, Column[] columns) 
		@Override public String generate()
	}
	
	public class InsertSql extends Sql {
		public InsertSql(String table, Column[] columns, Object[] fields) 
		@Override public String generate()
		private String valuesList(Object[] fields, final Column[] columns)
	}
	
	public class SelectWithCriteriaSql extends Sql { 
		public SelectWithCriteriaSql(
		String table, Column[] columns, Criteria criteria) 
		@Override public String generate()
	}
	
	public class SelectWithMatchSql extends Sql { 
		public SelectWithMatchSql(String table, Column[] columns, Column column, String pattern) 
		@Override public String generate()
	}
	
	public class FindByKeySql extends Sql {
        public FindByKeySql(String table, Column[] columns, String keyColumn, String keyValue) 
		@Override public String generate()
	}
	
	public class PreparedInsertSql extends Sql {
		public PreparedInsertSql(String table, Column[] columns) 
		@Override public String generate()
		private String placeholderList(Column[] columns)
	}
	
	public class Where {
		public Where(String criteria) public String generate()
	}
	
	public class ColumnList {
		public ColumnList(Column[] columns) public String generate()
	}
````

잘 짜여진 시스템은 추가와 수정에 있어서 건드릴 코드가 최소이다. 확장하기 위해서는 interface를 채택하여 작업하면 되고, 수정은 특정 클래스만 손보면 된다. 

## 변경으로부터 격리

OOP입문에서 concrete 클래스와 abstract 클래스가 있는데, concrete 클래스에 의존(상세한 구현에 의존)하는 클라이언트 클래스는 구현이 바뀌면 위험에 빠진다. 그래서 인터페이스와 abstract 클래스를 사용해 구현이 미치는 영향을 격리시켜야 한다. 

상세한 구현에 의존하는 코드는 테스트가 어렵다. 추상화를 통해 테스트가 가능할 정도로 시스템의 결합도를 낮추게 되면 유연성과 재사용성도 높아진다. **결합도가 낮다는 말은 시스템의 각 요소가 다른 요소로부터, 그리고 변경으로부터 잘 격리되어 있다는 뜻이다.**

````java
// Portfolio 클래스를 구현하자, 그런데 이 클래스는 외부 TokyoStockExchange API를 사용해 포트폴리오 값을 계산한다.
// 따라서 API 특성 상 시세 변화에 영향을 많이 받아 5분마다 값이 달라지는데, 이때문에 테스트 코드를 짜기 쉽지 않다.
// 그러므로 Portfolio에서 외부 API를 직접 호출하는 대신 StockExchange라는 인터페이스를 생성한 후 메서드를 선언하다.

public interface StockExchange { 
	Money currentPrice(String symbol);
}
````

````java
// 이후 StockExchange 인터페이스를 구현하는 TokyoStockExchange 클래스를 구현한다.
// 그리고 Portfolio 생성자를 수정해 StockExchange 참조자를 인수로 받는다.

public Portfolio {
	private StockExchange exchange;
	public Portfolio(StockExchange exchange) {
		this.exchange = exchange; 
	}
	// ... 
}
````

````java
// 이제 TokyoStockExchange 클래스를 흉내내는 테스트용 클래스를 만들 수 있다.(FixedStockExchangeStub)
// 테스트용 클래스는 StockExchange 인터페이스를 구현하며 고정된 주가를 반환한다.
// 그럼으로써 무난히 테스트 코드를 작성 할 수 있다.

public class PortfolioTest {
	private FixedStockExchangeStub exchange;
	private Portfolio portfolio;
	
	@Before
	protected void setUp() throws Exception {
		exchange = new FixedStockExchangeStub(); 
		exchange.fix("MSFT", 100);
		portfolio = new Portfolio(exchange);
	}

	@Test
	public void GivenFiveMSFTTotalShouldBe500() throws Exception {
		portfolio.add(5, "MSFT");
		Assert.assertEquals(500, portfolio.value()); 
	}
}

````

외부에서 구현체를 넣어주는 방식을 통해, 구현체를 변경해서 넣어줄 수 있게 되었다. 상세 구현 클래스가 아닌 interface에 의존하기 때문에 어떻게 구현이 되어있는지 숨긴 상태로 동작이 가능하다.

# 요약

* 클래스는 하나의 책임을 가져야 한다.
* 응집도를 높게 유지하면 작은 클래스 여럿이 나온다.
* 작은 클래스 여럿이 큰 클래스 하나보다 낫다.
* 결합도를 낮게 유지하면 변경이 쉽고 격리된 클래스를 만들 수 있다.

# Reference

* [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin)
* [Yooii-Studios / Clean-Code](https://github.com/Yooii-Studios/Clean-Code)
* [Clean Code](https://book.interpark.com/product/BookDisplay.do?_method=detail&sc.prdNo=213656258&gclid=CjwKCAjw9-KTBhBcEiwAr19igynFiOxjFYKEJyaiyNEI4XXL1bFM78ki2cNQLMSxcUWU9XNks8eEThoCG6EQAvD_BwE)
* [zinc0214 / CleanCode](https://github.com/Yooii-Studios/Clean-Code)
* [wojteklu/clean_code.md](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
