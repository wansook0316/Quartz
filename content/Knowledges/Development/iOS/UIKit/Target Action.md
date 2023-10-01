---
title: Target Action
thumbnail: ''
draft: false
tags:
- UIControl
- swift
- UIKit
- ios
- target-action
created: 2023-10-01
---

Target / Action은 사용자 interaction을 처리하는 주요 방법으로 알려져있다. 문서를 읽으며 알아보자.

# Target/Action

Target/Action은 대표적인 비동기 이벤트이다. Action이 왔을 때, 처리되는 방식이기 때문이다.

간단하게 Target/Action에 대해서 알아보자. 객체간의 소통을 위해 delegation, notification 등이 있으나, 이것만으로는 화면상에 보이는 것들의 소통에는 부족함이 있다. User Interface에서 가장 전형적인 것은 Graphic 요소이고, 이것들을 구성하는 대부분은 Control이다. 우리가 마주하는 Control은 보통, Button, SLider, Checkbox 등등이 있다. 이 녀석들과의 원할한 소통을 위해 해당 구조를 채택했다.

![](UIKIt_16_TargetAction_0.png)

Control의 역할을 굉장히 간단한데, 사용자의 의도를 해석하고, 그 요청을 수행하기 위해 다른 대상을 가리키는 것이다. 즉 특정 Action이 취해질 경우, 이를 처리할 수 있도록 이 이벤트를 처리하는 다른 녀석을 가리키도록 하는 것이다. 여기서 전달할 때는 많은 정보를 포함하지 않고, 사용자가 어떤 Action을 취했는지에 대해서만 알려준다. 이런 것을 Target/Action 매커니즘이라 한다.

Objective C 런타임을 사용하기 때문에, Code로 처리하기 위해서는 `@objc` 를 적어주어야 한다.

````swift
// 프로그래밍 방식
@objc func doSomething(_ sender: Any) {

}

// 인터페이스 빌더
@IBAction func doSomething(_ sender: Any) { 

}
````

Code로 사용하는 것이 상대적으로 익숙하지 않으니 간단하게 적어보겠다.

````swift
class ViewController: UIViewController {
	
    private let button: UIButton = { 
    	let button = UIButton() 
    	button.setTitle("나를 눌러줘", for: .normal) 
    	button.setTitleColor(.red, for: .normal) 
    	return button 
    }()
    
    override func viewDidLoad() {
    	super.viewDidLoad()
    	self.setupConstraint()
        self.button.addTarget(self, action: #selector(buttonAction), for: .touchUpInside)
    }

    private func setupConstraint() {
        self.view.addSubview(button)
        button.translatesAutoresizingMaskIntoConstraints = false 
        button.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true 
        button.centerYAnchor.constraint(equalTo: view.centerYAnchor).isActive = true
    }
    
    @objc private func buttonAction(_ button: UIButton) { 
        print("버튼이 눌렸습니다.") 
    }

}
````

# UIControl

UIKit에서는 `UIControl` 객체를 상속받아서 Customizing 할 수 있다. Control들의 base class로서, visual element들이 특정 Action 혹은 사용자 interaction을 전달하는 녀석이다. 위에서 보았던 Button, Slider, TextField들이 그 예가 될 수 있다. 

UIControl 객체는 **직접적으로 생성하면 안된다.** Subclassing하여 나만의 Control 객체를 만들고, 그 객체를 생성하여 사용해야 한다. 

이벤트가 일어나게 되면, control은 얽힌 Action을 바로 호출한다. 그럼 이 method를 실제로 찾아서 실행해야 할텐데, 그건 `UIApplication`이 수행한다. 이 과정에서 만약 필요하다면 responder chain을 따라서 메시지를 전달한다. Responder Chain이 궁금하다면 [이 글](https://velog.io/@wansook0316/Hit-Test-Responder-Chain)을 참고하자.

Customizing은 간단하다. 내부 `CALayer`처리가 복잡해서 그렇지.

````swift
class MyCustomControls: UIControl {
     func someMethodThatChangesValue() {
          self.sendActions(for: .valueChanged)
     }
}

myCustomControl = MyCustomControls()
myCustomControl.addTarget(self, action: #selector(yourAction), .valueChanged)
````

이런식으로 재사용할 수 있다. 같은 Control 객체라도 어떤 Event이냐에 따라 다른 Action을 바인딩할 수 있다. 이벤트의 종류는 [UIControl.Event](https://developer.apple.com/documentation/uikit/uicontrol/event)를 참고하자.

또한 Control객체는 상태를 가질 수 있다. 선택된 상태, 활성화 상태 등 다양한 값을 가질 수 있다. 이 값도 설정할 수 있는데, [UIControl.State](https://developer.apple.com/documentation/uikit/uicontrol/state)를 참고하자.

# Reference

* [Target-Action](https://developer.apple.com/library/archive/documentation/General/Conceptual/CocoaEncyclopedia/Target-Action/Target-Action.html)
* [UIControl](https://developer.apple.com/documentation/uikit/uicontrol)
* [UIControl.Event](https://developer.apple.com/documentation/uikit/uicontrol/event)
* [UIControl.State](https://developer.apple.com/documentation/uikit/uicontrol/state)
