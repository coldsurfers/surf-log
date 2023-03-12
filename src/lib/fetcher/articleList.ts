import axiosClient from '../axiosClient'
import { Article } from './types'

const fetchArticleList = async ({
    page,
    category,
    tag,
    count,
    isPublic = true,
}: {
    page?: number
    category?: string
    tag?: string
    count?: number
    isPublic?: boolean
}): Promise<Article[]> => {
    try {
        let url = `/article/list?`
        if (page) {
            url += `&page=${page}`
        }
        if (tag) {
            url += `&tag=${tag}`
        }
        if (category) {
            url += `&category=${category}`
        }
        if (count) {
            url += `&count=${count}`
        }
        if (typeof isPublic === 'boolean') {
            url += `&isPublic=${isPublic}`
        }
        const { data: articleList } = await axiosClient.get<Article[]>(url)
        return articleList
    } catch (e) {
        console.error(e)
        return []
    }
}

export default fetchArticleList
