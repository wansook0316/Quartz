---
title: Exception Part.01
thumbnail: ''
draft: false
tags:
- java
- oop
- exception
- try-catch
- finally
- garbage-collection
- rethrow
- error
created: 2023-09-29
---

개체 지향을 얘기하면 꼭 나오는 단어인 예외에 대해서 알아본다.

# Exception

* 사실 예외는 개체지향의 일부가 아니다.
* 시기적으로 비슷한 때 나왔고, 소수 진영에서 예외가 개체지향의 유일한 거라는 식으로 말하여 합쳐서 생각하게 됨

# try/catch/finally

````java
try {
    // 시도할 코드들
} catch (<예외 클래스 1> <변수명>) { // 하나 이상 있을 수 있음
    // 예외 처리 코드
} catch (<예외 클래스 2> <변수명>) {
    // 예외 처리 코드
} finally { // 생략 가능
    // 예외와 상관없이 항상 실행되는 코드
}
````

# catch와 예외 클래스(java)

* 특정 예외를 캐치할 수 있음
  * `IOException`: 입출력 관련 클래스들의 부모 클래스
    * `EOFException`, `FileNotFoundException` 등
  * `ArithmeticException`: 산술과 관련된 예외 (0나누기)
  * `IndexOutOfBoundsException`
* 특정하기 어렵다면 `Exception`클래스를 사용하면 다잡는다.
* 이렇게 동작하기 때문에, **부모 예외 클래스가 자식보다 먼저나오면 안된다.**
  * catch에서 순차적으로 처리하기 때문에 위에서 다 막혀버린다.

# finally 예

* Swift에서는 `defer`를 잘쓰면 되겠다. 

## C#

````c#
static void WriteByte(string path, byte b)
{
  FileStream fs = null;
  try
  {
    fs = File.Open(path, FileMode.Open);
    fs.WriteByte(b);
  }
  catch (IOException e)
  {
    Console.Error.WriteLine($"{e.Message");
    return;
  }
}
````

````c#
string path;
WriteByte(path, 67);
WriteByte(path, 67); // 예외 발생
````

* 특정 경로의 파일을 쓰는 동작을 하는 함수가 있다고 하자.
* 그런데, 같은 경로에 두번쓰려고 하면 예외가 발생한다.
* 파일을 닫지 않았기 때문!
* 그럼 항상 닫아줘야 겠네??

````c#
static void WriteByte(string path, byte b)
{
  FileStream fs = null;
  try
  {
    fs = File.Open(path, FileMode.Open);
    fs.WriteByte(b);
    fs.Close();
  }
  catch (IOException e)
  {
    Console.Error.WriteLine($"{e.Message");
    fs.Close();
    return;
  }
}
````

* 근데 이건 맞는가?
* 예외 발생시에도 파일에 써야하기 때문에 에러를 캐치하는 쪽에도 Close가 들어가야 한다.
* 뭔가 이상하다.
* 이렇게 되면 두번 호출시 `Open` 함수는 넘어갈 수 있지만, `WriteByte()` 함수에서 에러가 나버리면 곤란해진다.
* 만약 `IOException`말고 다른 예외가 발생하면 `Close`는 호출되지 않는다.
* 어떠한 상황에도 해당 함수가 호출된 후에는 무결한 상태를 보장해줘야 하는데, 그렇지 않게 되는 것.
* 즉, 무조건 이 함수 호출 후에는 다시 호출될 수 있도록 닫아주어야 한다.

````c#
static void WriteByte(string path, byte b)
{
    FileStream fs = null;
    try
    {
        fs = File.Open(path, FileMode.Open);
        fs.WriteByte(b);
    }
    catch (IOException e)
    {
        Console.Error.WriteLine($"{e.Message");
        return;
    }
    finally
    {
        if (fs != null)
        {
            fs.Close();
        }
    }
}
````

* 그래서 나온게 `finally`이다.
* 어느 경로를 타서 실행되도 무조건 실행되는 코드라 생각하면 된다.

## Java

* 당연히 자바에서도 같은 문제가 생길 소지가 있는 코드를 만들 수 있다.

````java
public void writeByte(String relativePath, byte b) {
    Path path = Paths.get(getClassPath(), relativePath);

    FileOutputStream out = null;
    try {
        out = new FileOutputStream(new File(path.toString()), true);
        out.write(b);
        out.close();
    } catch (IOException e) {
        e.printStackTrace();
        return;
    }
}
````

* 얘도 역시나 `write`시 에러나면 `close`안하고 나간다.
* 그런데 이녀석의 경우 닫지 않고 두번 호출해도 문제가 안생긴다. 왜?

### GC가 대신 닫아준다.

* 가비지 컬렉터가 참조되고 있지 않은 `FileOutputStream` 개체를 해제 시킨다.
  * GC는 `finalize()`를 호출하는데 이 안에서 `close()`를 호출한다.
* 그런데 그 시점이 명시적이지 않다. 즉 언제인지 모른다.
* GC 실행전에 리소스 한계치에 다다를 수도 있다.
  * 이러면 또 예외 발생
* **즉, 명시적으로 해야할 일을 하지 않는 것은 정도에서 벗어난다.**
  * **마법 같은 것에 의존하지 말자.**
