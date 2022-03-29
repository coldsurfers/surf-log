import { NextApiHandler } from 'next'
import meta from '../../../../public/article-meta.json'

const ArticleListAPI: NextApiHandler = (req, res) => {
    const { articles, categories } = meta

    switch (req.method) {
        case 'GET':
            return res.status(200).json({})
        default:
            return res.status(405).json({
                error: 'Method not allowed',
            })
    }
}

export default ArticleListAPI
