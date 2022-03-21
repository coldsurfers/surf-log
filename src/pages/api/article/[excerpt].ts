import { NextApiHandler } from 'next'
import meta from '../../../../public/article-meta.json'

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

    return res.status(405).json({
        error: `${req.method} method is not supported`,
    })
}

export default ArticleAPI
