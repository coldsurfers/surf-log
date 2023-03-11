import axiosClient from '../axiosClient'
import { Category } from './types'

export const fetchCategoryList = async (): Promise<Category[]> => {
    try {
        const { data: categoryList } = await axiosClient.get<Category[]>(
            '/category/list'
        )
        return categoryList
    } catch (e) {
        console.error(e)
        return []
    }
}
