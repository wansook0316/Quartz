---
title: Error Handling
thumbnail: ''
draft: false
tags:
- error
- exception
- try-catch
- 'null'
created: 2023-09-21
---

깨끗한 코드와 오류 처리는 화실히 연관성이 있다. 하지만 **오류 처리로 인해 프로그램 논리를 이해하기 어려줘진다면 깨끗한 코드가 아니다.**

# 오류보다 예외를 사용하라

에전 프로그래밍 언어는 예외를 지원하지 않았다. 이 때문에, 오류를 처리하는 방식은 제한적일 수 밖에 없었다.

* error flag를 설정한다.
* error code를 리턴한다.
* 호출하는 측에서 예외처리를 한다.

이런 방식으로는 **예외 처리를 잊기 쉽게하고 논리가 섞이어 헷갈리기 쉽다.** 

````java
// Bad
public class DeviceController {
  ...
    public void sendShutDown() {
        DeviceHandle handle = getHandle(DEV1);
        // 디바이스 상태를 점검한다.
        if (handle != DeviceHandle.INVALID) {
            // 레코드 필드에 디바이스 상태를 저장한다.
            retrieveDeviceRecord(handle);
            // 디바이스 상태가 일시정지가 아니라면 종료한다.
            if (record.getStatus() != DEVICE_SUSPENDED) {
                pauseDevice(handle);
                clearDeviceWorkQueue(handle);
                closeDevice(handle);
            } else {
                logger.log("Device suspended. Unable to shut down");
            }
        } else {
        logger.log("Invalid handle for: " + DEV1.toString());
        }
    }
  ...
}
````

````java
// Good
public class DeviceController {
    ...
    public void sendShutDown() {
        try {
            tryToShutDown();
        } catch (DeviceShutDownError e) {
            logger.log(e);
        }
    }
        
    private void tryToShutDown() throws DeviceShutDownError {
        DeviceHandle handle = getHandle(DEV1);
        DeviceRecord record = retrieveDeviceRecord(handle);
        pauseDevice(handle); 
        clearDeviceWorkQueue(handle); 
        closeDevice(handle);
    }
    
    private DeviceHandle getHandle(DeviceID id) {
        ...
        throw new DeviceShutDownError("Invalid handle for: " + id.toString());
        ...
    }
    ...
}
````

예외를 호출하는 함수를 아예 분리하여 논리 읽기가 쉬워졌다. 디바이스를 종료하는 알고리즘 (`tryToShutDown()`)과 오류를 처리하는 알고리즘 `getHandle()`이 분리되었다.

# Try-Catch-Finally 문부터 작성하라

try-catch 문의 특징부터 살펴보자. 이녀석은 상당히 흥미로운 녀석이다. 그 이유는, try 블록안에 들어가는 코드를 실행하면 **어느 시점에든 실행을 중단한 후 catch 블록으로 넘어갈 수 있기 때문이다.** 이러한 특징은 곧 transection과 비슷한 점이라 할 수 있다. 어떤 try문이든지간에 상관없이 해당 블록안에서 일관된 상태로 유지할 수 있기 때문이다. 이 블록이 실행되기 전과 후에 나올 수 있는 결과가 제한된다.

````java
  // Step 1: StorageException을 던지지 않으므로 이 테스트는 실패한다.
  
@Test(expected = StorageException.class)
public void retrieveSectionShouldThrowOnInvalidFileName() {
    sectionStore.retrieveSection("invalid - file");
}
  
public List<RecordedGrip> retrieveSection(String sectionName) {
    // dummy return until we have a real implementation
    return new ArrayList<RecordedGrip>();
}
````

먼저, error를 발생하는지 테스트하기 위한 함수를 만들자. 그리고, 이 함수의 껍데기를 만들어서 해당 테스트가 실패하도록 만들자.

