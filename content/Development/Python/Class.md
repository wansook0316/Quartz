---
title: Class
thumbnail: ''
draft: false
tags:
- python
- class
- initializer
- constructor
- inheritance
created: 2023-10-04
---

클래스는 c++에서 자세히 다뤘으므로, 해당 내용에 대해 파이썬 문법만 알아보도록 하자.

# init, constructor

````python
class Student:
    def __init__(self, givenID, givenName):
        self.id = givenID
        self.name = givenName

    def setId(self, givenID):
        self.id = givenID

    def getId(self):
        return self.id

    def setName(self, givenName):
        self.name = givenName

    def getName(self):
        return self.name

student1 = Student(20190001, "Harry Potter")
student2 = Student(20190002, "Hermione Granger")

print(student1.getId())
print(student1.getName())

print(student2.getId())
print(student2.getName())
````

````
20190001
Harry Potter
20190002
Hermione Granger
````

# **str**()

기본적으로 내가 만든 클래스의 모든 내용을 알아볼 수 있게 관용적으로 만들어주는 함수이다.

````python
class Student:
    def __init__(self, givenID, givenName):
        self.id = givenID
        self.name = givenName

    def setId(self, givenID):
        self.id = givenID

    def getId(self):
        return self.id

    def setName(self, givenName):
        self.name = givenName

    def getName(self):
        return self.name

    def __str__(self):
        msg = "id:{}, name:{}".format(self.id, self.name)
        return msg

student1 = Student(20190001, "Harry Potter")
student2 = Student(20190002, "Hermione Granger")

print(student1.getId())
print(student1.getName())

print(student2.getId())
print(student2.getName())
````

````
20190001
Harry Potter
20190002
Hermione Granger
id:20190002, name:Hermione Granger
````

# 클래스 변수

````python
class Student:
    # Class variables
    countStudent = 0

    def __init__(self, givenID, givenName):
        # Instance (or Object) variables
        self.id = givenID
        self.name = givenName
        Student.countStudent = Student.countStudent + 1

    def setId(self, givenID):
        self.id = givenID

    def getId(self):
        return self.id

    def setName(self, givenName):
        self.name = givenName

    def getName(self):
        return self.name

    def __str__(self):
        msg = "id:{}, name:{}".format(self.id, self.name)
        return msg

    def getNumOfStudent():
        return Student.countStudent
````

````
print(Student.getNumOfStudent())

student1 = Student(20190001, "Harry Potter")
student2 = Student(20190002, "Hermione Granger")

print(student1)
print(student2)

print(Student.getNumOfStudent())
````

````
20190001
Harry Potter
20190002
Hermione Granger
id:20190002, name:Hermione Granger
2
2
````

# Private Attribute

클래스를 설계할 때, 사람이 변수에 접근하는데 있어서 직접적인 접근을 막고 싶다! 이 때 c++ 에서는 `private` 를 사용했는데, 여기서는 좀더 직관적으로 변수에 `__` 를 추가해주면 된다.

````python
class Student:
    # Class variables
    __countStudent = 0

    def __init__(self, givenID, givenName):
        # Instance (or Object) variables
        self.__id = givenID
        self.__name = givenName
        Student.__countStudent = Student.__countStudent + 1

    def setId(self, givenID):
        self.__id = givenID

    def getId(self):
        return self.__id

    def setName(self, givenName):
        self.__name = givenName

    def getName(self):
        return self.__name

    def __str__(self):
        msg = "id:{}, name:{}".format(self.__id, self.__name)
        return msg

    def getNumOfStudent():
        return Student.__countStudent
````

````
student1 = Student(20190001, "Harry Potter")
student2 = Student(20190002, "Hermione Granger")

print(student1.getId())
print(student1.getName())

print(student2.getId())
print(student2.getName())

print(student2.__str__())

print(Student.getNumOfStudent())
print(Student.getNumOfStudent())

print(Student.__countStudent)
---------------------------------------------------------------------------
AttributeError                            Traceback (most recent call last)
<ipython-input-15-949f5d70643a> in <module>
     43 print(Student.getNumOfStudent())
     44
---> 45 print(Student.__countStudent)

AttributeError: type object 'Student' has no attribute '__countStudent'

````

내가 직접적으로 `__countStudent` 에 접근했기 때문에 에러가 뜬다.

# 상속

상속받는 방법을 알아보자!

````python
class GraduatedStudent(Student):

    def __init__(self, givenId, givenName, givenYear):
        self.__graduatedYear = givenYear
        super().__init__(givenId, givenName)

    def __str__(self):
        msg = super().__str__() + ", graduation:{}".format(self.__graduatedYear)
        return msg

