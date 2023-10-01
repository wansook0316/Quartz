---
title: Scroll to Row item
thumbnail: ''
draft: false
tags:
- ios
- UIKit
- swift
- UITableView
- UICollectionView
created: 2023-10-01
---

CollectionView나 TableView에서 특정 요소로 스크롤 시키는 방법에 대해 알아본다.

# TableView

````swift
self.tableView.scrollToRow(at: IndexPath(row: 10, section: .zero),
                           at: .bottom,
                           animated: true)
````

* 여기서 이동할 때, 해당 요소가 어느 위치에 있는지 결정할 수 있다. 
* top, middle, bottom이 키값으로 존재한다.
* [UITableView.ScrollPosition](https://developer.apple.com/documentation/uikit/uitableview/scrollposition) 참고

# CollectionView

````swift
self.collectionView.scrollToItem(at: IndexPath(row: 10, section: 0),
                                 at: .bottom,
                                 animated: true)
````

* 이 친구같은 경우에는 옵션이 보다 다양한다.
* [UICollectionView.ScrollPosition](https://developer.apple.com/documentation/uikit/uicollectionview/scrollposition) 참고

# Reference

* [scrollToRow(at:at:animated:)](https://developer.apple.com/documentation/uikit/uitableview/1614997-scrolltorow)
* [scrollToItem(at:at:animated:)](https://developer.apple.com/documentation/uikit/uicollectionview/1618046-scrolltoitem)
