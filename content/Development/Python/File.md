---
title: File
thumbnail: ''
draft: false
tags:
- python
- file
- input
- output
created: 2023-10-04
---

컴퓨터를 통한 문제 해결을 위해서 우리는 정수, 실수, 문자열 등을 프로그램 실행중에 만들어서 사용하였다. 하지만 실제 큰 프로그램들은 수시간 수년동안 쌓여진 데이터를 취급하는 목적으로 사용하며, 이 경우 컴퓨터의 전원이 꺼져도 유지되는 디스크의 화일 사용은 필수적이다.

# 파일 열기, 닫기

Python과 같은 프로그래밍 언어에서는 화일을 열고 닫는 문법을 제공하는데, 연 화일은 반드시 닫아야 한다. 열기만 하고 닫지 않은 화일은 프로그램의 동작시에 작업한 내용이 제대로 반영이 안되거나, 최악의 경우는 화일에 오류가 생겨서 사용이 불가할 수도 있다. Python에서 화일을 여는 문법은 `open()` 함수이다. 반대로 닫는 문법은 `close()` 함수이다.

````python
file = open('filename.csv', 'r')
file.close()
````

두번째 파라미터는, 파일을 여는 용도를 의미한다. `'r'`은 `read-only`를 의미하여, 읽기만 하고 수정은 불가능하게 하겠다는 의미이다. 자세한 사용법은, [Input and Output](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files) 여기에 가보자.

# 파일 통째로 읽기

````python
file = open('filename.csv', 'r')
contents = file.read()
file.close()
````

`read()` 함수를 사용하면 연 파일에 대한 모든 내용을 받아올 수 있다.

# with 문으로 파일 열기, 닫기

`close()` 를 까먹는 경우가 있기 때문에 with문을 사용해서 파일을 열고 닫을 수 있다.

````python
with open('filename.csv', 'r') as file:
    contents = file.read()
````

````
ID,Python,C++,Javascript,Go
20190001,A,A,A,A
20190002,A,B,A,C
20190003,C,B,C,A
````

# 파일 한 줄씩 읽기

화일 안의 데이터를 의미있게 사용하려면, 화일의 내용을 한줄씩 읽어서 프로그래밍을 하기 용이한 형태도 바꾸는 것이 일반적이다.`filename.csv`도 자세히 살펴보면, 2차원 테이블 형태로, 한줄을 여러 5개의 아이템이 있는 리스트 모양으로 볼 수 있다.따라서 Python 안에서 아이템을 5개 갖는 리스트들의 집합(`List in Lists`)으로 보면 의미있게 처리가 가능하다.

## with 문 이용

````python
fileMatrix = []

with open('filename.csv', 'r') as file:
    for lineContent in file: # Point.1
        fileMatrix.append(lineContent.strip('\n').split(',')) # Point.2

print(fileMatrix)
````

````
[['ID', 'Python', 'C++', 'Javascript', 'Go'], ['20190001', 'A', 'A', 'A', 'A'], ['20190002', 'A', 'B', 'A', 'C'], ['20190003', 'C', 'B', 'C', 'A']]
````

`Point.1`로 명시한 부분은 앞서 `for` 반복문에서 사용한 문법와 유사한 의미를 갖는데, `file`에서 한줄씩 읽어서 `lineContent` 문자열에 넣는다는 의미이다. **기본적으로 이 문법을 사용하면, `\n` 을 기준으로 한줄 씩 가져온다.** `Point.2` 를 보면,

`lineContent.strip('\n')`은 화일에서 읽은 한줄에서 `'\n'`를 제거하겠다는 의미이다. 이는 텍스트 파일에서 줄이 바뀌는 부분에서 줄 바꿈 특수 기호인 `'\n'`이 삽입되는데, 이는 데이터의 원래 의미와 상관 없으니 제거한다는 의미이다.

`.split(',')`은 `'\n'`이 제거된 줄에서, 다시 `,` 기호를 기준으로 나눈뒤 리스트에 넣어 반환하라는 코드이다. 이렇게 함으로써 화일의 `20190001,A,A,A,A`는 결국 다섯개의 아이템을 갖는 리스트로 변합니다.

이렇게 만들어진 리스트를 다시 `fileMatrix` 리스트의 요소로 하나씩 넣는다.

## Default open(), close() 이용

위의 코드를 open, close를 이용하면 다음과 같다.

````python
fileMatrix = []

file = open('filename.csv', 'r')

lineContent = file.readline()

while lineContent != '':
    fileMatrix.append(lineContent.strip('\n').split(','))
    lineContent = file.readline()

print(fileMatrix)
file.close()
````

````
[['ID', 'Python', 'C++', 'Javascript', 'Go'], ['20190001', 'A', 'A', 'A', 'A'], ['20190002', 'A', 'B', 'A', 'C'], ['20190003', 'C', 'B', 'C', 'A']]
````

여기서 알 수 있는 점은,

1. 아무것도 없는 줄을 가져오면 빈 string 이다.
1. 이 값을 기준으로 제어해야 한다.
1. 또 `readline()` 함수를 호출하면 그 다음줄을 읽어 온다.

# 기존 파일에 추가하기

기존 파일에 추가하기 위해서는 `open` 할 때, 두번째 입력 파라미터에 `a` 를 줘야한다. `append` 의 약자이다.

이 때, 파일을 쓰는 것이니 `w` 를 쓰면 큰일 난다. 컴퓨터는 단순하기 때문에 파일 이름에 해당 하는 파일을 그냥 **써버린다** 이 얘기가 뭐냐면 **덮어쓴다** 는 이야기이다. 어떠한 경고도 없이 덮어써 버린다. 따라서 우리는 주의할 필요가 있다.

