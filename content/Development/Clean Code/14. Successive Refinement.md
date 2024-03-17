---
title: Successive Refinement
thumbnail: ''
draft: false
tags:
- java
- clean-code
created: 2023-09-21
---

해당 부분은 너무 코드가 많아, 이전 상태와 이후 상태를 놓고 그 사이에서 저자가 어떠한 흐름으로 이를 처리했는지 간략하게 정리하는 것을 목적으로 한다.

# Intro

해당 부분에서는 출발은 좋았으나, 확장서잉 부족했던 모듈을 소개한다. 그 다음, 이를 개선하고 정리하는 단계를 순차적으로 알아볼 예정이다.

다음의 코드는 명령행 인수의 구문을 분석하는 클래스 `Args`다. 다음과 같이 사용할 수 있다.

````java
public static void main(String[] args) {
    try {
        Args arg = new Args("l,p#,d*", args); // 형식 설정: Bool, Int, String, args 인수로 넘김
        boolean logging = arg.getBoolean('l'); // arg로 파싱된 값을 받아 변수 이름으로 의미 부여
        int port = arg.getInt('p');
        String directory = arg.getString('d');
        executeApplication(logging, port, directory);
    } catch (ArgsException e) {
        System.out.print("Argument error: %s\n", e.errorMessage());
    }
}
````

ArgsException이 발생하지 않는다면 명령행 인수의 구문을 성공적으로 분석했으며 Args 인스턴스에 질의를 던져도 좋다는 말이다. 인수 값을 가져오기 위해 `get~()` 등의 메서드를 사용한다.

# Args 구현

이제 해당 클래스를 어떻게 구현했는지 적어보겠다. 이름, 함수 크기, 코드 형식에 주목하며 읽는다.

## Args.java

````java
package com.objectmentor.utilities.args;

import static com.objectmentor.utilities.args.ArgsException.ErrorCode.*; 
import java.util.*;

public class Args {
    private Map<Character, ArgumentMarshaler> marshalers;
    private Set<Character> argsFound;
    private ListIterator<String> currentArgument;
    
    public Args(String schema, String[] args) throws ArgsException { 
        marshalers = new HashMap<Character, ArgumentMarshaler>(); 
        argsFound = new HashSet<Character>();
        
        parseSchema(schema); // 1️⃣
        parseArgumentStrings(Arrays.asList(args)); // 2️⃣
    }
    
    // 1️⃣
    private void parseSchema(String schema) throws ArgsException { 
        for (String element : schema.split(","))
        if (element.length() > 0) 
            parseSchemaElement(element.trim());
    }
    
    private void parseSchemaElement(String element) throws ArgsException { 
        char elementId = element.charAt(0);
        String elementTail = element.substring(1); validateSchemaElementId(elementId);
        if (elementTail.length() == 0)
            marshalers.put(elementId, new BooleanArgumentMarshaler());
        else if (elementTail.equals("*")) 
            marshalers.put(elementId, new StringArgumentMarshaler());
        else if (elementTail.equals("#"))
            marshalers.put(elementId, new IntegerArgumentMarshaler());
        else if (elementTail.equals("##")) 
            marshalers.put(elementId, new DoubleArgumentMarshaler());
        else if (elementTail.equals("[*]"))
            marshalers.put(elementId, new StringArrayArgumentMarshaler());
        else
            throw new ArgsException(INVALID_ARGUMENT_FORMAT, elementId, elementTail);
    }
    
    private void validateSchemaElementId(char elementId) throws ArgsException { 
        if (!Character.isLetter(elementId))
        throw new ArgsException(INVALID_ARGUMENT_NAME, elementId, null); 
    }
    
    // 2️⃣
    private void parseArgumentStrings(List<String> argsList) throws ArgsException {
        for (currentArgument = argsList.listIterator(); currentArgument.hasNext();) {
            String argString = currentArgument.next(); 
            if (argString.startsWith("-")) {
                parseArgumentCharacters(argString.substring(1)); 
            } else {
                currentArgument.previous();
                break; 
            }
        } 
    }
    
    private void parseArgumentCharacters(String argChars) throws ArgsException { 
        for (int i = 0; i < argChars.length(); i++)
        parseArgumentCharacter(argChars.charAt(i)); 
    }
    
