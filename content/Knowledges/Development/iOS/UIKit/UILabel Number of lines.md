---
title: UILabel Number of lines
thumbnail: ''
draft: false
tags:
- UILabel
- UIKit
- number-of-lines
- ios
- swift
created: 2023-10-01
---

UILabel에 들어간 text를 모두 표현하고 싶다면 어떻게 해야할까? 쉬워보이지만 의외로 삽질을 하는 부분이다. 간단하게 알아보자.

# line 수가 결정되어 있는 경우

````swift
self.titleLabel.numberOfLines = 2
self.titleLabel.lineBreakMode = .truncatedTail

self.titleLabel <- Layouts()
    .resize(width: maxWidth)
    .move(to: .bottom, of: self.nicknameLabel, gap: Constants.labelSpace, alignment: nil)
    .move(to: .right, of: self.iconImageView, gap: Constants.imageLabelSpace, alignment: nil)
````

1. 먼저 표현되고 싶은 라인 수를 설정한다.
1. 그럼 그 라인 수를 넘어갔을 때 어떻게 될 것인가? 이 질문이 떠오른다. 설정해주자.
1. 표현되고 싶은 가로 길이만 지정해준다. 그러면 시스템이 계산할 정보가 모두 주어졌기 때문에 처리할 수 있다.
1. 마지막으로 위치를 지정해주자.

# line 수가 결정되어 있지 않은 경우

````swift
self.titleLabel.numberOfLines = .zero

self.titleLabel <- Layouts()
    .resize(width: maxWidth)
    .sizeToFit()
    .move(to: .bottom, of: self.nicknameLabel, gap: Constants.labelSpace, alignment: nil)
    .move(to: .right, of: self.iconImageView, gap: Constants.imageLabelSpace, alignment: nil)
````

1. `numberOfLines`를 0로 설정한다. 문서에 명시적으로 나와있다. 모든 줄을 표시하고 싶은 경우 설정해라.
1. 모든 줄을 표현한다고 했는데, fit하게 크기를 맞추라는 것은 말이 안된다. 크기를 알려줘야 맞추지.
1. 그렇기 때문에 우선적으로 내 사이즈에 대해 알려줘야 한다.
1. 그 다음에 그 크기에 맞게 사이즈를 맞춘다.
1. 다음으로 위치를 조정해준다.

# Reference

* [numberOfLines](https://developer.apple.com/documentation/uikit/uilabel/1620539-numberoflines)
