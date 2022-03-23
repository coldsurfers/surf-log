---
title: Dnote 5 - 2. React - 로그인 및 회원가입 기능 구현.
excerpt: Dnote 5 - 2. React - 로그인 및 회원가입 기능 구현.
category: velog
thumbnail: Velog.png
createdAt: 2018-09-23T10:05:49.815Z
---
Django API를 바탕으로, 리액트에서 로그인 및 회원가입 기능을 구현해보겠습니다.

이제 첫 화면에서는 오류가 나겠죠? 401 Unauthorized가 나옵니다.
권한 설정을 했는데, 저희는 Header에 Authorization을 주지 않아서 그런건데요, 일단 이 오류는 무시하고 로그인 회원가입 기능을 구현하겠습니다.

다음 파일들을 생성해줍니다.

`components/auth/AuthForm/AuthForm.js`

```jsx
import React from "react";
import styles from "./AuthForm.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const AuthForm = ({ kind }) => {
  return (
    <div className={cx("auth-form")}>
      <div className={cx("title")}>{kind.toUpperCase()}</div>
      <div className={cx("line-wrapper")}>
        <div className={cx("input-title")}>username</div>
        <input type="text" name="username" />
      </div>
      <div className={cx("line-wrapper")}>
        <div className={cx("input-title")}>password</div>
        <input type="password" name="password" />
      </div>
      <div className={cx("auth-button")}>{kind.toUpperCase()}</div>
      {kind === "register" ? (
        <Link to={`/auth/login`} className={cx("description")}>
          if you already have account...
        </Link>
      ) : (
        <Link to={`/auth/register`} className={cx("description")}>
          if you don't have an account...
        </Link>
      )}
    </div>
  );
};

export default AuthForm;

```


`components/auth/AuthForm/AuthForm.scss`

```css
@import "utils";

.auth-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border: 3px solid $oc-gray-6;
  border-radius: 3px;
  width: 512px;

  @include media("<medium") {
    width: 100%;
    border: none;
    top: 0%;
    transform: translate(-50%, 0%);
  }

  padding: 1rem;
  .title {
    text-align: center;

    font-size: 2rem;
    font-weight: 700;
    user-select: none;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .error {
    display: flex;
    justify-content: center;
    .message {
      font-size: 1.25rem;
      font-weight: 500;
      color: $oc-red-7;
    }
  }

  .line-wrapper {
    display: flex;
    flex-direction: column;

    .input-title {
      font-size: 1.6rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    input {
      height: 3rem;
      outline: none;
      border: 1px solid $oc-gray-6;
      border-radius: 2px;
      font-size: 1.5rem;
      padding: 0.5rem;

      font-weight: 600;
    }
  }

  .line-wrapper + .line-wrapper {
    margin-top: 1.5rem;
  }

  .auth-button {
    // height: 3rem;
    background: $oc-violet-7;

    margin-top: 2rem;
    border: 1px solid $oc-violet-7;
    border-radius: 2px;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;

    text-align: center;

    color: white;
    font-weight: 600;
    font-size: 1.5rem;

    cursor: pointer;
    user-select: none;

    &:hover {
      background: $oc-violet-8;
    }

    &:active {
      background: $oc-violet-7;
    }
  }

  .description {
    padding-top: 1rem;
    padding-bottom: 0.5rem;

    display: flex;
    flex-direction: row-reverse;

    font-size: 1.2rem;
    color: $oc-blue-7;

    @include media("<medium") {
      justify-content: center;
    }
  }
}

```
`components/auth/AuthForm/index.js`

```js
export { default } from './AuthForm';
```

그리고 pages의 Auth를 손봐야합니다.

`pages/Auth.js`

```jsx
import React from "react";
import AuthForm from "components/auth/AuthForm";

const Auth = ({ match }) => {
  // App.js /:kind로 설정해둔 값입니다.
  const { kind } = match.params;
  return (
    <div>
      <AuthForm kind={kind} />
    </div>
  );
};

export default Auth;

```

이제 redux의 auth module을 생성해볼까요?

일단 다음 액션들만 처리해주겠습니다.

`modules/auth.js`

```js
const INITIALIZE_INPUT = "auth/INITIALIZE_INPUT";

const CHANGE_INPUT = "auth/CHANGE_INPUT";

export const initializeInput = () => ({
  type: INITIALIZE_INPUT
});

export const changeInput = ({ name, value }) => ({
  type: CHANGE_INPUT,
  payload: {
    name,
    value
  }
});

const initialState = {
  form: {
    username: "",
    password: ""
  }
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_INPUT:
      return {
        ...state,
        form: {
          username: "",
          password: ""
        }
      };
    case CHANGE_INPUT:
      let newForm = state.form;
      newForm[action.payload.name] = action.payload.value;
      return {
        ...state,
        form: newForm
      };

    default:
      return state;
  }
};

```

`modules/index.js`

