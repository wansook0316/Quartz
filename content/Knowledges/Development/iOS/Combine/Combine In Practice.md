---
title: Combine In Practice
thumbnail: ''
draft: false
tags: null
created: 2023-09-22
---

var validatedPassword: AnyPublisher\<String?, Never> {
return Publishers.CombineLatest($password, $passwordAgain)
.map { password, passwordRepeat in
guard password == passwordRepeat, password.count > 8 else { return nil }
return password
}
.map { ($0 ?? "") == "password1" ? nil : $0 }
.eraseToAnyPublisher()
}

https://stackoverflow.com/questions/58889764/mistake-in-wwdc-2019-combine-in-practice-code-example-for-combinelatest

이 글에서 전반적으로 어떻게 사용하는지에 대해서 간단하게만 알아본다. 여기서 나오는 publisher나 siubscriber의 경우 직관적으로 이해만 하고 다음 글에서 문서를 다 뜯는 것을 목표로한다.

여기에 Future 등이 있는 듯.
