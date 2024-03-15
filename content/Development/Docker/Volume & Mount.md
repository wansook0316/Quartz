---
title: Volume & Mount
thumbnail: ''
draft: false
tags:
- docker
- mount
- volume
created: 2023-10-04
---

![](Pasted%20image%2020231004183532.png)*Volume과 Mount*

Docker Conatiner에 쓰여진 데이터는 컨테이너가 삭제될 때 함께 사라진다. 하지만 이에 관계없이 우리는 데이터를 영속적으로 저장할 필요가 있다. 또한 여러개의 컨테이너를 생성하여 사용할 경우, 하나의 폴더를 공유해야 하는 일이 빈번하다.

이러한 필요성에 대해 Docker는 두가지 옵션을 제공한다. 첫째가 `Volume`, 둘째가 `Mount`이다.

# Volume

이 방법은 Docker에서 권장하는 방법이다.

## Volume의 생성

````bash
$ docker volume create hello
hello
````

## Volume의 조회

````bash
$ docker volume ls
DRIVER              VOLUME NAME
local               hello
````

````bash
$ docker volume inspect hello
[
    {
        "CreatedAt": "2020-05-09T17:03:46Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/our-vol/_data",
        "Name": "our-vol",
        "Options": {},
        "Scope": "local"
    }
]
````

`Mountpoint`를 보면 해당 볼륨이 어디에 있는지 알 수 있다.

## 볼륨을 컨테이너에 마운트하기

````bash
$ docker run -v hello:/home/app --name one hugojuhel/notebook touch /app/test.txt
````

`docker run -v <볼륨 이름>:<컨테이너 내의 절대 경로> --name <컨테이너 이름> <image 이름> <명령> <파라미터>` 형식으로 구성되어 있다.

````bash
$ docker inspect hello
(...생략...)
    "Mounts": [
        {
            "Type": "volume",
            "Name": "our-vol",
            "Source": "/var/lib/docker/volumes/our-vol/_data",
            "Destination": "/app",
            "Driver": "local",
            "Mode": "z",
            "RW": true,
            "Propagation": ""
        }
    ],
(...생략...)
````

실제로 생성된 컨테이너를 조사하면 다음과 같이 뜨며, Type이 volume으로 지정된 것을 확인할 수 있다.

이러한 방법은 다른 컨테이너에 마운트할 때에도 동일하게 적용된다.

## Volume 삭제

````bash
$ docker volume rm hello
Error response from daemon: remove hello: volume is in use - [f73130c9dad14644ac46b89fe4018e561a7bcbfa4118d637949642d0d5d742e4, 666dda54f6be8ca852f3150b9741a9cab5a4659fa2e83fe6ca339550072c861ex]
````

삭제할 때는 mount 된 컨테이너를 모두 삭제한 뒤에야 삭제가 가능하다.

삭제를 수행했다면 에러가 뜨지 않을 것이다.

## Volume 청소

````bash
$ docker volume prune
WARNING! This will remove all local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
````

마운트 되지 않은 모든 볼륨을 한번에 정리할 수 있다.

# Bind-Mount

위의 `Volume` 방법을 보면, 경로를 docker가 제시한 경로에 맞춰서 생성된다. 하지만 시스템의 특정 경로를 기반으로 작업하고 싶은 경우도 많다. 이런 필요성에 대해 docker는 `Bind-Mount`를 제공한다.

사용법은 매우 간단하다. 위의 Volume 명이 들어가는 자리에, 원하는 호스트 경로를 적어주는 것으로 끝난다.

````bash
docker run -it --name jpt -v /Users/Choiwansik/Documents/internship/image_processing/share:/home/jovyan/share -p 28888:8888 hugojuhel/notebook /bin/bash
````

이 때 역시나 container의 절대 경로를 써주어야 한다.

````bash
"Mounts": [
            {
                "Type": "bind",
                "Source": "/Users/Choiwansik/Documents/internship/image_processing/share",
                "Destination": "/home/jovyan/share",
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            }
        ],
...
````

`Type`이 `bind`로 묶여있음을 확인할 수 있다.

# Volume vs Bind-Mount

 > 
 > 경로(Mount Point) 관리해 줄까? 말까?

둘의 가장 큰 차이점은, docker가 mount point를 관리해 주느냐의 여부로 나뉜다. 그냥 막 사용하고 싶은 경우애는 volume이 맞을 수 있지만, 컨테이너화된 개발 환경을 구축하고 싶을 때는 bind-mount가 더 유리하다.

### Reference

* [Docker 컨테이너에 데이터 저장 (볼륨/바인드 마운트)](https://www.daleseo.com/docker-volumes-bind-mounts/)
