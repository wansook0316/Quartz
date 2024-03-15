---
title: Custom Transition
thumbnail: ''
draft: false
tags:
- UIKit
- ios
- swift
- transition
created: 2023-10-01
---

이전 글에서 PresentationController가 무엇인지 배웠다. 그런데, Transition Animator를 제공하는 부분에서 `UIViewControllerAnimatedTransitioning`이라는 친구를 보았다. 오늘의 주제는 이녀석이다.

# UIViewControllerAnimatedTransitioning

Custom Transition에 있어 필요한 animation을 구현하기 위한 method들이 모여 있는 프로토콜이다. 이 프로토콜을 채택한 구현체를 넘겨주면 된다.

해당 Protocol의 method를 사용하면, "고정된 시간 내에 VC를 화면밖으로 전환하기 위한 애니메이션을 정의한 객체"를 만들 수 있다. 대화형 같은 경우 `UIViewControllerInteractiveTransitioning`를 통해 처리해주어야 한다. 구현해야 하는 method들은 다음과 같은 것들이 있다.

* `transitionDuration(using:)`: Required
  * Transition Animation의 Duration을 지정한다.
* `animateTransition(using:)`: Required
  * animation을 정의해준다. 
  * 상황에 맞는 여러 다른 animator를 제공할 수도 있다. (예를 들어 `.present`, `.dismiss`)

두 Method 모두 [UIViewControllerContextTransitioning](https://developer.apple.com/documentation/uikit/uiviewcontrollercontexttransitioning)이라는 Protocol 구현체로부터 Transition이 일어나는 동안의 정보들을 얻을 수 있다. 이를 Transition Context라 한다. 그 안에는 이전 글에서 설명한 `containerView`, `Frame` 정보, `isInteractive`, `isAnimated` 등등의 정보를 얻을 수 있다.

# Project

이전에 보았던 AppStore의 연장선에서 알아보겠다. 이전에 `CardDetailViewController`가 `UIViewControllerTransitioningDelegate`를 채택하고 여기서 3개의 method를 구현해줬었는데, Presentation Controller와 관계 없는 메서드가 둘 있었다.

````swift
extension CardDetailViewController: UIViewControllerTransitioningDelegate {
    
    func animationController(forPresented presented: UIViewController, presenting: UIViewController, source: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        return TodayAnimationTransition(animationType: .present)
    }
    
    func animationController(forDismissed dismissed: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        return TodayAnimationTransition(animationType: .dismiss)
    }
    
    func presentationController(forPresented presented: UIViewController, presenting: UIViewController?, source: UIViewController) -> UIPresentationController? {
        return CardPresentationController(presentedViewController: presented, presenting: presenting)
    }
}
````

위의 두 메서드가 그것이다. 이전 글에서는 present, dismiss에 맞는 각각의 animator를 제공해주었다고 했었다. 이제는 저녀석의 실체를 확인할 차례이다.

## TodayAnimationTransition

````swift
fileprivate let transitonDuration: TimeInterval = 1.0

enum AnimationType {
    case present
    case dismiss
}

class TodayAnimationTransition: NSObject {
    let animationType: AnimationType!
    
    init(animationType: AnimationType) {
        self.animationType = animationType
        super.init()
    }
}
````

일단 기본 반찬부터 보자. animator에 관련된 것을 처리하기 위해서 time interval을 정의하였고, Type까지 나눠서 관리하고 있다. 초기화할 때, Type을 정의하면, 이에 맞는 Animator를 제공할 생각인가보다.

````swift
extension TodayAnimationTransition: UIViewControllerAnimatedTransitioning {

    func transitionDuration(using transitionContext: UIViewControllerContextTransitioning?) -> TimeInterval {
        return transitonDuration
    }
    
    func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
        if animationType == .present {
            animationForPresent(using: transitionContext)
        } else {
            animationForDismiss(using: transitionContext)
        }
    }

}
````

아까 말했던 `UIViewControllerAnimatedTransitioning`를 구현할 때 Required되는 두개의 method를 구현하고 있다. animation 지속 시간과, 어떤 animation을 진행할 것인지에 대한 method이다. 코드 작성자는 type에 맞게 두개의 처리를 하고 있다.

