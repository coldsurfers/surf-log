---
title: Web Storages
excerpt: localStorage와 sessionStorage
category: dev
thumbnail: js.png
createdAt: 2022-03-17T11:06:57.532Z
---
# LocalStorage

document 객체 안에 포함.

localStorage는 sessionStorage와 비슷하지만 sessionStorage는 session이 만료되면 사라진다.
localStorage는 session이 만료되더라도 사라지지 않는다.

localStorage는 http protocol에 따라서 다르게 저장된다.

같은 도메인 호스트를 가지고 있더라도, http와 https에서의 localStorage는 다르다.

자동으로 값은 문자열로 변환되어 저장되며, key, value 형태로 저장된다.
각 key, value는 2 byte를 최대로 UTF-16 DOMString 형태로 저장한다.

```js
localStorage.setItem(key, value);
localStorage.getItem(key);
localStorage.clear() // localStorage 항목 전체 제거
```

# Session Storage

브라우저가 열려있는 동안만 값을 저장한다.
세션 쿠키와는 다르게 새 탭이나 새 페이지를 열면 또 새로운 sessionStorage가 동작.
http protocol에 따라 다르게 동작한다. (http, https)
각 key, value별로 최대 2 byte까지 저장 가능, UTF-16 DOMString 형태로 저장.

```js
sessionStorage.setItem(key, value);
sessionStorage.getItem(key);
```