    private void parseArgumentCharacter(char argChar) throws ArgsException { 
        ArgumentMarshaler m = marshalers.get(argChar);
            if (m == null) {
                throw new ArgsException(UNEXPECTED_ARGUMENT, argChar, null); 
            } else {
                argsFound.add(argChar); 
            try {
                m.set(currentArgument); 
            } catch (ArgsException e) {
                e.setErrorArgumentId(argChar);
                throw e; 
            }
        } 
    }
    
    public boolean has(char arg) { 
        return argsFound.contains(arg);
    }
    
    public int nextArgument() {
        return currentArgument.nextIndex();
    }
    
    public boolean getBoolean(char arg) {
        return BooleanArgumentMarshaler.getValue(marshalers.get(arg));
    }
    
    public String getString(char arg) {
        return StringArgumentMarshaler.getValue(marshalers.get(arg));
    }
    
    public int getInt(char arg) {
        return IntegerArgumentMarshaler.getValue(marshalers.get(arg));
    }
    
    public double getDouble(char arg) {
        return DoubleArgumentMarshaler.getValue(marshalers.get(arg));
    }
    
    public String[] getStringArray(char arg) {
        return StringArrayArgumentMarshaler.getValue(marshalers.get(arg));
    } 
}

````

위에서 아래로 코드가 물 흐르듯 읽힌다. 바깥쪽에서 사용하는 method는 최상단에 위치해있고, 아래로 내려갈 수록 구체적인 구현이 나열되어 있다. 한 가지 먼저 읽어볼 코드가 있다면 `ArgumentMarshaler` 정의이다. 아래에 정의되어 있는 `ArgumentMarshaler`가 따르는 interface이다.

## ArgumentMarshaler.java

````java
public interface ArgumentMarshaler {
    void set(Iterator<String> currentArgument) throws ArgsException;
}
````

### BooleanArgumentMarshaler.java

````java
public class BooleanArgumentMarshaler implements ArgumentMarshaler { 
    private boolean booleanValue = false;
    
    public void set(Iterator<String> currentArgument) throws ArgsException { 
        booleanValue = true;
    }
    
    public static boolean getValue(ArgumentMarshaler am) {
        if (am != null && am instanceof BooleanArgumentMarshaler)
            return ((BooleanArgumentMarshaler) am).booleanValue; 
        else
            return false; 
    }
}
````

### StringArgumentMarshaler.java

````java
import static com.objectmentor.utilities.args.ArgsException.ErrorCode.*;

public class StringArgumentMarshaler implements ArgumentMarshaler { 
    private String stringValue = "";
    
    public void set(Iterator<String> currentArgument) throws ArgsException { 
        try {
            stringValue = currentArgument.next(); 
        } catch (NoSuchElementException e) {
            throw new ArgsException(MISSING_STRING); 
        }
    }
    
    public static String getValue(ArgumentMarshaler am) {
        if (am != null && am instanceof StringArgumentMarshaler)
            return ((StringArgumentMarshaler) am).stringValue; 
        else
            return ""; 
    }
}
````

### IntegerArgumentMarshaler.java

````java
import static com.objectmentor.utilities.args.ArgsException.ErrorCode.*;

public class IntegerArgumentMarshaler implements ArgumentMarshaler { 
    private int intValue = 0;
    
    public void set(Iterator<String> currentArgument) throws ArgsException { 
        String parameter = null;
        try {
            parameter = currentArgument.next();
            intValue = Integer.parseInt(parameter);
        } catch (NoSuchElementException e) {
            throw new ArgsException(MISSING_INTEGER);
        } catch (NumberFormatException e) {
            throw new ArgsException(INVALID_INTEGER, parameter); 
        }
    }
    
    public static int getValue(ArgumentMarshaler am) {
        if (am != null && am instanceof IntegerArgumentMarshaler)
            return ((IntegerArgumentMarshaler) am).intValue; 
        else
            return 0; 
    }
}
````

`DoubleArgumentMarshaler`, `StringArrayArgumentMarshaler`는 패턴이 같아 생략한다. 해당 코드를 보다가 의문이 드는 것이 하나 있다면, 바로 Error 처리이다.

### ArgsException.java

````java
import static com.objectmentor.utilities.args.ArgsException.ErrorCode.*;

public class ArgsException extends Exception { 
    private char errorArgumentId = '\0'; 
    private String errorParameter = null; 
    private ErrorCode errorCode = OK;
    
    public ArgsException() {}
    
    public ArgsException(String message) {super(message);}
    
    public ArgsException(ErrorCode errorCode) { 
        this.errorCode = errorCode;
    }
    