```js
import { notes, notesEpics } from "./notes";
import { auth } from "./auth";
import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";

export const rootReducers = combineReducers({ notes, auth });
export const rootEpics = combineEpics(
  notesEpics.addNoteEpic,
  notesEpics.getNotesEpic,
  notesEpics.updateNoteEpic,
  notesEpics.deleteNoteEpic
);

```

`containers/AuthContainer.js`

```jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import AuthForm from "components/auth/AuthForm";
import { withRouter } from "react-router-dom";
import * as authActions from "store/modules/auth";

export class AuthContainer extends Component {
  componentDidMount() {
    const { initializeInput } = this.props;
    initializeInput();
  }

  componentDidUpdate(prevProps, prevState) {
    const { initializeInput } = this.props;

    if (prevProps.kind !== this.props.kind) {
      initializeInput();
    }
  }

  handleChangeInput = ({ name, value }) => {
    const { changeInput } = this.props;
    changeInput({ name, value });
  };
  render() {
    const { kind, username, password } = this.props;
    const { handleChangeInput } = this;
    return (
      <AuthForm
        kind={kind}
        username={username}
        password={password}
        onChangeInput={handleChangeInput}
      />
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.form.username,
  password: state.auth.form.password
});

const mapDispatchToProps = dispatch => {
  return {
    initializeInput: () => {
      dispatch(authActions.initializeInput());
    },
    changeInput: ({ name, value }) => {
      dispatch(authActions.changeInput({ name, value }));
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AuthContainer)
);

```

`pages/Auth.js`

```jsx
import React from "react";
import AuthContainer from "containers/AuthContainer";

const Auth = ({ match }) => {
  const { kind } = match.params;
  return (
    <div>
      <AuthContainer kind={kind} />
    </div>
  );
};

export default Auth;

```

`components/auth/AuthForm/AuthForm.js`

```jsx
import React from "react";
import styles from "./AuthForm.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const AuthForm = ({ kind, onChangeInput, username, password }) => {
  const handleChange = e => {
    const { name, value } = e.target;
    onChangeInput({ name, value });
  };
  return (
    <div className={cx("auth-form")}>
      <div className={cx("title")}>{kind.toUpperCase()}</div>
      <div className={cx("line-wrapper")}>
        <div className={cx("input-title")}>username</div>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
        />
      </div>
      <div className={cx("line-wrapper")}>
        <div className={cx("input-title")}>password</div>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
      </div>
      <div className={cx("auth-button")}>{kind.toUpperCase()}</div>
      {kind === "register" ? (
        <Link to={`/auth/login`} className={cx("description")}>
          if you already have account...
        </Link>
      ) : (
        <Link to={`/auth/register`} className={cx("description")}>
          if you don't have an account...
        </Link>
      )}
    </div>
  );
};

export default AuthForm;

```

이렇게 까지하면, 폼인풋들을 상태관리 할수 있고, 레지스터와 로그인 페이지간 이동할때, 모든 인풋밸류가 초기화 됩니다.

그렇다면 이제 API통신을 통해 login 과 register기능을 구현해보겠습니다.

그리고 그에따른 에러처리를 해보도록 하죠.

`modules/auth.js`

```js
....

const REGISTER = "auth/REGISTER";
const REGISTER_SUCCESS = "auth/REGISTER_SUCCESS";
const REGISTER_FAILURE = "auth/REGISTER_FAILURE";

const LOGIN = "auth/LOGIN";
const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
const LOGIN_FAILURE = "auth/LOGIN_FAILURE";

const INITIALIZE_ERROR = "auth/INITIALIZE_ERROR";
...

export const register = () => ({
  type: REGISTER
});

export const registerSuccess = ({ user, token }) => ({
  type: REGISTER_SUCCESS,
  payload: {
    user,
    token
  }
});

export const registerFailure = error => ({
  type: REGISTER_FAILURE,
  payload: {
    error
  }
});

export const login = () => ({
  type: LOGIN
});

export const loginSuccess = ({ user, token }) => ({
  type: LOGIN_SUCCESS,
  payload: {
    user,
    token
  }
});

export const loginFailure = error => ({
  type: LOGIN_FAILURE,
  payload: {
    error
  }
});


export const initializeError = () => ({
  type: INITIALIZE_ERROR
});

...

const registerEpic = (action$, state$) => {
  return action$.pipe(
    ofType(REGISTER),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const { username, password } = state.auth.form;
      return ajax.post(`/api/auth/register/`, { username, password }).pipe(
        map(response => {
          const { user, token } = response.response;
          return registerSuccess({ user, token });
        }),
        catchError(error =>
          of({
            type: REGISTER_FAILURE,
            payload: error,
            error: true
          })
        )
      );
    })
  );
};

const loginEpic = (action$, state$) => {
  return action$.pipe(
    ofType(LOGIN),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const { username, password } = state.auth.form;
      return ajax.post(`/api/auth/login/`, { username, password }).pipe(
        map(response => {
          const { user, token } = response.response;
          return loginSuccess({ user, token });
        }),
        catchError(error =>
          of({
            type: LOGIN_FAILURE,
            payload: error,
            error: true
          })
        )
      );
    })
  );
};

...
const initialState = {
  form: {
    username: "",
    password: ""
  },
  error: {
    triggered: false,
    message: ""
  },
  logged: false,
  userInfo: {
    id: null,
    username: "",
    token: null
  }
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_INPUT:
      return {
        ...state,
        form: {
          username: "",
          password: ""
        }
      };
    case CHANGE_INPUT:
      let newForm = state.form;
      newForm[action.payload.name] = action.payload.value;
      return {
        ...state,
        form: newForm
      };
    case INITIALIZE_ERROR:
      return {
        ...state,
        error: {
          triggered: false,
          message: ""
        }
      };
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
    case REGISTER_FAILURE:
      switch (action.payload.status) {
        case 400:
          return {
            ...state,
            error: {
              triggered: true,
              message: "WRONG USERNAME OR PASSWORD"
            }
          };
        case 500:
          return {
            ...state,
            error: {
              triggered: true,
              message: "TOO SHORT USERNAME OR PASSWORD"
            }
          };
        default:
          return {
            ...state
          };
      }
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
    case LOGIN_FAILURE:
      switch (action.payload.status) {
        case 400:
          return {
            ...state,
            error: {
              triggered: true,
              message: "WRONG USERNAME OR PASSWORD"
            }
          };
        case 500:
          return {
            ...state,
            error: {
              triggered: true,
              message: "PLEASE TRY AGAIN"
            }
          };
        default:
          return {
            ...state
          };
      }

    default:
      return state;
  }
};


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
  authEpics.registerEpic
);

```

