---
title: Programmers - 상호평가
thumbnail: ''
draft: false
tags:
- algorithm
- implementation
- programmers
- swift
created: 2023-10-02
---

# 풀이

하라는 대로 구현했다. 이거 부캠 시험에서 나온것 같은 기분이.. 일단 그리고 파이썬보다 스위프트가 더 편한 이상 현상이 발견됐다...

# Code

````swift
import Foundation


func getGrade(_ id: Int, _ scores: [Int]) -> String {
    // 최소 index들 구함 -> 일단 그 안에 id가 포함되어 있는지 확인 -> 포함되어 있다면 원소 개수가 1개인지
    // 최대 index들 구함
    var scores = scores
    let minScore = scores.min()!
    let maxScore = scores.max()!
    
    let minIndices = scores.enumerated().filter({ $0.element == minScore }).map { $0.offset}
    let maxIndices = scores.enumerated().filter({ $0.element == maxScore }).map { $0.offset}
    
    if minIndices.count == 1 && minIndices.contains(id) { // 유일한 최저점인 경우
        scores.remove(at: id)
    } else if maxIndices.count == 1 && maxIndices.contains(id) { // 유일한 최고점인 경우
        scores.remove(at: id)
    }
    
    let meanScore = scores.reduce(0, { $0 + $1 })/scores.count
    
    switch meanScore {
    case 90...:
        return "A"
    case 80..<90:
        return "B"
    case 70..<80:
        return "C"
    case 50..<70:
        return "D"
    case ..<50:
        return "F"
    default:
        return ""
    }
}


func solution(_ scores:[[Int]]) -> String {
    var studentScore = Dictionary<Int, [Int]>()
    let numberOfStudents = scores.count
    
    for i in 0..<numberOfStudents {
        studentScore[i] = scores.map { $0[i] }
    }
    
    var answer = ""
    for i in 0..<numberOfStudents {
        answer += getGrade(i, studentScore[i]!)
    }
    
    return answer
}

````

# Reference

* [상호 평가](https://programmers.co.kr/learn/courses/30/lessons/83201?language=swift)
