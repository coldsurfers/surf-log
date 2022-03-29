import { NextApiHandler } from 'next'
import meta from '../../../../public/article-meta.json'
import queryString from 'query-string'

const DEFAULT_PAGINATION_COUNT = 15

const ArticleListAPI: NextApiHandler = (req, res) => {
    const { articles, categories } = meta
    if (!req.url) {
        return res.status(400).json({
            error: 'req.url is not existing',
        })
    }
    const [path, queries] = req.url.split('?')
    const parsed = queryString.parse(queries)
    const { page, category } = parsed as {
        page?: number
        category?: string
    }
    switch (req.method) {
        case 'GET':
            if (!page) {
                return res.status(400).json({
                    error: 'page query string is not existing',
                })
            }
            let list = Object.entries(articles)
                .slice(
                    (page - 1) * DEFAULT_PAGINATION_COUNT,
                    page * DEFAULT_PAGINATION_COUNT
                )
                .map(([key, data]) => data)
            if (category) {
                list = list.filter((data) => data.data.category === category)
            }
            return res.status(200).json({
                list,
            })
        default:
            return res.status(405).json({
                error: 'Method not allowed',
            })
    }
}

export default ArticleListAPI
