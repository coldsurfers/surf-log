---
title: React memo를 쓸 때 주의해야 할 점 (feat. 배열의 아이템을 index로 가져오기)
excerpt: React의 memo를 쓰다가 난 장애 회고
category: dev
thumbnail: unsplash-code-react.jpg
createdAt: 2022-03-25T05:34:50.049Z
updatedAt: 2022-03-25T05:38:53.324Z
---
# React memo를 쓸 때 주의해야 할 점 (feat. 배열의 아이템을 index로 가져오기)

이 글은 React memo를 쓰다가 나온 장애를 회고하는 글 입니다.

기존 코드는 다음과 같았다.

```jsx
export default memo(ProjectItemList, (prev, next) => {
  return prev.data.length === next.data.length && prev.data[0].id === next.data[0].id
});
```

배열의 아이템의 개수가 0개일때 exception 처리를 안한것이 에러의 원인.
따라서 유저가 생성한 project의 개수가 0개였을때 rerender가 일어나면 에러가 나는 현상 이었다.

다음과 같이 코드를 변경하였다.

```jsx
export default memo(ProjectItemList, (prev, next) => {
  const prevFirstId = prev.data?.[0]?.id;
  const nextFirstId = next.data?.[0]?.id;
  return prev.data.length === next.data.length && prevFirstId === nextFirstId;
});
```

test 파일에서는 단순히 `render`라는 testing-library의 함수로만 테스트를 했기 때문에 해당 에러를 잡을 수 없었다.
또한 dummy empty array에 대한 테스팅이 추가되어있지 않았고 무조건 array의 length가 1이상이었기 때문에, 빈 array에 대한 테스팅 조차 없었던 것이 테스팅으로 거를수 없었던 이유.

따라서 test파일에서는 `rerender` 함수를 사용하여 React.memo가 props를 compare하도록 만들었다.

```jsx
import { screen, render } from "@testing-library/react";

...
...

describe("ProjectItemList", () => {
  it("render with empty data array", () => {
    const { rerender } = render(
      <ProjectItemList
        data={fakeProjectList} // 이때에는 배열의 길이가 0
        renderItem={(item) => <ProjectItem key={item.id} data={item} />}
      />,
      {
        wrapper: AllTheProviders,
      }
    );
    expect(screen.getByTestId("project-item-list").children.length).toBe(0);

    // rerender를 사용하여 React의 memo가 작동하게 하여 memo내의 areEqual 콜백 함수가 작동하게 한다.
    rerender(
      <ProjectItemList
        data={fakeProjectList}
        renderItem={(item) => <ProjectItem key={item.id} data={item} />}
      />
    );
    expect(screen.getByTestId("project-item-list").children.length).toBe(0);
  });
```

## 결론
* 배열의 아이템을 index로 가져올 때에는 반드시 유효성 검사를 하자.
* React memo를 사용할때에 testing 코드를 쓸 때에 `@testing-library/react`모듈의  `rerender` 를 사용하여 memo 함수의 areEqual 콜백함수가 동작하도록 해서 memo를 테스트 할 수 있다.