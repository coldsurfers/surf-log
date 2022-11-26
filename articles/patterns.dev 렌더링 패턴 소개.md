---
title: patterns.dev 렌더링 패턴 소개
excerpt: patterns.dev 렌더링 패턴 소개 글 번역
category: dev
thumbnail: js.png
createdAt: 2022-11-26T07:23:53.458Z
updatedAt: 2022-11-26T07:26:47.124Z
tags: ["patterns.dev","ssr","server side rendering","static rendering","client side rendering","rendering pattern","render pattern"]
---
> 이 글은 https://patterns.dev 에서 제공하는 글인 https://www.patterns.dev/posts/rendering-introduction/ 글을 번역한 글 입니다.

# 들어가면서

## 들어가면서

새로운 웹 앱을 만들기 시작할때에, 가장 기본적으로 드는 질문은 이것일 것입니다.
"어떻게 그리고 어디에 내가 보여줄 컨텐츠를 보여주고 싶은가?"
웹 서버가 되어야 하는가? 아니면 빌드 서버? 아니면 엣지? 아니면 클라이언트에 직접적으로?
한번에 보여줘야 하는가? 부분적으로? 점진적으로?

이 중요한 결정의 답은 실제 사용되는 케이스에 의해 결정 됩니다. 가장 최적화된 렌더링 패턴을 선택하는 것은 엔지니어링 팀을 위한 개발자 경험(DX)과 당신이 엔드 유저를 위해 디자인한 유저 경험(UX)에 새로운 세계를 만들것 입니다.

올바른 패턴을 선택하는 것은 더 빠른 빌드와 작은 프로세싱 비용으로 훌륭한 로딩 성능으로 이끌것 입니다. 반대로, 잘못된 패턴의 선택은 좋은 비즈니스 적인 아이디어를 실현 할 수 있는 앱을 죽이게 될것입니다. 따라서 당신이 가진 모든 혁신적인 아이디어들은 적절한 렌더링 패턴과 함께 개발단으로 실현되어야 합니다.

![Introduction](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/4.1.png)
출처: https://www.patterns.dev/posts/rendering-introduction/

## 렌더링 패턴의 중요성

