---
title: Dnote 7. React - 404페이지 완성 및 빌드된 리액트 띄우기
excerpt: Dnote 7. React - 404페이지 완성 및 빌드된 리액트 띄우기
category: velog
thumbnail: Velog.png
createdAt: 2018-09-23T10:07:28.385Z
---
음 이제 마지막이네요!

그러나 로그인 후 에러가 나타나는 현상을 방지하기 위해,

NoteContainer를 다음과 같이 바꿔주도록 하겠습니다!

`containers/NoteContainer.js`

```jsx
...
import * as authActions from "store/modules/auth";

...


componentDidMount() {
  // 에러 초기화
  this.props.initializeError();
  this.getNotes();
  window.addEventListener("scroll", this.handleScroll);
}

...

const mapDispatchToProps = dispatch => {
  return {
    changeNoteInput: ({ value }, isEditing) => {
      dispatch(noteActions.changeNoteInput({ value }, isEditing));
    },
    addNote: () => {
      dispatch(noteActions.addNote());
    },
    getNotes: () => {
      dispatch(noteActions.getNotes());
    },
    toggleNote: ({ id, text }) => {
      dispatch(noteActions.toggleNote({ id, text }));
    },
    updateNote: () => {
      dispatch(noteActions.updateNote());
    },
    deleteNote: ({ id }) => {
      dispatch(noteActions.deleteNote({ id }));
    },
    getMoreNotes: ({ lastId }) => {
      dispatch(noteActions.getMoreNotes({ lastId }));
    },
    //에러 초기화
    initializeError: () => {
      dispatch(authActions.initializeError());
    }
  };
};

...
```

404페이지를 완성하고 장고서버로 빌드된 리액트를 띄워볼까요?

다음과 같이 NotFound 컴포넌트를 생성해주세요.


`components/common/NotFound/NotFound.js`

```jsx
import React from "react";
import styles from "./NotFound.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const NotFound = () => (
  <div className={cx("not-found")}>
    <div className={cx("description")}>
      Hmm...
      <br /> You've reached some weird page!
      <div className={cx("go-back")}>Go Back</div>
    </div>
  </div>
);

export default NotFound;


```

`components/common/NotFound/NotFound.scss`

```css
@import "utils";

.not-found {
  background: $oc-violet-7;

  display: flex;
  justify-content: center;
  align-items: center;

  height: 100vh;
  .description {
    color: white;
    font-size: 2rem;

    @include media("<medium") {
      font-size: 1.5rem;
      margin-left: 1rem;
      margin-right: 1rem;
    }
    .go-back {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
      color: white;
      font-weight: 700;

      border: 1px solid white;
      border-radius: 2px;

      cursor: pointer;

      user-select: none;

      &:hover {
        background: $oc-violet-6;
      }

      &:active {
        background: $oc-violet-7;
      }
    }
  }
}

```


`components/common/NotFound/index.js`
```js
export { default } from './NotFound';
```

컨테이너도 하나 만들어 줍니다.

`containers/NotFoundContainer.js`

```jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import NotFound from "components/common/NotFound";

export class NotFoundContainer extends Component {
  render() {
    return <NotFound />;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotFoundContainer);

```

페이지에 반영해줍니다.

`pages/NotFound.js`

```jsx
import React from "react";
import NotFoundContainer from "containers/NotFoundContainer";
const NotFound = () => {
  return <NotFoundContainer />;
};

export default NotFound;

```

이렇게 하면 나름 깔끔한 NotFound페이지가 보여지게 됩니다.

이제 뒤로가기 기능을 추가해보겠습니다.

`containers/NoteContainer.js`

```jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import NotFound from "components/common/NotFound";
import { withRouter } from "react-router-dom";

export class NotFoundContainer extends Component {
  handleGoBack = () => {
    const { history } = this.props;
    history.goBack();
  };
  render() {
    const { handleGoBack } = this;
    return <NotFound onGoBack={handleGoBack} />;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NotFoundContainer)
);

```

`components/common/NotFound/NotFound.js`

```jsx
import React from "react";
import styles from "./NotFound.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const NotFound = ({ onGoBack }) => (
  <div className={cx("not-found")}>
    <div className={cx("description")}>
      Hmm...
      <br /> You've reached some weird page!
      <div className={cx("go-back")} onClick={onGoBack}>
        Go Back
      </div>
    </div>
  </div>
);

export default NotFound;

```

이제 뒤로가기도 잘됩니다!

자 이제는 빌드한것을 띄우는 노드 서버를 하나 개설해 보겠습니다.
그 전에 yarn build로 미리 빌드 해주세요.

우리의 백엔드와 프론트엔드가 있는 같은 위치에 build-server라는 폴더를 만들어 주세요. 그리고 그 폴더로 들어가서 

```bash
yarn init -y 
```

를 해주십시오.

그다음에 다음 명령어로 필요한 node 패키지들을 다운받아줍니다.


```bash
yarn add koa koa-connect-history-api-fallback koa-proxy koa-static
```

저희는 express보다 조금더 가벼운 노드 서버 라이브러리인 koa를 사용하겠습니다.

그리고 src 폴더를 하나 만들고 그 밑에 index.js 를 만들어주세요.

`src/index.js`

```js
const Koa = require("koa");

const proxy = require("koa-proxy");

const path = require("path");
const serve = require("koa-static");
const fallback = require("koa-connect-history-api-fallback");

const buildPath = path.join(__dirname, "../../frontend/build");

const port = 4000;

const app = new Koa();

app.use(
  proxy({
    host: "http://localhost:8000",
    match: /^\/api\/*.*/
  })
);

app.use(fallback());

app.use(serve(buildPath));

app.listen(port, () => {
  console.log("build server is running on port", port);
});

```

다음과 같이 작성해줍니다.

저희의 빌드 된 파일은 frontend/build 에 들어가 있으므로, 그 파일을 serve해주는 것입니다.

그런데, 저희는 백엔드 포트를 8000번을 사용하므로, proxy를 설정해주어야 합니다.

그 후에 fallback을 사용하여 빌드된 리액트의 라우팅을 모두 싱크시켜줍니다.

자 이렇게 하고 localhost:4000 에 접속하면 잘뜨게 됩니다!





