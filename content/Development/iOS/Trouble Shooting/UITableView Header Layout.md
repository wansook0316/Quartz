---
title: UITableView Header Layout
thumbnail: ''
draft: false
tags:
- UITableView
- UIKit
- header
- layout
- ios
created: 2023-10-01
---

headerView가 있는 TableView에서 높이는 제대로 맞는데, 이상하게 셀수가 많아질 상황에서 끝까지 스크롤되지 않는 문제가 발생했다.

# headerView의 layout을 먼저 잡아주어야 한다.

* tableView의 header layout을 먼저 잡아주지 않으면 하단의 셀이 안보이는 문제가 생긴다.
* header 영역의 높이가 50이라 했을 때, 스크롤 마지막에서 50만큼 스크롤이 더이상 안되는 문제가 있다.
* 먼저 headerView의 layout을 잡아주면 증상이 해결된다.
