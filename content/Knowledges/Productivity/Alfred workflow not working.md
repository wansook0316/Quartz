---
title: Alfred workflow not working
thumbnail: ''
draft: false
tags: null
created: 2023-10-01
---

잘 사용하고 있던 Alfred workflow가 동작하지 않는다.. Mac OS 12.3으로 업데이트하고나서 바로 이런 이슈가 터지다니. 속도가 안나 답답하다.

# Issue 원인

Apple에서 12.3부터 공식적으로 python 2을 지원하지 않는다고 한다. [Python 2](https://pythonclock.org/)는 이제 지원도 안해주니 뭐 이해는 간다.

문제는 Alfred workflow가 \*\*[Python 2 버전만을 지원](https://www.deanishe.net/alfred-workflow/supported-versions.html#why-no-python-3-support)\*\*한다는 것이다. (~~하..~~)

 > 
 > Alfred-Workflow only officially supports the system Pythons that come with macOS (i.e. /usr/bin/python), which is 2.6 on 10.6/Snow Leopard and 2.7 on later versions.

그래서 Workflow 제작자들이 Python library인 `Alfred-Workflow`로 제작한 경우 스크립트가 안먹어서 이 문제가 터진 것.

# 해결 방법

해결 방법은 간단하다. python2를 일단 다시 받자.

````bash
export PATH="/opt/homebrew/bin:/usr/local/bin:${PATH}"
eval "$(brew shellenv)"
brew install pyenv
pyenv install 2.7.18
ln -s "${HOME}/.pyenv/versions/2.7.18/bin/python2.7" "${HOMEBREW_PREFIX}/bin/python"
````

위의 커맨드를 하나씩 따라 쳐주자. 그러면 이제 python 2.7이 설치되었다. 그런데 이렇게만 했다고 적용되는 건 아니다. python2를 사용하고 있는 workflow로 가서 python 실행 위치를 지정해주어야 한다.

![](TroubleShooting_01_AlfredWorkflowNotWorking_0.png)
![](TroubleShooting_01_AlfredWorkflowNotWorking_1.png)

잘 안보이는데 이렇게 변경해주면 된다.

````bash
# From
python filename.py "{query}"

# To
${HOME}/.pyenv/versions/2.7.18/bin/python filename.py "{query}"
````

# 이렇게 해도 안되는 녀석이 있었다.. (Pows)

다행히 migration을 해준 용자님이 계셨다. 땡큐!

* [alfred-powerthesaurus](https://github.com/giovannicoppola/alfred-powerthesaurus)

안된다.. 그래서 그냥 python2로 시도해본 결과

````
Traceback (most recent call last):
  File "/Users/user/Library/Application Support/Alfred/Alfred.alfredpreferences/workflows/user.workflow.C9F20046-9639-4B9A-B500-C54916D16E75/workflow/workflow.py", line 2070, in run
    self.check_update()
  File "/Users/user/Library/Application Support/Alfred/Alfred.alfredpreferences/workflows/user.workflow.C9F20046-9639-4B9A-B500-C54916D16E75/workflow/workflow.py", line 2340, in check_update
    run_in_background('__workflow_update_check', cmd)
  File "/Users/user/Library/Application Support/Alfred/Alfred.alfredpreferences/workflows/user.workflow.C9F20046-9639-4B9A-B500-C54916D16E75/workflow/background.py", line 235, in run_in_background
    retcode = subprocess.call(cmd)
  File "/Users/user/.pyenv/versions/2.7.18/lib/python2.7/subprocess.py", line 172, in call
    return Popen(*popenargs, **kwargs).wait()
  File "/Users/user/.pyenv/versions/2.7.18/lib/python2.7/subprocess.py", line 394, in __init__
    errread, errwrite)
  File "/Users/user/.pyenv/versions/2.7.18/lib/python2.7/subprocess.py", line 1047, in _execute_child
    raise child_exception
OSError: [Errno 2] No such file or directory
````

??? 이건 또 뭐야. 잘 보니 subprocess.py가 존재하지 않는다고 한다. [OSError: \[Errno 2\] No such file or directory while using python subprocess in Django](https://stackoverflow.com/questions/18962785/oserror-errno-2-no-such-file-or-directory-while-using-python-subprocess-in-dj) 해당 글을 보니 함수 호출이 잘못 된 것 같다.

실제로 에러 로그보니 `retcode = subprocess.call(cmd)` 이부분 설명과 같았다.

![](TroubleShooting_01_AlfredWorkflowNotWorking_2.png)
![](TroubleShooting_01_AlfredWorkflowNotWorking_3.png)

그래서 해당 경로로 가서 바꿔줬다.

````bash
# From
retcode = subprocess.call(crop)

# To
retcode = subprocess.call(crop, shell=True)
````

그리고 python 2로 명령어를 바꿔주니 된다!

![](TroubleShooting_01_AlfredWorkflowNotWorking_4.png)

# 마무리

하, 갑자기 안되서 혈압이 올라버렸다. 이제 Script짜서 자동화 만들어둬야 되네..? 귀찮다. 끝!

# Reference

* [Not working on the latest MacOS 12.3](https://github.com/deanishe/alfred-workflow/issues/182)
* [Python 2.7 will retire in...](https://pythonclock.org/)
* [Alfred-Workflow Supported versions](https://www.deanishe.net/alfred-workflow/supported-versions.html#why-no-python-3-support)
* [alfred-powerthesaurus](https://github.com/giovannicoppola/alfred-powerthesaurus)
* [OSError: \[Errno 2\] No such file or directory while using python subprocess in Django](https://stackoverflow.com/questions/18962785/oserror-errno-2-no-such-file-or-directory-while-using-python-subprocess-in-dj)