훌륭한 UX를 만들기 위해서는, [Core Web Vitals (CWV)](https://web.dev/vitals/)와 같이 유저 기반의 수치에 최적화를 하려고 대개 노력합니다. CWV 수치 값들은 가장 유저 경험과 밀접한 값들을 측정합니다. CWV를 최적화 하는것은 우리 앱의 훌륭한 UX와 최적화된 SEO를 가져다 줄 수 있습니다.

![Web Vitals](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1660456914/patterns.dev/web-vitals.png)
출처: https://www.patterns.dev/posts/rendering-introduction/

엔지니어링 팀을 위한 훌륭한 DX를 만들기 위해서는, 더 빠른 빌드 시간, 쉬운 롤백, 증축 가능한 인프라, 그리고 그 밖에 개발자들이 목표에 도달 할수 있게 하는 많은 다른 기능들을 포함한 개발 환경들을 최적화 해야 합니다.

![Developer Experience](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/5.png)
출처: https://www.patterns.dev/posts/rendering-introduction/

이러한 규율에 맞추어 개발환경을 셋업 하는 것은 우리 개발팀에게 훌륭한 제품 효율성을 가져다 줄것입니다.

우리의 기대를 요약하면서, 꽤나 긴 리스트를 구축해 왔습니다. 하지만, 올바른 렌더링 패턴을 선택한다면, 대부분의 이러한 이점들을 실제로 이용할 수 있습니다.

![Performance](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/6.png)
출처: https://www.patterns.dev/posts/rendering-introduction/

## 패턴 고르기

서버사이드 렌더링(SSR)과 클라이언트 사이드 렌더링(CSR)에서부터 여러 다른 커뮤니티들에서 논의되고 실험되고 있는 고도로 발전된 패턴들을 다루어오면서, 렌더링 패턴은 긴 역사를 가지고 있습니다. 이러한 것들이 조금 과할 수 있지만, 우리는 모든 패턴들은 특정한 사용 케이스들에 맞추어 디자인 되었다는 것을 기억해야 합니다. 하나의 사용 케이스를 위한 특유의 이점은 다른 사용케이스들에서는 단점이 될수 있습니다. 또한 하나의 웹사이트만 하더라도 다른 여러 종류의 페이지들을 갖고 있어서 다른 렌더링 패턴들을 적용해야 하기도 합니다.

크롬 팀은 개발자들에게 full rehydration 방법론을 말미암아 정적 혹은 서버사이드 렌더링을 [추천해 왔습니다.](https://developers.google.com/web/updates/2019/02/rendering-on-the-web) 시간이 가면 갈수록, 점진적인 로딩과 렌더링 기술들이 당연하게 성능의 좋은 밸런스를 잡아주는데 도움이 되었고 모던 프레임워크의 새로운 기능들로 전달되어 왔습니다.

다음으로 이어질 챕터들에서는 다른 패턴들을 알아봅니다 - 옛 방식과 요즘 방식을 자세히 말이지요. 하지만 그전에, 어디에서 제일 잘 쓰일수 있는지 당신을 이해시키기 위해 그중 몇몇을 간단히 소개하겠습니다.

### Static Rendering (정적 렌더링)
정적 렌더링은 간단하지만 파워풀한 패턴입니다. 거의 즉시적으로 페이지를 로드하는 빠른 웹사이트를 구축하기 위해 이 패턴을 쓸수 있습니다.

정적 렌더링에서는, 전체적인 페이지를 위한 HTML이 빌드 타임에 생성되며 다음 빌드 전까지는 변화하지 않습니다. HTML 컨텐츠들은 정적이며 CDN이나 Edge Network를 통해서 쉽게 캐싱될수 있습니다. CDN들은 빠르게 캐싱된 pre-rendered된 HTML을 클라이언트에게 가져다 줄수 있습니다. 그들이 특정한 페이지를 요청할때 말이지요. 이러한 방법은 서버사이드 렌더링에서 이루어지는 특정 요청, 요청에서 받아온 HTML 컨텐츠를 보여주기 까지의 시간들을 굉장히 단축시킬수 있습니다.

위에서 설명된 프로세스는 자주 변하지 않고 그 누구가 요청을해도 같은 데이터를 보여주는 페이지들에게 굉장히 최적화 되어있습니다. 요즘에는 웹사이트에서 굉장히 동적이며 커스터마이징 된 데이터를 보여주기 때문에 정적 렌더링에서도 다른 사용케이스들을 쓸 수 있습니다.

![Static Rendering](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/img1.png)
출처: https://www.patterns.dev/posts/rendering-introduction/

### Basic/Plain Static Rendering (기본적이며 간단한 정적 렌더링)
정적 렌더링에도 많은 종류의 변형들이 있으므로, 좀전에 다룬 주된 기술을 Plain Static Rendering 이라고 부릅시다. 동적인 컨텐츠가 없는 페이지에서 사용할수 있습니다.

따라서 나올 부동산 관련 웹사이트 데모 페이지는 언제나 같은 컨텐츠를 똑같이 누구에게나 보여줍니다. 아무런 동적인 데이터도 없으며 개인화된 데이터도 없습니다.

![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_10.10.58_AM_umtlyl.webm)

사이트가 배포되고 빌드 될때 (예를들어, Vercel) 연관된 HTML이 생성되고 서버에 정적인 스토리지에 보관됩니다.

![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_10.18.37_AM_bhybvb.webm)

유저가 페이지를 요청하면, 서버는 이미 생성된 HTML을 클라이언트에 전송합니다. 이런 응답은 또한 사용자와 가장 가까운 엣지 로케이션에 캐싱됩니다. 브라우저는 HTML을 보여주고 페이지를 동작하게 하기 위해 자바스크립트 번들을 실행합니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/7.png)

플레인 정적 렌더링은 성능에 좋습니다. 굉장히 빠른 TTFB를 가져다 주기 때문이지요. HTML이 이미 서버에서 준비되어있기 때문에 브라우저는 더 빠른 응답을 받을 수 있으며 빠르게 보여줄 수 있습니다. 빠른 FCP와 LCP를 가져다 주면서 말이지요. 컨텐츠가 정저기익 때문에 그리는 동안 레이아웃 쉬프팅도 없습니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/8.png)

