---
title: Dnote 4 - 4. React - 노트 생성 기능 구현.
excerpt: Dnote 4 - 4. React - 노트 생성 기능 구현.
category: velog
thumbnail: Velog.png
createdAt: 2018-09-21T14:12:10.363Z
---
`store/modules/notes.js`

```js
import { ajax } from "rxjs/observable/dom/ajax";
import { of } from "rxjs";
import { map, mergeMap, catchError, withLatestFrom } from "rxjs/operators";
import { ofType } from "redux-observable";

const CHANGE_NOTE_INPUT = "notes/CHANGE_NOTE_INPUT";

const ADD_NOTE = "notes/ADD_NOTE";
const ADD_NOTE_SUCCESS = "notes/ADD_NOTE_SUCCESS";
const ADD_NOTE_FAILURE = "notes/ADD_NOTE_FAILURE";

export const changeNoteInput = ({ value }) => ({
  type: CHANGE_NOTE_INPUT,
  payload: { value }
});

export const addNote = () => ({
  type: ADD_NOTE
});
export const addNoteSuccess = note => ({
  type: ADD_NOTE_SUCCESS,
  payload: {
    note
  }
});
export const addNoteFailure = error => ({
  type: ADD_NOTE_FAILURE,
  payload: {
    error
  }
});

const addNoteEpic = (action$, state$) => {
  return action$.pipe(
    ofType(ADD_NOTE),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      return ajax.post(`/api/notes/`, { text: state.notes.noteInput }).pipe(
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

const initialState = {
  noteInput: "",
  notes: []
};

export const notes = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_NOTE_INPUT:
      return {
        ...state,
        noteInput: action.payload.value
      };
    case ADD_NOTE_SUCCESS:
      const { note } = action.payload;
      return {
        ...state,
        notes: [note].concat(state.notes),
        noteInput: ""
      };
    case ADD_NOTE_FAILURE:
      return {
        ...state,
        error: {
          triggered: true,
          message: "Error! Please Try With Unempty Note"
        }
      };
    default:
      return state;
  }
};

export const notesEpics = {
  addNoteEpic
};
```

위와 같이 note를 추가하는 epic과 액션, 리듀서들을 생성해주세요.

그리고, index.js에서 epic을 반영해주세요.

`modules/index.js`

```js
import { notes, notesEpics } from "./notes";
import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";

export const rootReducers = combineReducers({ notes });
export const rootEpics = combineEpics(notesEpics.addNoteEpic);

```

처음으로 epic이 나왔는데요, 이 epic은 configure에서 다음과 같이 등록해주어야 사용할수 있습니다.

`store/configure.js`

```js
import { createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";

import { rootReducers, rootEpics } from "./modules";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware();

export default createStore(
  rootReducers,
  composeEnhancers(applyMiddleware(epicMiddleware))
);

epicMiddleware.run(rootEpics);
```

이제 container로 다시 돌아와서 다음 작업들을 해줘야합니다.

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

  addNote = () => {
    const { addNote } = this.props;
    addNote();
  };

  render() {
    const { noteInput } = this.props;
    const { handleChange, addNote } = this;
    return (
      <div>
        <NoteWrapper>
          <InsertForm
            noteInput={noteInput}
            onChangeInput={handleChange}
            onAdd={addNote}
          />
        </NoteWrapper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  noteInput: state.notes.noteInput,
  notes: state.notes.notes
});

const mapDispatchToProps = dispatch => {
  return {
    changeNoteInput: ({ value }) => {
      dispatch(noteActions.changeNoteInput({ value }));
    },
    addNote: () => {
      dispatch(noteActions.addNote());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteContainer);
```

`components/notes/InsertForm/InsertForm.js`

```jsx
import React from "react";
import styles from "./InsertForm.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const InsertForm = ({ noteInput, onChangeInput, onAdd }) => {
  const handleChange = e => {
    const { value } = e.target;
    onChangeInput({ value });
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      onAdd();
    }
  };

  return (
    <div className={cx("form")}>
      <div className={cx("title")}>Insert Your Note Here...</div>
      <input
        type="text"
        name="note"
        value={noteInput}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default InsertForm;

```

근데 이상태로는 오류가 납니다, 이유는 proxy설정을 안했기 때문인데요, package.json에서 프록시 설정을 해줍니다.

`package.json`

```js
"proxy": "http://localhost:8000"
```

자 이제 엔터를 치면 노트가 생성됨을 알수 있습니다.

크롬 개발자도구를 키고, network에서 보시면 201 생성이 뜨죠?

![Imgur](https://i.imgur.com/zeTJmsp.png)


