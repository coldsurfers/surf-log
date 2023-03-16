import axiosClient from '../axiosClient'
import { Article, SaveArticleBody } from './types'

export const fetchSaveArticle = async (
    data: SaveArticleBody
): Promise<Article | null> => {
    try {
        const { data: article } = await axiosClient.post<Article>(
            '/article/save',
            data
        )
        return article
    } catch (e) {
        console.error(e)
        return null
    }
}
