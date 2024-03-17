---
title: Format
thumbnail: ''
draft: false
tags:
- python
- output
- format
created: 2023-10-04
---

## format()

````python
print('{0} ate {1} apples {2}'.format('I', '3', 'yesterday'))
print('{0} ate {1} apples {2}'.format('You', '5', 'at 2 pm'))
print('{1} ate {0} apples {2}'.format('5', 'You', 'at 2 pm'))
print('{} ate {} apples {}'.format('I', '3', 'yesterday'))

import math
myPi = math.pi

print('{0} {1:.4f} '.format(2,myPi) )
print('Pi rounded to {0} decimal places is {1:.5f}.'.format(4, myPi))


>>> I ate 3 apples yesterday
>>> You ate 5 apples at 2 pm
>>> You ate 5 apples at 2 pm
>>> I ate 3 apples yesterday
>>> 2 3.1416
>>> Pi rounded to 4 decimal places is 3.14159.
````

문자열.format() 을 사용하면, 결과값의 형태를 규격화 할 수 있다.
