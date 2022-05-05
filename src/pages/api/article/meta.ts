import { NextApiHandler } from 'next'
import meta from '../../../../public/article-meta.json'
import { ArticleMeta } from '../../../types/articleMeta'

const ArticleMetaAPI: NextApiHandler = (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method not allowed',
        })
    }
    return res.status(200).json({
        data: meta as ArticleMeta,
    })
}

export default ArticleMetaAPI
