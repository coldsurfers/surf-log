---
title: Dnote 6 - 1. React - 무한 스크롤링 기능 구현.
excerpt: Dnote 6 - 1. React - 무한 스크롤링 기능 구현.
category: velog
thumbnail: Velog.png
createdAt: 2018-09-23T10:06:55.996Z
---
이제 무한 스크롤링 기능을 구현해 보겠습니다.

무한 스크롤링은 브라우저가 아래에 닿았을때, 저희가 마지막으로 보여주는 노트 아이템의 id를 기준으로 다음 10개의 노트 아이템들을 받아올 예정입니다.

NoteContainer에 다음을 추가해주겠습니다.

`containers/NoteContainer.js`

```jsx
...

componentDidMount() {
  this.getNotes();
  // 스크롤링 이벤트 추가
  window.addEventListener("scroll", this.handleScroll);
}

componentWillUnmount() {
  // 언마운트 될때에, 스크롤링 이벤트 제거
  window.removeEventListener("scroll", this.handleScroll);
}

...

handleScroll = () => {
  const { innerHeight } = window;
  const { scrollHeight } = document.body;
  // IE에서는 document.documentElement 를 사용.
  const scrollTop =
    (document.documentElement && document.documentElement.scrollTop) ||
    document.body.scrollTop;
  // 스크롤링 했을때, 브라우저의 가장 밑에서 100정도 높이가 남았을때에 실행하기위함.
  if (scrollHeight - innerHeight - scrollTop < 100) {
    console.log("Almost Bottom Of This Browser");
  }
};
```

일단 스크롤링을 해야하므로 노트들을 20개정도 추가해주세요.

그리고 스크롤링해서 바닥에 닿으면 console에 로그가 찍힙니다.

그러면 이제 바닥에 거의 닿았을때, 더 많은 노트를 가져오는 API를 작성한후, redux처리를 해서 기능을 구현해야 합니다.

장고쪽으로 다시 돌아와주세요.

`notes/views.py`

```python
class LoadMoreNotes(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = NoteSerializer

    def get(self, request, *args, **kwargs):
        flagId = kwargs['id']
        notes = Notes.objects.filter(owner=self.request.user).filter(id__lt=flagId).order_by('-created_at')[:10]
        isLast = False
        if len(notes) < 10:
            isLast = True
        serializer = self.get_serializer(notes, many=True, context={"request": request})
        return Response({
            "notes": serializer.data,
            "isLast": isLast
        })
```

`notes/urls.py`

```python
from django.conf.urls import url
from .views import NoteViewSet, RegistrationAPI, LoginAPI, UserAPI, LoadMoreNotes
# LoadMoreNotes 가져오기


note_list = NoteViewSet.as_view({"get": "list", "post": "create"})

note_detail = NoteViewSet.as_view(
    {"get": "retrieve", "patch": "partial_update", "delete": "destroy"}
)


urlpatterns = [
    url("^notes/$", note_list, name="note-list"),
    url("^notes/(?P<pk>[0-9]+)/$", note_detail, name="note-detail"),
    url("^notes/next/(?P<id>[0-9]+)/$", LoadMoreNotes.as_view()),
    # 상단을 추가해줍니다
    url("^auth/register/$", RegistrationAPI.as_view()),
    url("^auth/login/$", LoginAPI.as_view()),
    url("^auth/user/$", UserAPI.as_view()),
]

```
url: `/api/notes/next/{id}/`

이렇게 되면 url의 id를 바탕으로 작성자의 노트중 id 이후의 10개를 가져옵니다.

그럼 이제 API작업은 끝났으니, 다시 리액트로 돌아와서 무한스크롤링을 마저 구현해보겠습니다.

redux의 notes모듈에서 더 받아오기 epic을 추가해주겟습니다.

`modules/notes.js`