````swift
extension TodayAnimationTransition: UIViewControllerAnimatedTransitioning {

    func animationForPresent(using transitionContext: UIViewControllerContextTransitioning) {
        let containerView = transitionContext.containerView
        //1.Get fromVC and toVC
        guard let fromVC = transitionContext.viewController(forKey: .from) as? UITabBarController else { return }
        guard let tableViewController = fromVC.viewControllers?.first as? TodayViewController else { return }
        guard let toVC = transitionContext.viewController(forKey: .to) as? CardDetailViewController else { return }
        guard let selectedCell = tableViewController.selectedCell else { return }
        
        let frame = selectedCell.convert(selectedCell.bgBackView.frame, to: fromVC.view)        
        //2.Set presentation original size.
        toVC.view.frame = frame
        toVC.scrollView.imageView.frame.size.width = GlobalConstants.todayCardSize.width
        toVC.scrollView.imageView.frame.size.height = GlobalConstants.todayCardSize.height
        
        containerView.addSubview(toVC.view)
        
        //3.Change original size to final size with animation.
        UIView.animate(withDuration: transitonDuration, delay: 0, usingSpringWithDamping: 0.5, initialSpringVelocity: 0, options: [], animations: {
            toVC.view.frame = UIScreen.main.bounds
            toVC.scrollView.imageView.frame.size.width = kScreenW
            toVC.scrollView.imageView.frame.size.height = GlobalConstants.cardDetailTopImageH
            toVC.closeBtn.alpha = 1
            
            fromVC.tabBar.frame.origin.y = kScreenH
        }) { (completed) in
            transitionContext.completeTransition(completed)
        }
    }
    
    func animationForDismiss(using transitionContext: UIViewControllerContextTransitioning) {
        guard let fromVC = transitionContext.viewController(forKey: .from) as? CardDetailViewController else { return }
        guard let toVC = transitionContext.viewController(forKey: .to) as? UITabBarController else { return }
        guard let tableViewController = toVC.viewControllers?.first as? TodayViewController else { return }
        guard let selectedCell = tableViewController.selectedCell else { return }
        
        UIView.animate(withDuration: transitonDuration - 0.3, delay: 0, usingSpringWithDamping: 0.8, initialSpringVelocity: 0, options: [], animations: {
            let frame = selectedCell.convert(selectedCell.bgBackView.frame, to: toVC.view)
            fromVC.view.frame = frame
            fromVC.view.layer.cornerRadius = GlobalConstants.toDayCardCornerRadius
            fromVC.scrollView.imageView.frame.size.width = GlobalConstants.todayCardSize.width
            fromVC.scrollView.imageView.frame.size.height = GlobalConstants.todayCardSize.height
            fromVC.closeBtn.alpha = 0
            
            toVC.tabBar.frame.origin.y = kScreenH - toVC.tabBar.frame.height
        }) { (completed) in
            transitionContext.completeTransition(completed)
            toVC.view.addSubview(toVC.tabBar)
        }
    }
    
}
````

실제 진행하는 code가 여기에 담겨있다. 사실 이 부분은 나중에 구현하면서 삽질할 것이기 때문에 덜 중요하다고 판단하여 스킵한다. 

# Reference

* [UIViewControllerAnimatedTransitioning](https://developer.apple.com/documentation/uikit/uiviewcontrolleranimatedtransitioning)
* [UIViewControllerInteractiveTransitioning](https://developer.apple.com/documentation/uikit/uiviewcontrollerinteractivetransitioning)
* [UIViewControllerContextTransitioning](https://developer.apple.com/documentation/uikit/uiviewcontrollercontexttransitioning)
* [iOS) UIPresentationController 를 알아보고 App Store clone app 을 살펴보자](https://gyuios.tistory.com/74)
* [iOS) Presentation 과 Transition 그리고 Animation...](https://koggy.tistory.com/10?category=922104)
* [iOS Swift Tutorial: Create Advanced Interactive Animations with UIKit](https://www.youtube.com/watch?v=Yrb78U3V16g)
* [appstore-clone](https://github.com/DragonTnT/appstore-clone)