그러므로, 플레인 정적 렌더링은 캐싱을 사용하는 CDN에 특히나 사용되며, 훌륭한 Core Web Vitals를 이루도록 도와줍니다. 그러나, 대부분의 웹사이트들은 최소한 몇개라도 동적인 컨텐츠들을 갖고 있으며 유저 인터랙션도 필요합니다.

### 클라이언트 사이드의 fetch를 이용한 정적 렌더링
우리의 부동산 데모 사이트를 개선하고 싶다고 해봅시다. 가장 최근에 리스팅된 것을 보여주기 위해서죠. 우리는 이러한 리스팅들을 만들기 위해서 데이터 프로바이더를 이용해야 합니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/9.png)

우리는 이 케이스에서 클라이언트 사이드의 fetch를 이용한 정적 렌더링을 이용할 수 있습니다. 이 패턴은 매 request마다 데이터를 업데이트 하고 싶을때 쓰면 좋습니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/10.png)

여전히 정적 렌더링을 쓸수 있으며 Skeleton Component와 같은 UI를 렌더 할 수 있습니다. 동적인 리스트 데이터를 위치하고 싶은곳에 말이지요. 그리고, 페이지가 로드되면 데이터를 fetch 할수 있습니다.(예시에선 SWR을 사용)

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/11.png)

커스텀 API route가 CMS로부터 데이터를 fetch하고 이 데이터를 반환하기 위해 사용되었습니다.


![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_2.55.30_PM_r0jvez.webm)

미리 생성된 HTML파일은 유저가 페이지를 요청할때에 클라이언트로 전송됩니다. 유저는 처음으로는 Skeleton UI를 데이터 없이 마주하게 됩니다. 클라이언트는 데이터를 API route를 통해서 요청하게 되고, 응답을 받고 리스팅을 보여줍니다. (예시에서는 hydration call은 포함되어 있지 않습니다)

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/12.png)

클라이언트 사이드의 fetch를 이용한 정적 렌더링이 우리에게 좋은 TTFB와 FCP를 주는 동안, FCP는 살짝 덜 최적화 되었죠. 왜냐하면 "largest content"가 우리가 리스팅 데이터를 API route를 통해 가져와야만 보여지기 때문이죠.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/13.png)

또한 높은 가능성으로 레이아웃 쉬프팅이 일어날수 있습니다. 만약 스켈레톤 UI의 크기가 결국 보여질 컨텐츠들의 크기와 맞지 않다면 말이죠.

또 다른 단점은 이러한 방법론은 더 높은 서버 비용이 들게 할수 있습니다. 우리가 API route를 매 페이지 요청마다 부르기 때문이지요.

Next.js는 몇가지 해결책을 제시합니다. 다음에 이어질 몇가지 섹션들에서 앱이 다이나믹한 데이터를 다룰때에 성능을 향상 시킬수 있는 방법을 논의할겁니다.

### getStaticProps를 사용한 정적 방법

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/14.png)

이 방법론은 당신을 데이터 프로바이더에게 접근할수 있게 하고 빌드 타임에 서버에서 데이터를 페치할수 있게 합니다. 이것은 빌드타임에 언제나 당신이 원하는 동적인 데이터가 존재 할때에 좋은 방법입니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/15.png)

`getStaticProps` 메서드를 통해서 우리는 HTML을 데이터와 함께 서버에서 제공할수 있습니다. 그러므로, 클라이언트에서 API 를 페치하는 route를 만들지 않아도 됩니다. 비슷하게, 스켈레톤 컴포넌트는 데이터가 로드되기 전에 필수가 아닙니다. 왜냐면 페이지 자체가 데이터와 함께 바로 제공될 것이기 때문이지요.

