---
title: Dnote 4 - 5. React - 노트 생성 시 에러 처리.
excerpt: Dnote 4 - 5. React - 노트 생성 시 에러 처리.
category: velog
thumbnail: Velog.png
createdAt: 2018-09-21T14:12:54.092Z
---
자 이제 생성은 되는데, 아무것도 없이 엔터만 치면 에러가 나겠죠?

이 에러를 반영해주는 작업들을 해보겠습니다.

redux의 initialState에 다음을 추가해줍니다.

`modules/notes.js`

```js
const initialState = {
  noteInput: "",
  notes: [],
  // 에러 관련 state 등록.
  error: {
    triggered: false,
    message: ""
  }
};
```

`containers/NoteContainer.js`

```jsx
...

render() {
    const { noteInput, error } = this.props;
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
        </NoteWrapper>
      </div>
    );
  }

...

const mapStateToProps = state => ({
  noteInput: state.notes.noteInput,
  notes: state.notes.notes,
  error: state.notes.error
});
```
`components/notes/InsertForm/InsertForm.js`

```jsx
import React from "react";
import styles from "./InsertForm.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const InsertForm = ({ noteInput, onChangeInput, onAdd, error }) => {
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
      <div className={cx("error")}>
        {error.triggered && (
          <div className={cx("message")}>{error.message}</div>
        )}
      </div>
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

이제 에러가 생기면 반영이 됩니다. 그러나 제대로 입력했을때도 남아있으니, 이부분을 고쳐보겠습니다.

`store/modules/notes.js`

```js
case ADD_NOTE_SUCCESS:
      const { note } = action.payload;
      return {
        ...state,
        notes: [note].concat(state.notes),
        noteInput: "",
        // 성공시 에러 초기화.
        error: {
          triggered: false,
          message: ""
        }
      };
```

다음에는 생성된 노트들을 보여주는 처리를 해보겠습니다.


