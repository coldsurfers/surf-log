---
title: 블로그 프로젝트 (proj. surf-log)
excerpt: 블로그 만들기 후기
category: dev
thumbnail: nextjsimage.png
createdAt: 2022-03-17T12:46:03.222Z
---
# Proj. surf-log (블로그  프로젝트)

[github repo](https://github.com/coldsurfers/surf-log)

## 1. Spec

* NextJS + Typescript
* marked + codemirror + prismjs

## 2. markdown meta build 기능 구현

```js
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const thumbnailDirPathStr = '../thumbnails'

function generateUniqSerial() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, (c) => {
        const r = Math.floor(Math.random() * 16)
        return r.toString(16)
    })
}

function main() {
    const mdFilesDirectoryPath = path.resolve(__dirname, '../articles')
    const mdFileNames = fs.readdirSync(mdFilesDirectoryPath, 'utf8')
    const mdFilesMetaArray = mdFileNames
        .map((fileName) => {
            const mdFilePath = path.resolve(
                __dirname,
                `../articles/${fileName}`
            )
            const mdFileContent = fs.readFileSync(mdFilePath, 'utf8')
            const mdFileMeta = matter(mdFileContent, {
                excerpt: function (file, options) {
                    file.excerpt = encodeURI(file.data.excerpt)
                    if (file.data.thumbnail) {
                        const thumbnailFileBase64Encoded = fs.readFileSync(
                            path.resolve(
                                __dirname,
                                `${thumbnailDirPathStr}/${file.data.thumbnail}`
                            ),
                            'base64'
                        )
                        file.thumbnailBase64 = thumbnailFileBase64Encoded
                    }
                },
            })
            return mdFileMeta
        })
        .sort((a, b) => {
            return new Date(a.data.createdAt) - new Date(b.data.createdAt)
        })
        .reduce((prev, curr) => {
            if (prev.find((prevItem) => prevItem.excerpt === curr.excerpt)) {
                curr.excerpt = `${curr.excerpt}-${generateUniqSerial()}`
            }
            return prev.concat(curr)
        }, [])
        .sort((a, b) => {
            return new Date(b.data.createdAt) - new Date(a.data.createdAt)
        })

    const categories = mdFilesMetaArray
        .map((meta) => meta.data.category)
        .filter((value, index, self) => self.indexOf(value) === index)

    const mdFilesMeta = mdFilesMetaArray.reduce((prev, curr) => {
        prev[curr.excerpt] = curr
        return prev
    }, {})

    const metaFilePath = path.resolve(__dirname, '../public/article-meta.json')

    const meta = {
        articles: mdFilesMeta,
        categories,
    }
    fs.writeFileSync(metaFilePath, JSON.stringify(meta))
}

main()

```

## 3. editor 기능 구현
[codemirror](https://codemirror.net/)로 editor 기능을 구현하였다.

## 4. markdown renderer 기능 구현
[marked](https://www.npmjs.com/package/marked) 모듈을 사용하여 markdown으로 작성된 string text를 html로 변환
prismjs로 코드 부분 Highlight

## 5. markdown 파일 쓰기(write) 기능 구현
next page api를 사용하여 구현.

```typescript
import { NextApiHandler } from 'next'
import fs from 'fs'
import path from 'path'

function generateUniqSerial() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, (c) => {
        const r = Math.floor(Math.random() * 16)
        return r.toString(16)
    })
}

const SaveAPI: NextApiHandler = (req, res) => {
    if (req.method === 'POST') {
        const { title, excerpt, category, thumbnail, text } = req.body
        let articlePath = path.resolve(
            __dirname,
            `../../../../articles/${title}.md`
        )
        if (fs.existsSync(articlePath)) {
            articlePath = path.resolve(
                __dirname,
                `../../../../articles/${`${title}-${generateUniqSerial()}`}.md`
            )
        }
        let content = `---
title: ${title}
excerpt: ${excerpt}
category: ${category}
thumbnail: ${thumbnail}
createdAt: ${new Date().toISOString()}
---
${text}`
        fs.writeFileSync(articlePath, content)
        return res.status(200).json({
            error: null,
        })
    }
    return res.status(501).json({
        error: 'not implemented',
    })
}

export default SaveAPI

```

## 6. markdown meta 정보 가져오기
nextjs server side api를 사용하여 다음과 같이 초기 fetching 후 pageProps로 페이지에 전달
```typescript
export const getStaticProps: GetStaticProps<ServerProps> = async (ctx) => {
    const articleMeta = (await import('../../public/article-meta.json')) as {
        articles: {
            [key: string]: Article
        }
        categories: string[]
    }
    return {
        props: {
            articles: Object.entries(articleMeta.articles).map(
                ([key, content]) => content
            ),
        },
    }
}
```

## 7. 배포

vercel을 사용하여 domain 연결 후 배포

## 8. 깃 전략

git flow를 사용