![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_3.02.04_PM_avmzuy.webm)

프로젝트를 빌드 할때에, 데이터 프로바이더가 콜 되며, 반환된 데이터는 생성된 HTML을 통하게 됩니다.

![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_3.06.26_PM_djvt57.webm)

유저가 페이지를 요청할때에, 프로세스는 플레인 정적 렌더링과 비슷합니다. 응답이 캐싱되며 스크린에 보여집니다. 그리고 브라우저는 자바스크립트 번들을 fetch하게 되고 페이지를 hydration 시킵니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/16.png)

클라이언트의 관점에서 네트워크와 메인쓰레드가 플레인 정적 렌더링과 동일합니다. 그래서 우리는 비슷한 굉장한 성능을 얻게됩니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/17.png)

사이트가 커가면서, 우리가 이러한 방법을 쓸때에 DX가 좋진 않습니다.

수백개의 페이지를 가진 사이트들에서 (블로그 사이트와 같이) 정적으로 빌드된다면 getStaticProps 메서드는 반복적으로 불릴 것이며 긴 빌드타임을 반환하게 됩니다. 외부의 API를 사용한다면, 리퀘스트 리밋을 넘어서거나 엄청난 비용을 지불하게 될거에요.

이 방법은 또한 빌드타임에서 비교적 자주 데이터를 새롭게 하지 않아도 될때에만 좋습니다. 잦은 데이터의 업데이트는 우리가 사이트를 자주 재 빌드 하고 재 배포해야 한다는 것을 의미하니까요.

## Incremental Static Regeneration (점진적인 정적 재 생성)

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/18.png)

우리는 이러한 빌드타임 이슈와 동적 데이터 이슈를 해결하기 위해서 점진적인 정적 재 생성을 사용합니다.

ISR은 유저가 요청하면 동적 페이지를 렌더링 하기도 하고 정적 페이지만을 렌더링 하기도 하는 하이브리드입니다. 이것은 더 적은 빌드 횟수와 자동화된 캐시 invalidation과 특정 인터벌 뒤의 페이지 재생성을 가져다 줍니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/19.png)

우리의 이전의 데모를 이제는 각각의 디테일한 정보를 보여주기 위해서 개발한다고 칩시다. 우리는 이러한 새로운 페이지들을 pre-render할수 있습니다. 유저가 리스트들을 클리했을때 빨리 로드하기 위해서죠.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/20.png)

Next.js는 getStaticProps를 사용하여 동적인 path들을 만들도록 달성하게 도와줍니다. 쿼리 파라미터를 통해 우리는 Next.js에게 어떤 페이지들을 먼저 생성할지 알려줄수 있습니다.

우리의 데모에서 모든 리스트들을 fetch하고 각각의 페이지들을 먼저 생성한다고 해봅시다. 이것은 수천개의 리스트가 있다면 굉장히 오래걸리는 일입니다. 그러한 케이스에서 Next에게 모든 페이지의 부분만 먼저 생성하라고 하고 남은 리스팅 페이지들이 요청에 의해서 생성될때에 fallback을 보여주게 할수있습니다. (유저가 요청할때에만)

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/21.png)

미리 렌더링되고 생성된 온디맨드 페이지들은 비슷하게 전달됩니다. 유저가 미리 생성되지 않은 페이지를 요청한다면, 요청이 왔을때에만 생성이 되고 Edge에 의해서 캐싱됩니다. 그러므로 처음으로 요청한 유저만이 조금 느린 속도를 경험할 것입니다. 다른 모든 사람들은 이점을 갖게 될것입니다. 캐싱으로 말이지요.

![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_3.49.59_PM_deygni.webm)

긴 빌드타임 이슈는 해결이 된듯 합니다. 하지만 우리는 아직도 우리가 새로운 리스트를 추가할때마다 재배포를 해야하는 랜딩페이지가 남아있네요.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/22.png)

