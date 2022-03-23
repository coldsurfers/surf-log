---
title: Django + React 로 첫 화면 띄워보기
excerpt: Django + React 로 첫 화면 띄워보기
category: velog
thumbnail: Velog.png
createdAt: 2018-09-19T13:38:34.013Z
---
> 이곳에 쓰인 모든 글은 http://v1k45.com/blog 의 http://v1k45.com/blog/modern-django-part-1-setting-up-django-and-react/ 에 쓰여진 대로 진행함을 알립니다.

> 또한 이 글의 원본은 https://killi8n.com 에 있음을 알립니다! (블로그 홍보는 안 
비밀...)

이번에 올릴 글은 장고와 리액트로 dev 모드와 production 모드로 화면 띄워보기 입니다. 일단 구조는 Root 앱 밑에 Frontend(React) , Backend(Django) 두 폴더가 있는 구조 입니다.

# 프로젝트 생성 하기

```bash
mkdir Deact
# make react project directory from cra
create-react-app deact-frontend

# django project
mkdir deact-backend

cd deact-backend

# make virtual env
virtualenv --python=python3 venv

# activate virtual env
source venv/bin/activate

# install django
pip install django

django-admin startproject deact

cd deact
python manage.py migrate
python manage.py runserver

```

자 그리고 이제 react directory로 와서 eject를 시켜주세요.

```bash
yarn eject
```

# React와 Django 통합하기

다시 django 디렉토리로 와서 다음 명령어로 인스톨 해줍니다.

```bash
pip install django-webpack-loader
```

그 다음에 settings.py에서 INSTALLED_APPS 에 'webpack_loader'를 추가해줍니다. 그리고 webpack_loader에 관한 설정과 저희의 리액트 앱을 보여줄 template에 관한 설정도 추가해줍니다.

> settings.py

```python
...

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'webpack_loader',
]

...

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "templates"),],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

...

WEBPACK_LOADER = {
    'DEFAULT': {
            'BUNDLE_DIR_NAME': 'bundles/',
            'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.dev.json'),
        }
}

```

그리고 templates 디렉토리를 장고 프로젝트의 Root디렉토리 밑에 만든후, index.html을 추가합니다.

> templates/index.html

```html
{% load render_bundle from webpack_loader %}
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Deact</title>
</head>

<body>
    <div id="root">
    </div>
    {% render_bundle 'main' %}
</body>

</html>
```

그리고 urls.py에 해당 템플릿 뷰를 라우팅 해줍니다.

> urls.py

```python
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name="index.html")),
]

```


이제 localhost:8000 으로 접속하면, 다음과 같이 오류가 날것입니다!
리액트 프로젝트에서 webpack loader설정을 안해서 나는 당연한 오류입니다.

