---
title: react + pwa + webpack 리액트 프로젝트를 웹팩으로 설정하기.
excerpt: react + pwa + webpack 리액트 프로젝트를 웹팩으로 설정하기.
category: velog
thumbnail: Velog.png
createdAt: 2019-12-22T14:05:51.941Z
---
# 리액트 프로젝트를 웹팩으로 설정하기.

## 1. 프로젝트 생성 및 깃 저장소 master 푸시.

```bash
mkdir react-webpack
yarn init -y
git init
```

`.gitignore`

```
build/
node_modules/
.DS_Store
yarn.lock
```

```bash
git remote add origin https://github.com/yungblud/react-webpack
git add .
git commit -m "init"
git push origin master
```

## 2. 프로젝트 구조 설정 및 기초가 되는 node module 인스톨

1. src 폴더 생성.
2. public 폴더 생성.
3. es6 문법을 사용하기 위한 노드 모듈 설치.

```bash
yarn add -D @babel/core @babel/preset-env @babel/preset-react
```

## 3. 웹팩 관련 모듈 설치

```bash
yarn add -D webpack webpack-cli webpack-dev-server babel-loader css-loader style-loader html-webpack-plugin
```

## 4. webpack.config.js 설정

webpack.config.js 파일 생성

`webpack.config.js`

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlPlugin = new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: './index.html',
})

const config = mode => {
    const isDevelopMode = mode === 'development'
    return {
        entry: './src/index.js',
        output: {
            path: path.join(__dirname, '/build'),
            filename: 'index.bundle.js',
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.(css)$/,
                    use: [
                        {
                            loader: 'style-loader',
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
                    ],
                },
            ],
        },
        plugins: [htmlPlugin],
    }
}

module.exports = (env, argv) => {
    const { mode } = argv
    return config(mode)
}
```

기본적인 리액트를 웹팩으로 띄울수 있는 설정만 하였다.

## 5. public 폴더에 index.html 생성

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>React PWA Webpack</title>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

id 를 root로 하는 태그생성.

## 6. .babelrc 파일 설정

.babelrc 파일 생성

`.babelrc`

```json
{
    "presets": ["@babel/env", "@babel/react"]
}
```

## 7. react 관련 모듈 인스톨

```bash
yarn add react react-dom
```

## 8. src/index.js 생성

`src/index.js`

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

const Root = () => <div>Hello World!</div>

ReactDOM.render(<Root />, document.getElementById('root'))
```

## 9. package.json scripts 명령어 추가.

`package.json`

```json
"scripts": {
    "build:prod": "webpack --mode=production",
    "build:dev": "webpack --mode=development"
},
```

이제 yarn build:prod 혹은 yarn build:dev 를 하면 build 폴더가 생성되면서, 번들링이 잘 된것을 볼수있다.

## 10. hot reload 를 사용 할수 있는 개발용 서버 띄우기.

`package.json`

```json
"scripts": {
    "start:dev": "webpack-dev-server --mode=development --open --hot",
    ...
}
```

start:dev 를 추가.
yarn start:dev 를 해보면 개발용 서버가 8080포트에 띄워진다.

