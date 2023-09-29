---
title: Key Value Observing To Combine
thumbnail: ''
draft: false
tags:
- combine
- key-value-observing
- KVO
created: 2023-09-22
---

https://developer.apple.com/documentation/combine/performing-key-value-observing-with-combine

````swift
self.tableViewObservation = self.tableView.observe(\.contentSize, options: [.new, .old]) { [weak self] (_, _) in
    self?.tableView.invalidateIntrinsicContentSize()
}

self.tableView.publisher(for: \.contentSize)
    .receive(on: DispatchQueue.main)
    .sink { [weak self] _ in
        self?.tableView.invalidateIntrinsicContentSize()
    }
    .store(in: &self.cancellables)
````
