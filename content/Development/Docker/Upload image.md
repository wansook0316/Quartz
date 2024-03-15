---
title: Upload image
thumbnail: ''
draft: false
tags:
- docker
- image
- docker-hub
created: 2023-10-04
---

## image 화 하기

* 코드가 다른 것으로 파악, 아래 코드는 동작한다.
  ````bash
  $ docker commit -a "jjy" <container name> <원하는 image repo 이름>
  $ docker commit -a "jjy" laughing_wilson wansook/mask_rcnn
  ````

## dockerhub 에 올리기

1. Login하기
   ````bash
   $ docker login
   ````

1. repository 만들기
   보통 형식은 계정이름/해당 repo이름 으로 결정된다.
   내가 만든 이미지의 repository이름을 이와 같게 바꿔주어야 한다.
   ````bash
   $ sudo docker image tag <기존 계정이름/repo name>:<tag> <새 계정이름/new repo name>:<new tag>
   $ docker image tag wansook/mask_rcnn wansook0316/mask_rcnn:first_commit
   ````

1. docker hub 에 push하기
   ````bash
   $ docker push wansook0316/mask_rcnn:first_commit
   ````
