---
title: Loop
thumbnail: ''
draft: false
tags:
- python
- loop
- for
- range
- break
- while
- continue
created: 2023-10-04
---

컴퓨터를 통하여 문제를 해결하는 가장 중요한 이유 중에는 계속적으로 반복하는 작업을 컴퓨터가 대신 처리하여 주는 것이다. 이런 기능을 반복문이라고 하며, 대부분의 프로그래밍 언어는 다양한 반복문을 제공한다.

# for

````python
for i in [1,2,3,4,5,6,7,8,9]:
    print(i, end = "  ")

>> 1  2  3  4  5  6  7  8  9
````

# range()

1. `range(limit)`: `0`에서 `limit - 1`까지를, `1씩 증가하는 형태의` 값으로 돌려 준다.
1. `range(start, end)`: `start`에서 `end`까지를, `1씩 증가하는 형태의` 값으로 돌려 준다.
1. `range(start, end, step)`: `start`에서 `end`까지의 값을 돌려 주는데, 숫자의 증가폭을 `step`만큼으로 한다.

## Example

````python
print("Case.1")
for i in range(3) :
    print(i, end = "  ")

print("")
print("Case.2")
for i in range(1,3) :
    print(i, end = "  ")

print("")
print("Case.3")
for i in range(0,10,2) :
    print(i, end = "  ")

print("")
print("Case.4")
for i in range(10,0,-2) :
    print(i, end = "  ")
````

````
Output
Case.1
0  1  2
Case.2
1  2
Case.3
0  2  4  6  8
Case.4
10  8  6  4  2
````

# While

## for 와 while의 차이점

````python
# for statement
for i in [1,2,3,4,5,6,7,8,9] :
    print(i)
# while statement
i = 1
while i <= 9 :
    print(i)
    i = i + 1
````

두 구문은 같은 명령을 수행한다.

## 무한 루프

왜 만들죠? 무한 반복하여 작업을 수행하다가, 특정 조건이 발생하는 경우에 반복문을 멈추거나, 아니면 사용자가 특정입력을 주는 경우 반복을 멈추기 위해서 사용한다.

무한루프는 다음과 같이 만들 수 있다.

````python
i = 0
while True:
    i = i + 1
    print(i end = " ")

````

그렇다면 특정 조건이 나왔을 때 탈출하는 문법은 무엇일까?

## break

특정 조건에서 무한 루프를 탈출 시키기 위해 위의 코드를 바꿔주자.

````python
i = 0
while True :
    i = i + 1
    print(i, end = " ")

    if(i == 10):
        break
````

## Continue

반복문을 수행하는 경우 특정 조건은 pass하고 나머지 조건에 대해서는 기존 작업을 계속하도록 하는 것이다. 이때 continue 라는 문법을 사용한다. 사용하게 되면 반복문의 처음으로 돌아가서 수행을 계속하게 된다. i 가 짝수인 경우 출력을 하지만 그렇지 않은 경우 넘기는 코드를 보자.

````python
i = 0
while True :
    i = i + 1

    if i % 2 == 0:
        print(i, end = " ")
        if(i == 100): #NEW.1
            break #NEW.2
    else:
        continue
````

````
2 4 6 8 10 12 14 16 18 20 22 24 26 28 30 32 34 36 38 40 42 44 46 48 50 52 54 56 58 60 62 64 66 68 70 72 74 76 78 80 82 84 86 88 90 92 94 96 98 100
````

# Lab

## 제대로 된 구구단 프로그램 완성하기

이제 우리는 다양한 방법으로 제대로된 구구단 프로그램을 완성할 수 있는 단계로 왔다. `calcGugudan()` 함수를 사용하지 않고 다음 처럼 `List in Lists`의 형태로 구구단의 결과를 저장하고 출력 할 수 있는 프로그램을 만들어 보자.

**출력 예시**

````
Output
['  1  ', '  2  ', '  3  ', '  4  ', '  5  ', '  6  ', '  7  ', '  8  ', '  9  ']
['  2  ', '  4  ', '  6  ', '  8  ', '  10 ', '  12 ', '  14 ', '  16 ', '  18 ']
['  3  ', '  6  ', '  9  ', '  12 ', '  15 ', '  18 ', '  21 ', '  24 ', '  27 ']
['  4  ', '  8  ', '  12 ', '  16 ', '  20 ', '  24 ', '  28 ', '  32 ', '  36 ']
['  5  ', '  10 ', '  15 ', '  20 ', '  25 ', '  30 ', '  35 ', '  40 ', '  45 ']
['  6  ', '  12 ', '  18 ', '  24 ', '  30 ', '  36 ', '  42 ', '  48 ', '  54 ']
['  7  ', '  14 ', '  21 ', '  28 ', '  35 ', '  42 ', '  49 ', '  56 ', '  63 ']
['  8  ', '  16 ', '  24 ', '  32 ', '  40 ', '  48 ', '  56 ', '  64 ', '  72 ']
['  9  ', '  18 ', '  27 ', '  36 ', '  45 ', '  54 ', '  63 ', '  72 ', '  81 ']
````

