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

export const removeArticleByExcerpt = async (excerpt: string) => {
    try {
        const { data } = await axiosClient.delete<void>(`/article/${excerpt}`)
        return data
    } catch (e) {
        console.error(e)
        return null
    }
}
