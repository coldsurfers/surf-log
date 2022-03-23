---
title: Dnote 4 - 3. React - 입력 폼 만들고 상태 관리.
excerpt: Dnote 4 - 3. React - 입력 폼 만들고 상태 관리.
category: velog
thumbnail: Velog.png
createdAt: 2018-09-21T14:11:43.275Z
---
`components/notes/InsertForm/InsertForm.js`

```jsx
import React from "react";
import styles from "./InsertForm.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const InsertForm = () => {
  return (
    <div className={cx("form")}>
      <div className={cx("title")}>Insert Your Note Here...</div>
      <input type="text" name="note" />
    </div>
  );
};

export default InsertForm;

```

`components/notes/InsertForm/InsertForm.scss`

```css
@import "utils";

.form {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  .title {
    border-bottom: 1px solid $oc-gray-8;
    padding-bottom: 0.75rem;

    font-size: 1.25rem;
    font-weight: 500;
  }

  input {
    margin-top: 0.75rem;
    height: 2.5rem;
    border: 1px solid $oc-gray-5;
    border-radius: 2px;

    outline: none;

    font-size: 1.5rem;
    padding: 0.25rem;

    background: $oc-gray-5;

    color: white;
    font-weight: 600;

    flex: 1;
  }
}
```

`components/notes/InsertForm/InsertForm.js`

```js
export { default } from './InsertForm';
```


이 InsertForm을 Main 페이지에 반영해보겠습니다.

`pages/Main.js`

```jsx
import React from "react";
import MainStructure from "components/structure/MainStructure";
import InsertForm from "components/notes/InsertForm";

const Main = () => {
  return (
    <MainStructure>
      <InsertForm />
    </MainStructure>
  );
};

export default Main;
```

이렇게 되면 너무 넓이가 넓어지므로, wrapper컴포넌트를 하나 만들어야합니다.

`components/notes/NoteWrapper/NoteWrapper.js`

```jsx
import React from "react";
import styles from "./NoteWrapper.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const NoteWrapper = ({ children }) => (
  <div className={cx("wrapper")}>{children}</div>
);

export default NoteWrapper;
```

`components/notes/NoteWrapper/NoteWrapper.scss`

```css
@import "utils";

.wrapper {
  margin: 0 auto;

  display: flex;
  flex-direction: column;

  width: 1024px;
  @include media("<medium") {
    width: 95%;
  }

  padding-top: 1rem;
  padding-bottom: 1rem;
}
```

`components/notes/NoteWrapper/index.js`

```js
export { default } from './NoteWrapper';
```

이제 이 wrapper로 InsertForm을 감싸줍니다.

`pages/Main.js`

```jsx
import React from "react";
import MainStructure from "components/structure/MainStructure";
import InsertForm from "components/notes/InsertForm";
import NoteWrapper from "components/notes/NoteWrapper";

const Main = () => {
  return (
    <MainStructure>
      <NoteWrapper>
        <InsertForm />
      </NoteWrapper>
    </MainStructure>
  );
};

export default Main;
```

위치가 나름 잡아졌죠?

그렇다면 이제 이 입력폼을 가지고 실제로 redux를 사용하여 django와 통신하여 새 노트를 한번 만들어보겠습니다.

일단 노트 input의 value 상태를 반영할 action과 리듀서를 생성해보겠습니다.

`store/modules/notes.js`

```js
const CHANGE_NOTE_INPUT = "notes/CHANGE_NOTE_INPUT";

export const changeNoteInput = ({ value }) => ({
  type: CHANGE_NOTE_INPUT,
  payload: { value }
});

const initialState = {
  noteInput: ""
};

export const notes = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_NOTE_INPUT:
      return {
        ...state,
        noteInput: action.payload.value
      };

    default:
      return state;
  }
};
```

이제 이 모듈을 index에서 반영해줍니다.

`store/modules/index.js`

```js
// 원래 있던 ping은 삭제해도 무방합니다.
import { notes } from "./notes";
import { combineReducers } from "redux";

export const rootReducers = combineReducers({ notes });
```

그럼 이제 이 모듈을 사용해서 input값을 관리해볼까요?

일단 그러기 위해서 container를 하나 생성해주어야합니다.

`containers/NoteContainer.js`

```jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import InsertForm from "components/notes/InsertForm";
import NoteWrapper from "components/notes/NoteWrapper";

import * as noteActions from "store/modules/notes";

export class NoteContainer extends Component {
  handleChange = ({ value }) => {
    const { changeNoteInput } = this.props;
    changeNoteInput({ value });
  };

  render() {
    const { noteInput } = this.props;
    const { handleChange } = this;
    return (
      <div>
        <NoteWrapper>
          <InsertForm noteInput={noteInput} onChangeInput={handleChange} />
        </NoteWrapper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  noteInput: state.notes.noteInput
});

const mapDispatchToProps = dispatch => {
  return {
    changeNoteInput: ({ value }) => {
      dispatch(noteActions.changeNoteInput({ value }));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteContainer);
```

그런 뒤에 pages에서 이 컨테이너만 렌더해줍니다.

`pages/Main.js`

```jsx
import React from "react";
import MainStructure from "components/structure/MainStructure";
import NoteContainer from "containers/NoteContainer";

const Main = () => {
  return (
    <MainStructure>
      <NoteContainer />
    </MainStructure>
  );
};

export default Main;
```

이제 InsertForm 컴포넌트에서 마무리 작업을 해줍니다.

`components/notes/InsertForm/InsertForm.js`

```jsx
import React from "react";
import styles from "./InsertForm.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const InsertForm = ({ noteInput, onChangeInput }) => {
  const handleChange = e => {
    const { value } = e.target;
    onChangeInput({ value });
  };

  return (
    <div className={cx("form")}>
      <div className={cx("title")}>Insert Your Note Here...</div>
      <input
        type="text"
        name="note"
        value={noteInput}
        onChange={handleChange}
      />
    </div>
  );
};

export default InsertForm;
```

이제 리덕스 데브툴스로 보면 입력을 할때마다 값이 바뀌는것을 알수 있습니다.

다음에는 이 값을 가지고 실제 노트를 하나 생성해보겠습니다.