    public ArgsException(ErrorCode errorCode, String errorParameter) { 
        this.errorCode = errorCode;
        this.errorParameter = errorParameter;
    }
    
    public ArgsException(ErrorCode errorCode, char errorArgumentId, String errorParameter) {
        this.errorCode = errorCode; 
        this.errorParameter = errorParameter; 
        this.errorArgumentId = errorArgumentId;
    }
    
    public char getErrorArgumentId() { 
        return errorArgumentId;
    }
    
    public void setErrorArgumentId(char errorArgumentId) { 
        this.errorArgumentId = errorArgumentId;
    }
    
    public String getErrorParameter() { 
        return errorParameter;
    }
    
    public void setErrorParameter(String errorParameter) { 
        this.errorParameter = errorParameter;
    }
    
    public ErrorCode getErrorCode() { 
        return errorCode;
    }
    
    public void setErrorCode(ErrorCode errorCode) { 
        this.errorCode = errorCode;
    }
    
    public String errorMessage() { 
        switch (errorCode) {
        case OK:
            return "TILT: Should not get here.";
        case UNEXPECTED_ARGUMENT:
            return String.format("Argument -%c unexpected.", errorArgumentId);
        case MISSING_STRING:
            return String.format("Could not find string parameter for -%c.", errorArgumentId);
        case INVALID_INTEGER:
            return String.format("Argument -%c expects an integer but was '%s'.", errorArgumentId, errorParameter);
        case MISSING_INTEGER:
            return String.format("Could not find integer parameter for -%c.", errorArgumentId);
        case INVALID_DOUBLE:
            return String.format("Argument -%c expects a double but was '%s'.", errorArgumentId, errorParameter);
        case MISSING_DOUBLE:
            return String.format("Could not find double parameter for -%c.", errorArgumentId); 
        case INVALID_ARGUMENT_NAME:
            return String.format("'%c' is not a valid argument name.", errorArgumentId);
        case INVALID_ARGUMENT_FORMAT:
            return String.format("'%s' is not a valid argument format.", errorParameter);
        }
        return ""; 
    }
    
    public enum ErrorCode {
        OK, INVALID_ARGUMENT_FORMAT, UNEXPECTED_ARGUMENT, INVALID_ARGUMENT_NAME, 
        MISSING_STRING, MISSING_INTEGER, INVALID_INTEGER, MISSING_DOUBLE, INVALID_DOUBLE
    }
}
````

# 정리

굉장히 단순한 개념임에도 불구하고 코드가 많이 필요하다. 이를 정적 타입 언어인 자바를 사용해서 이다. (Swift는 더할지도) 하지만 읽어보면 알겠지만 굉장히 구조도 깔끔하고 잘짜인 프로그램이다.

인수 유형을 추가하기 위해서는 `ArgumentMarshaler` 를 채택하여 get 함수를 추가하고, `parseSchemaElement` 함수에 case 하나만 추가하면 된다.

## 어떻게 짰느냐고?

처음부터 이렇게 구현할 수 있었을까? 아니다. 점진적으로 개선했다. **프로그래밍은 과학보다 공예(craft)에 가깝다. 깨끗한 코드를 짜려면 먼저 지저분한 코드를 짠 뒤에 정리해야 한다는 의미이다.**

대다수의 신참 프로그래머는 (대다수 초딩과 마찬가지로) 이 충고를 충실히 따르지 않는다. 그들은 무조건 돌아가는 프로그램을 목표로 잡는다. 일단 프로그램이 '돌아가면' 다음 업무로 넘어간다. '돌아가는' 프로그램은 그 상태가 어떻든 그대로 버려둔다. **경험이 풍부한 전문 프로그래머라면 이런 행동이 전문가로서 자살 행위라는 사실을 잘 안다.**

# Args: 1차 초안

그럼 처음의 이 코드가 어땠는지 확인해보자.

````java
import java.text.ParseException; 
import java.util.*;

public class Args {
    private String schema;
    private String[] args;
    private boolean valid = true;
    private Set<Character> unexpectedArguments = new TreeSet<Character>(); 
    private Map<Character, Boolean> booleanArgs = new HashMap<Character, Boolean>();
    private Map<Character, String> stringArgs = new HashMap<Character, String>(); 
    private Map<Character, Integer> intArgs = new HashMap<Character, Integer>(); 
    private Set<Character> argsFound = new HashSet<Character>();
    private int currentArgument;
    private char errorArgumentId = '\0';
    private String errorParameter = "TILT";
    private ErrorCode errorCode = ErrorCode.OK;
    
