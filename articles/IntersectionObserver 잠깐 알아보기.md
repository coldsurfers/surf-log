---
title: IntersectionObserver 잠깐 알아보기
excerpt: IntersectionObserver를 살짝 훑어보고, react에서 사용법 알아보기
category: dev
thumbnail: js.png
createdAt: 2022-04-11T01:27:39.650Z
---
# IntersectionObserver 잠깐 알아보기

## IntersectionObserver란?

IntersectionObserver는 web API 이다.
Intersection Observer API는 타겟 요소와 상위 요소 또는 최상위 document 의 viewport 사이의 intersection 내의 변화를 비동기적으로 관찰하는 방법이다.

[출처](https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API)


## IntersectionObserver를 쓰는 이유

전통적으로 예전부터 스크롤을 감지하여 HTML element를 관리할때에 window의 scroll event listener를 사용하여 스크롤을 감지하거나, HTML element의 가시성을 알아볼때에 사용했다.

하지만 이 window의 scroll event listener의 단점이 있었다.

* 이 스크롤 이벤트가 발생할때마다 event listener의 콜백함수가 동작되므로 그것이 단시간에 불필요하게 수백번, 수천번 작동할수 있다. (debounce 혹은 throttle 방식을 적용하여 이 문제를 개선 가능)
* 그리고 특정 지점을 관찰하기 위해서 `getBoundingClientRect()` 함수를 사용해야 하는데 이 함수를 사용시에는 `리플로우(reflow)` 현상이 발생한다

> Reflow: 브라우저가 웹 페이지의 일부 또는 전체를 다시 그려야 하는 경우 발생

이러한 기존 방법론의 단점을 보완하기 위해서 IntersectionObserver API가 등장했다.
비 동기적으로 실행되기 때문에, 메인 쓰레드에 영향을 주지 않으면서 변경 사항을 관찰 할 수 있다.
또한 `IntersectionOberverEntry` 의 속성을 활용하면 `getBoundingClientRect()`를 호출한 것과  같은 결과를 알 수 있기 때문에 따로 `getBoundingClientRect()` 함수를 실행 시킬 필요가 없다.
따라서 `Reflow`현상이 발생하는 것을 방지 할 수 있다

