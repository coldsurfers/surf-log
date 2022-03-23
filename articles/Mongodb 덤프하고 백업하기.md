---
title: Mongodb 덤프하고 백업하기
excerpt: Mongodb 덤프하고 백업하기
category: velog
thumbnail: Velog.png
createdAt: 2018-09-30T10:00:15.808Z
---
AWS를 쓰는 ... (무료로쓰는 혹은 돌려막기 하는...) 저같은 사용자에게 꼭필요한 DB덤프하고 덮어쓰기 !

이 블로그 또한 10개월 남짓 남은것 같은데 한 9개월 정도 남았을때에 덤프 과정이 필요할거 같아서 서핑 후 글을 남긴다.

# 덤프하기 

일단 몽고디비가 깔려있다면, mongodump라는 명령어로 덤프를 시켜야한다.

아래 명령어를 실행하게 되면 내 현재 위치에 dump라는 폴더가 생기게된다.

```bash
mongodump --host 127.0.0.1 --port 27017
```

--out 명령어로 위치를 지정해줄수도 있다. host와 port는 기본값인 127.0.0.1과 27017을 사용했다.

```bash
mongodump --out ~/mongo_backup --host 127.0.0.1 --port 27017
```

혹은 아이디와 비밀번호로 잠금된 몽고디비라면

```bash
mongodump --out ~/mongo_backup --host 127.0.0.1 --port 27017 -u계정명 -p계정비번 
```

으로 가능하고, 또한 모든 데이터베이스를 덤프하려는게 아니면 --db옵션을 사용하여 선택적으로 덤프가 가능하다.

```bash
mongodump --out ~/mongo_backup --host 127.0.0.1 --port 27017 -u계정명 -p계정비번 --db 선택적으로 복구하려는 db명
```

즉, dump 명령어를 정리하자면 다음과 같다.

```bash
mongodump --out 덤프지정위치(디렉터리) --host 127.0.0.1 --port 27017 -u계정명 -p계정비번 --db 선택적으로 복구하려는 db명
```

# 복구하기

덤프를 했으니, 덤프를 해놓은 데이터들을 바탕으로 복구를 해야한다.

마찬가지로 mongodb가 설치되어 있다면, command창에서 mongorestore를 사용가능 할것이다.

```bash
mongorestore --host 127.0.0.1 --port 27017 -u계정명 -p비번 --drop 원래디비에서 드랍시킬 디비명 --db 선택적으로 복구하려는 db명 "복구하려는 덤프된 디렉터리 위치"
```

--drop 옵션은 덤프하려는 데이터와 현재 디비에있는 데이터가 겹칠시 drop시키는 기능이다.

나의 블로그 복구를 예로들어보겠다.

## ex)

```bash
mongorestore --host 127.0.0.1 --port 27017 --drop myblog --db myblog ~/mongo_backup
```















> 유용하게 보셨다면 다른 좋은글이 있을지는 모르겠으나,,, 함들러보세요!

https://killi8n.com