    private enum ErrorCode {
        OK, MISSING_STRING, MISSING_INTEGER, INVALID_INTEGER, UNEXPECTED_ARGUMENT}
        
    public Args(String schema, String[] args) throws ParseException { 
        this.schema = schema;
        this.args = args;
        valid = parse();
    }
    
    private boolean parse() throws ParseException { 
        if (schema.length() == 0 && args.length == 0)
            return true; 
            parseSchema(); 
        try {
            parseArguments();
        } catch (ArgsException e) {

        }
        return valid;
    }
    
    private boolean parseSchema() throws ParseException { 
        for (String element : schema.split(",")) {
            if (element.length() > 0) {
                String trimmedElement = element.trim(); 
                parseSchemaElement(trimmedElement);
            } 
        }
        return true; 
    }
    
    private void parseSchemaElement(String element) throws ParseException { 
        char elementId = element.charAt(0);
        String elementTail = element.substring(1); 
        validateSchemaElementId(elementId);
        if (isBooleanSchemaElement(elementTail)) 
            parseBooleanSchemaElement(elementId);
        else if (isStringSchemaElement(elementTail)) 
            parseStringSchemaElement(elementId);
        else if (isIntegerSchemaElement(elementTail)) 
            parseIntegerSchemaElement(elementId);
        else
            throw new ParseException(String.format("Argument: %c has invalid format: %s.", elementId, elementTail), 0);
        } 
    }
        
    private void validateSchemaElementId(char elementId) throws ParseException { 
        if (!Character.isLetter(elementId)) {
            throw new ParseException("Bad character:" + elementId + "in Args format: " + schema, 0);
        }
    }
    
    private void parseBooleanSchemaElement(char elementId) { 
        booleanArgs.put(elementId, false);
    }
    
    private void parseIntegerSchemaElement(char elementId) { 
        intArgs.put(elementId, 0);
    }
    
    private void parseStringSchemaElement(char elementId) { 
        stringArgs.put(elementId, "");
    }
    
    private boolean isStringSchemaElement(String elementTail) { 
        return elementTail.equals("*");
    }
    
    private boolean isBooleanSchemaElement(String elementTail) { 
        return elementTail.length() == 0;
    }
    
    private boolean isIntegerSchemaElement(String elementTail) { 
        return elementTail.equals("#");
    }
    
    private boolean parseArguments() throws ArgsException {
        for (currentArgument = 0; currentArgument < args.length; currentArgument++) {
            String arg = args[currentArgument];
            parseArgument(arg); 
        }
        return true; 
    }
    
    private void parseArgument(String arg) throws ArgsException { 
        if (arg.startsWith("-"))
            parseElements(arg); 
    }
    
    private void parseElements(String arg) throws ArgsException { 
        for (int i = 1; i < arg.length(); i++)
            parseElement(arg.charAt(i)); 
    }
    
    private void parseElement(char argChar) throws ArgsException { 
        if (setArgument(argChar))
            argsFound.add(argChar); 
        else 
            unexpectedArguments.add(argChar); 
            errorCode = ErrorCode.UNEXPECTED_ARGUMENT; 
            valid = false;
    }
    
    private boolean setArgument(char argChar) throws ArgsException { 
        if (isBooleanArg(argChar))
            setBooleanArg(argChar, true); 
        else if (isStringArg(argChar))
            setStringArg(argChar); 
        else if (isIntArg(argChar))
            setIntArg(argChar); 
        else
            return false;
        
        return true; 
    }
    
    private boolean isIntArg(char argChar) {
        return intArgs.containsKey(argChar);
    }
    
    private void setIntArg(char argChar) throws ArgsException { 
        currentArgument++;
        String parameter = null;
        try {
            parameter = args[currentArgument];
            intArgs.put(argChar, new Integer(parameter)); 
        } catch (ArrayIndexOutOfBoundsException e) {
            valid = false;
            errorArgumentId = argChar;
            errorCode = ErrorCode.MISSING_INTEGER;
            throw new ArgsException();
        } catch (NumberFormatException e) {
            valid = false;
            errorArgumentId = argChar; 
            errorParameter = parameter;
            errorCode = ErrorCode.INVALID_INTEGER; 
            throw new ArgsException();
        } 
    }
    
    private void setStringArg(char argChar) throws ArgsException { 
        currentArgument++;
        try {
            stringArgs.put(argChar, args[currentArgument]); 
        } catch (ArrayIndexOutOfBoundsException e) {
            valid = false;
            errorArgumentId = argChar;
            errorCode = ErrorCode.MISSING_STRING; 
            throw new ArgsException();
        } 
    }
    
    private boolean isStringArg(char argChar) { 
        return stringArgs.containsKey(argChar);
    }
    
    private void setBooleanArg(char argChar, boolean value) { 
        booleanArgs.put(argChar, value);
    }
    
    private boolean isBooleanArg(char argChar) { 
        return booleanArgs.containsKey(argChar);
    }
    
    public int cardinality() { 
        return argsFound.size();
    }
    
    public String usage() { 
        if (schema.length() > 0)
            return "-[" + schema + "]"; 
        else
            return ""; 
    }
    
    public String errorMessage() throws Exception { 
        switch (errorCode) {
        case OK:
            throw new Exception("TILT: Should not get here.");
        case UNEXPECTED_ARGUMENT:
            return unexpectedArgumentMessage();
        case MISSING_STRING:
            return String.format("Could not find string parameter for -%c.", errorArgumentId);
        case INVALID_INTEGER:
            return String.format("Argument -%c expects an integer but was '%s'.", errorArgumentId, errorParameter);
        case MISSING_INTEGER:
            return String.format("Could not find integer parameter for -%c.", errorArgumentId);
        }
        return ""; 
    }
    
    private String unexpectedArgumentMessage() {
        StringBuffer message = new StringBuffer("Argument(s) -"); 
        for (char c : unexpectedArguments) {
            message.append(c); 
        }
        message.append(" unexpected.");
        
        return message.toString(); 
    }
    
    private boolean falseIfNull(Boolean b) { 
        return b != null && b;
    }
    
    private int zeroIfNull(Integer i) { 
        return i == null ? 0 : i;
    }
    
    private String blankIfNull(String s) { 
        return s == null ? "" : s;
    }
    
    public String getString(char arg) { 
        return blankIfNull(stringArgs.get(arg));
    }
    
    public int getInt(char arg) {
        return zeroIfNull(intArgs.get(arg));
    }
    
    public boolean getBoolean(char arg) { 
        return falseIfNull(booleanArgs.get(arg));
    }
    
    public boolean has(char arg) { 
        return argsFound.contains(arg);
    }
    
    public boolean isValid() { 
        return valid;
    }
    
    private class ArgsException extends Exception {
    } 
}
````