* 그래서 **절대 저렇게 짜면 안된다.**
* 실제로도 Java 9부터 `finalize()`를 삭제할 예정이라 함
* 마법같은 것(언젠가 GC가 내가 닫지 않은 걸 닫아줄거야)에 의존하지 않는다.

### 올바른 예

````java
public void writeByte(String relativePath, byte b) {
    Path path = Paths.get(getClassPath(), relativePath);

    FileOutputStream out = null;
    try {
        out = new FileOutputStream(new File(path.toString()), true);
        out.write(b);
        out.close();
    } catch (IOException e) {
        e.printStackTrace();
        return;
    } finally {
        if out (out != null) {
            out.close();
        } catch (Exception e) {

        }
    }
}
````

# 정리 - 예외 발생시 진행 순서

1. `try` 블록 실행이 중단됨
1. `catch`블록 중에 발생한 예외를 처리할 수 있는 블록이 있는지 찾음
   * 위에서 부터 순차적임
   1. 찾은 경우
      * 해당 `catch` 블록 안의 코드들을 실행
      * `finally` 블록을 실행
      * `try` 블록이후의 다른 코드들이 실행됨
   1. 못찾은 경우
      * `finally`를 블록을 실행
      * 한 단계 높은 `try`블록으로 전달

# catch 블록에서 다시 예외 던지기 (rethrow)

````java
try {

} catch (IOException e) {
    // 내가 처리 안하고 위에서 처리하고 싶어
    throw e;

} catch (Exception e) {

} finally {

}
````

* 예외를 잡긴했는데, 상위에서 처리하게 하고 싶을 경우
* 단, 이때 call stack이 유지된 상태여야 함
  * 그래야 위쪽을 찾으러 갈 수 있지
  * 위로 던지다가 호출 트리를 잃어버릴 가능성도 있음
* 그렇기 때문에 이거 좋은 습관은 아님
  * 폭탄? 돌리기

# Custom Exception

````java
public final class UserNotFoundException extends RuntimeException {
    public UserNotFoundException() {
        super();
    }

    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
````

* class를 만들어야 함
* 상속 받아야 함
* `super` 호출한 것으로 보아 `RuntimeException`에도 같은 파라미터 받는 함수가 있을 것이란 것을 알 수 있음

````java
public static void main(String[] args) {
    db.findUser("wansik")
}

public User findUser(String username) {
    for (User user : users) {
        if (user.getUsername().equals(username)) {
            return user;
        }
    }

    throw new UserNotFoundException(username) // 에러를 생성해서 던짐
}
````

* 보통은 `RuntimeException`을 상속하여 사용한다고 함
* 하지만 C#과 같이 그냥 `Exception`을 상속하여 사용할 수도 있다고 함
  * 난 왜 이게 나아보이지
* 그런데 이렇게 될 경우 사용방법이 달라진다고 한다.

# 자바의 예외 분류

* 다른 언어의 예외와 다른점이 있는데, 예외 분류가 다르다는 것
* 역사적인 이유, 정신적인 이유
* 배경을 알아보자.

## 오류를 방치하면 일어나는 일 (Java)

* JVM 환경에서 도는 프로그램에서 발생한 예외를,
* 전혀 처리(catch)하지 않으면 어떻게 되는지 알아보자.

````java
public static void main() {
    program.divide(10, 0); // Exception in thread "main" java.lang.ArithmeticException: / by zero
}

public int divide(int num, int denom) {
    return num / denom;
}
````

* `main()`메서드까지 처리를 안해줄 경우 JVM이 오류를 띄우고 종료시킴
* 결국은 JVM까지 가서 종료시키기에 OS나 기계에는 아무 영향이 없다.
  * JVM은 OS위에 그냥 설치하는 프로그램

## 오류를 방치하면 일어나는 일 (C)

* 그럼 가상 머신도 없고 예외도 없는 옛날 언어는 어떻게 될까?
* 언제적 OS/기계를 쓰냐에 따라 좀 다르다.

## 아주 옛날 하드웨어/OS

* 한번에 프로그램 하나만 실행가능
* 따라서 하드웨어에 있는 메모리를 모든 프로그램이 공유한다!

1. CPU에서 0으로 나누려 함
1. CPU의 ALU(Arithmetic and Logical Unit)는 이를 처리할 수 없음
1. 하드웨어가 멈춤 (진짜 크래시..)
1. 기계 재부팅해야 함

## 요즘의 하드웨어

* 여러 프로그램이 동시에 실행됨
* 따라서 각 프로그램마다 별도의 메모리 공간(가상 메모리)를 제공
  * 실제 메모리는 8기가인데, 각각의 프로그램 역시 8기가를 사용할 수 있다고 할당해버림(가상)
  * 그 괴리를 운영체제에서 디스크에 둔다던가 하는 로직을 통해 해결함

1. CPU에서 0으로 나누려 함
1. CPU의 ALU(Arithmetic and Logical Unit)는 이를 처리할 수 없음
1. CPU에서 문제가 있다는 인터럽트를 보내줌
   * 이걸 프로그램에서 제대로 처리안해주면 크래시날 수 있음
1. OS가 해당 상황을 파악한뒤 프로그램을 종료하고 가상 메모리 해제함
   * 외부 프로그램에 영향을 주지 않음

# Reference

* [Pocu Academy](https://pocu.academy/ko)
* [What's the equivalent of finally in Swift](https://stackoverflow.com/questions/30974104/whats-the-equivalent-of-finally-in-swift)
