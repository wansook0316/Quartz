---
title: Canvas
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# Canvas Application

Stack: Archiving, CoreGraphics, MVC, NotificationCenter, SceneDelegate, UIKit, UserDefault, iOS
Team: 1인
진행 기간: 2021/09/06 → 2021/09/17
About: 사각형, 사진, 텍스트, 드로잉에 대해 오브젝트를 만들어 생성하는 캔버스 애플리케이션을 제작했습니다.

# 개요

* 사각형, 사진, 텍스트, 드로잉에 대해 오브젝트를 만들어 생성하는 캔버스 애플리케이션을 제작했습니다.
* 다형성을 기반으로 동작하며, Container ViewController를 각 섹션별로 사용하고 Delegate로 통신하도록 설계하였습니다.
* Model의 변화가 발생할 때마다 각 ViewController로 post 메시지를 보내고, 이를 반영하는 구조를 제작하여 결합도를 낮추려 노력하였습니다.

![](Pasted%20image%2020231004194412.png)

![](133570715-e3b4374d-9573-4fab-ad30-c34e5914ec64.gif)
![](133570715-e3b4374d-9573-4fab-ad30-c34e5914ec64%20(1).gif)

# 사용 개념

* Delegate
* NotificationCenter
* Container View Controller
* Scene Delegate
