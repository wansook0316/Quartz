---
title: Searching
thumbnail: ''
draft: false
tags:
- algorithm
- B-Tree
- binary-search
- interpolation
- binary-tree
- AVL-tree
- red-black-tree
- hash
created: 2023-10-02
---

탐색하는 방법에 대해 알아보자.

# 검색 문제

* n개의 키를 가진 배열 S와 키 x가 주어졌을 때, x=S\[i\]가 되는 첨자 i를 찾는 것
* 없다면 오류로 처리한다.
* 결론 : 이분 검색 알고리즘보다 효율적인 알고리즘은 없다.

![image](https://user-images.githubusercontent.com/37871541/122089259-8c7b0280-ce41-11eb-9469-110ccbbf461e.png){: .center-small}*이진 검색 상태 공간 트리*
![image](https://user-images.githubusercontent.com/37871541/122089398-ae748500-ce41-11eb-8c21-3376c359827b.png){: .center-small}*순차 검색은 답이없다.*

# 보간 검색

![image](https://user-images.githubusercontent.com/37871541/122090883-3313d300-ce43-11eb-8217-4b30b6ea2425.png){: .center-small}*보간 검색*

* 비교 이외에 다른 추가적인 정보를 이용하여 검색?
* 10개의 정수를 검색하는데, 첫번째 정수는 0-9중 하나,
* 두번째 정수는 10-19중 하나, 이런식으로 되어있다고 하자.
* 이럴 경우 검색키 x와 S\[1+x//10\]에서 비교
* 즉, 25는 S\[1+25//10\] = S\[3\]에서 비교

## Linear Interpolation

![image](https://user-images.githubusercontent.com/37871541/122091059-60608100-ce43-11eb-8931-511012860374.png){: .center-small}*선형 보간*

![image](https://user-images.githubusercontent.com/37871541/122091172-7c642280-ce43-11eb-9c40-190b56b4b350.png){: .center-small}*선형 보간 방법*

![image](https://user-images.githubusercontent.com/37871541/122091722-0f04c180-ce44-11eb-92e2-f05db3df1388.png){: .center-small}*선형 보간의 시간 복잡도*

* 시간 복잡도
  * 최악의 경우 순차검색과 같아짐

# 트리 구조를 사용한 동적 검색

* 정적 검색
  * 데이터가 한꺼번에 저장되어 추후에 추가나 삭제가 이루어지지 않는 경우
* 동적 검색
  * 데이터가 수시로 추가, 삭제되는 유동적인 경우
  * 동적 검색의 경우 배열을 사용하기 어려움. 계속해서 정렬을 해야함

## 이진 검색 트리

![image](https://user-images.githubusercontent.com/37871541/122092055-76bb0c80-ce44-11eb-903a-2ad7f4406ff5.png){: .center-small}*이진 검색 트리*

* 사용하는 이유
  * 일단 inorder 순회 (왼쪽 자신 오른쪽)을 하게 되면 정렬된 순서로 추출 가능
* 평균 검색 시간을 짧게 유지
  * 만약 균형잡힌 트리라면 짧게 유지 가능
  * 하지만 균형을 유지한다는 보장이 없다.
  * 최악의 경우 linked list와 같은 구조가 된다.
  * Random하게 들어갈 경우 평균적으로 효율적인 검색시간을 기대할 수 있음
* 삽입될 때 균형 트리라면 logn으로 가능
* 삭제되는 경우는 사진을 보자.

![image](https://user-images.githubusercontent.com/37871541/122092532-ffd24380-ce44-11eb-9cee-172f6460a109.png){: .center-small}*두개의 자식 노드가 있는 경우*

![image](https://user-images.githubusercontent.com/37871541/122092691-2ee8b500-ce45-11eb-8e39-aa592a100ffc.png){: .center-small}*한개의 자식 노드가 있는 경우*

* 삭제 시나리오는 두가지가 있다.
  * 두개의 자식 노드가 있는 경우
    * 해당 노드보다 작은 노드중 가장 큰 노드로 대체
    * 해당 노드보다 큰 노드중 가장 작은 노드로 대체
  * 한개의 자식 노드가 있는 경우
    * 자식 노드를 바로 올려버림

### 이진 검색트리 검색 분석

![image](https://user-images.githubusercontent.com/37871541/122093163-bc2c0980-ce45-11eb-9290-4ebfc1db7fc9.png){: .center-small}
![image](https://user-images.githubusercontent.com/37871541/122093195-c3ebae00-ce45-11eb-8b7f-4328ed1e4d52.png){: .center-small}

![image](https://user-images.githubusercontent.com/37871541/122093315-eb427b00-ce45-11eb-9baf-cb744008a02f.png){: .center-small}

* 결국 여전히 최악의 경우 O(n)

## 검색 시간 향상을 위한 트리 구조

* 균형이 중요하다.
* 균형 트리
  * AVL 트리
    * 추가, 삭제, 검색 모두 O(logn)
  * B-트리
    * 잎 마디들의 깊이를 항상 같게 유지
    * 추가, 삭제, 검색 모두 O(logn)
  * Red-Black Tree
    * 추가, 삭제, 검색 모두 O(logn)

## AVL 트리

* 좌우 Subtree의 높이 차가 최대 1인 이진 탐색 트리

![image](https://user-images.githubusercontent.com/37871541/122174599-cee22500-cebd-11eb-8711-ce87e60815cf.png){: .center-small}*AVL 트리*

![image](https://user-images.githubusercontent.com/37871541/122180358-52eadb80-cec3-11eb-954d-12a86c2d1f4c.png){: .center-small}*균형 유지 방법*

* 재구성 작업
  * 일단을 위의 그림의 구현이 이해가지 않지만 보면
  * case 1
    * 새로 삽입했을 때, 왼쪽으로 줄줄이 다발이니까 오른쪽으로 회전
    * 그랬더니 양쪽 절댓값이 맞음 (절댓값차가 1)
  * case 2
    * 일단 삽입한 결과를 보니 조건에 안맞음
    * 왼쪽으로 회전해봄
    * 안됨
    * 더 상위 노드에서 오른쪽으로 회전해봄
  * case 3, 4 반대에서 똑같이 진행
  * 제대로된 알고리즘 설명은 생략, 조작을 하면 된다는 거만 정성적으로 이해
  * 취지 : 조작을 통해 균형 트리가능

## B Tree

![image](https://user-images.githubusercontent.com/37871541/122184131-e1ad2780-cec6-11eb-8ef4-20ec74b34cd3.png){: .center-small}*2-3 tree*

* 2-3 Tree
  * 각 마디에는 키가 하나 또는 두개가 존재한다. (B, \[B, C\])
  * 각 내부 마디의 자식 수는 키의 수 + 1이다.
    * 지금 같은 경우 첫번째는 왼쪽, 오른쪽
    * 두번째는 왼, 중, 오
  * 주어진 마디의 왼쪽 부분트리의 모든 키는 해당 마디의 값보다 작거나 같다.
  * 오른쪽은 크거나 같다.
  * 모든 잎마디는 수준이 같다. -> 어떻게? 추가적인 작업이 필요

![image](https://user-images.githubusercontent.com/37871541/122184565-4d8f9000-cec7-11eb-9ba8-4059d20df12f.png){: .center-small}*2-3 트리에서 데이터 추가시 균형 유지 방법*

지금 35를 넣으니 맨 오른쪽에 입력되어서 하나의 마디에 하나 혹은 두개의 키가 들어가야 함에도 불구하고 그렇지 않았다.

![image](https://user-images.githubusercontent.com/37871541/122184748-7ca60180-cec7-11eb-8afc-455396cff168.png){: .center-small}*continue...*

1. 25, 30, 35에서 중앙에 있는 값을 위로 올린다.
1. 다시 중앙에 있는 값(20)을 위로 올린다.
1. 이 때, 17, 30은 하나의 노드로 분기한다.
1. 하위 노드에 있던 16, 18, 25, 35는 이 분기된 것에 붙는다.
1. 루트 노드에서도 중앙에 있는 15를 위로 올린다.
1. 하위 노드가 분기된 노드에 붙는다.

결과적으로 보면, 추가했을 때, 트리의 조작은 logn만큼 일어 난다.

# Hashing

![image](https://user-images.githubusercontent.com/37871541/122186707-436e9100-cec9-11eb-9061-1957701c8543.png){: .center-verysmall}*Hash*

* 어느 일정한 개수의 값을 저장한다고 했을 때, 만약 key가 주민 등록 번호라면, 모든 번호를 저장하게 만들 수는 없다.
* 즉, 배열이나 트리나 이런 구조를 사용해서 만들게 된다.
* 그런데 또다른 방법이 있는데 이것이 해싱이다.
* 예를 들어 100개의 값을 저장할 떄, 0~99까지의 index를 가지는 배열을 만들어 놓고,
* 특정 key(주민번호)가 들어왔을 때 해시함수 (key % 100)를 통과한 값을 해당 배열의 index로 사용하는 것

자 그런데 생각해보면 주민 번호를 해시함수를 통과해서 나온 인덱스가 항상 다를까? 말도 안된다. 실제로 100개의 키가 서로 다른 방에 들어갈 확률을 계산해보면, (다른 해쉬값을 가질 확률)

$$
{100! \over 100^{100} }  = 9.3 \times10^{-43} = 0
$$

거의 0에 가까운 값이 나온다. 결국 충돌이 발생한다.

## 충돌을 피하는 방법

![image](https://user-images.githubusercontent.com/37871541/122187497-0bb41900-ceca-11eb-8b53-a57e67a5a7b5.png){: .center-small}*충돌 피하는 방법*

* open Hashing
  * closed addressing
  * chaining
  * separate chaining
* closed Hashing(open addressing)
  * linear probing
  * quadratic probing
  * double Hashing

단어가 너무 어려우니 대표적인 것만 알아두자.

* open Hashing
  * 해시 값에 따라서 줄줄이 다발로 연결해둔것
  * radix sort에서 했던 것 처럼 bucket과 유사한 개념임
  * 문제는 아시겠지만 중복되서 많을 경우 너무 탐색이 느려짐
* closed Hashing
  * 배열 내에다가 저장하는 방식
  * 특정 해시값으로 접근했을 때 값이 있는 경우 아래로 내려가거나 위로 올라가는 방식으로 값을 저장

### Open Hashing

![image](https://user-images.githubusercontent.com/37871541/122188996-7f0a5a80-cecb-11eb-99e4-6c00adbb43fb.png){: .center-small}*성공했을 때, 평균 검색 시간*
![image](https://user-images.githubusercontent.com/37871541/122189292-c5f85000-cecb-11eb-9b69-9576acf6f90d.png){: .center-verysmall}*실패시, 성공시 시간 비교*

* 최악의 상황
  * 모든 키가 같은 해쉬값을 가짐
  * $100 \times {1\over 100}^{100}$ 거의 뭐 0이긴 하다.
  * 효율적이게 되려면 균일하게 분포되는 것이 최선
  * n개의 키가 m개의 바구니에 들어가 있다면 결국 n/m개의 키가 평균적으로 들어가 있는것
  * 즉 내가 처음에 접근했느넫 못찾았어, 그럼 n/m개는 찾아야 한다는 거지
  * 그럼 검색에 성공한 경우 비교횟수는 1번에 되었을 때 시간 + 2번째에 되었을 때 시간 + n/m번째 되었을 떄 시간의 기대값을 구하면 된다.

### Closed Hashing

![image](https://user-images.githubusercontent.com/37871541/122189809-343d1280-cecc-11eb-9e9e-2c06aa366ac2.png){: .center-small}*hash image*
![image](https://user-images.githubusercontent.com/37871541/122190966-45d2ea00-cecd-11eb-9d7e-44c91ab27322.png){: .center-small}*Double Hashing*

linear, quadratic은 이해가 쉬우니 더블만 가져왔다.

* 용어
  * k = key
  * m = hash table size
* linear Hashing
  * 겹치면, 오른쪽으로 이동하면서 빈칸에 저장
  * $h(i, k) = h(k)+i) mod m$ i = 0, 1, 2, 3...
* quadratic probing
  * $h(i, k) = (h(k)+i^2) mod m$
  * 제곱해서 이동해버림
* double Hashing
  * $h(i, k) = h_1(k) + i\*h_2(k)) mod m$
  * 충돌할 경우 h2 사용
* 자료가 삭제되면 문제가 발생한다.

![image](https://user-images.githubusercontent.com/37871541/122190520-d8bf5480-cecc-11eb-926e-a94b5cac9e66.png){: .center-small}*linear 삭제 경우 문제점*

* a, b둘다 해시값이 5인 상황
* 둘다 넣었지, 잘됐어 오른쪽으로 밀렸으니까
* 근데 a 삭제함
* b 검색할래
* ??

# 선택 문제

* 키가 n개인 리스트에서 k번째로 큰(작은) 키를 찾는 문제
* 키는 정렬되어 있지 않다.

## 최대키 찾기

* 최대(최소)키 찾기 : 결론적으로 n-1번의 비교를 수행해야 한다.
* 그럼 한번에 최대키, 최소키를 찾는다면?

### 최소키와 최대키 찾기

![image](https://user-images.githubusercontent.com/37871541/122192873-01e0e480-cecf-11eb-9e6d-c271e092f584.png){: .center-small}*최소키와 최대키 동시에 찾기*

* 한번의 루프에서 최대, 최소 비교를 2번씩 n-1번 해야한다.
* W(n) = 2(n-1)

그런데 이보다 좋은 알고리즘이 존재한다.

### 키를 짝지워서 찾기

![image](https://user-images.githubusercontent.com/37871541/122193127-305ebf80-cecf-11eb-84af-0082d69eaa88.png){: .center-small}*키를 짝지우기*

1. 짝을 지어서 둘만 비교하여 큰놈, 작은놈을 나눈다.
1. 두 그룹을 만들어서 각각의 그룹에서 큰놈 그룹은 최댓값
1. 작은 그룹은 작은 값을 구한다.

동작하는 이유는, 결국 처음에 쌍을 지어서 그룹을 나누는 것이 최댓값이 나올 수 있는 후보 집단, 최소값이 나올 수 있는 후보집단을 나누는데 있다. 그럼 각각의 그룹에서 무조건 최대, 최소가 나올 수 밖에 없기 때문이다.

뭐.. 약간 나아졌다.

## 차대키 (second largest key) 찾기

![image](https://user-images.githubusercontent.com/37871541/122194344-5042b300-ced0-11eb-8c49-1d167f2d2450.png){: .center-small}*토너먼트 방법*

* 단순한 방법
  * 최대키를 찾음 (n-1번 비교)
  * 그 다음 최대키를 찾음(n-2)
* Tournament Method
  * 토너먼트를 진행하여 최대 우승자가 최대키
  * 그럼 우승자한테 진녀석들 중에 차대키가 있겠지.
    * 잘 생각해봐. 내가 최강자야
    * 결승에서 이겼어, 그럼 2등따리가 겪고온 애들은 이미 나보다 실력이 좋을 수 없어
    * 그럼 내가 이기고 온 녀석들 중에 2등따리보다 실력이 좋을수는 있지. 그치.
    * 그러니까 우승자가 제끼고 온놈들만 조사하면 2번째 실력자가 나오는 거지.

![image](https://user-images.githubusercontent.com/37871541/122194907-d7902680-ced0-11eb-9048-8548e06a93c7.png){: .center-small}*시간 복잡도 계산*

* n = 8팀
* 첫번째 4번, 두번재 2번 마지막 1번
* 총 시합 횟수 = $T(n) = n\sum\_{i=1}^{lgn}{1\over 2}^i = n-1$
* 결국 최대키 찾는데 있어서는 동일한 시간이 소요됨
* 차대키를 찾을 떄는, 우승자 기반으로 진놈만 챙기면 되는데 그때 깊이가 logn
* 그럼 해당 리스트에서 비교횟수는 logn-1
* 결과적으로 n_logn-2

## k번째 작은 키 찾기

* 정렬 후 k번재 선택 nlogn
* Quick sort의 partition 방법
* O(n) 방법 : ?

## Partition 방법

![image](https://user-images.githubusercontent.com/37871541/122196520-43bf5a00-ced2-11eb-8971-ccb1d2b13d88.png){: .center-small}*Partition*

* 퀵소트를 진행할 떄 두가지 함수가 있다.
  * Partition
  * Merge
* 이 때 partition은, 특정 피봇보다 작은 값을 왼쪽에, 큰값을 오른쪽에 두는 방식이다.
  * 최악의 경우(모두 비내림차순으로 정렬이되어 있다면) O(n^2)
* 그런데 이러면 좋은 점이 뭐냐면, 해당 피봇이 몇번째로 큰지 한번의 함수를 진행하는 동안 알 수 있다.
* 만약 현재 위치가 k보다 작다면, 오른쪽을 탐색해서 알아내면 되고,
* 크다면 왼쪽을 탐색하면 된다.

![image](https://user-images.githubusercontent.com/37871541/122196930-a9abe180-ced2-11eb-9b65-cfc9ecb13be6.png){: .center-small}*수도 코드*

* 시간 복잡도
  * 최악의 경우 O(n^2)
  * 최고의 경우 (해당 피봇이 계속해서 중간에 위치할 경우)
    * 그러면 계속해서 반으로 나누게 되고, 만약 8개라면 처음에 8개 비교
    * 그다음에 4개비교
    * 그다음에 2개 비교
    * 마지막에 1개 비교
  * 평균적으로 3n

## 선형 시간 방법

![image](https://user-images.githubusercontent.com/37871541/122197836-8cc3de00-ced3-11eb-9161-cdaff0c0511c.png){: .center-small}
![image](https://user-images.githubusercontent.com/37871541/122198524-30ad8980-ced4-11eb-90c3-d8d7e7b61fed.png){: .center-small}

1. 데이터를 5개의 묶음으로 만든다.
1. 각각의 묶음에서 정렬한다.
1. 가운데 값을 모아서 M 배열을 만든다. (중앙에 위치할 수 있는 값의 후보)
1. M 배열에서 가운데를 찾는다. (그냥 가운데 위치만 찾기 위함)
1. 그럼 전체 데이터에서 가운데의 위치만 알아냈다. 전체데이터를 정렬하지 않고.
   * 여기서, 그 가운데 값 m을 기준으로 작은쪽, 큰쪽이 위치할 수 있다.
1. 만약에 내가 찾고자하는 번째 k가 S1보다 작으면, 그 집단으로 가서 찾자
1. S1, S2 더해서 k보다 크면 중앙에 답이 있다는 소리니까 리턴
1. 그렇지 않으면 S3에 있다는 소리니까 그곳을 탐색
   * 이 때 k-s1-s2인 이유는 s3에서 k-s1-s2번째의 위치가 답이기 때문

![image](https://user-images.githubusercontent.com/37871541/122200035-9fd7ad80-ced5-11eb-95cb-9fdf2a6cb402.png){: .center}*의사 코드*

1. 5로 나뉜 뭉치를 정렬하는 것 : n/5 * 5*log5 = n*log5 = O(n)
1. M에 대해서 M/2번쨰 위치 구하기 : T(n/5)
   * 1/5로 배열크기가 줄어듦
   * 해당 알고리즘의 복잡도가 n인 것을 알고있기 때문에 적을 수 있음
1. m에 대해서 구했다면, 이를 기준으로 S1, S2, S3를 나눠야함
   * S 배열이 정렬이 되어있지 않은 상태이기 때문에 하나씩 비교해야 함
   * O(n)
1. k의 위치를 판단하고 다시 호출함 : T(3n/4) - ??

### T(3n/4)?

이 부분을 이해하기 위해서는 결국 S1, S3가 크기가 얼마나 나오는지에 대해 알아야 계산이 가능하다.

![image](https://user-images.githubusercontent.com/37871541/122201219-c9dd9f80-ced6-11eb-8b21-874a31e3d06f.png){: .center}

맨 아래의 그림을 확장해보면 다음과 같다.

![image](https://user-images.githubusercontent.com/37871541/122201940-8172b180-ced7-11eb-9bb0-16a63b0bc7bd.png){: .center}

한번의 중앙 위치를 알아낸 이후에 상황을 그림으로 나타내면 위와 같다. 만약에 여기서, m보다 작거나 같은 영역은 얼마나되니? 라고 물어본다면 대강 3/4정도의 영역이 확실하게 작을 수 있는 지점이다. 그렇기 때문에 다음 스텝으로 넘어감에 있어서 S1, S3는 최악의 경우 3n/4 정도의 개수가 할당될 수 있다. 결과적으로 상수 타임에 가능하다.. ㄷㄷ

## Partition과 median 방법 비교

![image](https://user-images.githubusercontent.com/37871541/122202600-2bead480-ced8-11eb-868c-d12751b3e539.png){: .center}Partition, median 방법 비교\_

* 결국 비교를 해보면, 단순 Partition방법은 모든 값을 비교하면서 pivot을 찾았다는 것
* 그리고 median의 median 방법을 통해 검색하는 영역을 줄였다는 점에서 시간 복잡도의 차이가 발생했다.

# 문자열 매칭

![image](https://user-images.githubusercontent.com/37871541/122203054-9e5bb480-ced8-11eb-8b1f-88d601879cd3.png){: .center-small}*문자열 매칭 문제*

문자열에서 패턴을 찾는 문제.

* 원시적인 방법
* 오토마타
* Rabin-Karp 알고리즘
* Noyer-moore 알고리즘

## 원시적인 방법

![image](https://user-images.githubusercontent.com/37871541/122203157-b3d0de80-ced8-11eb-8299-397eeccd7849.png){: .center-small}*원시적인 방법*

원시적인 방법은 그냥 n-m+1번 반복하는 것. 그리고 각각에 대해 m번 비교 :  O(mn)

## 오토마타

![image](https://user-images.githubusercontent.com/37871541/122203571-217d0a80-ced9-11eb-8f16-16c833de9f35.png){: .center-small}*오토마타 사용*

* 흠 전혀 모르겠다.
* 컴파일러 책을 참고하라고 한다. 와우..

## Rabin-Karp

![image](https://user-images.githubusercontent.com/37871541/122203884-7456c200-ced9-11eb-81a7-5401ab0857e2.png){: .center-small}
![image](https://user-images.githubusercontent.com/37871541/122203903-7a4ca300-ced9-11eb-9a2e-a31bf7ad9164.png){: .center-small}

* 핵심은 숫자로 변경해서 비교하는 것.

![image](https://user-images.githubusercontent.com/37871541/122204026-9bad8f00-ced9-11eb-86ae-61152d4fc7c3.png){: .center-small}

* 여기서 눈치챘겠지만, 계산 테크닉을 이용해서 비교를 줄일 수 있다.
* 그런데 m의 값이 크면 값이 너무 커지기 때문에 방법이 필요하다.

![image](https://user-images.githubusercontent.com/37871541/122204212-d4e5ff00-ced9-11eb-82b8-dca7212138fb.png){: .center-small}

* 적당한 q를 도입해서 모듈러 연산을 도입해 이러한 문제를 해결한다.
* 문제는 모듈러 값이 같다고해서 진짜 매칭이되는지 확인할 방법이 없기 때문에
* 같을 경우 한번 비교해주는 과정이 필요하다.
* 결국 O(n) 알고리즘

## Boyer Moore 알고리즘

![image](https://user-images.githubusercontent.com/37871541/122204910-9f8de100-ceda-11eb-8e03-2053bd14098d.png){: .center-small}

* 핵심이 뭐야?
* 맨처음부터 비교하지 말고 맨 끝을 비교한다음에
* 달라? 그러면 A 배열에서 비교한 녀석을 B에서 찾아봐
* 없어? 없으면 그냥 다 건너뛰어버리는겨

![image](https://user-images.githubusercontent.com/37871541/122205111-d7952400-ceda-11eb-8049-1dc89c892bd5.png){: .center-small}

* 이 때 가만 보면, p에 있는 원소에 대해서 끝의 문자가 어떤것이 나왔냐에 따라 점프하는 이동거리를 아예 구해버렸다. 
* 그러면 추가 계산 중복되는게 없어져버리니까

![image](https://user-images.githubusercontent.com/37871541/122205429-335fad00-cedb-11eb-8659-8bfa1418121b.png){: .center-small}

* 결국 jump를 구하는게 핵심이다.
* 그런데 만약에 해당 문자가 2개라면?
* 작은 값으로 설정한다.
