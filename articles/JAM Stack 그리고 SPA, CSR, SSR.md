---
title: JAM Stack 그리고 SPA, CSR, SSR
excerpt: 웹 클라이언트를 구성하는 방식들은 무엇이 있을까? 그리고 어떻게 다른가?
category: dev
thumbnail: unsplash-code-react.jpg
createdAt: 2022-03-19T06:26:37.017Z
---
# JAM Stack 그리고 SPA, CSR, SSR

# 목차
1. JAM Stack 이란 무엇인가?
2. JAM Stack은 SSR / CSR과 어떻게 다를까?
3. 그럼 SSR 방식은 필요가 없어진 것 일까?


## 1. JAM Stack 이란 무엇인가?
* J: Javascript
* A: API
* M: Markup

Javascript와 API 그리고 Markup(HTML)으로만 이루어진 웹의 구성을 이야기 한다.
우리가 알고 있는 SPA 과는 비슷하지만 다르다고 한다.
JAM Stack은 특정 기술 (ex. React, Vue)을 채택하는 것과는 다른 관점이며, 이들을 이용해서 웹사이트를 어떻게 구성할지에 대한 관점이다.

> **JavaScript**
Client 의 모든 처리는 Javascript 에게 맞긴다.
**API**
모든 기능 및 비즈니스 로직은 재사용 가능한 API 로 추상화한다.
**Markup**
SSG (Static Site Generator) 나 Template Engine (Webpack 등) 을 이용하여 Markup 을 미리 생성한다.


비슷하게 `MERN Stack`이 있다.
* M: Mongo DB
* E: Express
* R: React
* N: Node.JS

## 2. JAM Stack은 SSR / CSR과 어떻게 다를까?

React, Angular, Vue와 같은 모던 웹 프레임워크 및 라이브러리가 나오기 전에 SSR로 웹 사이트를 보여주었다. SSR이라 함은 브라우저의 요청을 받아 서버에서 html을 내려주어 렌더링 해주는 방식을 말한다. 하지만 이러한 방식은 CSR에 비해 서버의 자원을 많이 쓰게 되므로 그런 부분에서 비효율 적이다.
또한 속도측면에서도 CSR은 서버를 타지 않고 렌더링을 해주기 때문에, SSR에 비해 효율적이다.
페이지를 이동할 때 마다 서버에서 html을 받아서 뷰를 그려주는 것보다는 http request를 통해서 필요한 자원만 받아서 뷰에 그려주는 것이 속도상 이점이 있기 때문이다.

그래서 React와 같은 SPA (Single Page App) 프레임워크 및 라이브러리는 html 마크업 부분은 사실상 title 및 meta 를 나타내는 head 태그와 body 태그내에서 javascript를 이용하여 렌더링 할 tag를 지정해주는 태그 외에는 많은 부분이 비어있다.

SPA 방식은 서버에서 의존하던 클라이언트를 그려주는 방식에서 많이 탈피한 방식이다.
서버에서 html을 그리는데 필요한 자원을 모두 받아오는 SSR 방식에서 서버에서는 필요한 자원(클라이언트와 분리된 서버 API를 통해서)만을 받아오며 html은 기본 토대만을 담당 하며 나머지 클라이언트에서 보여주는 모든 뷰들은 자바스크립트와 css가 담당한다.

## 3. 그럼 SSR 방식은 필요가 없어진 것 일까?
SPA를 통한 CSR 방식은 다음과 같은 두가지 단점을 가진다.
1. SSR에 비해서 첫 그림을 그려주기 전 까지 딜레이가 걸린다.
2. HTML이 거의 비어있기 때문에, SEO (검색엔진 최적화)에 좋지 않다.

SPA를 사용한 CSR 방식은 위 두가지 단점에도 너무나 매력적인 스택이기 때문에, 위 두가지 단점을 보완하고자 하는 방식들이 나오게 되었다.

예를들면 부분적으로 SSR 방식을 채택한 Next (React)와 Nuxt (Vue) 등이 있다.
첫 페이지는 SSR로 보여주고, 나머지는 SPA의 javascript를 사용하여 CSR로 보여주는 방식이다.
이로써 단점 1번을 보완하여 첫 페이지는 완성된 html을 보여주어 `First meaningful paint`의 속도를 향상시키고 단점 2번을 보완하여 검색 봇이 html을 크롤링 해서 SEO를 향상 시켰다.




