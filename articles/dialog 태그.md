---
title: dialog 태그
excerpt: modal을 위한 웹 표준 태그
category: dev
thumbnail: js.png
createdAt: 2022-03-17T11:17:54.538Z
---
# <dialog /> 대화 상자 요소
tabindex 속성을 dialog에 사용해서는 안 된다.
IE에서는 지원하지 않는다

## 속성
* open: 대화상자가 활성화 된 상태임을 나타낸다. open이 없을 때에 사용자에게 대화상자가 보여져선 안 된다. 

## 예시

### open
```html
<dialog open>
  <p>여러분 안녕하세요!</p>
</dialog>
```

### showModal event
```js
updateButton.addEventListener('click', function onOpen() {
  if (typeof favDialog.showModal === "function") {
    favDialog.showModal();
  } else {
    alert("The <dialog> API is not supported by this browser");
  }
});
```

### close event
```js
favDialog.addEventListener('close', function onClose() {
  outputBox.value = favDialog.returnValue + " button clicked - " + (new Date()).toString();
});
```

[MDN 문서](https://developer.mozilla.org/ko/docs/Web/HTML/Element/dialog)