---
title: Dnote 3 - 1. React - 개발 환경 설정 및 구조 잡기.(sass 설정)
excerpt: Dnote 3 - 1. React - 개발 환경 설정 및 구조 잡기.(sass 설정)
category: velog
thumbnail: Velog.png
createdAt: 2018-09-20T13:46:27.088Z
---
자 이제 프로젝트를 모두 생성했으니, 리액트쪽부터 건들여 볼까요?

```bash
$ cd frontend
# 저는 vscode를 쓰므로..
$ code ./
```
> # eject 하기

sass를 사용하려면 eject를 해서 설정파일들을 만져줘야 하므로 일단 eject부터 하겠습니다.


```bash
$ yarn eject
....
...
...
# eject completed.

# 실행 전에 바로 eject하면 오류가 나므로 다시 모듈을 다운로드 해줍니다.

$ yarn
# 혹은 npm install
# 저는 yarn을 쓰므로 앞으로는 yarn으로 진행하겠습니다.

$ yarn start
```
첫화면이 잘 뜬다면 다음으로 넘어가겠습니다.

> # sass 설정

일단 css대신 scss를 쓰려면 다음 패키지들을 다운로드 해주세요.

```bash
$ yarn add --dev node-sass sass-loader
```
그리고 `config/paths.js` 로 이동해주세요.

`config/paths.js`
```js
// config after eject: we're in ./config/
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
  // 추가해줍니다.
  styles: resolveApp("src/styles")
};
```

그런 다음 src밑에 styles폴더를 생성하여 주세요.

그 후 `config/webpack.config.dev.js` 로 이동하여 주세요.

`config/webpack.config.dev.js`
```js
{
  test: /\.css$/,
  use: [
    require.resolve("style-loader"),
    {
      loader: require.resolve("css-loader"),
      options: {
        importLoaders: 1
      }
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          autoprefixer({
            browsers: [
              ">1%",
              "last 4 versions",
              "Firefox ESR",
              "not ie < 9" // React doesn't support IE8 anyway
            ],
            flexbox: "no-2009"
          })
        ]
      }
    }
  ]
},
// "file" loader makes sure those assets get served by WebpackDevServer.
```
쭉 내리다보면 위와같은 부분이 있는데, 찾는 팁을 드리자면
ctrl + f 하고 .css로 찾은뒤 첫번째로 찾아지는 부분입니다.

저 위 코드들을 쭉 복사하신후 바로 밑에 붙여넣기 해주세요.

그 뒤에 다음과 같이 설정해줍니다.

```bash
{
	# css 를 scss로 바꿔줍니다.
  test: /\.scss$/,
  use: [
    require.resolve("style-loader"),
    {
      loader: require.resolve("css-loader"),
      options: {
        importLoaders: 1
      }
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          autoprefixer({
            browsers: [
              ">1%",
              "last 4 versions",
              "Firefox ESR",
              "not ie < 9" // React doesn't support IE8 anyway
            ],
            flexbox: "no-2009"
          })
        ]
      }
    },
    # 추가해줍니다.
    {
      loader: require.resolve("sass-loader"),
      options: {
        includePaths: [paths.styles]
      }
    }
  ]
},
```

`config/webpack.config.prod.js`로 이동해줍니다.

`config/webpack.config.prod.js`

```js
// 여기서도 .css 를 찾은뒤 밑으로 똑같이 복사해줍니다.

{
  // css -> scss
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract(
    Object.assign(
      {
        fallback: {
          loader: require.resolve('style-loader'),
          options: {
            hmr: false,
          },
        },
        use: [
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              minimize: true,
              sourceMap: shouldUseSourceMap,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          // 추가해줍니다.
          {
            loader: require.resolve("sass-loader"),
            options: {
              includePaths: [paths.styles]
            }
          }
        ],
      },
      extractTextPluginOptions
    )
  ),
  // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
},
```

자 이제 sass에 대한 환경 설정은 모두 끝났습니다.







