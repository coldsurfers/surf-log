---
title: SOLID 원칙
excerpt: 간단히 SOLID 원칙 정리
category: dev
thumbnail: unsplash-programming.jpg
createdAt: 2022-03-19T07:39:59.979Z
---
# SOLID 원칙

## SOLID 원칙의 개요
컴퓨터 프로그래밍에서 SOLID란 로버트 마틴이 2000년대 초반에 명명한 객체 지향 프로그래밍 및 설계의 다섯 가지 기본 원칙을 마이클 페더스가 두문자어 기억술로 소개한 것이다.
프로그래머가 시간이 지나도 유지 보수와 확장이 쉬운 시스템을 만들고자 할 때 이 원칙들을 함께 적용할 수 있다.
SOLID 원칙들은 소프트웨어 작업에서 프로그래머가 소스 코드가 읽기 쉽고 확장하기 쉽게 될 때까지 소프트웨어 소스 코드를 리팩터링하여 코드 냄새를 제거하기 위해 적용할 수 있는 지침이다. 이 원칙들은 애자일 소프트웨어 개발과 적응적 소프트웨어 개발의 전반적 전략의 일부다.

> 자료
https://ko.wikipedia.org/wiki/SOLID_(%EA%B0%9D%EC%B2%B4_%EC%A7%80%ED%96%A5_%EC%84%A4%EA%B3%84)

좀 더 나은 코드의 품질을 위해 클린 코드를 지향하는 원칙인 것 같다.
프로젝트 사이즈가 커지면서 혹은 프로젝트 사이즈가 작더라도, 각 클래스가 맡은 일에 최대한 영향을 받지 않으면서 어떻게 깔끔한 코드를 작성 하는가에 대한 논리이다.

객체 지향 설계라고 나와있으나, 굳이 객체 지향 방법을 따르지 않는 react같은 라이브러리의 방식에도 적용할 수 있다.

사람이 이해할 수 있는 코드를 만드는데에 있어서 알고 있으면 굉장히 도움이 되는 원칙이라고 할 수 있다.

## SOLID 원칙의 내용
SOLID 원칙은 다음과 같이 5개로 나뉜다.

### S: 단일 책임 원칙 (Single responsibility principle)
>한 클래스는 하나의 책임만 가져야 한다.

단일 책임 원칙에 의하면 하나의 클래스는 하나의 책임, 즉 하나의 하는 일에만 집중해야 한다.
하나의 클래스가 하는 일이 여러개로 뭉쳐져 있다면, 클래스를 수정시에 다른 일들에 엮여서 깔끔하지 않을 가능성이 높다. 관심사를 분리하여 최대한 잘게 나누어 하나의 클래스는 하나의 일에 집중하도록 만들어야 추후 코드를 변경 할 시에도 안전하게 변경할 수 있다.

### O: 개방-폐쇄 원칙 (Open/closed principle)
> 소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다.

만약 우리가 하나의 모듈을 수정했다고 가정 할 때에, 그 수정으로 인해 이 모듈을 쓰는 다른 곳에서 똑같이 수정을 해줘야 한다면 규모가 큰 프로젝트에서는 굉장히 많은 수정작업이 일어나야 한다.
따라서 무엇을 수정하여 모듈의 사용성을 확장 할 때에는, 이 모듈을 사용하던 기존의 코드를 **수정**하는 것이 아닌 코드를 **추가**하여 확장성을 넓히는 방향으로 가야한다.

```js
let cakeMaker = {
	availableFlavor: ['chocolate', 'milk chocolate', 'strawberry'],
  	makeCake: function(flavor) {
    	const cake = this.availableFlavor.find((v) => v === flavor)
        if (cake) {
        	return cake
        } else {
        	throw Error(`We don't have ${flavor} flavor`)
        }
    }
}
```

더 많은 맛을 가진 케익을 만들고 싶다면, 이 cakeMaker 코드에서 availableFlavor를 늘려주는 것이 아닌 아래와 같이 `addFlavor` 함수를 추가하여 이 cakeMaker를 사용하는 쪽에서 변경하는 것이 좋다.

```js
let cakeMaker = {
	availableFlavor: ['chocolate', 'milk chocolate', 'strawberry'],
    makeCake: function(flavor) {
    	const cake = this.availableFlavor.find((v) => v === flavor)
        if (cake) {
        	return cake
        } else {
        	throw Error(`We don't have ${flavor} flavor`)
        }
    },
    addFlavor: function(flavor) {
    	this.availableFlavor = this.availableFlavor.concat(flavor)
    }
}
```

### L: 리스코프 치환 원칙 (Liskov substitution principle)
> 프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스로 바꿀 수 있어야 한다.

하나의 인터페이스로부터 파생된 인터페이스를 만들고, 파생된 하위 인터페이스에서 확장을 한다.

### I: 인터페이스 분리 원칙 (Interface segregation principle)
> 특정 클라이언트를 위한 인터페이스 여러 개가 범용 인터페이스 하나보다 낫다

여러 기능이 모여진 인터페이스라면, 한 기능을 사용할때에는 다른 기능을 사용하지 않을 가능성이 생긴다. 따라서 이런 기능들을 분리하여 따로 인터페이스를 구현한다.

```typescript
interface Phone {
	call: {
    	photoShoot: () => void
        callTo: (phoneNumber: string) => void
    }
}
```

위와같이 call에서 photoShoot을 사용하는 일은 드물 것이다, 하지만 Phone객체는 photoShoot기능이 필요하다. 따라서 photoShoot기능은 call에서 분리한다.

```typescript
interface Phone {
	call: {
        callTo: (phoneNumber: string) => void
    }
    photoShoot: () => void
}
```

### D: 의존관계 역전 원칙 (Dependency inversion principle)
> 프로그래머는 추상화에 의존해야지, 구체화에 의존하면 안된다.

확장성이 필요할 시 이미 구현되어있는 구현체에서 작업을 한다기 보다는, 하나의 기능을 더 늘려서 새로운 인터페이스를 만든다. 그 새로이 추가된 인터페이스에서 확장성을 구현한다.

즉 새로운 기능을 하나 만들어서, 기존 있던 기능을 확장을 위해 고쳐서 사이드이펙트를 만드는 상황을 줄인다.

