---
title: Dnote 3 - 2. React - 개발 환경 설정 및 구조 잡기.(프로젝트 구조잡기)
excerpt: Dnote 3 - 2. React - 개발 환경 설정 및 구조 잡기.(프로젝트 구조잡기)
category: velog
thumbnail: Velog.png
createdAt: 2018-09-21T05:09:31.610Z
---
자 redux설정에 앞서 잠시 기본 적인 sass 스타일의 틀을 잡고 가보겠습니다.

`styles/index.scss`

```css
@import url("//fonts.googleapis.com/css?family=Do+Hyeon:400");

body {
  margin: 0;
  box-sizing: border-box;
  font-family: "Do Hyeon", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: inherit;
}

a {
  text-decoration: inherit;
  color: inherit;
}

```

설명을 드리자면 도현체를 사용하기 위해서 도현체를 import시키고, 전체적인 body태그의 스타일을 해준것입니다. 
또한 a 태그로 링크를 걸때, 자동적으로 나오는 못생긴 스타일들을 없애주었습니다.

이제 index.js에 이 스타일을 불러와야 하는데, 불러오기 전에 경로를 비교하여 불러오기 귀찮으므로, .env파일을 생성하여 NODE_PATH를 src로 정해줍니다.

이렇게 하면 src를 기준으로 불러올수 있습니다.

`src/.env`

```js
NODE_PATH=src
```

그런 뒤 앱을 한번 다시 실행시켜주세요.

이제 index.js로 돌아와서 스타일을 임포트한후 확인해보겠습니다.

`src/index.js`

```js
import React from "react";
import ReactDOM from "react-dom";
// 기존에 있던 App을 지웠습니다.
import "styles/index.scss";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<div>도현체</div>, document.getElementById("root"));
registerServiceWorker();

```

도현체가 나타나서 잘뜨나요?

그렇다면 성공입니다. 이제는 기본적인 개발 구조를 잡아보겠습니다.

일단 원래 있던 파일들을 조금 삭제할 건데요, 다음 파일들을 일단 삭제하겠습니다.

`src/App.css`
`src/App.test.js`
`src/index.css`
`src/logo.svg`

그리고 src 밑에 다음과 같은 폴더들을 생성해줍니다.

`containers`: 리액트 컨테이너 파일들 집합
`components`: 리액트 컴포넌트 파일들 집합
`pages`: Routing에서 사용될 page 파일들 집합
`store`: redux모듈들과 configure파일들 집합

그리고 원래 있던 App.js를 components로 옮겨주고, src밑에 나중에 리덕스 스토어를 반영할 Root.js를 생성해줍니다.

App.js는 다음과 같이 코드를 비워줍니다.

`components/App.js`

```jsx
import React, { Component } from "react";

class App extends Component {
  render() {
    return <div>App.js</div>;
  }
}

export default App;

```

`src/Root.js`

```jsx
import React from "react";
import App from "components/App";

const Root = () => {
  return <App />;
};

export default Root;

```



그리고 이 Root.js를 index에서 렌더시켜줍니다.

`src/index.js`

```jsx
import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";
import "styles/index.scss";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();
```

잘 나타나나요? 그렇다면 성공입니다.

다음에서는 redux설정을 통해서 redux-devtools (크롬 웹스토어) 로 반영해보겠습니다.


