---
title: Dnote 5 - 1. Django - 권한 설정 및 로그인 / 회원가입 구현
excerpt: Dnote 5 - 1. Django - 권한 설정 및 로그인 / 회원가입 구현
category: velog
thumbnail: Velog.png
createdAt: 2018-09-23T10:05:17.452Z
---
일단 권한을 설정 해야 하니까, Django로 돌아옵시다.

django-rest-knox 라는 패키지를 다운로드 해야합니다.


```bash
$ (venv) pip install django-rest-knox
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
    'notes',
    'rest_framework',
    'knox',
]

...
# 제일 하단에 추가해줍니다.
# 처음에 10개만 받아오기 위해 PAGE_SIZE를 설정했습니다.
# 그리고 기본 권한을 knox의 token을 기반으로 설정했습니다.
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_AUTHENTICATION_CLASSES': ('knox.auth.TokenAuthentication',),
}
```

```bash
$ (venv) python manage.py makemigrations
$ (venv) python manage.py migrate
```

이제 기본 권한을 설정했으니, notes 모델에서 owner 필드를 추가해주겠습니다.

`notes/models.py`

```python
from django.db import models
from django.contrib.auth.models import User


class Notes(models.Model):
    text = models.CharField(max_length=255)
    owner = models.ForeignKey(
        User, related_name="notes", on_delete=models.CASCADE, null=True
    )
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)

    def __str__(self):
        return self.text

```

User 모델을 가져온뒤, foreign key로 설정했네요.


그리고 모델을 수정했으니 다시한번 migrate 해줍니다.

```bash
$ (venv) python manage.py makemigrations
$ (venv) python manage.py migrate
```

views.py에서는 모든 노트를 불러왔던것을 이제 owner별로 불러오는 작업을 해주겠습니다. 그리고, 노트를 만들때, owner 필드에 값을 넣어야겠죠?

`notes/views.py`

```python
from rest_framework import viewsets, permissions
from .models import Notes


class NoteViewSet(viewsets.ModelViewSet):
	permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = NoteSerializer

    def get_queryset(self):
        return self.request.user.notes.all().order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
```

자 이제, 회원가입 및 로그인에 대한 API 구현을 해보겠습니다.


`notes/serializers.py`

```python
from rest_framework import serializers
from .models import Notes
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

...

# 회원가입 시리얼라이저

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data["username"], None, validated_data["password"]
        )
        return user


# 접속 유지중인지 확인할 시리얼라이저

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")


# 로그인 시리얼라이저 

class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")

```

위와같이 serializer를 만들고, 


`notes/views.py`

```python
from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from .models import Notes
from .serializers import (
    NoteSerializer,
    CreateUserSerializer,
    UserSerializer,
    LoginUserSerializer,
)
from knox.models import AuthToken

....



class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        if len(request.data["username"]) < 6 or len(request.data["password"]) < 4:
            body = {"message": "short field"}
            return Response(body, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "token": AuthToken.objects.create(user),
            }
        )


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "token": AuthToken.objects.create(user),
            }
        )


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

```

serializer들도 만들어 줍니다.

`notes/urls.py`

```python
from django.conf.urls import url
from .views import NoteViewSet, RegistrationAPI, LoginAPI, UserAPI


note_list = NoteViewSet.as_view({"get": "list", "post": "create"})

note_detail = NoteViewSet.as_view(
    {"get": "retrieve", "patch": "partial_update", "delete": "destroy"}
)


urlpatterns = [
    url("^notes/$", note_list, name="note-list"),
    url("^notes/(?P<pk>[0-9]+)/$", note_detail, name="note-detail"),
    url("^auth/register/$", RegistrationAPI.as_view()),
    url("^auth/login/$", LoginAPI.as_view()),
    url("^auth/user/$", UserAPI.as_view()),
]

```
이렇게 url 라우팅도 해주면 장고작업은 끝이납니다.

postman 에서 body에 raw -> JSON형태로
```json
{
	"username": "testing",
	"password": "1234"
}
```
를 넣어주시고, http://localhost:8000/api/auth/register/ 와 http://localhost:8000/api/auth/login/ 을 POST 방식으로 실행하면 잘 실행이 될것입니다.

또한 접속된 유저 정보를 보기  위해서는, http://localhost:8000/api/auth/user/ 로 Headers 에 Authorization 항목을 넣고 __token 토큰값__ 으로 GET 실행 하면 유저 정보가 뜨게됩니다.

마지막으로 로그아웃을 구현하는것은 간단합니다.

`d_note/urls.py`

```python
from django.contrib import admin
from django.urls import path

from notes import urls
from django.conf.urls import include, url

urlpatterns = [
    path("admin/", admin.site.urls),
    url(r"^api/", include(urls)),
    url(r"^api/auth", include("knox.urls")),
]

```
다음과 같이 설정하면, /api/auth/logout/ 으로 Authorization: token 토큰값 으로 실행하면 로그아웃이 됩니다.