student1 = GraduatedStudent(20190001, "Harry Potter", 2023)

print(student1)
````

````
id:20190001, name:Harry Potter, graduation:2023
````

`super()` 함수가 굉장히 신기한데, 바로 상속받은 클래스에 접근할 수 있는 메서드이다.

# has-a Relationship

특정 클래스를 포함하는 클래스가 있을 수 있다. 부모자식 관계처럼 피를 나누지는 않아도 묶어놓을 수는 있다.

````
class Department:
    def __init__(self):
        memberStudent = Student()
````

memberStudent 를 `__init__` 함수안에 변수로 선언해주면 된다.

# Exercise

inputdata1.csv 와 inputdata2.csv 를 입력으로 받아서 sample.csv와 같은 형태로 결과를 만드는 프로그램을 작성해라.

`myFile` 클래스를 만들어서 풀이해라.

## inputdata1.csv

````
ID,Name
20190001,Apple
20190003,Pear
20190002,Orange
````

## inputdata2.csv

````
ID,Class1,Class2,Class3
20190003,90,90,98
20190002,45,12,37
20190009,10,10,10
20190001,89,92,35
````

## sample.csv

````
ID,Name,Course 1,Course 2,Course 3,Average
20190001,Apple,89,92,35,72
20190002,Orange,45,12,37,31
20190003,Pear,90,90,98,92
````

## 풀이

````python
# ANSWER : START

import csv

class myFile:

    def __init__(self, fileName = None, fileMode = None):
        self.__fileName = fileName
        self.__fileMode = fileMode
        self.__fileList = []
        if self.__fileMode == "r" and self.__fileName != None:
            self.file = open(self.__fileName, self.__fileMode)
            read_file = csv.reader(self.file)
            for line in read_file:
                self.__fileList.append(line)
            self.__fileList[1:] = sorted(self.__fileList[1:])

        elif self.__fileMode == "w" and self.__fileName != "":
            self.file = open(self.__fileName, self.__fileMode)


    def getStatus(self):

        if self.__fileList != [] or self.__fileMode == "w":
            return True
        else:
            print("파일이 열리지 않았음 status = false")
            return False


    def getBody(self):

        if self.getStatus() == True:
            return self.__fileList[1:]
        else:
            print("파일이 열리지 않아 body 출력이 불가합니다.")
            return False

    def setContentHead(self,fileHeader = None):
        if self.getStatus() == True and fileHeader != None:
            self.__fileHeader = fileHeader
            return True
        else:
            print("fileHeader 가 주어지지 않았거나, 파일이 열리지 않았습니다.")
            return False


    def setContentBody(self, fileContent = None):
        if self.getStatus() == True and fileContent != None:
            self.__fileContent = fileContent
            return True
        else:
            print("fileContent 가 주어지지 않았거나, 파일이 열리지 않았습니다.")
            return False

    def writeFile(self):
        if self.getStatus() == True:
            myWriter = csv.writer(self.file)
            myWriter.writerow(self.__fileHeader)
            for i in range(len(self.__fileContent)):
                myWriter.writerow(self.__fileContent[i])
            return True

        else:
            print("파일이 열리지 않았습니다.")
            return False

    def closeFile(self):
        if self.getStatus() == True:
            self.file.close()
            return True

        else:
            print("파일이 열리지 않았습니다.")
            return False


def mergeList(li1, li2):
    result = []
    temp = []

    for i in range(len(li1)):
        for j in range(len(li2)):
            if li1[i][0] == li2[j][0]:
                temp = []
                temp.append(li1[i][0])
                temp.append(li1[i][1])
                temp.append(li2[j][1])
                temp.append(li2[j][2])
                temp.append(li2[j][3])
                sum = 0
                for k in range(1,4):
                    sum = sum + int(li2[j][k])

                temp.append(str(int(sum/3)))

                result.append(temp)

    result = sorted(result)

    return result


# ANSWER : END

file1 = myFile("inputdata1.csv", 'r')
file2 = myFile("inputdata2.csv", 'r')

if (file1.getStatus() != False) and (file2.getStatus() != False):
    newList = mergeList(file1.getBody(), file2.getBody())

    file3 = myFile("output.csv", 'w')
    file3.setContentHead(["ID", "Name", "Course 1", "Course 2", "Course 3", "Average"])
    file3.setContentBody(newList)
    file3.writeFile()
    file3.closeFile()
else:
    print("input file error")

file1.closeFile()
file2.closeFile()
````
