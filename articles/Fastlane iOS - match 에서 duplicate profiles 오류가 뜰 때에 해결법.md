---
title: Fastlane iOS - match 에서 duplicate profiles 오류가 뜰 때에 해결법
excerpt: match 에서 duplicate profiles 오류가 뜰 때에 해결법
category: dev
thumbnail: fastlane.png
createdAt: 2022-07-31T04:52:15.831Z
tags: []
---
# Fastlane iOS - match 에서 duplicate profiles 오류가 뜰 때에 해결법

회사에서 fastlane 으로 iOS 빌드 자동화를 할 일이 생겨서 전체적으로 쭉 들여다 보는 와중에 해결하기 참 애매한 상황을 맞닥뜨렸다.

`match`를 이용하여 codesign에 필요한 certificate 및 profile들을 관리하는 레포와 연동을 해야 하는데, 다음과 같은 에러가 뜬 것 이다.


```bash
multiple profiles found with the name match 'match AppStore xxx.xxx.xxx'. Please remove the duplicate profiles and try again
```

말 그대로 `match AppStore xxx.xxx.xxx`이라는 name을 가진 profile이 존재 하고 있다는 것이다.
정확히는 모르겠지만, profile name이 하나의 unique key가 되어 profile을 구분하는 구분자로 사용되는 것 같았다.

따라서 이 오류를 해결 하기 위해선, 다음과 같은 두가지 방안이 떠올랐다.

1. 이미 만들어져 있는 동일한 이름의 프로필을 `match nuke`를 사용하여 없애거나 직접 developer portal에 들어가서 삭제한다
2. 1번의 방법이 안되면, cert와 sigh를 사용하여 우회한다

결론부터 말하자면 위 방법 모두 해결책이 되진 못했다.

이유는 다음과 같다.
1번의 경우 회사의 apple developer 계정으로 apple developer portal에 접속해도, `match AppStore xxx.xxx.xxx`와 같은 이름의 profile은 찾아 볼 수 없었다.
오리무중 이었다. 도저히 아무리 찾아봐도 우리가 관리하는 프로필에는 저런 이름을 가진 것이 없었다.

2번으로 어떻게 해보려고 했지만, github action에서 돌려야 해서 현실적인 부분에 부딪혔던 것 같다.

이렇게 삽질을 하던 도중, match를 사용하여 custom profile name을 주어서 굳이 `match AppStore xxx.xxx.xxx`와 같은 이름의 profile을 만들지 않아도 되는 방식을 알아냈다.

이 방식을 소개하려고 한다.
나는 fastlane cli 명령어를 사용하진 않았고, Fastfile에 custom 한 lane을 만들어서 실행했다.

## 1. 먼저 필요하다면 기존 profile을 삭제하는 match nuke를 실행한다

```ruby
match_nuke(
	type: "appstore",
	api_key: app_store_connect_api_key, # fastlane action 중 app_store_connect_api_key를 사용하여 받아온다.
	username: "apple developer account email", # 이쪽에서는 apple developer account email을 입력
	app_identifier: "bundle id", # app bundle id 입력
	profile_name: "match AppStore xxx.xxx.xxx" # optional (nuke할 profile의 name을 입력)
)
```

## 2. 실제 apple developer portal 에 profile을 만든다
```ruby
get_provisioning_profile(
	development: false,
	force: true,
	team_id: "apple developer team id", # apple developer team의 id를 입력
	filename: "xxxxxx.mobileprovision", # .mobileprovision이라는 확장자로 끝나는 파일 이름을 입력
	provisioning_name: "custom AppStore xxx.xxx.xxx" # 커스텀하게 만들 provisioning의 이름을 입력
)
```
만약 developer portal에 들어가서 profiles 탭에서 만들어진 profile의 상세를 눌러서 edit을 눌러보았을때, 하단의 certificates 옵션이 ios distribution으로 잡혀있다면 xcode와 모두 연동이 가능한 distribution으로 바꾸어준다.

## 3. match (readonly false)를 통해서 provisioning을 GitHub repo 에 연동시켜준다
```ruby
match(
	git_url: "https://github.com/user-name/repo-name", # certificate을 관리하는 github repo의 url을 입력
	storage_mode: "git",
	type: 'appstore',
	app_identifier: "xxx.xxx.xxx", # app bundle id 입력
	readonly: false, # readonly 를 false로 해줌으로써 repo와 연동할수 있게 함
	verbose: true,
	api_key: app_store_connect_api_key, # app store connect api key
	profile_name: "custom AppStore xxx.xxx.xxx" # 특정 커스텀하게 만든 프로필의 이름을 입력, 이 provisioning이 repo와 연동되게 됨
)
```

이렇게 하면 실제 repo와 연동하여 굳이 match가 정해준 이름이 아니더라도 커스텀한 이름을 사용할 수 있다.






























