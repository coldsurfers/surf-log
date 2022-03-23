---
title: Dnote 4 - 6. React - 노트 리스트 구현 및 수정 / 삭제 기능 구현.
excerpt: Dnote 4 - 6. React - 노트 리스트 구현 및 수정 / 삭제 기능 구현.
category: velog
thumbnail: Velog.png
createdAt: 2018-09-23T10:04:35.022Z
---
이제 할것은 노트 리스트 보여주기인데, Django API의 notes 앱의 url 중 

```python
url("^notes/$", note_list, name="note-list")
```
을 참조하여 가져올것이다.

일단 우리는 권한 설정을 하지 않았으므로, 모든 노트들을 가져올수 있다.

postman으로 위 url에 접근해보자.

```js
[
    {
        "id": 5,
        "text": "에러?"
    },
    {
        "id": 4,
        "text": "제대로 입력?"
    },
    {
        "id": 3,
        "text": "에러가 아니다!"
    },
    {
        "id": 2,
        "text": "노트를 생성했다!"
    }
]
```

입력된 리스트들을 받아올수 있다.

이것을 우리는 React에서 보여줄것이다.

일단 redux 처리부터 해보자.

`store/modules/notes.js`

```js
...

const GET_NOTES = "notes/GET_NOTES";
const GET_NOTES_SUCCESS = "notes/GET_NOTES_SUCCESS";
const GET_NOTES_FAILURE = "notes/GET_NOTES_FAILURE";
// 액션들을 추가해주고,

... 

export const getNotes = () => ({
  type: GET_NOTES
});
export const getNotesSuccess = ({notes}) => ({
  type: GET_NOTES_SUCCESS,
  payload: {
    notes
  }
});
export const getNotesFailure = error => ({
  type: GET_NOTES_FAILURE,
  payload: {
    error
  }
});

// 그에 따른 함수들을 정의한다.

...

const getNotesEpic = (action$, state$) => {
  return action$.pipe(
    ofType(GET_NOTES),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      return ajax
        .get(`/api/notes/`)
        .pipe(
          map(response => {
            const notes = response.response;
            return getNotesSuccess({notes});
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

// api 통신에 쓰일 epic도 정의한다.

...

case GET_NOTES_SUCCESS:
    return {
      ...state,
      notes: action.payload.notes
    };
case GET_NOTES_FAILURE:
  return {
    ...state,
    error: {
      triggered: true,
      message: "Error! Please Try Again!"
    }
  };

...

export const notesEpics = {
  addNoteEpic,
  getNotesEpic
};

// 마지막으로  reducer를 손보고, epic에 추가해준다.
```

`modules/index.js`

```js
import { notes, notesEpics } from "./notes";
import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";

export const rootReducers = combineReducers({ notes });
export const rootEpics = combineEpics(notesEpics.addNoteEpic, notesEpics.getNotesEpic);
// getNotesEpic 등록한다.
```

이렇게 되면 리덕스 작업은 끝이났고, 이제 UI에서 렌더링해줄 작업이 남아있다.

`containers/NoteContainer.js`

```jsx
	componentDidMount() {
      this.getNotes();
    }

    getNotes = () => {
      const { getNotes } = this.props;
      getNotes();
    };

...


const mapDispatchToProps = dispatch => {
  return {
    changeNoteInput: ({ value }) => {
      dispatch(noteActions.changeNoteInput({ value }));
    },
    addNote: () => {
      dispatch(noteActions.addNote());
    },
    // 추가
    getNotes: () => {
      dispatch(noteActions.getNotes())
    }
  };
};
```

이렇게 componentDidMount에서 노트를 불러오면 redux 상태가 다음과 같아진다!