랜딩페이지를 리프레시 하기 위해서는, 캐시를 자동적으로 invalidate 할수 있습니다. 그리고 특정 간격에 따라서 백그라운드에서 페이지를 다시 생성할수 있지요. 우리는 이것을 revalidate 필드를 통해서 사용할수 있습니다.

![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/updated_jvhqnv.webm)

만약 유저가 특정시간보다 더 오래 캐싱된 페이지를 요청했다면, 유저는 처음으로는 stale page를 보게됩니다. 페이지 재 생성은 즉시 실행됩니다. 페이지가 백그라운드에서 재생성되었다면, 캐시는 사라지고 최근에 재생성된 페이지로 업데이트 됩니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/23.png)

ISR로 인해서 우리는 다이나믹한 컨텐츠들을 자동적으로 새로 만들어주는 이점을 볼수 있습니다.

비록 이 방법이 이전에 다루었던 방법보다 이미 굉장한 성능 향상임에도, 몇가지 살펴봐야 할것이 남아있습니다. 우리의 컨텐츠들은 사실 우리가 설정한 시간간격보다는 훨씬 적게 업데이트 됩니다. 이것은 불필요한 페이지 재생성과 캐싱 invalidation을 유발 할것이에요. 이러한 현상이 나올때마다, 우리는 우리의 serverless function들을 다시 부르게 되고 높은 서버 비용이 나오게 하죠.

### On-demand Incremental Static Regeneration (온디맨드 ISR)

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/24.png)

우리가 마지막으로 언급한 문제점을 해결하기 위해서 우리는 ISR를 사용한 온디맨드 ISR이 있습니다. ISR이지만 재생성이 고정된 인터벌이 아닌 특정 이벤트에서만 작동합니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/25.png)

revalidate 필드를 쓰는 대신, API route에 기반한 새로운 데이터에 기반해서 revalidate을 합니다.

![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_5.24.13_PM_xeumhu.webm)

예를들면 우리는 incoming webhook을 구독하여 언제 새로운 데이터가 추가되었는지 알수 있습니다. 우리가 revalidate method를 요청하면, 특정 path를 갖는 페이지는 자동적으로 재생성됩니다.

일반적인 ISR에서는 업데이트된 페이지가 유저가 요청한 페이지를 위해서만 edge node에서 캐싱됩니다. 온디맨드 ISR은 stale content를 보게하지 않고 전세계의 모든 엣지 네트워크를 통해서 페이지를 재생성하고 재전달 합니다. 따라서  자동적으로 대부분이 가장 최신의 페이지를 볼수있게 말이지요. 또한 불필요한 재생성과 불필요한 서버리스 함수 요청들을 방지합니다. 일반적인 ISR에 비하면 말이지요.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/26.png)

따라서 온디맨드 ISR은 우리에게 퍼포먼스 향상과 좋은 DX를 제공합니다.

전반적으로 정적 생성은 좋은 패턴입니다. 특히나 ISR과 같은 정적 패턴은 상당수의 실사용 케이스를 커버할수있습니다.

언제나 합리적인 가격으로 올라와 있어야하는 빠르고 동적인 웹사이트들을 가질수 있게합니다. 그러나 어떤 실사용 케이스들에서는 static이 최선이 아닐때가 있습니다. 예를들면, 엄청나게 dynamic하고 개인화된 페이지라면 말이죠. 그런 페이지들은 유저마다 다릅니다. 이러한 케이스에서는 어떤 패턴이 최고인지 알아보죠.

## Server-Side Rendering (서버사이드 렌더링)

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/27.png)

서버사이드 렌더링에서는 HTML을 매 요청마다 생성합니다. 이러한 방법은 고도로 개인화된 데이터를 갖는 페이지들에서 유용합니다. 예를들면 유저 쿠키 기반의 데이터라던지 유저의 요청에 기반한 포괄적인 어떠한 데이터들에서 말이지요. 또한 인증 상태에 따라서 렌더블라킹을 유발해야하는 페이지들에서도 좋습니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/28.png)

