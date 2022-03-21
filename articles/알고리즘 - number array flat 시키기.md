---
title: 알고리즘 - number array flat 시키기
excerpt: depth에 관계없이 number array를 모두 flat 시켜보자
category: dev
thumbnail: unsplash-programming.jpg
createdAt: 2022-03-21T09:16:03.780Z
---
# 알고리즘 - number array flat 시키기

[코드샌드박스](https://codesandbox.io/s/condescending-haslett-xeqbm0?file=/src/index.js)

### 문제 1
> [1, [2, 3], [4, 5]]를 모두 flat 해보세요

**답안**

```js
function flat(numbers) {
  var answer = [];
  answer = numbers;
  answer = answer.flatMap((v) => v);
  return answer;
}

console.log("문제 1:", flat([1, [2, 3], [4, 5]]));
```

답안 설명: 간단하게 flatMap을 쓰면 2 depth array까지는 flatten이 가능하다.

### 문제 2
> [1, [2, 3], [4, 5], [4, [5, 6, [6, 7]]]]를 모두 flat 해보세요

**답안**

```js
function flatAll(numbers) {
  var answer = [];
  answer = numbers;
  while (answer.some((v) => Array.isArray(v))) {
    answer = answer.flatMap((v) => v);
  }
  return answer;
}

console.log("문제 2:", flatAll([1, [2, 3], [4, 5], [4, [5, 6, [6, 7]]]]));
```

답안 설명: depth 가 무한개일때라고 가정 할때, 모두 flatten작업이 들어가야 하므로, `some` 함수를 사용하여 하나라도 array type인 것을 걸러낸다. 따라서 answer값을 계속 검사하여 하나라도 array type을 가질때까지 모두 flat 작업을 계속 한다.