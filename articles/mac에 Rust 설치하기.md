---
title: mac에 Rust 설치하기
excerpt: Rust Lang 을 mac에 설치해보기
category: dev
thumbnail: rust-logo-blk.png
createdAt: 2022-04-11T01:52:22.087Z
---
# Rust 설치하기

이 [사이트](https://www.rust-lang.org/tools/install)를 참조하여 Rust Lang을 mac에 설치했던 과정을 나타내보겠다.

## rustup을 사용하여 설치
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
## 환경변수 설정
ohmyzsh을 썼기 때문에 다음과 같이 rust lang의 bin 디렉터리를 환경변수에 등록하였다.
```shell
export RUST_BIN=$HOME/.cargo/bin
export PATH=$PATH:$RUST_BIN
```
그리고 zshrc 파일을 다시 실행시킨다.

```bash
source ~/.zshrc
```

```bash
rustc --version
rustc 1.60.0 (7737e0b5c 2022-04-04)
```

rust lang이 mac에 설치되고 전역 환경 변수에 등록되었다.