이런 코드를 처음부터 의도한 것은 아니었다. 함수 이름이나 변수 이름을 선택한 방식, 어설프지만 나름대로 구조가 있다는 사실 등이 노력의 증거다. 하지만 어느 순간 프로그램은 내 손을 벗어났다. 첫 버전이던 Boolean 인수만 지원하던 초기 버전에서 String과 Integer 인수 유형을 추가하면서 부터 재앙이 시작됐다.

## 그래서 멈췄다

추가할 인수 유형이 적어도 두 개는 더 있었지만, 이 상태에서 추가하면 코드가 더 나빠질 것이라는 사실이 자명했다. 계속 밀어붙이면 프로그램은 어떻게든 완성하겠지만 그랬다가는 너무 커서 손대기 어려운 골칫거리가 생겨날 참이었다. 코드 구조를 유지보수하기 좋은 상태로 만들려면 지금이 적기라 판단했다.

이런 타이밍은 사실 우리가 코드를 짜면서도 은연중에 느끼는 포인트이다. **즉, 지금했던 방식을 고집했을 때 얻는 효용보다, 좋은 구조를 선택하여 진행했을 때 얻는 효용이 크다고 직관적으로 느끼는 지점이다.** 리팩토링을 하면서는 코드를 작성하면서 느꼈던 점을 정리했다.

1. 인수 유형을 추가하면서, 새 인수 유형을 추가하기 위해서는 주요 지점 세곳에 코드를 추가해야 한다는 사실을 알았다.
1. 명령행 인수에서 인수 유형을 분석해서 진짜 유형으로 변경해야 한다.
1. get~ 메서드를 통해 진짜 유형을 반환한다.

이러한 조건을 기반으로 `ArgumentMarshaler`라는 개념을 만들었다.

## 점진적으로 개선하다