````python
Gugudan = []

for i in range(1,10):
    temp = []
    for j in range(1,10):

        temp.append(' {} '.format(i*j))
    Gugudan.append(temp)
    temp = []

Gugudan
````

## 사용자가 입력한 숫자보다 작은 숫자로 리스트 만들기

다음의 요구 사항에 맞는 프로그램을 개발하여 아래의 입력창을 통해서 실행합니다.

1. 리스트 a가 `[1,2,1,8,9,4,2,5,1,3]`로 초기화 되어 있습니다.
1. 사용자로부터 정수 하나를 입력받습니다.
1. 리스트 a의 아이템 중 사용자가 입력한 숫자보다 작은 숫자를 모두 출력하는 프로그램을 구현합니다.
1. 이때, 출력할 숫자를 하나씩 출력하지 말고, 해당되는 숫자들을 모아 새로운 list를 만들어서 그 list를 출력하게 합니다.

````python
a = [1,2,1,8,9,4,2,5,1,3]

int_input =  int(input("입력해!! : "))
low_num_a = []

for i in range(len(a)):
    if (a[i] <= int_input):
        low_num_a.append(a[i])

print(low_num_a)
````

````
Output
입력해!! : 3
[1, 2, 1, 2, 1, 3]
````

## 두 개의 리스트 병합하여 중복된 아이템이 없는 새로운 리스트 만들기

다음의 요구 사항에 맞는 프로그램을 개발하여 아래의 입력창을 통해서 실행합니다.

(a) 두 개의 list a와 b를 다음과 같이 정의합니다.

(b) a = `[1,1,2,3,5,8,13,24,34,55]`

(c) b = `[1,1,2,3,4,5,6,7,8,9,10,11,12]`

(d) 두 list에 모두 포함되는 요소(element)를 모아서, 중복되는 요소가 없는 새로운 리스트 c를 만든 후, 결과를 출력합니다.

````python
a = [1,1,2,3,5,8,13,24,34,55]
b = [1,1,2,3,4,5,6,7,8,9,10,11,12]

checker = []

for i in range(len(a)):
    if(a[i] not in checker):
        checker.append(a[i])
for k in range(len(b)):
    if(b[k] not in checker):
        checker.append(b[k])

checker.sort()
checker
````

````
Output
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 24, 34, 55]
````

## 숫자 추측 게임 개발하기 (1)

다음의 요구 사항에 맞는 프로그램을 개발하여 아래의 입력창을 통해서 실행합니다.

1. 1에서 9 사이의 숫자(1과 9 포함) 중 하나를 랜덤하게 생성합니다.
1. 사용자에게 숫자를 추측하여 입력하게 하고, 입력한 수가 생성된 수보다 큰지, 작은지, 같은지를 알립니다.
1. 사용자가 생성된 수와 같은 수를 입력할 때까지 프로그램은 끝나지 않고 반복됩니다.

````python
import random as rd

com_num = rd.randrange(1,10)

while(1):

    my_num = int(input("맞춰봐! : "))

    if (com_num > my_num):
        print("up")

    elif (com_num < my_num):
        print("down")

    else:
        print("맞추다니.......! 내가 졌다.")
        break
````

````
Output
맞춰봐! : 3
up
맞춰봐! : 5
down
맞춰봐! : 4
맞추다니.......! 내가 졌다.
````

## 숫자 추측 게임 개발하기 (2)

1. 앞서 `숫자 추측 게임 개발하기 (1)` 문제와 반대되는 문제입니다.
1. 이번에는 사용자(당신)가 0에서 100 사이 숫자 중 하나를 골라 머리 속에 기억합니다.
1. 프로그램이 그 숫자가 무엇인지 맞히도록 합니다.
1. 프로그램이 숫자를 guess할때마다 사용자는 그 숫자가 자신이 생각한 수 보다 큰지(2), 작은지(0), 혹은 똑같은지(1) 입력합니다.
1. 프로그램이 숫자를 맞히면 종료됩니다.

````python
from random import *

start = 0
end = 100

while(1):

    com_num = randrange(start,end)
    print("너의 숫자는 {} 거야".format(com_num))

    updown = int(input("up : 2, same : 1, down : 0 = "))

    if (updown == 2):
        print("더 큰숫자야!")
        start = com_num + 1

    if (updown == 0):
        print("더 작은 숫자야!")
        end = com_num

    if (updown == 1):
        print("잘했어!")
        break
````

````
Output
너의 숫자는 56 일거야
up : 2, same : 1, down : 0 = 0
더 작은 숫자야!
너의 숫자는 19 일거야
up : 2, same : 1, down : 0 = 2
더 큰숫자야!
너의 숫자는 50 일거야
up : 2, same : 1, down : 0 = 1
잘했어!
````
