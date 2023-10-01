---
title: UITableView Resizing
thumbnail: ''
draft: false
tags:
- ios
- UIKit
- swift
- UITableView
- resizing
created: 2023-10-01
---

tableView를 다루다보면 셀의 크기를 정하는 일이 상당히 귀찮을 때가 있다. 어떻게 하면 동적인 cell을 만들 수 있는지 확인해보자.

# Working with Self-Sizing Table View Cells

애플에서는 일단 이 옵션을 사용하지 말라고 한다. tableViewDelegate에 있는 `tableView:heightForRowAtindexPath`를 사용해서 처리하라고 한다. 아마 성능상 문제일 가능성이 크다.

하지만 우리는 이렇게 단순한 앱만 만드는 것이 아니다. 메신저같은 경우 사용자가 입력하는 text길이에 따라 cell height가 변경되어야 한다. 아니면 사용자가 입력한 텍스트가 가려져서 읽기 어려워질지도 모른다.

## 방법

두가지 property를 사용하면 간단하게 처리할 수 있다.

* `tableView.rowHeight`
* `tableView.estimatedRowHeight`

````swift
private func setupTableView() {
    self.tableView.rowHeight = UITableView.automaticDimension
    self.tableView.estimatedRowHeight = 77
}
````

`.rowHeight`에는, 나 이제부터 컨텐츠에 맞게 계산해서 cell 높이 적용할거야! 라고 알려주고, `.estimatedRowHeight`에는 대충 개발자가 짐작한 cell height를 알려준다. 왜 굳이 알려줄까. 어차피 오토 레이아웃이 계산할텐데?

 > 
 > Providing a nonnegative estimate of the height of rows can improve the performance of loading the table view. If the table contains variable height rows, it might be expensive to calculate all their heights when the table loads. Using estimation allows you to defer some of the cost of geometry calculation from load time to scrolling time.

음이 아닌 추정치를 제공하는 것이 tableView의 성능에 영향을 끼친다고 한다. 만약에 row가 많다면, autolayout 자체를 계산하는 것이 매우 cost가 높을 수 있기 때문이다. 

즉, 추정치를 제공하는 것 자체가 성능적으로 더 좋다는 것. 스크롤하게 되면서 보이는 화면과 연계된 문제인 듯 하다.

# 220419 추가

Refactoring 업무 중, cell의 높이가 반영이 되지 않는 문제가 있었다. viewModel로 부터 data를 로드하고, subscriber가 이를 받은 뒤에 화면에 그려주기만 하면 되는데, 다양한 화면에서 해당 tableView가 보여야 해서 tableView의 동적인 변화가 필요했다.

이전 코드는 다음과 같이 화면이 appear하는 시점에 constraint를 반영하여 해결했다.

````swift
self.tableViewHeight.constant = self.tableView.contentSize.height
self.tableView.layoutIfNeeded()
````

하지만 원래 보여져야 하는 cell의 크기가 60일 때, 계속해서 44의 크기로 보여짐을 확인했다. 문제를 살펴보니, 이전 작업자가 해당 부분을 명시하지 않았음이 확인되었다.

````swift
self.tableView.estimatedRowHeight = 44
self.tableView.rowHeight = UITableView.automaticDimension
````

위 코드는 상속받은 UITableView이다. override하여 변경하지 않아 발생한 문제이다. 실제 겪어보니 배우는게 중요하다는 생각이 든다.

# Reference

* [\[ios\] Self-Sizing Table View Cells](https://baked-corn.tistory.com/124)
* [Working with Self-Sizing Table View Cells](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/WorkingwithSelf-SizingTableViewCells.html)
* [Self-sizing Table View Cells](https://www.raywenderlich.com/8549-self-sizing-table-view-cells)
