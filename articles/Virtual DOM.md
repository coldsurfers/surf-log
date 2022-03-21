---
title: Virtual DOM
excerpt: Virtual DOM은 무엇일까?
category: dev
thumbnail: unsplash-code-react.jpg
createdAt: 2022-03-20T13:27:54.602Z
---
# Virtual DOM은 무엇인가?

[유튜브영상](youtube.com/watch?v=d7pyEDqBDeE)

## DOM
> Document Object Model

트리구조로 HTML, XHTML, XML 문서에서 보여주는 기준화된 API
Javascript를 HTML과 연결해준다.
DOM Node들은 직접 접근이 가능하다. (ex. getElementById)
Tree의 각 노드들은 html element를 나타낸다

## Web Browser 작동 순서
> HTML을 파싱하여 DOM Tree를 구성한다
-> 렌더 트리를 만든다
-> 렌더 트리의 레이아웃을 구성한다
-> 렌더 트리를 그린다

* DOM 트리 자체는 HTML 문서를 파싱하는 렌더링 엔진에 의해 생성된다. (ex. Webkit)
* CSS를 파싱하고 HTML에 파싱된 CSS를 적용하는 하여 렌더 트리를 생성한다
* 렌더트리가 브라우저에 그려진다.

우리가 node를 변경할때에 위의 일들이 매번 일어난다.
node의 변경이 자주 일어날수록, 뷰를 다시 그려주기 위해 브라우저가 받는 부하는 계속 된다.
굉장히 고비용의 일이 되는 것 이다.

## Virtual DOM을 사용함으로써 해결한 일들

* node들의 변화를 감지하여 바로 그려주는 대신, 먼저 Virtual DOM에 적용한다.
* Virtual DOM에 적용된 것은 실제 뷰에는 그려지지 않는다. 따라서 저비용의 작업에 해당한다. 새로운 빌딩을 짓는 것과 새로운 빌딩을 짓기위한 청사진을 그리는 것의 차이이다.
* 또한 Virtual DOM은 효율성을 위해 변화를 한번에 모아서 배치작업을 한다.

## Virtual DOM
> 단순히 Virtual DOM은 트리구조를 가지는 순수 자바스크립트 객체이다.

가볍고, 메모리 내부에 존재한다. 절대로 실제로 그려지지 않는다. 이 Virtual DOM이라는 아이디어는 React에 의해서 나왔지만, 다른 프런트엔드 프레임워크들에도 사용중이다. (ex. Angular 2, Vue)


## React의 Virtual DOM은 어떻게 작동할까?
* 초기 렌더링 작업에서, JSX는 템플릿 컴파일러에게 in-memory DOM Tree를 어떻게 생성할지 알려준다.
* `ReactDOM.render()` 함수를 불렀을때에, Virtual DOM Tree를 메모리 내부에서 생성한다.

## State의 변화 다루기
* 대부분 `setState`함수에 의해서 App이 업데이트 된다.
* 이 때에 Tree는 완전히 다르게 새로이 생성된다.
* state가 변할시에 두개의 다른 Virtual DOM이 메모리 내부에 존재하게 된다
* 이것은 비효율적으로 보이지만, 실제로는 그렇지 않다. React Element들은 굉장히 가볍기 때문이다.
* 이때에 React는 두개의 Tree를 비교한다. 그리고 두 Tree간의 차이점을 매핑한다.
* 그 차이점들을 조합하여 패치를 만들어내고, 변화를 실제 DOM에 반영한다.
* 이때 사용하는 diff 알고리즘은 실제 DOM을 업데이트하기 위해서 최소한의 작업을 찾기 위해 사용된다.
* 이러한 작업들은 batch되어 처리되어서 매 lifecycle 마다 실제 DOM은 한번만 변화된다.

## Diffing, or "Reconciliation"
* 최소한의 작업을 찾기 위한 것은 `O(n3)` complexity를 가진다.
* React는 `O(n)`을 사용한다.
* 어떻게? 두가지 가정에 의존한다.

### 가정 1
* 서로 다른 타입의 Element들은 서로 다른 Tree를 생성해낸다.
* 따라서 React는 두개의 서로다른 Tree를 비교할때에 각 트리의 Root Element를 비교한다.
* 만약 두개의 Root Element가 서로 다른 타입을 가지고 있다면, React는 이전의 Tree를 모두 새로운 Tree로 갈아 엎는다. Root Element 밑의 모든 SubTree를 새로이 그려낸다.

### 가정 2
* `key` 값을 사용하는 것이 자식 Element들의 변화를 감지하는데 힌트가 되어 줄 수 있다.
* 성능을 개선하기 위해서는 `key`값들이 모두 안정적이고 예측가능하고 중복된 값이 없어야 한다.

```html
<ul>
  <li>John</li>
  <li>Alice</li>
</ul>
```


```html
<ul>
  <li>John</li>
  <li>Alice</li>
  <li>Ed</li>
</ul>
```

`key` 값이 없다면 새로운 자식 element가 추가되어도, 모든 자식 element를 모두 다시 그려줘야 한다. 하지만 `key` 값으로 자식 element를 구분할 수 있다면, 어떤 것만 새로이 추가해야 하는지 알 수 있다.

```html
<ul>
  <li key="9">John</li>
  <li key="10">Alice</li>
  <li key="11">Ed</li>
</ul>
```

만약 `key` 값이 예측하지 못하는 random한 값이라면 (ex. Math.random()) React는 예측할 수 없기 때문에 자식 Element가 제대로 그려지지 못하는 현상이 발생 할 수 있다.

## 다음은?
### React Fiber
> React의 reconciliation 알고리즘을 다시 쓰는데에 새로 나온 것이다.
DOM 을 계속 순환하는 대신에, fiber라고 부르는 새로운 데이터 구조를 사용한다.
Fiber는 순수 자바스크립트 객체이며 parent-child node 간 관계를 하나의 linked-list형태로 트래킹한다. 위의 작업들은 "incremental rendering" 혹은 "scheduling"이라고 불리운다