![Imgur](https://i.imgur.com/CMeIfq5.png)

이제 리액트로 넘어와서 다시 설정을 해줘야 합니다.


```bash
# webpack bundle tracker 설치
yarn add --dev webpack-bundle-tracker
```

> config/path.js

```js
module.exports = {
  dotenv: resolveApp(".env"),
  appBuild: resolveApp("build"),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appIndexJs: resolveApp("src/index.js"),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  yarnLockFile: resolveApp("yarn.lock"),
  testsSetup: resolveApp("src/setupTests.js"),
  appNodeModules: resolveApp("node_modules"),
  publicUrl: getPublicUrl(resolveApp("package.json")),
  servedPath: getServedPath(resolveApp("package.json")),
  // 추가 해줍니다.
  statsRoot: resolveApp("../deact-backend/deact")
};
```

> config/webpack.config.dev.js

```js
// bundleTracker를 import 해 줍니다.
const BundleTracker = require('webpack-bundle-tracker');
// publicPath와 publicUrl을 다음과 같이 변경해줍니다.
const publicPath = 'http://localhost:3000/';
const publicUrl = 'http://localhost:3000/';

// entry 부분을 아래와 같이 변경해줍니다.
entry: [
    require.resolve("./polyfills"),
    require.resolve("webpack-dev-server/client") + "?http://localhost:3000",
    require.resolve("webpack/hot/dev-server"),
    require.resolve("react-dev-utils/webpackHotDevClient"),
    paths.appIndexJs
],
  
// 가장 아래의 plugins 쪽에 다음을 추가해줍니다. 
plugins: [
	...
  	new BundleTracker({path: paths.statsRoot, filename: 'webpack-stats.dev.json'}),
]

```



> config/webpackDevServer.config.js

```js
// host 밑에 다음을 추가해줍니다.
host: host,
headers: {
  'Access-Control-Allow-Origin': '*'
},
```

자 이제 다시 yarn start로 시작 한후, localhost:8000으로 접속하면 첫 화면이 뜰것입니다.

여기까지 Dev모드의 React를 띄우는 것을 알아 보았는데요, 그럼 이번에는 build된 React를 띄우는 Prod 모드를 알아봅시다.

루트 프로젝트 아래의 deact 앱 아래에 production_settings.py를 다음과 같이 생성해줍니다.

> deact/deact/production_settings.py

```python 
from .settings import *

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "assets"),
]

WEBPACK_LOADER = {
    'DEFAULT': {
            'BUNDLE_DIR_NAME': 'bundles/',
            'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.prod.json'),
        }
}
```
그 다음에 templates 디렉토리와 같은 위치에 assets/bundles 디렉토리를 차례로 생성해줍니다. 나중에 리액트앱이 빌드 될때 파일이 이곳으로 모이게 됩니다.

그리고 다시 리액트의 config/paths.js 에서 appBuild를 아까 만든 assets/bundles 경로로 설정해줍니다.

> config/paths.js

```js
module.exports = {
  dotenv: resolveApp(".env"),
  // 변경 할 부분입니다. 
  appBuild: resolveApp("../deact-backend/deact/assets/bundles"),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appIndexJs: resolveApp("src/index.js"),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  yarnLockFile: resolveApp("yarn.lock"),
  testsSetup: resolveApp("src/setupTests.js"),
  appNodeModules: resolveApp("node_modules"),
  publicUrl: getPublicUrl(resolveApp("package.json")),
  servedPath: getServedPath(resolveApp("package.json")),
  statsRoot: resolveApp("../deact-backend/deact")
};

```

그리고 config/webpack.config.prod.js 에서 다음과 같은 작업들을 해야합니다.

> config/webpack.config.prod.js

```js
// Bundle Tracker를  import해줍니다(상단)
const BundleTracker = require('webpack-bundle-tracker');

// 기존의 publicPath를 다음과 같이 바꿔줍니다.
const publicPath = "/static/bundles/";
// 기존의 cssFilename을 다음과 같이 변경해줍니다. (앞의 static/ 을 없애줍니다.)
const cssFilename = 'css/[name].[contenthash:8].css';

// 약 67 번째 라인에 있는 경로도 모두 static을 제거 해줍니다.
...
output: {
  ...
  
  filename: "js/[name].[chunkhash:8].js",
  chunkFilename: "js/[name].[chunkhash:8].chunk.js",
  
  ...
}
  
// 약 140번째 라인의 경로도 static을 제거해줍니다.
  
{
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve("url-loader"),
    options: {
      limit: 10000,
      name: "media/[name].[hash:8].[ext]"
    }
},
  
  
// 약 223번째 라인의 경로도 static을 제거해줍니다.
  
options: {
      name: "media/[name].[hash:8].[ext]"
}
  
// 마지막 plugins 에 다음을 추가해줍니다.
  
plugins: [
	...
  	new BundleTracker({
      path: paths.statsRoot,
      filename: "webpack-stats.prod.json"
    })	
  	...
]
...
```
쉽게 설명을 해드리면 ctrl + f 로 static을 검색하신후, 경로로 잡히는 모든것을 삭제해 주시면 됩니다. 그 후 plugins 에 bundleTracker관련 코드를 추가해 줍니다.

그리고 리액트 쪽에서 build를 해줍니다.
```bash
yarn build
```

그 후 장고 쪽에서 다음과 같은 명령어로 production 모드를 띄워줍니다.

```bash
python manage.py runserver --settings=deact.production_settings
```

잘 뜨나요? 
여기 까지 되셨다면 production도 띄울수 있게 된것입니다!