````java
// Step 2: 이제 테스트는 통과한다.
public List<RecordedGrip> retrieveSection(String sectionName) {
    try {
        FileInputStream stream = new FileInputStream(sectionName)
    } catch (Exception e) {
        throw new StorageException("retrieval error", e);
    }
    return new ArrayList<RecordedGrip>();
}
````

이제 실패한 테스트를 통과시키기 위해 내부 구현을 시도하자. throw를 던지기 때문에 이제 위의 test 함수는 통과한다.

````java
// Step 3: Exception의 범위를 FileNotFoundException으로 줄여 정확히 어떤 Exception이 발생한지 체크하자.
    public List<RecordedGrip> retrieveSection(String sectionName) {
    try {
        FileInputStream stream = new FileInputStream(sectionName);
        stream.close();
    } catch (FileNotFoundException e) {
        throw new StorageException("retrieval error", e);
    }
    return new ArrayList<RecordedGrip>();
}
````

마지막으로 에러의 범위를 줄이자. `FileNotFoundException`으로 범위를 줄였다. 이렇게 **강제로 예외를 일으키는 테스트 케이스를 작성한 후 테스트를 통과하는 방식으로 코드를 구성하게 되면 try 블록의 transection 범위내에서 구현하게 된다.** 결과적으로 **코드의 본질을 벗어나지 않도록 할 수 있다.**

# 미확인 에외를 사용하라

해당 단을 이해하기 위해서는 Checked Exception과 Unchecked Exception에 대한 정의부터 알고가야 한다.

||Checked Exception|Unchecked Exception|
|--|-----------------|-------------------|
|쉬운 이해|꼭 처리를 해줘야 하는 예외 <br> (로직적으로 처리를 해줘야 함)|꼭 처리하지 않아도 되는 예외 <br> (개발자 부주의)|
|확인 시점|컴파일 타임|런 타임|
|예외 발생시 트랜잭션 처리|Roll-back O|Roll-back X|
|에시|Exception 상속 하위 클래스 중 Runtime Exception을 제외한 녀석들 <br> - IOException <br> - SQLException|RuntimeException <br> - NullPointerException <br> - IndexOutOfBoundException <br> - SystemException|

예시를 보면 간단히 이해할 수 있다. 명확하게 에러를 처리해야 하는 경우를 Checked Exception, 개발자 부주의, system적으로 발생하는 예외등을 Unchecked Exception이라 한다.

이러한 맥락에서 저자는 어떠한 주장을 가지고 있을까? 이전 java에서 처음으로 Exception이 나왔을 때는 멋지다고 생각했다. 이 때문에, 메서드가 반환하는 예외를 모두 열거하는 방식을 사용했다. 하지만 **안정적인 소프트웨어를 제작하는 요소로 Checked Exception이 반드시 필요하지는 않다는 사실이 분명해졌다.** 오히려 우리가 생각해야 하는 것은 **Checked exception을 처리하기 위해 치르는 비용을 생각해보아야 한다.**

어떤 비용이 드는지 생각해보자.

null

1. 특정 메소드에서 checked exception을 throw하고
1. 3단계(메소드 콜) 위의 메소드에서 그 exception을 catch한다면
1. 모든 중간단계 메소드에 exception을 정의해야 한다.(자바의 경우 메소드 선언에 throws 구문을 붙이는 등)

이는 연쇄적인 수정을 해야하기 때문에 **OCP(Open Closed Principle)을 위반**한다. 상위 레벨 메소드에서 하위 레벨 메소드의 디테일에 대해 알아야 하기 때문에 **캡슐화도 깨진다.** 

# 예외에 의미를 제공하라

호출 스택이 이러한 맥락을 제공하기는 하지만, 이 정도를 불충분하다. 에외가 발생한 이유와 좀 더 구체적인 Exception Type을 통해 이해하기 편하도록 해라.

# 호출자를 고려해 예외 클래스를 정의하라

