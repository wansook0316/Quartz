---
title: Subscript
thumbnail: ''
draft: false
tags: null
created: 2023-09-30
---

Subscript는 Swift에 있는 새로운 문법이다. 값 접근에 있어서 의미있는 접근 방법을 정의하여 사용할 수 있다. 예를 들어 행렬이 있을 수 있다. 행렬이라는 자료구조를 만들고, 실제 2차원 배열에 접근하는 것처럼 접근하기 위해 접근 방법을 customizing하는 것이라 생각하면 되겠다. 

# Subscript

* class, struct, enum에 추가 가능
* 간단한 방법으로 member element에 접근할 수 있는 방법
* 하나의 type에 여러개의 subscript 사용 가능
* subscript 하나에 여러개의 parameter 사용 가능
* 예시
  ````swift
  struct Matrix {
      let rows: Int, columns: Int
      var grid: [Double]
  
      init(rows: Int, columns: Int) {
          self.rows = rows
          self.columns = columns
          self.grid = Array(repeating: 0.0, count: rows * columns)
      }
  
      func indexIsValid(row: Int, column: Int) -> Bool {
          return row >= 0 && row < rows && column >= 0 && column < columns
      }
  
      subscript(row: Int, column: Int) -> Double {
          get {
              assert(self.indexIsValid(row: row, column: column), "Index out of range")
              return grid[(row * self.columns) + column]
          }
          set {
              assert(self.indexIsValid(row: row, column: column), "Index out of range")
              grid[(row * self.columns) + column] = newValue
          }
      }
  }
  
  var A = Matrix(rows: 3, columns: 4)
  print(A[2, 3]) // 0.0
  ````