```js
import { ajax } from "rxjs/observable/dom/ajax";
import { of } from "rxjs";
import { map, mergeMap, catchError, withLatestFrom, 
        // 잠시간의 delay를 두어 로딩뷰를 띄우기 위해 추가해줍니다.
        delay } from "rxjs/operators";
import { ofType } from "redux-observable";

...


const GET_MORE_NOTES = "notes/GET_MORE_NOTES";
const GET_MORE_NOTES_SUCCESS = "notes/GET_MORE_NOTES_SUCCESS";
const GET_MORE_NOTES_FAILURE = "notes/GET_MORE_NOTES_FAILURE";

...

export const getMoreNotes = lastId => ({
  type: GET_MORE_NOTES,
  payload: {
    lastId
  }
});

export const getMoreNotesSuccess = ({ notes, isLast }) => ({
  type: GET_MORE_NOTES_SUCCESS,
  payload: {
    notes,
    isLast
  }
});

export const getMoreNotesFailure = error => ({
  type: GET_MORE_NOTES_FAILURE,
  payload: {
    error
  }
});

....


const getMoreNotesEpic = (action$, state$) => {
  return action$.pipe(
    ofType(GET_MORE_NOTES),
    // 0.75초간의 딜레이를 줍니다.
    delay(750),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null;
      const { lastId } = action.payload;
      return ajax
        .get(`/api/notes/next/${lastId}/`, {
          "Content-Type": "application/json",
          Authorization: `token ${token}`
        })
        .pipe(
          map(response => {
            const { notes, isLast } = response.response;
            return getMoreNotesSuccess({ notes, isLast });
          }),
          catchError(error =>
            of({
              type: GET_MORE_NOTES_FAILURE,
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
  noteInput: "",
  notes: [],
  error: {
    triggered: false,
    message: ""
  },
  editing: {
    id: null,
    text: ""
  },
  // 아래 추가.
  isLast: false,
  isLoading: false
};

...

case GET_MORE_NOTES:
      return {
        ...state,
        isLoading: true
      };
case GET_MORE_NOTES_SUCCESS:
  return {
    ...state,
    notes: state.notes.concat(action.payload.notes),
    isLast: action.payload.isLast,
    isLoading: false
  };
case GET_MORE_NOTES_FAILURE:
  return {
    ...state,
    error: {
      triggered: true,
      message: "ERROR WHILE LOAD MORE, TRY AGAIN"
    }
  };

...

export const notesEpics = {
  addNoteEpic,
  getNotesEpic,
  updateNoteEpic,
  deleteNoteEpic,
  getMoreNotesEpic
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
  authEpics.registerEpic,
  authEpics.checkUserEpic,
  authEpics.logoutEpic,
  notesEpics.getMoreNotesEpic
);

```

`containers/NoteContainer.js`
```jsx

....

handleScroll = () => {
  const { innerHeight } = window;
  const { scrollHeight } = document.body;
  const scrollTop =
    (document.documentElement && document.documentElement.scrollTop) ||
    document.body.scrollTop;
  if (scrollHeight - innerHeight - scrollTop < 100) {
    if (!this.props.isLoading && !this.props.isLast) {
      const lastId = this.props.notes[this.props.notes.length - 1].id;
      this.props.getMoreNotes({ lastId });
    }
  }
};

.....

const mapStateToProps = state => ({
  noteInput: state.notes.noteInput,
  notes: state.notes.notes,
  error: state.notes.error,
  editing: state.notes.editing,
  // 아래 추가.
  isLast: state.notes.isLast,
  isLoading: state.notes.isLoading
});

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
    // 아래 추가.
    getMoreNotes: ({lastId}) => {
      dispatch(noteActions.getMoreNotes({lastId}));
    }
  };
};
....
```
이렇게 되면 바닥에 닿았을때, 0.75초 간격으로 가져오게 됩니다.

중복 받아오기를 방지하기 위하여 isLoading이거나, isLast일때에는 받아오지 않게 설정해놓았습니다.

