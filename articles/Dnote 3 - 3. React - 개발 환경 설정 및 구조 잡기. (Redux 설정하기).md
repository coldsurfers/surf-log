---
title: Dnote 3 - 3. React - 개발 환경 설정 및 구조 잡기. (Redux 설정하기)
excerpt: Dnote 3 - 3. React - 개발 환경 설정 및 구조 잡기. (Redux 설정하기)
category: velog
thumbnail: Velog.png
createdAt: 2018-09-21T05:28:59.139Z
---
기본적인 스타일과 구조를 잡았으니, 이제 리덕스를 설정해야겠습니다.

리덕스는 글로벌하게 상태관리를 할수있게 도와주는 도구라고 생각하는데요, 딱히 복잡하지 않은 프로젝트에서는 굳이 리덕스를 사용하지 않아도 된다고 생각합니다. 허나 저는 API통신을 할 것이고, 평소에 리덕스를 사용해왔기 때문에, 리덕스 스토어에서 전체 상태를 관리할 예정입니다.

또한 이 튜토리얼의 리덕스는 redux-observable을 사용합니다. rxjs의 개념이 도입된 라이브러리 인데요, rxjs의 개념을 가지고 계신 분들이라면 충분히 따라오실수 있고, 만약 아니라도, API통신에만 rxjs가 사용되므로, 각자 궁금하신 부분들은 https://redux-observable.js.org/ 이 페이지에서 학습하셔도 금방 따라오실수 있을거라고 생각합니다.

자 그럼 이제부터 리덕스 설정을 해보겠습니다.

store폴더 밑에 modules 폴더를 생성해주세요.

그리고 일단 redux-devtools로 띄워봐야 하니, 간단하게 modules 밑에 ping.js라는 파일을 생성해서 스테이트를 생성해보겠습니다.

그전에 리덕스 설정에 필요한 라이브러리들을 다운로드 해줘야합니다.

```bash
$ yarn add redux react-redux redux-observable rxjs rxjs-compat
```

`store/modules/ping.js`

```js
const PING = "PING";

const initialState = {
  ping: "ping"
};

export const ping = (state = initialState, action) => {
  switch (action.type) {
    case PING:
      return {
        ping: "pong"
      };
    default:
      return state;
  }
};

```

그리고 modules밑에 index.js를 생성해주세요. 다음과 같이 작성해줍니다.

`modules/index.js`

```js
import { ping } from "./ping";
import { combineReducers } from "redux";

export const rootReducers = combineReducers({ ping });

```

다음으로 store밑에 configure.js 를 생성해주세요.

`store/configure.js`

```js
import { createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";

import { rootReducers } from "./modules";

// 크롬 데브 툴스 설정입니다.
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware();

export default createStore(
  rootReducers,
  composeEnhancers(applyMiddleware(epicMiddleware))
);

```

그리고 Root.js에서 다음과 같이 코딩해줍니다.

`Root.js`

```jsx
import React from "react";
import App from "components/App";
import { Provider } from "react-redux";
import store from "store/configure";

const Root = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
export default Root;
```

크롬 devtools에서 표식이 뜨면서 개발자 도구를 눌러서 보면 다음과 같이 뜨나요?? * 혹시 크롬 데브툴스가 없다면, redux-devtools로 검색하셔서 웹스토어 추가 해주시면 됩니다. *

![Imgur](https://i.imgur.com/EbTU21N.png)

기본적인 리덕스 설정이 끝났습니다!




