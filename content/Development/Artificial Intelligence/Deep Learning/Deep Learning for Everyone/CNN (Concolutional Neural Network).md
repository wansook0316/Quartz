---
title: CNN (Concolutional Neural Network)
thumbnail: ''
draft: false
tags:
- deep-learning
- tensorflow
- convolution
- computer-vision
created: 2023-10-04
---

# Split & Merge (Convolution NN)

## No Padding, No Stride

![](no_padding_no_strides.gif)

## Padding, Stride

![](Pasted%20image%2020231004141153.png)
![](Pasted%20image%2020231004141201.png)

입력 단 자체를 나누어서 노드를 단들고 마지막에 합쳐버린다!

이 발상은, 고양이 실험으로 부터 왔는데, 요약하면, 우리는 그림 전체를 파악하는 것이 아니고, 부분 부분의 입력을 나누어서 받는다는 것이 핵심 아이디어이다.

자세한 설명은, [CNN by Andrew ng](CNN%20by%20Andrew%20ng.md) 여기서 공부해보자!

![](_2019-07-21__11.43.07.png)
![](_2019-07-21__11.47.06.png)

여기서 중요한 것은, 

1. 필터의 깊이는 해당 Activation map의 깊이와 같아야 한다.
1. 필터의 개수에 따라 Activation map의 깊이가 달라진다.
1. convolution 된 뒤의 면적은 stride와 padding에 따라 달라진다.

# Pooling

= sampling

압축? 과 같은 개념!

## Avg Pooling

![](1_uoWYsCV5vBU8SHFPAPao-w.gif)

## Max Pooling

![](Pasted%20image%2020231004140637.png)

# Fully Connected Layer (FC layer)

마지막 단에서 최종 출력 개수로 맞춰주는 것! 소프트맥스를 사용한다.

# Reference

* [vdumoulin/conv_arithmetic](https://github.com/vdumoulin/conv_arithmetic)
* [The Ultimate Guide to Convolutional Neural Networks (CNN) - Blogs SuperDataScience - Big Data | Analytics Careers | Mentors | Success](https://www.superdatascience.com/the-ultimate-guide-to-convolutional-neural-networks-cnn/)
* [A Comprehensive Guide to Convolutional Neural Networks - the ELI5 way](https://towardsdatascience.com/a-comprehensive-guide-to-convolutional-neural-networks-the-eli5-way-3bd2b1164a53)
* [\# CNN Visualization](http://cs.stanford.edu/people/karpathy/convnetjs/demo/cifar10.html)
