---
title: Dnote 5 - 3. React - 로그인 유지 및 로그아웃 기능 구현.
excerpt: Dnote 5 - 3. React - 로그인 유지 및 로그아웃 기능 구현.
category: velog
thumbnail: Velog.png
createdAt: 2018-09-23T10:06:24.397Z
---
자 이제는 로그인과 회원가입이 되었으니 로그인이 되었을때, 유지하는 기능을 추가하고, 로그인이 만약 안되었다면, 접속시 바로 로그인 페이지로 넘겨보고, 마지막으로 로그아웃 기능까지 구현해보겠습니다.

일단 장고 앱에서는 회원가입만 하더라도, 토큰을 부여하게 됩니다. 그러니까, 회원가입 하자마자 로그인을 한다고 생각하시면 될것 같습니다.

일단 로그인을 유지하려면 localStorage를 이용해야 합니다.

따라서 로그인이나 회원가입이 완료되면 저희 redux 의 auth에서 logged라는 state가 있는데, 이 logged가 true로 바뀌게 됩니다.

`modules/auth.js`

```js
case REGISTER_SUCCESS:
  return {
    ...state,
    logged: true,
    userInfo: {
      id: action.payload.user.id,
      username: action.payload.user.username,
      token: action.payload.token
    }
  };

...


case LOGIN_SUCCESS:
  return {
    ...state,
    logged: true,
    userInfo: {
      id: action.payload.user.id,
      username: action.payload.user.username,
      token: action.payload.token
    }
  };
```

위와 같이 말이죠. 그리고 userInfo라는 state도 그에 맞에 변경이 됩니다.

저희는 이제 이 값들을 AuthContainer에서 componentDidUpdate로 이용할 계획입니다.

`containers/AuthContainer.js`

```jsx
componentDidUpdate(prevProps, prevState) {
  // 하단에 AuthContainer를 withRouter로 감쌌기 때문에, history를 props로 이용할수 있습니다.
  const { history } = this.props;
  if (prevProps.kind !== this.props.kind) {
    this.initialize();
  }

  if (prevProps.logged !== this.props.logged && this.props.logged) {
    // logged가 true가 되면 localStorage에 값을 저장합니다. 
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        id: this.props.userInfo.id,
        username: this.props.userInfo.username,
        token: this.props.userInfo.token
      })
    );
    // 값을 저장후, main페이지로 이동시켜줍니다.
    history.push("/");
  }
}
```

자 이제 회원가입이나 로그인을 해보시면 이동하고, chrome 개발자 콘솔을 사용하여 localStorage로 쳐보시면 값이 저장된것을 알수 있습니다. 또한 localStorage에는 문자열밖에 저장하지 못하므로, JSON.stringify를 사용하여 JSON을 문자열로 변환시켜줍니다. 

아직까지는 에러가 발생하죠? 이유는 간단합니다, 저희가 메인 페이지로 이동하자마자 NoteContainer에서는 componentDidMount로 바로 노트 리스트를 받아오기 때문인데요, 저희는 아직 Header에 토큰값을 넘겨주지 않았기 때문에 401 에러가 뜹니다.


이 에러를 고쳐주기 위해서는 redux의 notes모듈로 넘어가서 Header값에 Authorization을 넣어주어야 합니다.

`modules/notes.js`

```jsx
const getNotesEpic = (action$, state$) => {
  return action$.pipe(
    ofType(GET_NOTES),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      // localStorage의 userInfo를 JSON.parse를 통해 string을 JSON화 시킨후 token값만 가져옵니다.
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null;
      // 헤더에 Authroization을 토큰값과 함께 넣어줍니다.
      return ajax
        .get(`/api/notes/`, {
          "Content-Type": "application/json",
          Authorization: `token ${token}`
        })
        .pipe(
          map(response => {
            const notes = response.response;
            return getNotesSuccess({ notes });
          }),
          catchError(error =>
            of({
              type: GET_NOTES_FAILURE,
              payload: error,
              error: true
            })
          )
        );
    })
  );
};
```

