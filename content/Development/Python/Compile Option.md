---
title: Compile Option
thumbnail: ''
draft: false
tags:
- Regex
- python
created: 2023-10-04
---

# 개요

지금까지는 간단한 정규식을 살펴 보았지만, 실제로 존재하는 다양한 문자열에서 정보를 뽑아내기 위해서는 추가적인 옵션이 필요하다. 예를 들어 쇼핑몰의 상품 리뷰를 사용자가 작성했다고 한다. 우리는 여기서 핵심적인 단어를 뽑아내야 한다. 하지만 이런 리뷰는 문자열은 맞지만, 전체적으로 보았을 때 줄바꿈 문자(`\n`)가 포함되어 있다. 줄바꿈 문자(`\n`)는 이전에 배운 문자열에서 매치되지 않는 경우이다. 이렇게 어떤 문자열이냐에 따라서 우리는 검색 조건을 달리해야 한다. 이런 문제점을 기반으로 정규식을 컴파일할 때 사용할 수 있는 옵션을 소개한다.

|option|describtion|
|:----:|:---------:|
|DOTALL(S)|메타문자 `.` 가 줄바꿈 문자를 포함하여 모든 문자와 매치할 수 있도록 한다.|
|IGNORECASE(I)|대소문자에 관계없이 매치할 수 있도록 한다.|
|MULTILINE(M)|여러줄과 매치할 수 있도록 한다. (^, $ 메타문자의 사용과 관계가 있는 옵션이다)|
|VERBOSE(X)|verbose 모드를 사용할 수 있도록 한다. (정규식을 보기 편하게 만들수 있고 주석등을 사용할 수 있게된다.)|

옵션을 사용할 때는 `re.DOTALL`처럼 전체 옵션 이름을 써도 되고 `re.S`처럼 약어를 써도 된다.

## DOTALL(S)

 > 
 > 메타문자 `.` 가 줄바꿈 문자를 포함하여 모든 문자와 매치할 수 있도록 한다.

`.` 메타 문자는 **줄바꿈 문자(`\n`)를 제외한** 모든 문자와 매치되는 규칙이 있다. 만약 `\n` 문자도 포함하여 매치하고 싶다면 `re.DOTALL` 또는 `re.S` 옵션을 사용해 정규식을 컴파일하면 된다.

````python
>>> import re
>>> p = re.compile('a.b')
>>> m = p.match('a\nb')
>>> print(m)
None
````

위의 예를 보면, 컴파일 옵션을 주지 않은 경우 메타문자 `.`는 줄바꿈 문자(`\n`)와 매치되지 않음을 알 수 있다.

````python
>>> p = re.compile('a.b', re.DOTALL)
>>> m = p.match('a\nb')
>>> print(m)
<_sre.SRE_Match object at 0x01FCF3D8>
````

이번에는 옵션을 준 경우이다. 줄바꿈 문자도 포함하여 결과에 반영한 것을 알 수 있다. 보통 `re.DOTALL` 옵션은 여러 줄로 이루어진 문자열에서 `\n`에 상관없이 검색할 때 많이 사용한다.

## IGNORECASE, I

 > 
 > 대소문자에 관계없이 매치할 수 있도록 한다.

`re.IGNORECASE` 또는 `re.I` 옵션은 대소문자 구별 없이 매치를 수행할 때 사용하는 옵션이다. 다음 예제를 보자.

````python
>>> p = re.compile('[a-z]', re.I)
>>> p.match('python')
<_sre.SRE_Match object at 0x01FCFA30>
>>> p.match('Python')
<_sre.SRE_Match object at 0x01FCFA68>
>>> p.match('PYTHON')
<_sre.SRE_Match object at 0x01FCF9F8>
````

`[a-z]` 정규식은 소문자만을 의미하지만 `re.I` 옵션으로 대소문자 구별 없이 매치된다.

