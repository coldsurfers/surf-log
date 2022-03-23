---
title: Dnote 4 - 2. React - 페이지 구조 생성.
excerpt: Dnote 4 - 2. React - 페이지 구조 생성.
category: velog
thumbnail: Velog.png
createdAt: 2018-09-21T14:10:25.372Z
---
지난 튜토리얼에서 만든 API를 바탕으로 통신하여, 리액트에서 CRUD를 실시해보겠습니다.

일단 처음에 react-router-dom을 사용하여 클라이언트쪽 라우팅을 해보겠습니다.

```bash
$ yarn add react-router-dom
```

`Root.js`

```jsx
import React from "react";
import App from "components/App";
import { Provider } from "react-redux";
import store from "store/configure";
import { BrowserRouter } from "react-router-dom";

const Root = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

export default Root;

```


Root.js를 다음과 같이 BrowserRouter로 감싸줍니다.

그런 뒤 라우팅에 쓰이게 될 pages들을 생성하겠습니다.

pages밑에 다음과 같은 파일들을 생성해주세요.

`Main.js`: 노트들이 리스트되어 나타날 페이지

```jsx
import React from "react";

const Main = () => {
  return <div>Main Page</div>;
};

export default Main;

```

`Auth.js`: 로그인 / 회원가입 페이지

```jsx
import React from "react";

const Auth = () => {
  return <div>Auth Page</div>;
};

export default Auth;

```

`NotFound.js`: 라우팅 되지 않은 곳에서 나타날 페이지

```jsx
import React from "react";

const NotFound = () => {
  return <div>NotFound Page</div>;
};

export default NotFound;

```

그런뒤 이 페이지들을 한곳에 모아줄 index.js를 생성합니다.

`pages/index.js`

```js
export { default as Main } from "./Main";
export { default as Auth } from "./Auth";
export { default as NotFound } from "./NotFound";
```

App.js에서 페이지들을 라우팅 해줍니다.

`App.js`

```jsx
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Main, Auth, NotFound } from "pages";

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact={true} component={Main} />
          <Route path="/auth/:kind" exact={true} component={Auth} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default App;
```

라우팅이 끝났으면, 이제 다음과 같은 주소들이 작동할것입니다.

http://localhost:3000/ -> Main
http://localhost:3000/auth/login -> Auth
http://localhost:3000/auth/register -> Auth
http://localhost:3000/alskjdalskdj -> NotFound

그럼 이제 라우팅은 되었으니, 실제 UI들을 조금씩 만들어보겠습니다.

메인 스트럭쳐를 뜻하는 structure 폴더를 components 밑에 생성해줍니다.

그 뒤 Header를 만들어주겠습니다.

![Imgur](https://i.imgur.com/qVw6aCd.png)

다음과 같은 구조를 가집니다! 
아 그리고 로그아웃 버튼을 만들기 위해 react-icons를 인스톨 해줍니다.
 또한, color제공 라이브러리인 open-color와 미디어 쿼리를 좀더 자유롭게 사용하게 해주는 include-media도 다운로드 해주겠습니다. 
 classnames는 여러개의 클래스를 한번에 사용하게도 하고, scss와 bind하여 굳이 styles라는 이름을 사용하지 않아도 되게하는 라이브러리 입니다.

```bash
$ yarn add react-icons open-color include-media classnames
```

그리고 이 라이브러리들을 모든 scss에서 적용할수 있게 해보겠습니다.

`styles/utils.scss`

```css
@import "~open-color/open-color";
@import "~include-media/dist/include-media";

$breakpoints: (
  small: 320px,
  medium: 768px,
  large: 1024px,
  wide: 1400px
);

```
앞으로 모든 scss파일에서 임포트 하게될 utils.scss를 생성했습니다.



`Header.js`

```jsx
import React from "react";
import styles from "./Header.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { MdLock } from "react-icons/md";

const cx = classNames.bind(styles);

const Header = ({ onLogout }) => (
  <div className={cx("header")}>
    <Link to={"/"} className={cx("logo")}>
      D-Note
    </Link>
    <div className={cx("logout")}>
      <MdLock onClick={onLogout} />
    </div>
  </div>
);

export default Header;
```

`Header.scss`

```css
@import "utils";

.header {
  background: $oc-violet-6;
  height: 5rem;

  display: flex;
  align-items: center;

  .logo {
    color: white;

    font-weight: 800;
    font-size: 1.5rem;

    cursor: pointer;

    margin-left: 1rem;

    user-select: none;
  }

  .logout {
    margin-left: auto;
    margin-right: 1rem;
    color: white;

    font-weight: 800;
    font-size: 2rem;

    cursor: pointer;
  }
}
```

`index.js`

```js
export { default } from './Header';
```

그럼 이제 이 헤더를 반영시켜볼까요?

`pages/Main.js`

```jsx
import React from "react";
import Header from "components/structure/Header";

const Main = () => {
  return <Header />;
};

export default Main;
```

잘 나타나나요?

근데 이런식으로 매 페이지에서 Header를 import 하는건 비효율 적이므로, 페이지 구조를 만들어주는 컴포넌트를 하나 생성하겠습니다.

`components/structure/MainStructure.js`

```jsx
import React from "react";
import styles from "./MainStructure.scss";
import classNames from "classnames/bind";
import Header from "components/structure/Header";

const cx = classNames.bind(styles);

const MainStructure = ({ children }) => (
  <div>
    <Header />
    <main>{children}</main>
  </div>
);

export default MainStructure;
```

`components/structure/index.js`

```jsx
export { default } from './MainStructure';
```

그리고 이 MainStructure를 Main 페이지에 반영해줍니다.

`pages/Main.js`

```jsx
import React from "react";
import MainStructure from "components/structure/MainStructure";

const Main = () => {
  return <MainStructure>Main Page</MainStructure>;
};

export default Main;
```

다음에는 노트를 입력하는 노트 입력 폼을 만들어보겠습니다.