`containers/AuthContainer.js`

```jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import AuthForm from "components/auth/AuthForm";
import { withRouter } from "react-router-dom";
import * as authActions from "store/modules/auth";

export class AuthContainer extends Component {
  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.kind !== this.props.kind) {
      this.initialize();
    }
  }

  initialize = () => {
    const { initializeInput, initializeError } = this.props;
    initializeError();
    initializeInput();
  };

  handleChangeInput = ({ name, value }) => {
    const { changeInput } = this.props;
    changeInput({ name, value });
  };

  handleLogin = () => {
    const { login } = this.props;
    login();
  };

  handleRegister = () => {
    const { register } = this.props;
    register();
  };
  render() {
    const { kind, username, password, error } = this.props;
    const { handleChangeInput, handleLogin, handleRegister } = this;
    return (
      <AuthForm
        kind={kind}
        username={username}
        password={password}
        onChangeInput={handleChangeInput}
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={error}
      />
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.form.username,
  password: state.auth.form.password,
  userInfo: state.auth.userInfo,
  logged: state.auth.logged,
  error: state.auth.error
});

const mapDispatchToProps = dispatch => {
  return {
    initializeInput: () => {
      dispatch(authActions.initializeInput());
    },
    changeInput: ({ name, value }) => {
      dispatch(authActions.changeInput({ name, value }));
    },
    initializeError: () => {
      dispatch(authActions.initializeError());
    },
    register: () => {
      dispatch(authActions.register());
    },
    login: () => {
      dispatch(authActions.login());
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AuthContainer)
);


```

`components/auth/AuthForm/AuthForm.js`

```jsx
import React from "react";
import styles from "./AuthForm.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const AuthForm = ({
  kind,
  onChangeInput,
  username,
  password,
  onLogin,
  onRegister,
  error
}) => {
  const handleChange = e => {
    const { name, value } = e.target;
    onChangeInput({ name, value });
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      switch (kind) {
        case "register":
          onRegister();
          return;
        case "login":
          onLogin();
          return;
        default:
          return;
      }
    }
  };
  return (
    <div className={cx("auth-form")}>
      <div className={cx("title")}>{kind.toUpperCase()}</div>
      <div className={cx("error")}>
        {error.triggered && (
          <div className={cx("message")}>{error.message}</div>
        )}
      </div>
      <div className={cx("line-wrapper")}>
        <div className={cx("input-title")}>username</div>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className={cx("line-wrapper")}>
        <div className={cx("input-title")}>password</div>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      {kind === "register" ? (
        <div className={cx("auth-button")} onClick={onRegister}>
          {kind.toUpperCase()}
        </div>
      ) : (
        <div className={cx("auth-button")} onClick={onLogin}>
          {kind.toUpperCase()}
        </div>
      )}
      {kind === "register" ? (
        <Link to={`/auth/login`} className={cx("description")}>
          if you already have account...
        </Link>
      ) : (
        <Link to={`/auth/register`} className={cx("description")}>
          if you don't have an account...
        </Link>
      )}
    </div>
  );
};

export default AuthForm;


```


이렇게 되면 API 통신이 완료됩니다. 그에따른 오류처리도 됩니다.

다음 에서는 로그인을 유지하고, 로그인이 되지 않았을때에는, 로그인 페이지로 보내고, 로그아웃 기능을 구현해보겠습니다.