![Imgur](https://i.imgur.com/OUW6JFc.png)

이제 통신은 완료 되었고, UI를 생성해보자.

components에 NoteList와 NoteItem을 추가해준다.

`components/notes/NoteItem/NoteItem.js`

```jsx
import React from "react";
import styles from "./NoteItem.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const NoteItem = ({ note }) => {
  return (
    <div className={cx("note-item")}>
      <div className={cx("note")}>{note.text}</div>
      <div className={cx("delete")}>&times;</div>
    </div>
  );
};

export default NoteItem;
```
`components/notes/NoteItem/NoteItem.scss`

```css
@import "utils";

.note-item {
  display: flex;
  align-items: center;
  height: 3rem;
  background: $oc-gray-5;

  padding-left: 1rem;
  padding-right: 1rem;

  cursor: pointer;

  .note {
    color: white;

    font-weight: 600;
    font-size: 1.25rem;
  }

  .delete {
    margin-left: auto;
    cursor: pointer;

    color: white;
    font-weight: 800;
    font-size: 2rem;

    user-select: none;
  }
  .return {
    display: flex;
    align-items: center;
    margin-left: auto;
    cursor: pointer;

    color: white;
    font-weight: 800;
    font-size: 1.5rem;
  }

  input {
    height: 100%;
    width: 100%;

    outline: none;
    background: $oc-gray-6;
    border: 1px solid $oc-gray-6;

    font-size: 1.5rem;
    color: white;
    font-weight: 600;
  }
}

.editing {
  background: $oc-gray-6;
}

```


`components/notes/NoteList/NoteList.js`

```jsx
import React from "react";
import styles from "./NoteList.scss";
import classNames from "classnames/bind";
import NoteItem from "components/notes/NoteItem";

const cx = classNames.bind(styles);

const NoteList = ({ notes }) => {
  const noteList = notes.map((note, i) => {
    return <NoteItem note={note} key={note.id} />;
  });
  return (
    <div className={cx("note-list")}>
      <div className={cx("title")}>Your Notes...</div>
      {noteList}
    </div>
  );
};

export default NoteList;

```
`components/notes/NoteList/NoteList.scss`

```css
@import "utils";

.note-list {
  .title {
    border-bottom: 1px solid $oc-gray-5;
    padding-bottom: 0.75rem;

    font-size: 1.25rem;
    font-weight: 500;

    margin-bottom: 1rem;
  }

  .note-item + .note-item {
    margin-top: 1rem;
  }
}

```

마지막으로 NoteContainer에서 NoteList를 불러오고, notes를 props로 전달해준다.

`containers/NoteContainer.js`
```jsx
...
import NoteList from "../components/notes/NoteList/NoteList";
...


render() {
  const { noteInput, error, notes } = this.props;
  const { handleChange, addNote } = this;
  return (
    <div>
      <NoteWrapper>
        <InsertForm
          noteInput={noteInput}
          onChangeInput={handleChange}
          onAdd={addNote}
          error={error}
        />
        <NoteList notes={notes} />
      </NoteWrapper>
    </div>
  );
}
...
```

이렇게 되면 작성된 노트의 리스트를 모두 보여줬다.

리스트를 모두 보여줬으니, 그에 따른 기능들을 구현해볼까??

일단 수정하는 기능을 추가해보자. 수정은 노트아이템을 클릭하면 수정할수 있게 만들것이고, 되돌아 가려면 다시한번 토글하면 되는 식이다.

redux로 돌아가서 수정 기능을 추가해보자.

`modules/notes.js`

```js
const TOGGLE_NOTE = "notes/TOGGLE_NOTE";
// 노트를 수정하기위해 토글하는 액션 추가

...

export const toggleNote = ({ id, text }) => ({
  type: TOGGLE_NOTE,
  payload: {
    id,
    text
  }
});

// 토글 함수 추가

...


const initialState = {
  noteInput: "",
  notes: [],
  error: {
    triggered: false,
    message: ""
  },
  // 수정하는 노트아이템을 표시하는 state 추가.
  editing: {
    id: null,
    text: ""
  }
};


...

// 토글 리듀서 추가
case TOGGLE_NOTE:
    return {
      ...state,
      editing: {
        id: parseInt(action.payload.id, 10),
        note: action.payload.text
      }
    };
...
```

이렇게 되면 토글시, editing 에 토글된 노트의 id와 text값이 저장된다.

`containers/NoteContainer.js`

```jsx

...
	// 토글하는 함수 추가
    handleToggle = ({ id, text }) => {
      const { toggleNote, editing } = this.props;
  	// 이미 에디팅 중이면 한번 더 토글시 초기화
      if (editing.id === id) {
        toggleNote({ id: null, text: "" });
      } else {
        // 아니면 에디팅 표시.
        toggleNote({ id, text });
      }
    };

	render() {
      const { noteInput, error, notes, editing } = this.props;
      const { handleChange, addNote, handleToggle } = this;
      return (
        <div>
          <NoteWrapper>
            <InsertForm
              noteInput={noteInput}
              onChangeInput={handleChange}
              onAdd={addNote}
              error={error}
            />
            <NoteList 
              notes={notes} 
              editing={editing} 
              onToggle={handleToggle} />
          </NoteWrapper>
        </div>
      );
    }

....

const mapStateToProps = state => ({
  noteInput: state.notes.noteInput,
  notes: state.notes.notes,
  error: state.notes.error,
  // editing state 추가
  editing: state.notes.editing
});

const mapDispatchToProps = dispatch => {
  return {
    changeNoteInput: ({ value }) => {
      dispatch(noteActions.changeNoteInput({ value }));
    },
    addNote: () => {
      dispatch(noteActions.addNote());
    },
    getNotes: () => {
      dispatch(noteActions.getNotes());
    },
    // toggle 함수 추가
    toggleNote: ({ id, text }) => {
      dispatch(noteActions.toggleNote({ id, text }));
    }
  };
};
....
```

`components/notes/NoteList/NoteList.js`

```jsx
import React from "react";
import styles from "./NoteList.scss";
import classNames from "classnames/bind";
import NoteItem from "components/notes/NoteItem";

const cx = classNames.bind(styles);

const NoteList = ({ notes, editing, onToggle }) => {
  const noteList = notes.map((note, i) => {
    return <NoteItem 
             note={note} 
             key={note.id} 
             editing={editing}
             onToggle={onToggle} />;
  });
  return (
    <div className={cx("note-list")}>
      <div className={cx("title")}>Your Notes...</div>
      {noteList}
    </div>
  );
};

export default NoteList;

```

`components/notes/NoteItem/NoteItem.js`

```jsx
import React from "react";
import styles from "./NoteItem.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const NoteItem = ({ note, editing, onToggle }) => {
  const handleToggle = () => {
    onToggle({ id: note.id, text: note.text });
  };
  return (
    <div
      className={cx("note-item", editing.id === note.id && "editing")}
      onClick={handleToggle}
    >
      <div className={cx("note")}>{note.text}</div>
      <div className={cx("delete")}>&times;</div>
    </div>
  );
};

export default NoteItem;

```

여기까지하면 토글시 다음과 같이 나타날 것이다.

![Imgur](https://i.imgur.com/4O11xvW.png)

단, 여기서 input에서는 value값만 주고 onChange함수를 작성하지 않아서 오류가 뜰텐데, 이것을 고쳐보자.

일단 다시 redux로 돌아가서 changeNoteInput부분을 바꾸어 주어야 한다.

`modules/notes.js`

```js
...
export const changeNoteInput = ({ value }, isEditing) => ({
  type: CHANGE_NOTE_INPUT,
  payload: { value, isEditing }
});
..

// reducer부분 

case CHANGE_NOTE_INPUT:
  if (action.payload.isEditing) {
    return {
      ...state,
      editing: {
        ...state.editing,
        text: action.payload.value
      }
    };
  }
  return {
    ...state,
    noteInput: action.payload.value
  };
```

`containers/NoteContainer.js`

```jsx
  handleChange = ({ value }, isEditing) => {
    const { changeNoteInput } = this.props;
    changeNoteInput({ value }, isEditing);
  };

	
  render() {
      const { noteInput, error, notes, editing } = this.props;
      const { handleChange, addNote, handleToggle } = this;
      return (
        <div>
          <NoteWrapper>
            <InsertForm
              noteInput={noteInput}
              onChangeInput={handleChange}
              onAdd={addNote}
              error={error}
            />
            <NoteList
              notes={notes}
              editing={editing}
              onToggle={handleToggle}
              onChange={handleChange}
            />
          </NoteWrapper>
        </div>
      );
    }
	// NoteList props에 onChange 추가

...

const mapDispatchToProps = dispatch => {
  return {
   	// 변경
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
    }
  };
};

```

`components/notes/NoteList.js`

```jsx
import React from "react";
import styles from "./NoteList.scss";
import classNames from "classnames/bind";
import NoteItem from "components/notes/NoteItem";

const cx = classNames.bind(styles);
// onChange 추가 및 NoteItem props 전달
const NoteList = ({ notes, editing, onToggle, onChange }) => {
  const noteList = notes.map((note, i) => {
    return (
      <NoteItem
        note={note}
        key={note.id}
        editing={editing}
        onToggle={onToggle}
        onChange={onChange}
      />
    );
  });
  return (
    <div className={cx("note-list")}>
      <div className={cx("title")}>Your Notes...</div>
      {noteList}
    </div>
  );
};

export default NoteList;

```

`components/notes/NoteItem.js`

```jsx
import React from "react";
import styles from "./NoteItem.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const NoteItem = ({ note, editing, onToggle, onChange }) => {
  const handleToggle = () => {
    onToggle({ id: note.id, text: note.text });
  };

  // change함수 추가 및 input 태그 value값과 onChange 추가.
  const handleChange = e => {
    const { value } = e.target;
    onChange({ value }, true);
  };
  return (
    <div
      className={cx("note-item", editing.id === note.id && "editing")}
      onClick={handleToggle}
    >
      {editing.id === note.id ? (
        <input
          type="text"
          name="note"
          value={editing.text}
          autoFocus
          onChange={handleChange}
        />
      ) : (
        <div className={cx("note")}>{note.text}</div>
      )}
      <div className={cx("delete")}>&times;</div>
    </div>
  );
};

export default NoteItem;

```

이렇게 되면 토글을 할때에도, 전혀 문제가 되지 않고 수정시에도 수정한 글자들이 모두 상태에 반영됩니다.

그럼 이제, 실제로 수정 기능을 구현해볼까요?


`modules/notes.js`

```js
const UPDATE_NOTE = "notes/UPDATE_NOTE";
const UPDATE_NOTE_SUCCESS = "notes/UPDATE_NOTE_SUCCESS";
const UPDATE_NOTE_FAILURE = "notes/UPDATE_NOTE_FAILURE";

...


export const updateNote = () => ({
  type: UPDATE_NOTE
});
export const updateNoteSuccess = ({ note }) => ({
  type: UPDATE_NOTE_SUCCESS,
  payload: {
    note
  }
});
export const updateNoteFailure = error => ({
  type: UPDATE_NOTE_FAILURE,
  payload: {
    error
  }
});

...

const updateNoteEpic = (action$, state$) => {
  return action$.pipe(
    ofType(UPDATE_NOTE),
    withLatestFrom(state$),

    mergeMap(([action, state]) => {
      return ajax
        .patch(`/api/notes/${state.notes.editing.id}/`, {
          text: state.notes.editing.text
        })
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

...

case UPDATE_NOTE_SUCCESS:
  const { id, text } = action.payload.note;
  let notes = state.notes;
  let index = notes.findIndex((note, i) => {
    return note.id === id;
  });
  notes[parseInt(index, 10)] = {
    id,
    text
  };
  return {
    ...state,
    editing: {
      id: null,
      note: ""
    },
    notes
  };

export const notesEpics = {
  addNoteEpic,
  getNotesEpic,
  updateNoteEpic
};


```

`modules/index.js`

```js
import { notes, notesEpics } from "./notes";
import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";

export const rootReducers = combineReducers({ notes });
export const rootEpics = combineEpics(
  notesEpics.addNoteEpic,
  notesEpics.getNotesEpic,
  notesEpics.updateNoteEpic
);

```

`containers/NoteContainer.js`

```jsx
....
  updateNote = () => {
    const { updateNote } = this.props;
    updateNote();
  };


....
render() {
    const { noteInput, error, notes, editing } = this.props;
    const { handleChange, addNote, handleToggle, updateNote } = this;
    return (
      <div>
        <NoteWrapper>
          <InsertForm
            noteInput={noteInput}
            onChangeInput={handleChange}
            onAdd={addNote}
            error={error}
          />
          <NoteList
            notes={notes}
            editing={editing}
            onToggle={handleToggle}
            onChange={handleChange}
            onUpdate={updateNote}
          />
        </NoteWrapper>
      </div>
    );
  }

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
    }
  };
};


```

`components/notes/NoteList/NoteList.js`

```jsx
import React from "react";
import styles from "./NoteList.scss";
import classNames from "classnames/bind";
import NoteItem from "components/notes/NoteItem";

const cx = classNames.bind(styles);

const NoteList = ({ notes, editing, onToggle, onChange, onUpdate }) => {
  const noteList = notes.map((note, i) => {
    return (
      <NoteItem
        note={note}
        key={note.id}
        editing={editing}
        onToggle={onToggle}
        onChange={onChange}
        onUpdate={onUpdate}
      />
    );
  });
  return (
    <div className={cx("note-list")}>
      <div className={cx("title")}>Your Notes...</div>
      {noteList}
    </div>
  );
};

export default NoteList;

```
`components/notes/NoteItem/NoteItem.js`

```jsx
import React from "react";
import styles from "./NoteItem.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const NoteItem = ({ note, editing, onToggle, onChange, onUpdate }) => {
  const handleToggle = () => {
    onToggle({ id: note.id, text: note.text });
  };

  const handleChange = e => {
    const { value } = e.target;
    onChange({ value }, true);
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      onUpdate();
    }
  };
  return (
    <div
      className={cx("note-item", editing.id === note.id && "editing")}
      onClick={handleToggle}
    >
      {editing.id === note.id ? (
        <input
          type="text"
          name="note"
          value={editing.text}
          autoFocus
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      ) : (
        <div className={cx("note")}>{note.text}</div>
      )}
      <div className={cx("delete")}>&times;</div>
    </div>
  );
};

export default NoteItem;

```


자 이렇게 되면 노트 수정까지 완료되었습니다.

이제 삭제를 해볼까요?

`modules/notes.js`


```js
...
const DELETE_NOTE = "notes/DELETE_NOTE";
const DELETE_NOTE_SUCCESS = "notes/DELETE_NOTE_SUCCESS";
const DELETE_NOTE_FAILURE = "notes/DELETE_NOTE_FAILURE";
...

export const deleteNote = ({ id }) => ({
  type: DELETE_NOTE,
  payload: {
    id
  }
});
export const deleteNoteSuccess = ({ id }) => ({
  type: DELETE_NOTE_SUCCESS,
  payload: {
    id
  }
});
export const deleteNoteFailure = error => ({
  type: DELETE_NOTE_FAILURE,
  payload: {
    error
  }
});


...

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
...

case DELETE_NOTE_SUCCESS:
  return {
    ...state,
    notes: state.notes.filter(note => note.id !== action.payload.id)
  };

...


export const notesEpics = {
  addNoteEpic,
  getNotesEpic,
  updateNoteEpic,
  deleteNoteEpic
};

```

`modules/index.js`
```js
import { notes, notesEpics } from "./notes";
import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";

export const rootReducers = combineReducers({ notes });
export const rootEpics = combineEpics(
  notesEpics.addNoteEpic,
  notesEpics.getNotesEpic,
  notesEpics.updateNoteEpic,
  notesEpics.deleteNoteEpic
);

```

`containers/NoteContainer.js`

```jsx
...
  deleteNote = ({ id }) => {
    const { deleteNote } = this.props;
    deleteNote({ id });
  };

...

render() {
    const { noteInput, error, notes, editing } = this.props;
    const {
      handleChange,
      addNote,
      handleToggle,
      updateNote,
      deleteNote
    } = this;
    return (
      <div>
        <NoteWrapper>
          <InsertForm
            noteInput={noteInput}
            onChangeInput={handleChange}
            onAdd={addNote}
            error={error}
          />
          <NoteList
            notes={notes}
            editing={editing}
            onToggle={handleToggle}
            onChange={handleChange}
            onUpdate={updateNote}
            onDelete={deleteNote}
          />
        </NoteWrapper>
      </div>
    );
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
    // 추가
    deleteNote: ({ id }) => {
      dispatch(noteActions.deleteNote({ id }));
    }
  };
};
```


`NoteList.js`

```jsx
import React from "react";
import styles from "./NoteList.scss";
import classNames from "classnames/bind";
import NoteItem from "components/notes/NoteItem";

const cx = classNames.bind(styles);

const NoteList = ({
  notes,
  editing,
  onToggle,
  onChange,
  onUpdate,
  onDelete
}) => {
  const noteList = notes.map((note, i) => {
    return (
      <NoteItem
        note={note}
        key={note.id}
        editing={editing}
        onToggle={onToggle}
        onChange={onChange}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    );
  });
  return (
    <div className={cx("note-list")}>
      <div className={cx("title")}>Your Notes...</div>
      {noteList}
    </div>
  );
};

export default NoteList;

```

`NoteItem.js`

```jsx
import React from "react";
import styles from "./NoteItem.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const NoteItem = ({
  note,
  editing,
  onToggle,
  onChange,
  onUpdate,
  onDelete
}) => {
  const handleToggle = () => {
    onToggle({ id: note.id, text: note.text });
  };

  const handleChange = e => {
    const { value } = e.target;
    onChange({ value }, true);
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      onUpdate();
    }
  };

  const handleDelete = e => {
    // handleToggle이 되는것을 방지
    e.stopPropagation();
    onDelete({ id: note.id });
  };
  return (
    <div
      className={cx("note-item", editing.id === note.id && "editing")}
      onClick={handleToggle}
    >
      {editing.id === note.id ? (
        <input
          type="text"
          name="note"
          value={editing.text}
          autoFocus
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      ) : (
        <div className={cx("note")}>{note.text}</div>
      )}
      <div className={cx("delete")} onClick={handleDelete}>
        &times;
      </div>
    </div>
  );
};

export default NoteItem;

```

이렇게 되면 삭제도 가능해집니다!

다음에는 권한설정 및 무한 스크롤링 기능을 구현해보겠습니다.


