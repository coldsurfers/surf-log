import { NextApiHandler } from 'next'
import meta from '../../../../public/article-meta.json'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const ArticleAPI: NextApiHandler = (req, res) => {
    if (req.method === 'GET') {
        const { excerpt } = req.query
        const { articles } = meta

        const [, articleData] = Object.entries(articles).find(
            ([key]) => key === encodeURIComponent(`${excerpt}`)
        ) ?? [null, null]

        return res.status(200).json({
            data: articleData,
        })
    }

    if (req.method === 'DELETE') {
        if (process.env.NODE_ENV === 'production') {
            return res.status(405).json({
                error: `${req.method} method is not supported`,
            })
        }
        const { excerpt } = req.query
        const { articles } = meta
        const encodedExcerpt = encodeURIComponent(excerpt as string)
        const article = articles[encodedExcerpt as keyof typeof articles]
        const { title } = article.data
        const articlePath = path.resolve(
            __dirname,
            `../../../../../articles/${title}.md`
        )
        const exist = fs.existsSync(articlePath)
        if (!exist) {
            return res.status(404).json({
                error: 'file is not existing',
            })
        }
        fs.rmSync(articlePath)
        execSync('yarn ready')
        return res.status(204).json({})
    }

    return res.status(405).json({
        error: `${req.method} method is not supported`,
    })
}

export default ArticleAPI
