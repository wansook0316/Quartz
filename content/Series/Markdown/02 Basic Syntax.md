---
title: Basic Syntax
draft: false
tags:
- Markdown
- Syntax
---

# This is a heading 1

## This is a heading 2

### This is a heading 3

#### This is a heading 4

##### This is a heading 5

###### This is a heading 6

|Style|Syntax|Example|Output|
|-----|------|-------|------|
|Bold|`** **` or `__ __`|`**Bold text**`|**Bold text**|
|Italic|`* *` or `_ _`|`*Italic text*`|*Italic text*|
|Strikethrough|`~~ ~~`|`~~Striked out text~~`|~~Striked out text~~|
|Bold and nested italic|`** **` and `_ _`|`**Bold text and _nested italic_ text**`|**Bold text and *nested italic* text**|
|Bold and italic|`*** ***` or `___ ___`|`***Bold and italic text***`|***Bold and italic text***|
|Highlight|`\=\= \=\=`|`\=\=Highlight\=\=`|==Highlight==|

# Quotes

 > 
 > Human beings face ever more complex and urgent problems, and their effectiveness in dealing with these problems is a matter that is critical to the stability and continued progress of society. 
 > 
 > - Doug Engelbart, 1961

# Callouts

 > 
 > \[!info\]
 > Here's a callout block. 
 > It supports **Markdown**, [Wikilinks](../../Internal%20link.md), and [embeds](../../Embed%20files.md)!

* [Wikilinks](https://help.obsidian.md/Linking+notes+and+files/Internal+links)는 내부 링크 (`[[]]`)를 의미한다.
* [Embeds](https://help.obsidian.md/Linking+notes+and+files/Embedding+files)는 외부 파일을 내부에서 처리하는 것을 말한다. (`![[]]`)

 > 
 > \[!question\] Can callouts be nested? 
 > 
 >  > 
 >  > \[!todo\] Yes!, they can.
 >  > 
 >  >  > 
 >  >  > \[!example\] You can even use multiple layers of nesting.

 > 
 > \[!info\]
 > `[!info`

 > 
 > \[!abstract\]
 > 
 >  > 
 >  > `[!abstract`\]

 > 
 > \[!hint\]
 > 
 >  > 
 >  > `[!hint]`

 > 
 > \[!success\]
 > 
 >  > 
 >  > `[!success]`

 > 
 > \[!warning\]
 > 
 >  > 
 >  > `[!warning]`

 > 
 > \[!failure\]
 > 
 >  > 
 >  > `[!failure]`

 > 
 > \[!error\]
 > 
 >  > 
 >  > `[!error]`

 > 
 > \[!bug\]
 > 
 >  > 
 >  > `[!bug]`

 > 
 > \[!example\]
 > 
 >  > 
 >  > `[!example]`

 > 
 > \[!quote\]
 > 
 >  > 
 >  > `[!quote]`