[출처](http://blog.hyeyoonjung.com/2019/01/09/intersectionobserver-tutorial/)

## IntersectionObserver 간략 사용법
```js
const observer = new IntersectionObserver(callback, options)
```
형식으로 생성을 하여 쓴다.
그렇다면 세세하게 한번 callback, options 그리고 생성자로 받은 생성자 객체에는 어떤 것을 포함하고 있는지 알아보자.

### IntersectionObserver - callback

```js
let callback = (entries, observer) => {
  entries.forEach(entry => {
    // Each entry describes an intersection change for one observed
    // target element:
    //   entry.boundingClientRect
    //   entry.intersectionRatio
    //   entry.intersectionRect
    //   entry.isIntersecting
    //   entry.rootBounds
    //   entry.target
    //   entry.time
  });
};
```

### IntersectionObserver - options

```js
let options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  threshold: 1.0
}

let observer = new IntersectionObserver(callback, options);
```
* threshold: 1.0 은 대상 요소가 root 에 지정된 요소 내에서 100% 보여질 때 콜백이 호출될 것을 의미합니다. 혹은 25% 단위로 요소의 가시성이 변경될 때마다 콜백이 실행되게 하고 싶다면 [0, 0.25, 0.5, 0.75, 1] 과 같은 배열을 설정하세요.
* root: 대상 객체의 가시성을 확인할 때 사용되는 뷰포트 요소입니다. 이는 대상 객체의 조상 요소여야 합니다. 기본값은 브라우저 뷰포트이며, root 값이 null 이거나 지정되지 않을 때 기본값으로 설정됩니다.
* rootMargin: root 가 가진 여백입니다. 이 속성의 값은 CSS의 margin 속성과 유사합니다. e.g. "10px 20px 30px 40px" (top, right, bottom, left). 이 값은 퍼센티지가 될 수 있습니다. 이것은 root 요소의 각 측면의 bounding box를 수축시키거나 증가시키며, 교차성을 계산하기 전에 적용됩니다. 기본값은 0입니다.

### IntersectionObserver - 생성자로 받은 객체

```js
let observer = new IntersectionObserver(callback, options);
let target = document.querySelector('#listItem');
observer.observe(target)

...

observer.unobserve(target)
observer.disconnect()

```

* observe: 특정 HTML Element를 관찰 하게 된다.
* unobserve: 특정 HTML Element의 관찰을 멈춘다.
* disconnect: observer가 모든 HTML Element에 대한 관찰을 멈춘다


## IntersectionObserver를 실무에서는 어떻게 쓸까?

### 예제 1. 무한 스크롤링
간단한 이 블로그 프로젝트에 쓰인 사용법을 소개하며 글을 마치려고 한다.
무한 스크롤링을 구현해서 더 가져오기 기능을 구현하는데 쓰였다.

```js
useEffect(() => {
  let observer: IntersectionObserver
  observer = new IntersectionObserver(
      (
          entries: IntersectionObserverEntry[],
          observer: IntersectionObserver
      ) => {
          const [entry] = entries
          if (
              !entry.isIntersecting ||
              articles.length < DEFAULT_PAGINATION_COUNT
          ) {
              return
          }
          loadMore()
          observer.unobserve(
              loadingIndicatorElementRef.current as Element
          )
      },
      {
          threshold: 0.5,
      }
  )

  if (loadingIndicatorElementRef.current) {
      observer.observe(loadingIndicatorElementRef.current as Element)
  }

  return () => {
      if (observer) {
          observer.disconnect()
      }
  }
}, [articles.length, loadMore])

...

return (
  ...
      <div
          className={css`
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              margin-top: 10px;
              margin-bottom: 10px;
          `}
          ref={loadingIndicatorElementRef}
      >
          {isLoading && <RotatingLines width="100" />}
      </div>
	</ArticleListContainer>
)
```

설명을 해보자면 react의 ref를 사용하여 `loadingIndicatorElementRef`를 일반 div element에 주입을 시킨다. 그 div element가 IntersectionObserver가 관찰하게 될 HTML Element이다.
유저가 스크롤을 하여 하단으로 스크롤을 내리면, 특정 하단의 div element가 보이게 되고, 따라서 그것을 관찰하던 IntersectionObserver가 관찰을 하다가, 특정 threshold에 맞추어 콜백함수를 실행한다. threshold 값이 만족이 된다면, entry의 `isIntersecting` 속성이 true로 변하게 된다.
따라서 그때에 필요한 비즈니스 로직을 실행하게 된다. 여기서는 loadMore 함수를 실행 시킨다.

### 예제 2. dynamically fixed 사이드바

```js
const NavItemList = styled.ul<{ isFixed: boolean }>`
    position: ${(p) => (p.isFixed ? 'fixed' : 'relative')};
    top: ${(p) => (p.isFixed ? '1rem' : '0px')};
    width: ${(p) => (p.isFixed ? '230px' : '100%')};

...
`

...

useEffect(() => {
    let observer: IntersectionObserver
    observer = new IntersectionObserver(
        (entries, observer) => {
            const [entry] = entries

            if (entry.isIntersecting) {
                setIsFixed(false)
            } else {
                setIsFixed(true)
            }
        },
        {
            threshold: 0.1,
        }
    )

    if (sideBarTopSpaceRef.current) {
        observer.observe(sideBarTopSpaceRef.current as Element)
    }

    return () => {
        if (observer) {
            observer.disconnect()
        }
    }
}, [])

return (
  <Container style={{ position: 'relative' }}>
      <div
          ref={sideBarTopSpaceRef}
          style={{
              height: '90px',
          }}
      />
      <NavItemList isFixed={isFixed}>
          <NavItem>
              <Link href={`/`} passHref>
                  <NavLink matched={router.pathname === '/'}>
                      <NavLinkText>All</NavLinkText>
                  </NavLink>
              </Link>
          </NavItem>
...
```
이 상황에 대해서 살짝 설명을 하자면, 사이드바가 특정 스크롤 높이에서는 fixed 상태가 되어야 하는 상황이다. 따라서 스크롤바 위에 특정 높이를 가진 div element를 놓고 그것을 IntersectionObserver를 이용해 관찰한다. 그 후, 특정 element가 `isIntersecting === true` 일때 `isFixed` 상태를 변경한다.





