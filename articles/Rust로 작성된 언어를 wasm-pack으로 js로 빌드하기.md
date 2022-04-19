---
title: Rust로 작성된 언어를 wasm-pack으로 js로 빌드하기
excerpt: Rust로 작성된 언어를 wasm-pack으로 js로 빌드하기
category: dev
thumbnail: rust-logo-blk.svg
createdAt: 2022-04-19T03:38:21.084Z
updatedAt: 2022-04-19T03:40:27.575Z
---
# Rust로 작성된 언어를 wasm-pack으로 js로 빌드하기

## 1. rust 및 wasm-pack 설치

* 만약 아직 rust가 기기에 설치되어 있지 않다면, https://rustup.rs/ 에서 rustup을 사용하여 rust를 설치해준다.
* https://rustwasm.github.io/wasm-pack/installer/ 링크를 참조하여 `wasm-pack` 을 기기에 설치해 준다.

## 2. cargo를 사용하여 rust 템플릿 생성

```bash
cargo new --lib my-lib
```

위와같이 명령어를 실행하게 되면, my-lib이라는 이름의 rust 템플릿 디렉터리가 생성된다.

## 3. Cargo.toml 작성

```toml
[package]
name = "<name>"
version = "<version>"
authors = [<author>]
edition = "<year>"
description = "<description>"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2.63"
```

Cargo.toml에 대한 자세한 정보는 https://rustwasm.github.io/docs/wasm-pack/tutorials/npm-browser-packages/template-deep-dive/cargo-toml.html 이쪽 링크를 참조하면 자세히 설명되어 있다.


## 4. Javascript로 export 할 Rust 코드 작성

`lib.rs`
```rust
extern crate wasm_bindgen;

#[wasm_bindgen]
pub fn add(x: i32, y: i32) -> i32 {
	x + y
}
```

위와 같이 wasm_bindgen을 이용하여 js로 export할 rust 함수를 만든다.

```bash
wasm-pack build
```

wasm-pack 을 사용하여 Build를 하게 되면 pkg 디렉터리가 생긴다.
이곳에는 wasm_bindgen을 사용하여 작성한 코드들이 js 및 ts 파일로 생성된다.

이것을 다음과 같이 js파일에서 import 할 수 있다.

`package.json`
```json
...
"dependencies": {
  "rust-wasm": "file:../pkg",
  ...
},
...
```

```js
import * as wasm from "rust-wasm/rust_wasm";

alert(wasm.add(1, 2));

```

> 참고 자료
[utilForever님의 rust-wasm-ts-template](https://github.com/utilForever/rust-wasm-ts-template)
[wasm-pack 공식 문서 - 매뉴얼 셋업](https://rustwasm.github.io/docs/wasm-pack/tutorials/npm-browser-packages/getting-started/manual-setup.html)





