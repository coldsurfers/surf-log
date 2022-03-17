---
title: JS Asynchronous 간략 설명
excerpt: promise, worker, animation
category: dev
thumbnail: js.png
createdAt: 2022-03-17T11:32:19.056Z
---
# JS Asynchronous

## Promise

Promise와 같은 비동기 작업은 eventQueue에 들어간다.
main thread가 끝난 후 실행되어 Javascript의 block 현상을 막는다.
queued된 작업들은 가능한 빨리 실행되어 Javascript 환경으로 결과를 반환해준다.

## Worker

분리된 thread에서 태스크들을 실행 가능하게 한다.
하지만 여러 thread를 동시에 사용한다면 동시성을 보장하기 어렵다.
따라서 이러한 사이드 이펙트를 막기 위해서 main 쪽 코드와 worker의 코드는 완벽히 분리되어야 한다. 같은 변수를 공유하면 사이드 이펙트가 일어난다.

### 종류
* Shared Worker
* Dedicated Worker
* Service Worker

## Animation

```js
element.animate();
```

### 예시

```js
const aliceTumbling = [
  { transform: 'rotate(0) scale(1)' },
  { transform: 'rotate(360deg) scale(0)' }
];

const aliceTiming = {
  duration: 2000,
  iterations: 1,
  fill: 'forwards'
}

const alice1 = document.querySelector("#alice1");
const alice2 = document.querySelector("#alice2");
const alice3 = document.querySelector("#alice3");

alice1.animate(aliceTumbling, aliceTiming);
```