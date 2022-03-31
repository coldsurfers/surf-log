---
title: Event Loop in Browser 번역 (feat. Macro Task와 Micro Task)
excerpt: Macro Task와 Micro Task의 차이
category: dev
thumbnail: js.png
createdAt: 2022-03-31T02:26:22.978Z
---
# Event Loop in Browser 번역 (feat. Macro Task와 Micro Task)

[원글 링크 (dev.to)](https://dev.to/jasmin/difference-between-the-event-loop-in-browser-and-node-js-1113)

![how event loop works in browser](https://res.cloudinary.com/practicaldev/image/fetch/s--I8K4E512--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tg7893fgvd0q8im1fy3s.png)

1. Heap
	* 함수에서 정의한 object와 변수를 저장한다
2. Call Stack
	* 코드에서 만든 함수들을 LIFO형식의 스택으로 쌓는다.
    * 가장 마지막에 들어온 것이 가장 위에 쌓이는 형태 (가장 처음 들어온 것이 가장 아래에 쌓인다.)
3. Web API
	* V8 엔진에 의해서 제공되는 추가적인 기능들이다.
    * Web API를 사용하는 함수들은 이 컨테이너에 저장되었다가, Web API가 완료 시 나오게 된다. (callback 함수)
4. Queues
	* 비동기적인 코드의 응답을 계산하기 위해서 사용된다.
    * 이러한 응답들은 엔진을 블락하지 않는다.
    * **Macro Task Queue**
    	* Job Queue보다 낮은 우선순위에 있는 비동기 함수들을 실행시킨다.
        * 또한 DOM Events, Ajax calls, setTimeout 등의 함수들을 실행시킨다.
	* **Micro Task Queue**
    	* Message Queue 보다 높은 우선순위에 있는 비동기 함수들을 실행 시킨다.
        * promise를 사용하는 비동기 함수들을 실행시킨다.
        
> Event Loop는 Call Stack을 확인하여 Stack이 비어있을 때에 Queue에 있는 함수들을 Call Stack으로 넣고 실행한다. 이미 제공된 함수들은 높은 우선순위를 받게 되고 Message Queue에 있는 함수들보다 먼저 실행된다.