개인화된 대시보드에서는 고도로 다이나믹한 컨텐츠를 갖는 것의 좋은 예시 입니다. 컨텐츠의 대부분이 유저의 식별이나 인증레벨에 따라 결정됩니다. 유저의 쿠키에 기반하거나 해서 말이죠. 이런 대시보드는 유저가 인증되었을때에만 보여지고 유저 특유의 중요한 데이터를 보여줄수도 있습니다. 다른 유저에게는 보여주어서는 안되는 데이터들이죠.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/29.png)

Next.js에서는 `getServerSideProps` 메서드를 통해서 서버를 통한 페이지 렌더링을 제공합니다. 이 메서드는 매 요청마다 서버에서 이루어지며 결국 반환된 데이터를 페이지에게 HTML을 만들기 위해서 전달합니다.

![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_5.31.41_PM_oxsq12.webm)

유저가 페이지를 요청할때, `getServerSideProps`는 실행되고 페이지를 만들기 위해서 데이터를 반환합니다. 그리고 이 응답을 클라이언트에게 전송합니다. 클라이언트는 HTML을 렌더링하고 다른 요청을 하기 위해서 Javascript bundle을 페치합니다. HTML 요소들을 hydrate하는 자바스크립트 번들이지요.

생성된 HTML컨텐츠들은 매 요청마다 다르고 CDN에 캐싱되면 안됩니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/31.png)

클라이언트를 위한 네트워크와 메인쓰레드가 굉장히 static과 서버사이드 렌더링이 비슷합니다. FCP는 거의 LCP와 비슷하며 초기 페이지로드 후에 레이아웃 쉬프팅을 피할수 있습니다. 동적인 데이터 로딩이 없다면 말이죠.

![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_5.36.49_PM_kkuxv3.webm)

그러나 서버렌더링된 TTFB는 static rendering에 비해서 굉장히 깁니다. 매 요청마다 처음부터 다시 만들어지기 때문이지요.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/32.png)

서버사이드 렌더링이 고도화된 개인적인 데이터를 렌더링하기에는 좋은 선택지이지만 더 나은 UX와 서버 비용을 줄이기위해서 고려해야할 사항들이 몇개가 있습니다. 이러한 비용들은 높을 것 입니다. 매 요청마다 serverless function을 호출하기 때문이지요.

1. `getServerSideProps`의 실행 시간
페이지 생성은 `getServerSideProps`로부터 데이터가 올때까지 시작되지 않습니다. 나아가서 우리는 `getServerSideProps`메서드가 너무 오래걸리지 않는다는 것을 전제로 해야합니다.
2. serverless function과 똑같은 위치의 데이터베이스를 배포하기
만약 데이터가 데이터베이스를 통해서 온다면, 데이터베이스 조회에 걸리는 시간을 줄여야 합니다. 쿼리 최적화에 더해서, 데이터베이스의 위치도 고려해야 합니다.
![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_5.38.55_PM_uwecig.webm)
만약 당신의 serverless function이 San Francisco에 위치해 있고 데이터베이스가 도쿄에 있다면 커넥션을 구축하고 데이터를 가져오는데에 많은 시간이 들 것 입니다. 대신, 데이터베이스를 serverless function과 같은 리젼으로 옮기세요. 더 빠른 데이터베이스의 조회 시간을 위해서 말이지요.
3. 응답 헤더에 `Cache-Control`을 추가하기
SSR 성능을 향상시키는 다른 방법은 응답시간에 Cache-Control 헤더를 붙이는 것입니다.
4. 서버 하드웨어 향상
서버 하드웨어를 업그레이드 하는 것은 각각의 요청과 응답을 더 빠르게 할수 있습니다.

Vercel은 serverless function 들을 server-render하기 위해서 사용합니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/34.png)