음 이렇게 바꾸고나니 또 에러가뜨죠? 이유는 저희가 django 앱에서 rest framework의 paging 기능을 사용했기 때문인데요, 이렇게 되면 받아올때 다음과 같은 정보들을 받게 됩니다.

```js
{count: 0, next: null, previous: null, results: []}
```
이런식으로 말이죠, count는 받아오는 아이템의 갯수, next는 다음 페이지의 api url, previous는 전 페이지의 api url, results에는 아이템들의 리스트값이 담겨 옵니다. 따라서 results라는 변수로 response값을 다시 가져와야 합니다.

`modules/notes.js`

```js
case GET_NOTES_SUCCESS:
  return {
    ...state,
    notes: action.payload.notes.results
  };
```

reducer의 GET_NOTES_SUCCESS 부분을 다음과 같이 바꿔줍니다. 이렇게 되면 오류가 나지 않고, 받아온 리스트들을 잘 보여주게 됩니다. 

저희는 다른 payload들은 사용하지 않습니다. 예를들면, count, next, previous같은 것들인데요, 단순히 보여주기만 한다면 위의 값들을 이용하여 무한스크롤링을 해도 상관이 없습니다만 저희는 중간에 삭제를 하거나 수정을 하기 때문에 마지막 아이템을 기준으로 다시 노트들을 가져옵니다. 따라서 딱히 이용할 이유가 없으므로, 일단 results값만 사용하겠습니다.

자 이제는 다시 auth모듈로 돌아가서 로그인 정보를 유지하고 로그인 되지 않았다면, auth page로 보내는 기능을 추가하겠습니다. 전에 저희가 django에서 만든 checkUser 를 이용할 계획입니다.

`modules/auth.js`

```js
...
const CHECK_USER = "auth/CHECK_USER";
const CHECK_USER_SUCCESS = "auth/CHECK_USER_SUCCESS";
const CHECK_USER_FAILURE = "auth/CHECK_USER_FAILURE";

const SET_USER_TEMP = "auth/SET_USER_TEMP";

...

export const checkUser = () => ({
  type: CHECK_USER
});

export const checkUserSuccess = () => ({
  type: CHECK_USER_SUCCESS
});

export const checkUserFailure = error => ({
  type: CHECK_USER_FAILURE,
  payload: {
    error
  }
});

export const setUserTemp = ({ id, username, token }) => ({
  type: SET_USER_TEMP,
  payload: {
    id,
    username,
    token
  }
});

...

const checkUserEpic = (action$, state$) => {
  return action$.pipe(
    ofType(CHECK_USER),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null;
      return ajax
        .get(`/api/auth/user/`, {
          "Content-Type": "application/json",
          Authorization: `token ${token}`
        })
        .pipe(
          map(response => {
            return checkUserSuccess();
          }),
          catchError(error =>
            of({
              type: CHECK_USER_FAILURE,
              payload: error,
              error: true
            })
          )
        );
    })
  );
};

...
case CHECK_USER_SUCCESS:
  return {
    ...state
  };
case CHECK_USER_FAILURE:
  return {
    ...state,
    logged: false,
    userInfo: {
      id: null,
      username: "",
      token: null
    }
  };
case SET_USER_TEMP:
  return {
    ...state,
    logged: true,
    userInfo: {
      id: action.payload.id,
      username: action.payload.username,
      token: action.payload.token
    }
  };

export const authEpics = { registerEpic, loginEpic, checkUserEpic };


```

`modules.index.js`

```js
import { notes, notesEpics } from "./notes";
import { auth, authEpics } from "./auth";
import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";

export const rootReducers = combineReducers({ notes, auth });
export const rootEpics = combineEpics(
  notesEpics.addNoteEpic,
  notesEpics.getNotesEpic,
  notesEpics.updateNoteEpic,
  notesEpics.deleteNoteEpic,
  authEpics.loginEpic,
  authEpics.registerEpic,
  authEpics.checkUserEpic
);

```

위와같이 작성한후, 전역적으로 사용할 BaseContainer.js 를 만들어줍니다.

`containers/BaseContainer.js`

```jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import * as authActions from "store/modules/auth";
import { withRouter } from "react-router-dom";

export class BaseContainer extends Component {
  componentDidMount() {
    this.checkUser();
  }

  checkUser = () => {
    const { checkUser, setUserTemp, history } = this.props;

    // 먼저 localStorage에 값이 저장되있는지 확인, userInfo값이 있다면, 로그인을 한것으로 인식하고,
    // 바로 setUserTemp를 실시.
    // 이를 하는 이유는 새로고침 했을시, state가 초기화 되어 logged값도 false로 바뀌는데, 새로고침 했을시
    // 로그인을 유지하기 위함.
    if (localStorage.getItem("userInfo")) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUserTemp({
        id: userInfo.id,
        username: userInfo.username,
        token: userInfo.token
      });
      return;
    }

    // 만약 userInfo값이 localStorage에 없을때에는, api통신을 실시.
    checkUser();

    // 만약 checkUser가 실패 했다면, logged는 false로 바뀌므로, 로그인 페이지로 이동시킨다.
    // 또한, /auth/register에서는 /auth/login으로 이동할 필요가 없으므로, auth라는 path가 url에 포함될때는 제외시킨다
    if (!this.props.logged && !window.location.pathname.includes("auth")) {
      history.push("/auth/login");
    }
  };

  render() {
    return <div />;
  }
}

const mapStateToProps = state => ({
  logged: state.auth.logged
});

const mapDispatchToProps = dispatch => {
  return {
    checkUser: () => {
      dispatch(authActions.checkUser());
    },
    setUserTemp: ({ id, username }) => {
      dispatch(authActions.setUserTemp({ id, username }));
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BaseContainer)
);

```

그리고 이 BaseContainer를 App.js에 반영한다.

`components/App.js`

```jsx
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Main, Auth, NotFound } from "pages";
import BaseContainer from "containers/BaseContainer";

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact={true} component={Main} />
          <Route path="/auth/:kind" exact={true} component={Auth} />
          <Route component={NotFound} />
        </Switch>
        <BaseContainer />
      </div>
    );
  }
}

export default App;

```
이렇게 되면 로그인이 되었다면, 새로고침을 해도 로그인 상태가 유지됩니다.

만약 로그인이 되어있지 않다면, /auth/login으로 이동하겠죠.

그렇다면 이제 로그아웃 기능을 구현해볼까요?

`modules/auth.js`

```js
...

const LOGOUT = "auth/LOGOUT";
const LOGOUT_SUCCESS = "auth/LOGOUT_SUCCESS";
const LOGOUT_FAILURE = "auth/LOGOUT_FAILURE";

...

export const logout = () => ({
  type: LOGOUT
});

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS
});

export const logoutFailure = () => ({
  type: LOGOUT_FAILURE
});


....

const logoutEpic = (action$, state$) => {
    return action$.pipe(
      ofType(LOGOUT),
      withLatestFrom(state$),
      mergeMap(([action, state]) => {
        const token = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo")).token
          : null;
        return ajax
          .post(
            `/api/auth/logout/`,
            // post의 body를 비워놓는다.
            {},
            {
              "Content-Type": "application/json",
              Authorization: `token ${token}`
            }
          )
          .pipe(
            map(response => {
              // success시 localStorage에서 userInfo 삭제.
              localStorage.removeItem("userInfo");
              return logoutSuccess();
            }),
            catchError(error => {
              of({
                type: LOGIN_FAILURE,
                payload: error,
                error: true
              });
            })
          );
      })
    );
  };

....

case LOGOUT_SUCCESS:
  return {
    ...state,
    logged: false,
    userInfo: {
      id: null,
      message: "",
      token: null
    }
  };
case LOGOUT_FAILURE:
  return {
    ...state,
    error: {
      triggered: true,
      message: "LOGOUT ERROR, PLEASE TRY AGAIN"
    }
  };

...

export const authEpics = { registerEpic, loginEpic, checkUserEpic, logoutEpic };
```

`modules/index.js`

