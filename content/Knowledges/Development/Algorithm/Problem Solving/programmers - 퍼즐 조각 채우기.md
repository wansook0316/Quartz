---
title: programmers - 퍼즐 조각 채우기
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- swift
- implementation
created: 2023-10-02
---

# 풀이

하라는 대로 구현했다. 일단, board에서는 빈칸을 찾아야 하고, table에서는 채워진 조각을 찾아야 한다. 각각에서 그 빈 구석을 모두 도려낸 뒤에, 그 조각들이 맞는지를 완전탐색했다. 이 때, table에 있는 조각중, 사용을 마친 경우는 최종 결과물에 더해지면 안된다.

# Code

````swift
import Foundation

let blocked = 2

struct Position {
    let y: Int
    let x: Int
    
    init(_ y: Int, _ x: Int) {
        self.y = y
        self.x = x
    }
}

class Block {
    var rowSize: Int
    var colSize: Int
    let fillCount: Int
    var isInserted: Bool = false
    var value: [[Int]]
    
    init(_ rowSize: Int, _ colSize: Int, _ fillCount: Int, _ value: [[Int]]) {
        self.rowSize = rowSize
        self.colSize = colSize
        self.fillCount = fillCount
        self.value = value
    }
    
    private func rotate(){
        var rotated = [[Int]]()
        for j in 0..<value[0].count {
            rotated.append(value.map({ $0[j] }).reversed())
        }
        self.value = rotated
        self.rowSize = rotated.count
        self.colSize = rotated[0].count
    }
    
    func isOk(_ rotated: Block, other block: Block) -> Bool {
        return rotated.rowSize == block.rowSize && rotated.colSize == block.colSize && rotated.fillCount == block.fillCount && rotated.isInserted == false && block.isInserted == false
    }
    
    func match(with block: Block) -> Int? {
        for _ in 0..<4 {
            self.rotate()
            if isOk(self, other: block) {
                if self.value == block.value {
                    self.isInserted = true
                    block.isInserted = true
                    return self.fillCount
                }
            }
        }
        return nil
    }
}



func BFS(start: Position, in board: inout [[Int]], with num: Int) -> Block? {
    let n = board.count
    func isOk(_ y: Int, _ x: Int) -> Bool {
        return (0..<n).contains(y) && (0..<n).contains(x) && board[y][x] == num
    }
    
    let d = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    var q = Array([start])
    var positions = Array([start])
    board[start.y][start.x] = blocked
    
    while !q.isEmpty {
        guard let now = q.first else { return nil }
        q.removeFirst()
        let y = now.y, x = now.x
        
        for i in 0..<4 {
            let ny = y + d[i][0], nx = x + d[i][1]
            if isOk(ny, nx) {
                let position = Position(ny, nx)
                q.append(position)
                positions.append(position)
                board[ny][nx] = blocked
            }
        }
    }
    
    // 모인 positions에 대해서 row 상한 하한, col 상한 하한을 체크한다.
    let rowLowerBound = positions.map { $0.y }.min()!
    let rowUpperBound = positions.map { $0.y }.max()!
    let colLowerBound = positions.map { $0.x }.min()!
    let colUpperBound = positions.map { $0.x }.max()!
    
    var slicedBoard = board[rowLowerBound...rowUpperBound].map { Array($0[colLowerBound...colUpperBound]) }
    slicedBoard = slicedBoard.map({ $0.map( { $0 == blocked ? 1 : 0 })})
    return Block(slicedBoard.count, slicedBoard[0].count, positions.count, slicedBoard)
}

func detach(in board: inout [[Int]], with num: Int) -> [Block] {
    let n = board.count
    var blocks = [Block]()
    for i in 0..<n {
        for j in 0..<n {
            if board[i][j] == num {
                guard let block = BFS(start: Position(i, j), in: &board, with: num) else { continue }
                blocks.append(block)
            }
        }
    }
    return blocks
}


func solution(_ gameBoard:[[Int]], _ table:[[Int]]) -> Int {
    var board = gameBoard, table = table
    let boardBlocks = detach(in: &board, with: 0)
    let tableBlocks = detach(in: &table, with: 1)
    
    var count = 0
    for tBlock in tableBlocks {
        for bBlock in boardBlocks {
            if let matchCount = tBlock.match(with: bBlock) {
                count += matchCount
            }
        }
    }
    return count
}
````

# Reference

* [퍼즐 조각 채우기](https://programmers.co.kr/learn/courses/30/lessons/84021)
