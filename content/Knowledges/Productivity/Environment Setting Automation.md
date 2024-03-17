---
title: Environment Setting Automation
thumbnail: ''
draft: false
tags:
- environment
- setting
- automation
- mac
created: 2023-09-30
---

# 왜 필요한가?

* 주기적인 포맷이 필요하다는 것을 느꼈다. 7년동안 정리를 안하다보니 나도 스트레스를 받더라..
* 그럴 때마다 기존에 사용하는 환경을 다시 구축하는게 너무나 시간낭비고 하기 싫었다.
* 셀스크립트를 통해 자동화를 해둔다면 생산성 향상이 있을 것이라 판단!

# 장단점

* 장점
  * 주기적인 기기 변경이나 여러 디바이스에 동일한 환경을 세팅해야 하는 필요가 있을 때 매우 유용하다.
* 단점
  * 시간을 내서 만들어놔야 하므로 귀찮다.

# 목표

* 내가 사용할 앱들에 대해서 스크립트 한번으로 세팅이 가능하도록 만든다.

* [결과물](https://github.com/super-wansook/DevelopEnvSettingForMac/) 해당 링크에서 받아서 사용하면 된다.

## 설치할 프로그램 목록

해당 항목이 마음에 들지 않는다면, github에서 받아 `Brewfile`을 수정하면 된다. 개인적으로 추가도 가능하다.

### 기본 설치

* bat
* fasd
* fzf
* git
* git-lfs
* mas
* neofetch
* neovim
* tig
* zsh
* mas
* wget
* python3

### Brew로 설치

* quicktype

### 웹으로부터 설치

* alfred
* appcleaner
* gitkraken
* hammerspoon
* iterm2
* notion
* slack
* telegram
* visual-studio-code
* zoom
* keka
* monitorcontrol
* camo-studio
* dash
* figma
* google-chrome
* postman
* karabiner-elements
* charles
* mattermost
* zeplin
* telegram

### 앱스토어로부터 설치

* Accelerate for Safari
* BetterJSON for Safari
* ColorSlurp
* Dark Reader for Safari
* Enpass - Password Manager
* Gifski
* KakaoTalk
* Keynote
* Magnet
* Microsoft Excel
* Microsoft PowerPoint
* Microsoft Word
* Movist
* SnippetsLab
* Spark – Email App by Readdle
* Unicorn Blocker
* Yoink
* Unicorn HTTPS
* Paste JSON as Code • quicktype
* Slack
* Twitter
* ScreenBrush
* Xcode

# 방법

1. HomeBrew를 다운로드 한다.

````zsh
# 설치확인 명령어
brew doctor
# Homebrew 설치 명령어
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
````

2. cask, mas 설치한다.

* [cask](https://github.com/Homebrew/homebrew-cask): 웹사이트에서 받을 수 있는 어플리케이션 설치를 도와주는 라이브러리
* [mas](https://github.com/mas-cli/mas): 앱스토어에서 받을 수 있는 어플리케이션 설치를 도와주는 라이브러리

````zsh
brew install cask
brew install mas
````

3. brewfile을 만든다.

````zsh
touch Brewfile
````

4. 설치하고 싶은 패키지가 brew에 있는지 확인한다.

* [brew 패키지 리스트](https://formulae.brew.sh/formula/)

만약 기본 저장소에 있다면 Formulae에 있다고 뜨고, 웹 저장소가 연결되어 있다면 casks에 있다고 뜬다.
이 차이를 기반으로 Brewfile을 작성해주면 된다.

혹은 터미널 창에서 `brew search`를 통해서 찾는 방법도 있다.

5. 만약 없다면 앱스토어에서 찾아본다.

mas 패키지는 앱스토어와 연결해서 여러 명령을 처리할 수 있는 라이브러리이다. 아래의 다양한 명령어 중에서 `search`를 사용해서 찾으면 된다. 이 때, id까지 명시해서 brewfile에 작성한다.

∙ mas account : 맥 앱스토어에서 로그인된 애플 ID를 출력합니다.
∙ mas help : 도움말을 볼 수 있습니다.
∙ mas install : 맥 앱스토어에서 배포중이거나 배포한 적이 있는 앱을 내려받을 수 있습니다.
∙ mas list : 맥 앱스토어를 통해 설치한 앱을 목록으로 보여줍니다.
∙ mas outdated : 다운로드가 중단되거나 실패한 앱을 내려받을 수 있습니다.
∙ mas search : 맥 앱스토어에서 앱을 검색합니다. **App Bundle Id를 찾을 수 있습니다.**
∙ mas signin/signout : 맥 앱스토어에서 로그인/로그아웃합니다.
∙ mas upgrade : 맥 앱스토어 업데이트 기능을 수행합니다.
∙ mas version : mas-cli 버전을 확인합니다.

6. 완성된 brewfile은 다음과 같다.

````zsh
tap "homebrew/core"
tap "homebrew/cask"
tap "homebrew/cask-fonts"
tap "homebrew/bundle"

# brew install
brew "bat"
brew "fasd"
brew "fzf"
brew "git"
brew "git-lfs"
brew "mas"
brew "neofetch"
brew "neovim"
brew "tig"
brew "zsh"
brew "mas"
brew "wget"
brew "python3"

# brew install app
brew install quicktype

# cask install
cask "alfred"
cask "appcleaner"
cask "gitkraken"
cask "hammerspoon"
cask "iterm2"
cask "notion"
cask "slack"
cask "telegram"
cask "visual-studio-code"
cask "zoom"
cask "keka"
cask "monitorcontrol"
cask "camo-studio"
cask "dash"
cask "figma"
cask "google-chrome"
cask "postman"
cask "karabiner-elements"
cask "charles"
cask "mattermost"
cask "zeplin"
cask "telegram"

# Mac App
mas "Accelerate for Safari", id: 1459809092
mas "BetterJSON for Safari", id: 1511935951
mas "ColorSlurp", id: 1287239339
mas "Dark Reader for Safari", id: 1438243180
mas "Enpass - Password Manager", id: 732710998
mas "Gifski", id: 1351639930
mas "KakaoTalk", id: 869223134
mas "Keynote", id: 409183694
mas "Magnet", id: 441258766
mas "Microsoft Excel", id: 462058435
mas "Microsoft PowerPoint", id: 462062816
mas "Microsoft Word", id: 462054704
mas "Movist", id: 461788075
mas "SnippetsLab", id: 1006087419
mas "Spark – Email App by Readdle", id: 1176895641
mas "Unicorn Blocker", id: 1231935892
mas "Yoink", id: 457622435
mas "Unicorn HTTPS", id: 1475628500
mas "Paste JSON as Code • quicktype", id: 1330801220
mas "Slack for Desktop", id: 803453959
mas "Twitter", id: 1482454543
mas "ScreenBrush", id: 1233965871
mas "Xcode", id: 497799835

````

7. 해당 파일을 실행시킨다.

````zsh
brew bundle --file=./Brewfile
````

혹은, 추가 설정이 필요하다면 셀 스크립트를 만들고 이를 실행시키는 방법도 있다. 브랜디 랩스의 기술 블로그를 참고했다.

````zsh
#!/usr/bin/env bash

# Homebrew 설치 여부 확인
if ! which brew
then
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

# 스크립트 내에서 일부 sudo 권한이 필요한 명령을 수행하기 위해 root 패스워드를 입력
# sudo 권한이 필요한 이유 : cask로 설치한 애플리케이션을 바로 실행하기 위해 다운로드 된 파일에 대한 격리 속성 제거 작업
read -r -s -p "[sudo] sudo password for $(whoami):" pass

# BrewFile 실행 명령어
brew bundle

# 설치 성공 완료 메세지 노출
printf '\n install success! \n'
````

8. 셀 스크립트의 실행 권한을 주자

````zsh
chmod +x ./install.sh
````

9. 실행하자.

````zsh
sh install.sh
````

`install.sh`에는 개인적으로 세팅한 것들이 있다. 예를 들어 python 2.18 버전을 가상환경을 통해 설치하는 것이 대표적인 예가 될 수 있겠다. 해당 버전을 설치하게 된 이유는 [이 글](https://velog.io/@wansook0316/Alfred-Workflow-Not-Working)을 참고해주면 고맙겠다. 좀 맘에 안든다면, 해당 python 2버전을 설치하는 부분만 지워주면 되겠다.

# 현재 상태를 저장하고 싶다면

````zsh
brew bundle dump
````

bundle이라는 기능을 통해서 현재 내 맥에 설치되어 있는 앱들을 Brewfile로 저장하거나 생성하는 것이 가능하다.

# 추가 - 동영상 녹화 방법

* https://www.youtube.com/watch?v=0Ce0HEwpC48&t=65s
* 내부 소리까지 녹화 가능하다.

# 참고

* [DevelopEnvSettingForMac](https://github.com/super-wansook/DevelopEnvSettingForMac/)

* [Homebrew와 Shell Script를 사용하여 맥(Mac) 개발 환경 구축 자동화하기](https://dev-yakuza.posstree.com/ko/environment/configure-development-environment-on-mac-with-homebrew-and-shell-script/)
* [Homebrew로 Mac 개발 환경 세팅 자동화](http://labs.brandi.co.kr/2020/05/26/leekh.html)