자 이제 로딩 뷰를 보여줘야겠죠?

```bash
$ yarn add better-react-spinkit
```
위와같은 모듈을 받아줍니다.

잘 만들어진 로딩뷰를 보여주는 모듈입니다.

그리고 LoadingView 컴포넌트를 다음과 같이 만들어줍니다.


`components/notes/LoadingView/LoadingView.js`

```jsx
import React from "react";
import styles from "./LoadingView.scss";
import classNames from "classnames/bind";
import { ChasingDots } from "better-react-spinkit";

const cx = classNames.bind(styles);

const LoadingView = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div className={cx("loading-view")}>
      <ChasingDots color={"black"} size={60} />
    </div>
  );
};

export default LoadingView;

```

`components/notes/LoadingView/LoadingView.scss`

```css
@import "utils";

.loading-view {
  display: flex;
  justify-content: center;
  align-items: center;

  padding-top: 1rem;
  padding-bottom: 1rem;
}

```
`components/notes/LoadingView/index.js`

```js
export { default } from './LoadingView';
```

이 컴포넌트를 컨테이너에 반영합니다.

`containers/NoteContainer.js`

```jsx
...
import LoadingView from "components/notes/LoadingView";

...


render() {
  const { noteInput, error, notes, editing, isLoading } = this.props;
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
        <LoadingView isLoading={isLoading} />
      </NoteWrapper>
    </div>
  );
}
...

```

오 이제 로딩뷰도 보여지고, 무한 스크롤링이 아주 잘됩니다.


근데 한가지 문제점이 남아있죠~ 바로 isLast가 아닌 상태에서 즉, 10개만 받아왔다고 가정하고, 나머지 10개가 남아있다는 상황에서 위에서부터 삭제를 하면 10개는 모두 사라지지만, 나머지 10개가 받아와지지 않습니다.

이 문제를 해결하기 위해 다음과 같이 변경해줍니다.

`containers/NoteContainer.js`

```jsx
deleteNote = ({ id }) => {
  const { deleteNote } = this.props;
  deleteNote({ id });

  const scrollHeight =
    (document.documentElement && document.documentElement.scrollHeight) ||
    document.body.scrollHeight;
  const clientHeight =
    (document.documentElement && document.documentElement.clientHeight) ||
    document.body.clientHeight;
  const offsetFlag = scrollHeight - clientHeight < 100;
  if (offsetFlag) {
    const lastId = this.props.notes[this.props.notes.length - 1].id;
    if (!this.props.isLast) {
      this.props.getMoreNotes({ lastId });
    }
  }
};
```

지웠을때, 남아있는 스크롤의 높이가 100보다 작아지면 만약 isLast가 아니라면 더 받아오는 형식입니다.

그러나 이렇게 했을때에도 버그가 있습니다.

엄청나게 빨리 눌렀을때에 로딩이 되는도중에도 삭제가 진행되기 때문인데요.

이 버그를 고쳐보겠습니다.

`containers/NoteContainer.js`

```jsx
deleteNote = ({ id }) => {
  const { deleteNote } = this.props;
  // 현재 props의 isLoading이 아닐때만 지워줍니다.
  if (!this.props.isLoading) {
    deleteNote({ id });
  }

  const scrollHeight =
    (document.documentElement && document.documentElement.scrollHeight) ||
    document.body.scrollHeight;
  const clientHeight =
    (document.documentElement && document.documentElement.clientHeight) ||
    document.body.clientHeight;
  const offsetFlag = scrollHeight - clientHeight < 100;
  if (offsetFlag) {
    const lastId = this.props.notes[this.props.notes.length - 1].id;
    if (!this.props.isLast) {
      this.props.getMoreNotes({ lastId });
    }
  }
};
```

유후 이제 버그도 고쳤고 무한스크롤링도 되고 삭제시에도 더 많은 노트들을 보여줄수 있습니다!

