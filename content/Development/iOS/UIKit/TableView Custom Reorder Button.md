---
title: TableView Custom Reorder Button
thumbnail: ''
draft: false
tags:
- swift
- UI
- ios
- UITableView
- reordering
created: 2023-10-01
---

테이블 뷰의 reorder 버튼을 변경해야 하는데, API가 없어 고생했던 경험을 공유한다.

# 해결 방법

`UITableView`의 `tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath)`에서 cell 내부에 있는 `UITableViewCellReorderControl`를 변경하면 된다.

## TableView

````swift
extension SomeViewController: UITableViewDelegate {

    public func tableView(_ tableView: UITableView, moveRowAt sourceIndexPath: IndexPath, to destinationIndexPath: IndexPath) {
        self.moveRow(at: sourceIndexPath.row, to: destinationIndexPath.row) // dataSource 변경
    }

    public func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        guard let selectedCell = cell as? ReorderControlAppearanceReplaceable else {
            return
        }
        selectedCell.replaceReorderImage()
    }

}
````

## Cell

````swift
internal protocol ReorderControlAppearanceReplaceable {

    func replaceReorderImage()

}

internal class SomeCell: UITableViewCell, ReorderControlAppearanceReplaceable {

    private let reorderControlView = UIImageView(image: UIImage(image: "이미지 이름"))

    internal func replaceReorderImage() {
        guard let reorderControlView = self.subviews.filter({ String(describing: type(of: $0)) == "UITableViewCellReorderControl" }).first else {
            return
        }

        _ = reorderControlView.subviews
            .first(where: { $0 is UIImageView })
            .map {
                $0.removeFromSuperview()
            }

        self.reorderControlView.frame.size = CGSize(width: Constants.reorderViewWidth, height: Constants.reorderViewWidth)

        reorderControlView.addSubview(self.reorderControlView)

        self.reorderControlView <- Layouts()
            .move(to: .right, margin: .zero, alignment: nil)
            .move(toCenter: .vertical)
    }

}
````

# 정리

* 약간 hack 같은 느낌이 있지만, 현재로서는 이 방법밖에 없다고 한다.

# Reference

* [Change default icon for moving cells in UITableView](https://stackoverflow.com/questions/8603359/change-default-icon-for-moving-cells-in-uitableview/19807800#19807800)
* [UITableViewCellEditControlとUITableViewCellReorderControlの画像を変更する(複数選択可能時のみ)](https://qiita.com/Yaruki00/items/b1b11d54cf0eef8ac75d)
* https://velog.io/@ddosang/iOS-UITableView-%EC%88%9C%EC%84%9C-%EB%B3%80%EA%B2%BD-UITableViewReorderControl
* [\[iOS\] UITableView Drag & Drop으로 Row 이동](https://furang-note.tistory.com/31)
* [Reordering UITableView without reorder control](https://helpex.vn/question/reordering-uitableview-without-reorder-control-60e18ef932040a4027544cb3)
