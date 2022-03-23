---
title: Dnote 4 - 1. Django - CRUD API 작업
excerpt: Dnote 4 - 1. Django - CRUD API 작업
category: velog
thumbnail: Velog.png
createdAt: 2018-09-21T12:44:28.410Z
---
이제 웹통신을 할 장고 API를 설정해보겠습니다.

django쪽 디렉터리에서 앱을 하나 생성해줍니다.

```bash
$ (venv) python manage.py startapp notes
```

`settings.py`
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # notes 앱 추가
    'notes',
]
```

일단, REST Framework를 사용할 것이기 때문에 먼저 인스톨부터 하죠.

```bash
$ (venv) pip install djangorestframework
```

그런뒤 마찬가지로 INSTALLED_APPS 에 추가합니다.

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # notes 앱 추가
    'notes',
    # rest framework 추가
    'rest_framework',
]
```

저희가 notes 앱 에서 쓸 파일들은 다음과 같습니다.

`urls.py`: API 라우팅

`models.py`: 모델

`serializers.py`: 모델을 참조하여 serializing

`views.py`: 실제 일을 하는 곳. serializer 참조.

일단 models.py 에서 모델을 생성해야합니다.

`notes/models.py`

```python
from django.db import models

class Notes(models.Model):
    text = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)

    def __str__(self):
        return self.text

```

한줄 노트가 들어갈 text필드와 만들어진 날짜를 구분하는 created_at필드를 가진 Notes모델을 생성했습니다.

항상 모델을 등록한후에는 migration을 해주어야 합니다.

```bash
$ (venv) python manage.py makemigrations
$ (venv) python manage.py migrate
```

serializer를 생성하겠습니다.

`notes/serializers.py`

```python
from rest_framework import serializers
from .models import Notes


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = ("id", "text")
```

다음과 같이 Note 모델을 시리얼라이징 해주는 시리얼라이저를 생성했습니다.

그리고 views.py에서 ViewSet을 하나 만든 후 urls.py에서 라우팅 해주겠습니다.

`notes/views.py`

```python
from rest_framework import viewsets
from .serializers import NoteSerializer
from .models import Notes


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer

    def get_queryset(self):
        return Notes.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save()
```

`notes/urls.py`

```python
from django.conf.urls import url
from .views import NoteViewSet

note_list = NoteViewSet.as_view({"get": "list", "post": "create"})

note_detail = NoteViewSet.as_view(
    {"get": "retrieve", "patch": "partial_update", "delete": "destroy"}
)


urlpatterns = [
    url("^notes/$", note_list, name="note-list"),
    url("^notes/(?P<pk>[0-9]+)/$", note_detail, name="note-detail"),
]
```

그 다음 root앱의 urls.py에서 notes의 urls.py를 반영해줍니다.

`urls.py`

```python
from django.contrib import admin
from django.urls import path

from notes import urls
from django.conf.urls import include, url

urlpatterns = [
	path("admin/", admin.site.urls), 
    url(r"^api/", include(urls))
]
```

이제 다음의 url들이 통신이 될것입니다.

http://localhost:8000/api/notes/ (GET - Note List)
http://localhost:8000/api/notes/ (POST - Create Note)
http://localhost:8000/api/notes/{id}/ (GET - Get Single Note by id)
http://localhost:8000/api/notes/{id}/ (PATCH - update partial)
http://localhost:8000/api/notes/{id}/ (DELETE - destroy a single note by id)


일단 권한 설정을 하지 않았습니다. 
지금까지 만들어놓은 API를 가지고 react에서 반영해보겠습니다.








