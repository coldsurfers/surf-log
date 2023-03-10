import { NextApiHandler } from 'next'
import axiosClient from '../../../lib/axiosClient'

const CategoryListAPI: NextApiHandler = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({})
    }
    try {
        const { data: categoryList } = await axiosClient.get('/category/list')
        return res.status(200).json(categoryList)
    } catch (e) {
        console.error(e)
        return res.status(500).json({})
    }
}

export default CategoryListAPI
