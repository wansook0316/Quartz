---
title: NSAttributedString
thumbnail: ''
draft: false
tags:
- swift
- NSAttributedString
- String
- Automatic-Reference-Counting
created: 2023-09-30
---

이미지와 글자가 있는 Button을 만들다가, String안에 image를 넣을 수 있다는 것을 알았다!

# NSAttributedString

 > 
 > 텍스트 일부에 대해 특성(시각적 스타일, 하이퍼 링크 등)이 있는 문자열

텍스트 일부에 대해 특성들을 적용할 수 있는 String이다. 기본적으로 Read-only이다. default font로는 Helvetica 12-point를 사용한다. `NSParagraphStyle`을 사용하면 정렬, indent, lineSpacing, lineBreakMode 등을 추가하여 사용할 수 있다. 다음과 같은 것들이 가능하다.

* 부분적 font 적용
* kerning (자간)
* 부분적 Color 적용
* markdown으로 부터 생성
* html으로부터 생성 

````swift
let text = "추가하기"

var attributes = [NSAttributedString.Key: Any]()
attributes[.font] = font
attributes[.foregroundColor] = color
attributes[.kern] = value
attributes[.strokeWidth] = width
attributes[.strokeColor] = color

let style = NSMutableParagraphStyle()
style.minimumLineHeight = minimumLineHeight
style.maximumLineHeight = maximumLineHeight
style.lineSpacing = lineSpacing
style.lineBreakMode = lineBreakMode
attributes[.paragraphStyle] = style

let attributedString = NSAttributedString(string: text, attributes: attr?.rawValue)
````

# NSTextAttachment로 이미지 넣기

특정하나의 요소에 image + Label과 같은 형식으로 넣어주어야 할 때가 있다. 여간 귀찮은 것이 아닌데, 이러한 경우 `NSTextAttachment`와 `NSAttributedString` 을 사용하여 처리하는 방법도 있다.

````swift
let font = UIFont.systemFont(ofSize: 14)
let image = UIImage(name: "addtion")
let imageSize = CGSize(width: 12, height: 12)
let text = "추가하기"

let attachment = NSTextAttachment()
attachment.image = image

let y = (font.capHeight - imageSize.height).rounded() / 2 // font 대비 center
attachment.bounds = CGRect(x: 0, y: y, width: imageSize.width, height: imageSize.height)

[NSAttributedString(attachment: attachment), NSAttributedString.makeSpace(points: self.spacing), attributedString].joined()
````

여기서 font 안넣어주면 default font로 적용되서 원하는 모양이 안나올 수 있다. 아래 margin이 생겼던 것으로 기억한다.

# Reference

* [NSAttributedString](https://developer.apple.com/documentation/foundation/nsattributedstring)
* [NSMutableAttributedString](https://developer.apple.com/documentation/foundation/nsmutableattributedstring)
* [NSParagraphStyle](https://developer.apple.com/documentation/uikit/nsparagraphstyle)
* [NSTextAttachment](https://developer.apple.com/documentation/uikit/nstextattachment)
