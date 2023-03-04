import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Article, ArticleData } from '../src/types/article'
import { ArticleMeta } from '../src/types/articleMeta'

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
        .filter((fileName) => fileName !== 'temporary')
        .map((fileName) => {
            const mdFilePath = path.resolve(
                __dirname,
                `../articles/${fileName}`
            )
            const mdFileContent = fs.readFileSync(mdFilePath, 'utf8')
            const mdFileMeta = matter(mdFileContent, {
                excerpt: (file, options) => {
                    file.excerpt = file.data.excerpt ?? ''
                    if (file.data.thumbnail) {
                        const ext = path
                            .extname(file.data.thumbnail)
                            .split('.')
                            .pop()
                        let base64Pre = ''
                        switch (ext) {
                            case 'svg':
                                base64Pre = `data:image/svg+xml;base64, `
                                break
                            case 'png':
                                base64Pre = `data:image/png;base64, `
                                break
                            case 'jpeg':
                            case 'jpg':
                                base64Pre = `data:image/jpeg;base64, `
                                break
                            default:
                                throw Error('unexpected file extension')
                        }
                        const thumbnailFileBase64Encoded = fs.readFileSync(
                            path.resolve(
                                __dirname,
                                `${thumbnailDirPathStr}/${file.data.thumbnail}`
                            ),
                            'base64'
                        )
                        file.thumbnailBase64 = `${base64Pre}${thumbnailFileBase64Encoded}`
                    }
                },
            })
            console.log(mdFileMeta)
            return mdFileMeta
        })
        .sort((a, b) => {
            const createdAtPrev = (a.data as ArticleData).createdAt
            const createdAtNext = (b.data as ArticleData).createdAt
            if (!createdAtPrev || !createdAtNext)
                throw Error('Invalid createdAt')
            return (
                new Date(createdAtPrev).valueOf() -
                new Date(createdAtNext).valueOf()
            )
        })
        .reduce<matter.GrayMatterFile<string>[]>((prev, curr) => {
            if (prev.find((prevItem) => prevItem.excerpt === curr.excerpt)) {
                curr.excerpt = `${curr.excerpt}-${generateUniqSerial()}`
            }
            return prev.concat(curr)
        }, [])
        .sort((a, b) => {
            const createdAtPrev = (a.data as ArticleData).createdAt
            const createdAtNext = (b.data as ArticleData).createdAt
            if (!createdAtPrev || !createdAtNext)
                throw Error('Invalid createdAt')
            return (
                new Date(createdAtNext).valueOf() -
                new Date(createdAtPrev).valueOf()
            )
        })

    const categories = [
        ...new Set(mdFilesMetaArray.map((meta) => meta.data.category)),
    ].sort()

    const mdFilesMeta = mdFilesMetaArray.reduce<{ [key: string]: Article }>(
        (prev, curr) => {
            if (curr.excerpt) {
                prev[curr.excerpt] = {
                    ...curr,
                    isEmpty: false,
                    excerpt: curr.excerpt,
                }
            }
            return prev
        },
        {}
    )

    const metaFilePath = path.resolve(__dirname, '../public/article-meta.json')

    const meta = {
        articles: mdFilesMeta,
        categories,
    }
    fs.writeFileSync(metaFilePath, JSON.stringify(meta))
}

main()