````python
with open('filename.csv', 'r') as file:
    contents = file.read()
print("[Before append]")
print(contents)

with open('filename.csv', 'a') as file: # Point.1
    file.write("20190004,B,B,B,B\n") # Point.2

with open('filename.csv', 'r') as file:
    contents = file.read()
print("[After append]")
print(contents)
````

````
[Before append]
ID,Python,C++,Javascript,Go
20190001,A,A,A,A
20190002,A,B,A,C
20190003,C,B,C,A

[After append]
ID,Python,C++,Javascript,Go
20190001,A,A,A,A
20190002,A,B,A,C
20190003,C,B,C,A
20190004,B,B,B,B


````

# 파일 쓰기

위의 예에서 본 파일은 사실 잘 보게 되면, 학번, 그리고 언어에 대한 성적을 의미하고 있다. 여기서 우리가 `HTML, CSS` 에 대한 추가적인 성적역시 나타내고 싶다. 아직 시험을 치르지 않았으므로 공란으로 두고 싶다면, 우리는 지금까지 배운 것으로 해결 할 수 없다. 왜냐면 우리는 추가하는 방법에 있어 마지막에 추가하는 것만 배웠기 때문이다. 따라서 우리는 기존 파일을 읽어와 추가적인 작업을 하고, 다시 이녀석을 파일에 넣어줄 필요가 있다. 이 때 필요한 것이 **파일 쓰기** 이다.

````python
import csv
# 위의 예에서 파일을 string으로 부터 list로 만들어 다룰 수 있게 했다.
# 그런데 파일을 내가 쓰려면, 다시 list로 부터 string으로 만든뒤 넣어줘야 한다.
# 그 작업이 너무 귀찮다.. 그래서 이 라이브러리를 import하고 함수를 가져다 쓰자.

fileMatrix = []
# 파일을 리스트로 정리해줄 큰 녀석을 만들자.

with open('filename', 'r') as fileRead:
    for lineContent in fileRead:
        fileMatrix.append(lineContent.strip('\n').split(','))
# fileMatrix에 내가 원하는 파일을 리스트 형태로 정리해 두자.
# 이렇게 csv 라이브러리를 사용해서 나타낼 수 도 있다.
#with open('Step_13_SampleFile_score.csv', 'r') as fileRead:
#    fileReader = csv.reader(fileRead)
#    for line in fileReader:
#        fileMatrix.append(line)

print("[Before]")
print(fileMatrix)


fileMatrix[0].extend(["HTML5", "CSS3"])
# Array 원소자체를 추가한다.
# Array상태로 추가하는 것이 아님

lenFileMatrix = len(fileMatrix)
# fileMatrix Array의 크기를 가져온다.

for i in range(lenFileMatrix - 1):
    i = i + 1
    fileMatrix[i].extend(["_", "_"])
# 아직 성적이 입력이 안되어 있으므로, 다 초기화 해준다.

print("[After]")
print(fileMatrix)

with open('Step_13_SampleFile_newScore.csv', 'w') as fileWrite:
    myWriter = csv.writer(fileWrite)
    for i in range(lenFileMatrix):
        myWriter.writerow(fileMatrix[i])
    # 여기서 csv 라이브러리를 가져온 이유가 나온다.
    # 먼저, 내가 쓸 파일을 'w' 로 연다.
    # 그리고 그 객체를 csv.writer 라는 객체의 input으로 주고,
    # 해당 객체를 mywriter라는 이름으로 받는다.
    # 이제 내가 만들었던, fileMatrix array의 요소요소들을 써줘야 한다.
    # for 문을 돌면서, 아까 만들었던 myWriter 객체의 writerow 객체의 input으로
    # 배열을 넣어준다.
````

````
['ID', 'Python', 'C++', 'Javascript', 'Go']
['20190001', 'A', 'A', 'A', 'A']
['20190002', 'A', 'B', 'A', 'C']
['20190003', 'C', 'B', 'C', 'A']
['20190004', 'B', 'B', 'B', 'B']
[Before]
[['ID', 'Python', 'C++', 'Javascript', 'Go'], ['20190001', 'A', 'A', 'A', 'A'], ['20190002', 'A', 'B', 'A', 'C'], ['20190003', 'C', 'B', 'C', 'A'], ['20190004', 'B', 'B', 'B', 'B']]
[After]
[['ID', 'Python', 'C++', 'Javascript', 'Go', 'HTML5', 'CSS3'], ['20190001', 'A', 'A', 'A', 'A', '_', '_'], ['20190002', 'A', 'B', 'A', 'C', '_', '_'], ['20190003', 'C', 'B', 'C', 'A', '_', '_'], ['20190004', 'B', 'B', 'B', 'B',  '_', '_']]
````

# 주석 없는 소스코드

````python
import csv

fileMatrix = []

with open('SampleFile.csv', 'r') as myfile:
    read_file = csv.reader(myfile)
    for line in read_file:
        fileMatrix.append(line)

print("[Before]")
print(fileMatrix)

lenfileMatrix = len(fileMatrix)

for i in (1, lenfileMatrix-1):
    fileMatrix[i].extend(["_", "_"])

print("[After]")
print(fileMatrix)

with open('SampleFile_new.csv', 'w') as newfile:
    write_file = csv.writer(newfile)
    for i in range(lenfileMatrix):
        write_file.writerow(fileMatrix[i])

````