당신이 이용한 만큼만 지불하는 것 처럼 serverless function이 많은 이점을 가지고 있음에도, 몇가지 제한들이 존재합니다. long cold boot로 알려진 람다를 시작하는 시간은 serverless function들의 보편적인 이슈입니다. 또한 데이터베이스 연결이 느릴수 있습니다. 또한 지구반대편에 위치한 서버리스 함수를 콜하게 되면 안됩니다.

## Edge SSR + HTTP Streaming (에지 SSR + HTTP 스트리밍)

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/35.png)

Vercel은 현재 **Edge Server-Side Rendering**을 탐험중입니다. 이것은 유저들이 **어떠한 region**에서도 서버렌더를 할수 있게 하며 거의 **0에 가까운 cold boot**를 경험하게 합니다. Edge SSR의 또 다른 이점은 edge runtime이 **HTTP Streaming**을 가능케 한다는 것입니다.

![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_5.47.07_PM_usqexj.webm)

Serverless function을 통해서 페이지 전체를 서버사이드에서 생성하고 모든 번들이 로딩되기를 기다리며 hydration이 시작할수 있기 전에 파싱합니다.

![](https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_5.48.20_PM_auurip.webm)

Edge SSR을 통해서 다큐먼트가 각각이 준비가 되고 hydrate할수 있을때에 알갱이별로 스트림 할수 있습니다. 대기시간을 줄이게 합니다. 먼저 볼수 있는 컴포넌트들을 하나하나 볼수있기 때문이지요.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/40.png)

Streaming SSR은 React Server Components를 가능하게 합니다. React Server Components를 사용한 Edge SSR은 static과 server 렌더링의 아름다운 하이브리드를 제공합니다.

React Server Component는 부분적으로 리액트 컴포넌트를 서버에서 렌더할수 있게 합니다. 클라이언트로 다운로드 될 필요없는 큰 의존성을 요구하는 컴포넌트들을 위해서 유용합니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/41.png)

부동산 데모 웹사이트로 돌아가서, 우리가 랜딩페이지를 보여주는것과 동시에 유저의 위치 기반으로된 리스트들을 보여주고 싶다고 해봅시다. 페이지의 대다수가 static data만을 필요로 합니다. 요청 기반의 데이터를 필요로하는 리스트들이죠.

전체적인 페이지를 서버렌더하는 것 보다, 우리는 이제 리스트 컴포넌트들만을 서버사이드에서, 나머지는 클라이언트사이드에서 렌더링 할수 있습니다. 서버렌더에서 모든 것을 서버사이드에서 렌더링 하는 반면, 우리는 이제 서버사이드 렌더링의 동적 이점을 가진 Static Rendering으로 훌륭한 성능을 보여줄수 있습니다.

![](https://res.cloudinary.com/ddxwdqwkr/image/upload/v1658990025/patterns.dev/42.png)

우리는 서버에서 컨텐츠를 렌더하는 많은 패턴들을 알아보았습니다. 완벽한 rehydration을 가진 [클라이언트 사이드 렌더링(CSR)](https://www.patterns.dev/posts/client-side-rendering/) 은 다이나믹한 웹사이트를 위해서 아직도 추천됩니다. 유저인터랙션 기반으로 모든 컴포넌트들이 바뀌는 것이죠.

어플리케이션의 타입이나 페이지 타입에 기반하면, 몇몇의 패턴들은 다른 것들모다 더 많이 유용할것입니다. 아래의 차트는 서로 다른 패턴들의 요약을 비교하며 각각의 실사용 케이스를 알려줍니다.

![](https://www.patterns.dev/img/remote/Z1mbJpL.svg)

[Patterns for Building JavaScript Websites in 2022](https://dev.to/this-is-learning/patterns-for-building-javascript-websites-in-2022-5a93) 에서 제공하는 이어지는 테이블에서는 주된 어플리케이션 성향의 키포인트에 따른 다른 시각을 제공합니다. 보편적인 [application holotypes](https://jasonformat.com/application-holotypes/)를 찾고있는 사람들이라면 유용할 것입니다.









