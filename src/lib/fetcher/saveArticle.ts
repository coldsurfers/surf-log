import axiosClient from '../axiosClient'
import { Article } from './types'

export const fetchSaveArticle = async (data: {
    title: string
    excerpt: string
    thumbnail: string
    category: string
    editorText: string
    tags: string[]
}): Promise<Article | null> => {
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