Exception class를 만들 때 가장 중요한 것은 "어떤 방식으로 예외를 처리할까"이다. 이 과정에서 Third Party library를 사용하고, 여기서 던지는 에러를 처리해야 한다면, **wrapping 하여 관리하는 것이 좋다.**

1. 라이브러리 교체 등의 변경에 대응하기 쉽다.
1. 라이브러리 쓰는 곳을 테스트하는 경우, 해당 라이브러리를 가짜로 만들어 테스트하기 쉬워진다.
1. 라이브러리의 API 디자인에 관계없이 내 프로그램에 맞도록 정제하여 사용할 수 있다.

````java
// Bad
// catch문의 내용이 거의 같다. 중복이 많다.

ACMEPort port = new ACMEPort(12);
try {
    port.open();
} catch (DeviceResponseException e) {
    reportPortError(e);
    logger.log("Device response exception", e);
} catch (ATM1212UnlockedException e) {
    reportPortError(e);
    logger.log("Unlock exception", e);
} catch (GMXError e) {
    reportPortError(e);
    logger.log("Device response exception");
} finally {
    ...
}
````

````java
// Good
// ACME 클래스를 LocalPort 클래스로 래핑해 new ACMEPort().open() 메소드에서 던질 수 있는 exception들을 간략화
  
LocalPort port = new LocalPort(12);
try {
    port.open();
} catch (PortDeviceFailure e) {
    reportError(e);
    logger.log(e.getMessage(), e);
} finally {
    ... 
}
  
public class LocalPort {
    private ACMEPort innerPort;
    public LocalPort(int portNumber) {
        innerPort = new ACMEPort(portNumber);
    }
    
    public void open() {
        try {
            innerPort.open();
        } catch (DeviceResponseException e) {
            throw new PortDeviceFailure(e);
        } catch (ATM1212UnlockedException e) {
            throw new PortDeviceFailure(e);
        } catch (GMXError e) {
            throw new PortDeviceFailure(e);
        }
    }
    ...
}
````

# 정상 흐름을 정의하라

지금까지 본 방식으로 예외처리를 하게되면 깔끔한 코드를 보장할 수 있다. 하지만 catch문에서 예외적인 상황을 처리하는 경우 오히려 더러워진다. 정말 예외인지 기본로직에 편입해야 하는지 판단하는 습관을 가져야 한다.

````java
// Bad
try {
    MealExpenses expenses = expenseReportDAO.getMeals(employee.getID());
    m_total += expenses.getTotal();
} catch(MealExpensesNotFound e) {
    m_total += getMealPerDiem();
}
````

코드를 부르는 입장에서 예외를 처리해야 하는 상황을 신경써야 한다. 아래와 같이 **캡슐화를 한다면 신경쓸 필요가 없어진다.**

````java
// Good

// caller logic.
...
MealExpenses expenses = expenseReportDAO.getMeals(employee.getID());
m_total += expenses.getTotal();
...

public class PerDiemMealExpenses implements MealExpenses {
    public int getTotal() {
    // return the per diem default
    }
}

// 이해를 돕기 위해 직접 추가한 클래스
public class ExpenseReportDAO {
    ...
    public MealExpenses getMeals(int employeeId) {
    MealExpenses expenses;
    try {
        expenses = expenseReportDAO.getMeals(employee.getID());
    } catch(MealExpensesNotFound e) {
        expenses = new PerDiemMealExpenses();
    }
    
    return expenses;
    }
    ...
}
````

# null을 반환하지 마라

null을 리턴하고 싶은 생각이 들면 **위에서 설명한 special case object를 리턴하자.** **third party 라이브러리에서 null을 리턴할 가능성이 있다면 Exception을 던지는 방향으로 처리하거나 special case object를 리턴하는 메서드로 래핑**하자.

````java
// BAD!!!!

