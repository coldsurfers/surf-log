---
title: react + pwa + webpack 투두 리스트 만들기
excerpt: react + pwa + webpack 투두 리스트 만들기
category: velog
thumbnail: Velog.png
createdAt: 2019-12-22T15:25:32.538Z
---
# 투두 리스트 만들기

## 1. src/components/Root.js 생성

`src/components/Root.js`

```jsx
import React from 'react'

const Root = () => {
    return <div>Hello world!</div>
}

export default Root
```

`src/index.js`

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './components/Root'

ReactDOM.render(<Root />, document.getElementById('root'))
```

## 2. 스타일 관련 폴더 생성 및 sass-loader 추가

```bash
yarn add -D node-sass sass-loader
```

`webpack.config.js`
원래 스타이 설정 부분(test: css)로 되었던 부분을
아래와 같이 변경.

```js
{
    test: /\.(css|scss)$/,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        {
            loader: 'css-loader',
            options: {
                modules: {
                    localIdentName: isDevelopMode
                        ? '[path][name]__[local]--[hash:base64:5]'
                        : '[name]__[local]--[hash:base64:5]',
                },
                importLoaders: 1,
                sourceMap: true,
            },
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: true,
            },
        },
    ],
},
```

`src/styles/index.scss`

```scss
body {
    color: blue;
}
```

`src/index.js`

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './components/Root'
import './styles/index.scss'

ReactDOM.render(<Root />, document.getElementById('root'))
```

이제 다시 개발서버를 키면, 글자 색상이 blue로 바뀐것을 볼수있다.

`index.scss`

```scss
body {
    margin: 0;

    height: calc(100vh);

    display: flex;
    justify-content: center;
    align-items: center;
}
```

## 3. TodoWrapper 생성

`src/components/TodoWrapper/index.js`

```jsx
import React from 'react'
import s from './style.scss'

const TodoWrapper = () => {
    return <div className={s.wrapper}>TodoWrapper</div>
}

export default TodoWrapper
```

`src/components/TodoWrapper/style.scss`

```scss
.wrapper {
    border: 3px solid #ababab;

    padding: 30px;
    width: 500px;
    height: auto;
}
```

`src/components/Root.js`

```jsx
import React from 'react'
import TodoWrapper from './TodoWrapper'

const Root = () => {
    return <TodoWrapper />
}

export default Root
```

## 4. TodoTitle & TodoList 컴포넌트 생성

`src/components/TodoTitle/index.js`

```jsx
import React from 'react'
import s from './style.scss'

const TodoTitle = () => {
    return <div className={s.wrapper}>React Todo List</div>
}

export default TodoTitle
```

`src/components/TodoTitle/style.scss`

```scss
.wrapper {
    font-size: 25px;
    padding-bottom: 10px;
    border-bottom: 2px solid #eeeeee;
}
```

`src/components/TodoList/index.js`

```jsx
import React from 'react'
import s from './style.scss'

const TodoList = ({ todoList }) => {
    const todoItem = todoList.map(({ id, todo }) => {
        return (
            <div key={id} className={s.todoItem}>
                {todo}
            </div>
        )
    })
    return <div className={s.wrapper}>{todoItem}</div>
}

export default TodoList
```

`src/components/TodoList/style.scss`

```scss
.wrapper {
    color: blue;
}
```

api 를 가져오기 위한 axios 모듈 설치

```bash
yarn add axios
```

`src/components/TodoWrapper/index.js`

```jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import s from './style.scss'
import TodoTitle from '../TodoTitle'
import TodoList from '../TodoList'

const TodoWrapper = () => {
    const [todoList, setTodoList] = useState([])

    const getTodoList = async () => {
        try {
            const { data: todoList } = await axios.get(
                'https://jsonplaceholder.typicode.com/todos'
            )
            setTodoList(todoList.splice(0, 10))
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getTodoList()
    }, [])

    return (
        <div className={s.wrapper}>
            <TodoTitle />
            <TodoList todoList={todoList} />
        </div>
    )
}

export default TodoWrapper
```

