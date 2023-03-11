import axiosClient from '../axiosClient'
import { Article } from './types'

export const fetchArticleByExcerpt = async (
    excerpt: string
): Promise<Article | null> => {
    try {
        const { data: article } = await axiosClient.get<Article>(
            `/article/${excerpt}`
        )
        return article
    } catch (e) {
        console.error(e)
        return null
    }
}
