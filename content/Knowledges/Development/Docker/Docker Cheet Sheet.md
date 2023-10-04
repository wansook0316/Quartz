---
title: Docker Cheet Sheet
thumbnail: ''
draft: false
tags:
- docker
- cheat-sheet
- container
created: 2023-10-04
---

# 설치

````bash
brew install docker
````

[mac 용 도커](https://hub.docker.com/editions/community/docker-ce-desktop-mac) 설치하기

# Docker image download

````bash
docker pull hugojuhel/notebook
````

* [Docker Hub](https://hub.docker.com/) 에서 원하는 docker 이미지를 다운로드
* 혹은 아래 예제와 같이 명령어로 다운받을 수도 있음
* [사용한 이미지](https://hub.docker.com/r/hugojuhel/notebook)

# Docker image 확인

````bash
docker images
````

설치한 이미지들을 볼 수 있다.

# Docker container 생성 및 실행

````bash
docker run -it --name jpt -v /Users/Choiwansik/Documents/internship/image_processing/share:/home/jovyan/share -p 28888:8888 hugojuhel/notebook /bin/bash
````

![](Pasted%20image%2020231004183453.png)*사용자 상황에 맞게 옵션 골라 사용*

* 명령어는 항상 root 권한으로 실행한다.
* `-i(interactive)`, `-t(Pseudo-try)` 옵션 : 실행된 Bash 셸에 입력 및 출력을 할 수 있다.
* `-v`, `--volume` 옵션 : host folder와 공유할 수 있다.

# jupyter notebook 실행

````bash
jupyter notebook --ip=0.0.0.0 --allow-root
````

실행하게 되면, 아까 연결해 두었던 로컬 포트로 접속할 경우 사용할 수 있다.

# Docker 명령어

도커 명령어 Cheat Cheet이다. 나중에 이거만 보고 사용하도록 하자.

## 프로세스 보기

````bash
sudo docker ps -a
````

-a 옵션을 사용하면 정지된 컨테이너까지 모두 출력하고, 옵션을 사용하지 않으면 실행되고 있는 컨테이너만 출력한다.

## 컨테이너 시작하기

````bash
sudo docker container start hello
````

이름 대신 container_id를 사용해도 된다.

## 컨테이너 재부팅

````bash
sudo docker container restart hello
````

운영체제 재부팅과 유사하다.

## 컨테이너 접속하기

````bash
sudo docker container attach hello
````

bash에서 `exit` 혹은 `Ctrl+D` 를 입력하면 컨테이너가 정지된다.

## exec 명령으로 컨테이너 외부에서 명령 실행하기

현재 hello 컨테이너의 bin/bash를 실행한 상태라고 가정하자. 그리고 해당 컨테이너에 접속하지 않은 상태로, hello 컨테이너 안의 명령을 실행해보자.

````bash
sudo docker container exec hello echo "Hello World"
````

`docker container exec <컨테이너 이름> <명령> <매개변수>` 형식이다. 컨테이너 대신 컨테이너 id를 사용할 수 있다. 이 명령어는 컨테이너가 실행되고 있는 상태에서만 사용할 수 있으며 정지된 상태에서는 사용할 수 없다.

`docker exec` 명령은 이미 실행된 컨테이너에 `apt-get, yum` 과 같은 명령으로 패키지를 설치하거나 각종 데몬을 실행할 때 활용할 수 있다.

## 컨테이너 정지하기

````bash
sudo docker container stop hello
````

정지한 경우 다시 attach하고 싶으면 start후 가능하다.

## 컨테이너 삭제하기

````bash
sudo docker container rm hello
````

container 명령어를 쓰지 않아도되지만 최신 버전에서는 권장한다.

## 컨테이너 실행 상태로 빠져나오기

컨테이너 안에서 `ctrl+pq`을 누르면 된다.

## 컨테이너 내 사용자 비밀번호를 모를 때

````bash
docker container exec -u 0 -it jpt /bin/bash
````

`-u`는 default user라 password를 필요로 하지 않는다.

## 이미지 삭제하기

````bash
sudo docker rmi ubuntu:latest
````

`docker rmi <이미지 이름>:<태그>` 형식이다. 이미지 이름 대신 id를 사용해도 된다. 태그를 주는 이유는 같은 이름 인 경우 모두 삭제되기 때문이다.

## 정리

|명령|Code|
|::----|:--:|
|버전 확인|$ docker -v|
|이미지 다운로드|$ docker pull \[이미지 명\]|
|다운로드된 이미지 목록|$ docker images|
|컨테이너 생성|$ docker create \[옵션\] \[이미지 명\]|
|컨테이너 생성 및 실행|$ docker run \[옵션\] \[이미지 명\]|
|컨테이너 실행|$ docker start \[컨테이너 명\]|
|컨테이너 재실행|$ docker restart \[컨테이너 명\]|
|컨테이너 접속|$ docker attach \[컨테이너 명\]|
|컨테이너 정지|$ docker stop \[컨테이너 명\]|
|실행중인 컨테이너 목록|$ docker ps|
|정지된 컨테이너 목록|$ docker ps -a|
|컨테이너 명 변경|$ docker rename \[기존 컨테이너 명\] \[새로운 컨테이너 명\]|
|컨테이너 삭제|$ docker rm \[컨테이너 명\]|

# Reference

* [\[Docker\] 설치, 다운로드, 실행, jupyter notebook 연동, 삭제, 기타 등등](https://pbj0812.tistory.com/134)
