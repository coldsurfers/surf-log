---
title: Dnote 2. React / Django 프로젝트 생성.
excerpt: Dnote 2. React / Django 프로젝트 생성.
category: velog
thumbnail: Velog.png
createdAt: 2018-09-20T13:30:40.361Z
---
> # 각 프로젝트 생성

```bash
# 프로젝트 워크스페이스로 이동해주세요.
# 큰 집 안에 backend와 frontend가 있는 구조입니다.

# 루트 폴더를 생성합니다.
$ mkdir dnote
$ cd dnote

# React 프로젝트를 생성합니다.

$ create-react-app frontend
...
...
...
# react 앱 생성 완료!

# django 프로젝트가 위치할 디렉터리를 생성합니다.
$ mkdir backend
$ cd backend
```

> # Django - Virtual Env 생성

```bash
# 저는 python3를 쓰기 때문에 
# 다음과 같이 virtual env를 생성해주겠습니다.
# virtualenv 가 없다면 pip install virtualenv 로 설치 하여 주세요
$ virtualenv --python=python3 venv

# 마지막 venv는 virtual env 폴더의 이름이므로 
# 원하는 이름으로 해주어도 무방합니다.
```

> # Django - Virtual Env 실행

```bash
# 장고 앱 개발에서는 항상 virtual env가 사용됩니다.
# 따라서 개발시 제일 처음으로 venv를 실행해주세요!

# mac
$ source venv/bin/activate

# windows
$ venv\Scripts\activate.bat

# venv환경에서 탈출하려면 deactivate 명령어를 치시면 됩니다.

# venv가 액티베잇 되었으면 터미널 앞쪽에 (venv)가 붙게 됩니다.
```

> # django 설치 / project 생성

```bash
$ (venv) pip install django
$ (venv) django-admin startproject dnote
$ (venv) cd dnote
$ (venv) ./manage.py migrate
$ (venv) ./manage.py runserver
```
http://localhost:8000 으로 들어가시면 첫화면을 보시게 될 것 입니다.

다음 글에서는 React 개발 환경 설정 및 구조를 잡아 보겠습니다. 또한 sass 및 redux등의 개발 기초작업을 해보겠습니다.