```js
import { notes, notesEpics } from "./notes";
import { auth, authEpics } from "./auth";
import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";

export const rootReducers = combineReducers({ notes, auth });
export const rootEpics = combineEpics(
  notesEpics.addNoteEpic,
  notesEpics.getNotesEpic,
  notesEpics.updateNoteEpic,
  notesEpics.deleteNoteEpic,
  authEpics.loginEpic,
  authEpics.registerEpic,
  authEpics.checkUserEpic,
  authEpics.logoutEpic
);
```

로그아웃 버튼을 눌러야 하기 때문에 HeaderContainer를 만들어줍니다.

`containers/HeaderContainer.js`

```jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "components/structure/Header";
import * as authActions from "store/modules/auth";

export class HeaderContainer extends Component {
  handleLogout = () => {
    const { logout } = this.props;
    logout();
  };
  render() {
    const { handleLogout } = this;
    return <Header onLogout={handleLogout} />;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(authActions.logout());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContainer);

```

그리고 components의 MainStructure에서 Header를 HeaderContainer로 변경해줍니다.

`components/structure/MainStructure/MainStructure.js`

```jsx
import React from "react";
import styles from "./MainStructure.scss";
import classNames from "classnames/bind";
import HeaderContainer from "containers/HeaderContainer";

const cx = classNames.bind(styles);

const MainStructure = ({ children }) => (
  <div>
    <HeaderContainer />
    <main>{children}</main>
  </div>
);

export default MainStructure;

```
이제 로그아웃버튼을 누르면 로그아웃 통신이 일어나게 되는데 페이지 변경이 안되죠? 다음과 같이 변경해줍니다.

`containers/BaseContainer.js`

```jsx
componentDidUpdate(prevProps, prevState) {
  if (prevProps.logged !== this.props.logged && !this.props.logged) {
    window.location.href = "/auth/login";
  }
}
```
로그아웃 한채로 / 로 이동하면 다시 로그인 페이지로 돌아오게됩니다.
(register페이지 제외)
자 이제 로그아웃 기능까지 완료되었습니다! 

아 그리고 빼먹은 부분이 있는데, 이제는 모든 CRUD기능들에 Authorization Header를 붙여줘야 합니다. 안그러면 401 에러가 뜨게됩니다.

`modules/notes.js`

```js
const addNoteEpic = (action$, state$) => {
  return action$.pipe(
    ofType(ADD_NOTE),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null;
      return ajax
        .post(
          `/api/notes/`,
          { text: state.notes.noteInput },
          {
            "Content-Type": "application/json",
            Authorization: `token ${token}`
          }
        )
        .pipe(
          map(response => {
            const note = response.response;
            return addNoteSuccess(note);
          }),
          catchError(error =>
            of({
              type: ADD_NOTE_FAILURE,
              payload: error,
              error: true
            })
          )
        );
    })
  );
};

const deleteNoteEpic = (action$, state$) => {
  return action$.pipe(
    ofType(DELETE_NOTE),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null;
      return ajax
        .delete(`/api/notes/${action.payload.id}/`, {
          "Content-Type": "application/json",
          Authorization: `token ${token}`
        })
        .pipe(
          map(response => {
            return deleteNoteSuccess({ id: action.payload.id });
          }),
          catchError(error =>
            of({
              type: DELETE_NOTE_FAILURE,
              payload: error,
              error: true
            })
          )
        );
    })
  );
};

const updateNoteEpic = (action$, state$) => {
  return action$.pipe(
    ofType(UPDATE_NOTE),
    withLatestFrom(state$),

    mergeMap(([action, state]) => {
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null;
      return ajax
        .patch(
          `/api/notes/${state.notes.editing.id}/`,
          {
            text: state.notes.editing.text
          },
          {
            "Content-Type": "application/json",
            Authorization: `token ${token}`
          }
        )
        .pipe(
          map(response => {
            const note = response.response;

            return updateNoteSuccess({ note });
          }),
          catchError(error =>
            of({
              type: UPDATE_NOTE_FAILURE,
              payload: error,
              error: true
            })
          )
        );
    })
  );
};
```

이렇게 되면 CRUD도 정상 작동합니다.






