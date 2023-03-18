import { ArticleMeta } from '../../types/articleMeta'

export const fetchArticleMeta = async (): Promise<ArticleMeta | null> => {
    try {
        const articleMetaJSON = await import(
            '../../../public/article-meta.json'
        )
        return articleMetaJSON.default
    } catch (e) {
        console.error(e)
        return null
    }
}