**프로그램을 망치는 가장 좋은 방법 중 하나는 개선이라는 이름 아래 구조를 크게 뒤집는 행위다.** 이러한 점에서 TDD를 사용했다. 즉, 언제라도 시스템이 돌아가야 한다는 원칙을 적용하기 위한 의지다.

변경 전후의 시스템의 오작동 여부를 검증하기 위해서는 언제든 실행이 가능한 Test Suit가 필요하다. 이를 위해 현재 Class의 동작을 확인할 수 있는 test case를 만들어 놓았다. 이 코드들을 통과한다면 올바로 동작한다고 봐도 무방했다.

이 다음에야 시스템에 변경을 가하기 시작했다. 먼저, `ArgumentMarshaler`의 골격을 추가했다.

````java
private class ArgumentMarshaler { 
    private boolean booleanValue = false;

    public void setBoolean(boolean value) { 
        booleanValue = value;
    }
    
    public boolean getBoolean() {return booleanValue;} 
}

private class BooleanArgumentMarshaler extends ArgumentMarshaler { }
private class StringArgumentMarshaler extends ArgumentMarshaler { }
private class IntegerArgumentMarshaler extends ArgumentMarshaler { }
````

그 다음으로

````java
// AS-IS

public class Args {
    private Map<Character, Boolean> booleanArgs = new HashMap<Character, Boolean>();

    ... 

    private void parseBooleanSchemaElement(char elementId) { 
        booleanArgs.put(elementId, false);
    }

    ...

    private void setBooleanArg(char argChar, boolean value) { 
        booleanArgs.put(argChar, value);
    }

    ...

    public boolean getBoolean(char arg) { 
        return falseIfNull(booleanArgs.get(arg));
    }
}

// TO-BE
public class Args {
    private Map<Character, ArgumentMarshaler> boolean booleanArgs = new HashMap<Character, ArgumentMarshaler>();

    ... 

    private void parseBooleanSchemaElement(char elementId) {
        booleanArgs.put(elementId, new BooleanArgumentMarshaler());
    }
    
    ...

    private void setBooleanArg(char argChar, boolean value) {
        booleanArgs.get(argChar).setBoolean(value);
    }
    
    ...

    public boolean getBoolean(char arg) {
        Args.ArgumentMarshaler am = booleanArgs.get(arg);
        return am != null && am.getBoolean();
    }
}
````

# String 인수

처음 Bool이 통과했다면 String 처리는 간단하다. 유사하게 처리해주면 된다. `parse~`, `set~`, `get~` 함수를 새로 만든 `ArguementMarshaler`를 구현한 `StringArguementMarshaler`로 태체하자.

이렇게 유사한 부분을 찾아서 구현을 완료했다면 다음 문제는 Exception이다. Exception은 정말 꼴봬기 싫은 코드이다. 잘 살펴보면, Exception 코드는 Args에 속하지 않는 코드이다. 그렇기 때문에 이 모든 예외를 한데로 모아 Args 모듈과 완벽하게 분리시키자. 이렇게 해서 위의 코드가 나오게 되었다.

# 결론

그저 돌아가는 코드만으로는 부족하다. 단순히 돌아가는 코드에 만족하는 프로그래머는 전문가 정신이 부족하다. **나쁜 코드만큼 지배적으로 개발 프로젝트에 악영향을 미치는 요인도 없다.** 나쁜 일정은 다시 짜면 된다. 나쁜 요구사항은 다시 정의하면 된다. 나쁜 팀 역학은 복구하면 된다. 하지만 나쁜 코드는 썩어 문드러진다. 점점 무게가 늘어가 발목을 잡는다.

코드도 정리할 수는 있다. 하지만 비용이 크다. 오래된 의존성을 깨기 위해서는 상당한 시간과 인내심이 든다. 반면 처음부터 깨끗한 상태로 유지하려는 습관을 갖는다면 어렵지 않다. **언제나 코드는 최대한 깔끔하고 단순하게 정리하자.**

# Reference

* [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin)
* [Yooii-Studios / Clean-Code](https://github.com/Yooii-Studios/Clean-Code)
* [Clean Code](https://book.interpark.com/product/BookDisplay.do?_method=detail&sc.prdNo=213656258&gclid=CjwKCAjw9-KTBhBcEiwAr19igynFiOxjFYKEJyaiyNEI4XXL1bFM78ki2cNQLMSxcUWU9XNks8eEThoCG6EQAvD_BwE)
* [zinc0214 / CleanCode](https://github.com/Yooii-Studios/Clean-Code)
* [wojteklu/clean_code.md](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