## MULTILINE, M

 > 
 > 여러줄과 매치할 수 있도록 한다.

re.MULTILINE 또는 re.M 옵션은 다음 글에 설명할 메타 문자인 `^`, `$`와 연관된 옵션이다. 이 메타 문자에 대해 간단히 설명하자면 `^`는 문자열의 처음을 의미하고, `$`는 문자열의 마지막을 의미한다. 예를 들어 정규식이 `^python`인 경우 문자열의 처음은 항상 python으로 시작해야 매치되고, 만약 정규식이 `python$`이라면 문자열의 마지막은 항상 python으로 끝나야 매치된다는 의미이다.

````python
import re
p = re.compile("^python\s\w+")

data = """python one
life is too short
python two
you need python
python three"""

print(p.findall(data))
````

````
['python one']
````

정규식 `^python\s\w+`은 python이라는 문자열로 시작하고 그 뒤에 whitespace, 그 뒤에 단어가 와야 한다는 의미이다. 검색할 문자열 data는 여러 줄로 이루어져 있다.

결과를 보면 `^` 메타 문자에 의해 python이라는 문자열을 사용한 첫 번째 줄만 매치된 것을 알 수 있다. 하지만 내가 원하는 결과는 해당 문자열의 처음에 조건이 걸리는 것이 아니고, **라인이 변경될 때** 처음인 경우를 뜻하는 것이다. 이럴 때 사용하는 옵션이 `re.MULTILINE` 또는 `re.M`이다.

````python
import re
p = re.compile("^python\s\w+", re.MULTILINE)

data = """python one
life is too short
python two
you need python
python three"""

print(p.findall(data))
````

````
['python one', 'python two', 'python three']
````

`re.MULTILINE` 옵션으로 인해 `^` 메타 문자가 문자열 전체가 아닌 각 줄의 처음이라는 의미를 갖게 되었다. 즉, re.MULTILINE 옵션은 ^, $ 메타 문자를 문자열의 각 줄마다 적용해 주는 것이다.

## VERBOSE(X)

 > 
 > verbose 모드를 사용할 수 있도록 한다.

고마운 옵션이다. 사실 정규식은 사용하기 까다롭다. 정규식은 마치 시와 같이 함축적인 단어들의 집합으로 구성되어 있다. 따라서 전문가들이 만들어 놓은 정규식을 보면 정말 섬세하게 다뤄서 해석해야 한다. 좀 더 좋은 방법이 없을까? 이렇게 이해하기 어려운 정규식을 주석 또는 줄 단위로 구분할 수 있다면 얼마나 보기 좋고 이해하기 쉬울까? 이러한 욕구를 해소해줄 수 있는 것이 바로 `re.VERBOSE` 또는 `re.X` 옵션이다.

````python
charref = re.compile(r'&[#](0[0-7]+|[0-9]+|x[0-9a-fA-F]+);')
````

````python
charref = re.compile(r"""
 &[#]                # Start of a numeric entity reference
 (
     0[0-7]+         # Octal form
   | [0-9]+          # Decimal form
   | x[0-9a-fA-F]+   # Hexadecimal form
 )
 ;                   # Trailing semicolon
""", re.VERBOSE)
````

첫 번째와 두 번째 예를 비교해 보면 컴파일된 패턴 객체인 charref는 모두 동일한 역할을 한다. 하지만 정규식이 복잡할 경우 두 번째처럼 주석을 적고 여러 줄로 표현하는 것이 훨씬 가독성이 좋다는 것을 알 수 있다.

`re.VERBOSE` 옵션을 사용하면 문자열에 사용된 whitespace는 컴파일할 때 제거된다(단 \[ \] 안에 사용한 whitespace는 제외). 그리고 줄 단위로 #기호를 사용하여 주석문을 작성할 수 있다.

# Reference

* [07-2 정규 표현식 시작하기](https://wikidocs.net/4308)
* [Regex](Regex.md)
