---
title: Dnote 1. 소개
excerpt: Dnote 1. 소개
category: velog
thumbnail: Velog.png
createdAt: 2018-09-20T13:02:16.300Z
---
안녕하세요? 딱히 제가 만든 프로젝트가 대단한 것은 아니지만, 장고와 리액트로 작업을 할때 저는 처음에 삽질을 많이 했는데요, 이러한 삽질을 하며 만들어본 경험을 바탕으로 리액트와 장고로 한줄 노트앱을 만드는 과정을 공유하고자 해서 튜토리얼을 써보게 되었습니다.

https://velog.io/@killi8n/Django-React-%EB%A1%9C-%EC%B2%AB-%ED%99%94%EB%A9%B4-%EB%9D%84%EC%9B%8C%EB%B3%B4%EA%B8%B0-55jm970olw

위 링크에 들어가시면 지난 튜토리얼을 보실수 있습니다.


사실, 이번 튜토리얼은 지난 번에 썻던 Django와 React를 이용해서 첫 화면 띄워보기에 이어지는 튜토리얼 입니다. 본 아이디어는 지난 글에도 썼듯이 http://v1k45.com 에 나오는 튜토리얼입니다.

아이디어와 많은 정보들을 위 블로그에서 얻었음을 알리며, 이 튜토리얼에서는 원글을 완전히 똑같이 따라하진 않았으며, 원래 글에는 구현되있지않은 무한스크롤링도 나름 구현해 보았으니 관심이 있으신분들은 나름 도움이 되리라고 생각하며, 글을 쓰도록 하겠습니다.

이번에는 장고 서버로 리액트를 띄우는 과정을 가장 마지막에 해보도록 하고, 일단 React Dev모드에서 Backend(Django)와 통신하고, 모든 기능들을 추가 시킨 후 build하여 8000번에 띄워보도록 해보겠습니다!

Redux를 사용할 예정인데, Redux는 rxjs를 활용한 redux-observable을 API통신에만 사용하여 구현해볼 예정입니다!
(나머지 상태관리는 redux를 통해 이루어지지만, rxjs를 이용하지는 않았습니다.)

> # 개요
1. [소개](http://www.google.co.kr)
2. [React / Django 프로젝트 생성](https://killi8n.com/post/5ba3ab51b17fd60398c3da40)
3. 
	1. [React - 개발 환경 설정 및 구조 잡기.(sass 설정)](https://killi8n.com/post/5ba3ab6eb17fd60398c3da41)
    2. [React - 개발 환경 설정 및 구조 잡기.(프로젝트 구조잡기)](https://killi8n.com/post/5ba47cdcb17fd60398c3da42)
    3. [React - 개발 환경 설정 및 구조 잡기. (Redux 설정하기)](https://killi8n.com/post/5ba48178b17fd60398c3da43)
4. 
	1. [Django - CRUD API 작업](https://killi8n.com/post/5ba4e776b17fd60398c3da44)
    2. [React - 페이지 구조 생성](https://killi8n.com/post/5ba4ee30b17fd60398c3da45)
    3. [React - 입력 폼 만들고 상태 관리](https://killi8n.com/post/5ba4f258b17fd60398c3da46)
    4. [React - 노트 생성 기능 구현](https://killi8n.com/post/5ba4f70fb17fd60398c3da47)
    5. [React - 노트 생성 시 에러 처리](https://killi8n.com/post/5ba4fb13b17fd60398c3da48)
    6. [React - 노트 리스트 구현 및 수정 / 삭제 기능 구현](https://killi8n.com/post/5ba65f62be54be359e528453)
5. 
	1. [Django - 권한 설정 및 로그인 / 회원가입 구현](https://killi8n.com/post/5ba66554be54be359e528454)
    2. [React - 로그인 및 회원가입 기능 구현](https://killi8n.com/post/5ba67282be54be359e528456)
    3. [React - 로그인 유지 및 로그아웃 기능 구현](https://killi8n.com/post/5ba7366cbe54be359e528457)
6. 
	1. [React - 무한 스크롤링 기능 구현](https://killi8n.com/post/5ba7384bbe54be359e528458)
7. [React - 404페이지 완성 밑 빌드된 리액트 띄우기](https://killi8n.com/post/5ba759e8be54be359e528459)

# Github Repo
## https://github.com/yungblud/d-note

> # 프로젝트 미리보기

일단 무엇을 하려는지는 알아야겠죠??

input태그를 이용하여 직관적으로 한줄 노트를 작성할수 있는 앱이며, 스크린샷을 첨부하도록 하겠습니다.

## 그냥 화면..

![Imgur](https://i.imgur.com/yusIEhg.png)

## 무한 스크롤링 화면..


![Imgur](https://i.imgur.com/plSZf0y.png)


## 클릭하여 수정하기 화면..


![Imgur](https://i.imgur.com/DpUiPv5.png)

> ## 로그인 / 회원가입 화면..

![Imgur](https://i.imgur.com/JvbJJwE.png)


![Imgur](https://i.imgur.com/fBLLxz1.png)

그렇다면 이제 본격적으로 코딩을 해볼까요?

다음글에서 계속됩니다...



