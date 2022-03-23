---
title: react + pwa + webpack PWA 적용하기
excerpt: react + pwa + webpack PWA 적용하기
category: velog
thumbnail: Velog.png
createdAt: 2019-12-23T03:19:13.569Z
---
# PWA 적용하기

## 1. 노드 모듈 인스톨

pwa에 관련한 웹팩 모듈을 인스톨 해준다.

```bash
yarn add -D webpack-pwa-manifest workbox-webpack-plugin
```

## 2. manifest.json 파일 생성

`public/manifest.json`

```json
{
    "name": "react-webpack",
    "short_name": "react",
    "description": "react todo list app with pwa",
    "background_color": "#ffffff",
    "crossorigin": "use-credentials",
    "theme_color": "#eeeeee",
    "filename": "manifest.json"
}
```

## 3. webpack 설정 추가

`webpack.config.js`

```js
...
const WebpackPwaManifest = require('webpack-pwa-manifest')
const { GenerateSW } = require('workbox-webpack-plugin')
const manifest = require('./public/manifest.json')

...

const pwaPlugin = new WebpackPwaManifest(manifest)

const workboxPlugin = new InjectManifest({
    swSrc: './src/sw.js',
    swDest: 'sw.js',
})
...

{
    ...
    plugins: [htmlPlugin, cssPlugin, pwaPlugin, workboxPlugin],
}
```

`src/sw.js`

```js
workbox.core.skipWaiting()
workbox.core.clientsClaim()

workbox.routing.registerRoute(
    new RegExp('https://jsonplaceholder.typicode.com'),
    new workbox.strategies.StaleWhileRevalidate()
)

self.addEventListener('push', event => {
    const title = 'Get Started With Workbox'
    const options = {
        body: event.data.text(),
    }
    event.waitUntil(
        self.ServiceWorkerRegistration.showNotification(title, options)
    )
})

workbox.precaching.precacheAndRoute(self.__precacheManifest)
```

manifest 와 service worker 설정까지 추가하였다.

## 4. serviceWorker 작동 시키기.

`src/index.js`

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './components/Root'
import './styles/index.scss'

ReactDOM.render(<Root />, document.getElementById('root'))

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then(registration => {
                console.log('SW registered', registration)
                registration.pushManager.subscribe({ userVisibleOnly: true })
                Notification.requestPermission().then(p => {
                    console.log(p)
                })
            })
            .catch(e => {
                console.log('SW registration failed: ', e)
            })
    })
}
```

개발자 도구를 켜고 Application 탭을 클릭한 후, Sercice Workers 탭을 클릭 하면 서비스 워커가 잘 붙은것을 볼수 있다.
또한 offline 으로 설정 한뒤 새로고침을 해도 새로고침 후 오프라인에서도 앱이 동작하는 것을 볼수 있다.
runTimeCaching 옵션에서 jsonplaceholder URL을 등록하였기 때문이다.

마지막으로 푸쉬 노티피케이션까지도 구현되었다. 테스트는 Application 탭의 Service Workers 아래에 push 버튼을 눌러보면 할수있다.

