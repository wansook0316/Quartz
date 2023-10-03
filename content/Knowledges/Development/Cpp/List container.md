---
title: List container
thumbnail: ''
draft: false
tags:
- cpp
- list
- vector
created: 2023-10-03
---

# List

이제껏 vector container 에 대해서 집중적으로 사용했는데, list container 역시 vector와 마찬가지로 많이 사용된다.

### Vector

* **장점** : search가 빠르다.
* **단점** : pop/ push 가 느리다.

 > 
 >  ***요소의 내용이 바뀔일이 많이 없으면 Vector 사용***

### List

* **장점** : search가 느리다.
* **단점** : pop/ push 가 빠르다.

 > 
 >  ***요소의 내용이 바뀔일이 많으면 List 사용***

기본적으로 가지는 method는 같기 때문에, 쉽게 사용가능하다.

````c++
#include <iostream>
#include <list>

using namespace std;


int main(){
    list<int> myList{1,2,3,4};
    char command;
    int inputVal;
    bool finished = false;
    while(!finished){
        cout << "I)nput, P)rint, L)ength, E)mpty, Q)uit : ";
        cin >> command;
        switch (command) {
            case 'I':
            case 'i':
                cin >> inputVal;
                myList.push_back(inputVal);
                break;
            case 'P':
            case 'p':
                for(auto elem:myList)
                    cout << elem << '\t';
                cout << endl;
                break;
            case 'L':
            case 'l':
                cout << "Number of items : " << myList.size() << endl;
                break;
            case 'E':
            case 'e':
                myList.clear();
                break;
            case 'Q':
            case 'q':
                finished = true;
                cout << "Exit the program" << endl;
                break;
                
            default:
                cout << "Wrong command" << endl;
                break;
        }
    }
    
    return 0;
}

````

````
I)nput, P)rint, L)ength, E)mpty, Q)uit : I
1
I)nput, P)rint, L)ength, E)mpty, Q)uit : P
1	2	3	4	1	
I)nput, P)rint, L)ength, E)mpty, Q)uit : L
Number of items : 5
I)nput, P)rint, L)ength, E)mpty, Q)uit : E
I)nput, P)rint, L)ength, E)mpty, Q)uit : P

I)nput, P)rint, L)ength, E)mpty, Q)uit : Q
Exit the program
Program ended with exit code: 0
````