public void registerItem(Item item) {
    if (item != null) {
    ItemRegistry registry = peristentStore.getItemRegistry();
    if (registry != null) {
        Item existing = registry.getItem(item.getID());
        if (existing.getBillingPeriod().hasRetailOwner()) {
        existing.register(item);
        }
    }
    }
}

````

여기서 null 체크를 못한 부분에서 문제가 생긴다면 찾기가 너무 힘들다. 당장 위에만 보아도 peristentStore가 null인 경우에 대한 예외처리가 안된다!! 만약에 null인 상태로 아래 로직을 따라간다면 어떻게 될까? NullPointerException가 발생할 거고 이를 처리해줘야 한다.어디서 해줄까? 수십단계 위의 메소드에서 처리해줘야 하나? 이 메소드의 문제점은 null 체크가 부족한게 아니라 null체크가 너무 많다는 것이다.

````java
// Good
List<Employee> employees = getEmployees();
for(Employee e : employees) {
    totalPay += e.getPay();
}

public List<Employee> getEmployees() {
    if( .. there are no employees .. )
    return Collections.emptyList();
    }
}
````

# null을 전달하지 마라

**null을 반환하는 것도 나쁘지만, null을 메서드로 넘기는 것은 더 나쁘다.** null을 메서드의 파라미터로 넣어야 하는 API를 사용하는 경우가 아니면 null을 메서드로 넘기지 말자. 대다수의 프로그래밍 언어들은 파라미터로 들어온 null에 대해 적절한 방법을 제공하지 못한다. 예시를 보면 이해가 가능하다.

````java
// Bad
// calculator.xProjection(null, new Point(12, 13));
// 위와 같이 부를 경우 NullPointerException 발생
public class MetricsCalculator {
  public double xProjection(Point p1, Point p2) {
    return (p2.x – p1.x) * 1.5;
  }
  ...
}

// Bad
// NullPointerException은 안나지만 윗단계에서 InvalidArgumentException이 발생할 경우 처리해줘야 함.
public class MetricsCalculator {
  public double xProjection(Point p1, Point p2) {
    if(p1 == null || p2 == null){
      throw InvalidArgumentException("Invalid argument for MetricsCalculator.xProjection");
    }
    return (p2.x – p1.x) * 1.5;
  }
}

// Bad
// 좋은 명세이지만 첫번째 예시와 같이 NullPointerException 문제를 해결하지 못한다.
public class MetricsCalculator {
  public double xProjection(Point p1, Point p2) {
    assert p1 != null : "p1 should not be null";
    assert p2 != null : "p2 should not be null";
    
    return (p2.x – p1.x) * 1.5;
  }
}
````

# 결론

 > 
 > 깨끗한 코드는 읽기도 좋아야 하지만, 안정성도 높아야 한다. 이 두개는 Trade-Off가 아니다.

* Exception을 활용하자.
* Try-Catch문을 먼저 작성하고 로직을 넣자.
* 지나친 unchecked exception은 좋지 않다.
* Exception을 사용할 시, 이유와 Type을 구체적으로 적어라.
* 사용에 맞게(third party library) Exception을 wrapping하라.
* Exception을 남발하기보다 정상적인 상황을 정의하여 처리할 수 있다면 그렇게 하라.
* Null은 리턴하지도, 넘기지도 마라.

# Reference

* [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin)
* [Yooii-Studios / Clean-Code](https://github.com/Yooii-Studios/Clean-Code)
* [Clean Code](https://book.interpark.com/product/BookDisplay.do?_method=detail&sc.prdNo=213656258&gclid=CjwKCAjw9-KTBhBcEiwAr19igynFiOxjFYKEJyaiyNEI4XXL1bFM78ki2cNQLMSxcUWU9XNks8eEThoCG6EQAvD_BwE)
* [zinc0214 / CleanCode](https://github.com/Yooii-Studios/Clean-Code)
* [wojteklu/clean_code.md](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
* [Java 예외 처리에 대한 작은 생각](https://www.nextree.co.kr/p3239/)
