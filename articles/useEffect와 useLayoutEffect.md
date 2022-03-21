---
title: useEffect와 useLayoutEffect
excerpt: 초기값 설정에 따라서 언제 어느 것을 사용하여야 할까?
category: dev
thumbnail: unsplash-code-react.jpg
createdAt: 2022-03-21T02:17:58.205Z
---
# useEffect와 useLayoutEffect

## useEffect
> componentDidMount 혹은 componentDidUpdate와는 달리 useEffect에서 사용되는 effect는 브라우저가 화면을 업데이트하는 것을 차단하지 않습니다.
이를 통해 애플리케이션의 반응성을 향상해줍니다.
대부분의 effect는 동기적으로 실행될 필요가 없습니다.
흔하지는 않지만 (레이아웃의 측정과 같은) 동기적 실행이 필요한 경우에는 useEffect와 동일한 API를 사용하는 useLayoutEffect라는 별도의 Hook이 존재합니다.

[React 문서](https://ko.reactjs.org/docs/hooks-effect.html)

이 설명을 코드로 풀어 말하자면 다음과 같다.

```jsx
const Page = () => {
	const [name, setName] = useState("")
    
    useEffect(() => {
    	setName("John Doe")
    }, [])
  
	return <h1>My name is {name}</h1>
}
```

위 코드에서 name값의 초기값은 ""이다.
useEffect를 사용하여 초기 렌더링 시 name값을 "John Doe"로 바꾸어준다.
실제로 이 코드를 실행 시켜 보면, 잠깐동안 layout shifting (깜빡이는 현상)이 일어날 것 이다.
(layout shifting을 경험해보기 위해서는, 브라우저의 네트워크 설정에서 throttling을 걸어서 느리게 할 필요가 있다.)

이것을 방지하기 위해서 `useLayoutEffect`를 사용할 수 있다.

## useLayoutEffect

위에서 쓴 코드를 useLayoutEffect를 사용한다면 다음과 같다.


```jsx
const Page = () => {
	const [name, setName] = useState("")
    
    useLayoutEffect(() => {
    	setName("John Doe")
    }, [])
  
	return <h1>My name is {name}</h1>
}
```

이렇게 사용한다면 John Doe라는 글자가 layout shifting이 없이 초기 화면에서 그려질 것이다.

* useLayoutEffect
	* **DOM이 그려지기 전**에 실행
	* 동기적
* useEffect
	* **DOM이 그려지고 나서** 실행
	* 비동기적

### 참고 자료
> https://merrily-code.tistory.com/46