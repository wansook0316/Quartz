---
title: UITableView Separator
thumbnail: ''
draft: false
tags:
- UIKit
- UITableView
- swift
- ios
- interface-separation-principle
created: 2023-10-01
---

UITableView의 Separator와 관련해 해결했던 것들을 적어둔다.

# 높이 늘리기

* 찾아본 결과 방법이 없다.
* 셀 안에 UIView를 만들어서 처리하는 것이 방법.

# Separator 길이 조정

````swift
self.tableView. separatorInset= UIEdgeInsets(top: .zero, left: 10.0, bottom: .zero, right: 10.0)
````

# 테이블 뷰 라인 없애기

````swift
self.tableView.separatorStyle = .none
````

# 왼쪽에 마진이 생기는 경우

````swift
self.tableView.separatorStyle = .singleLine
self.tableView.cellLayoutMarginsFollowReadableWidth = false
self.tableView.separatorInset.left = 0
````

# Reference

* [\[iOS\] UITableView의 Separator에 대해서](https://minzombie.github.io/ios/separator/)
* [\[SWIFT\] UITableView의 separator, 구분선 왼쪽이 안나올 때](https://g-y-e-o-m.tistory.com/68)
* [How to increase the UITableView separator height?](https://stackoverflow.com/questions/3521310/how-to-increase-the-uitableview-separator-height)
* [cellLayoutMarginsFollowReadableWidth](https://developer.apple.com/documentation/uikit/uitableview/1614849-celllayoutmarginsfollowreadablew)
