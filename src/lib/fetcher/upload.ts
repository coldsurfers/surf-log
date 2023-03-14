import axiosClient from '../axiosClient'
import { PresignURLResponse } from './types'

export const getPresigned = async ({
    type,
    filename,
    filetype,
}: {
    type: 'thumbnail' | 'content-images'
    filename: string
    filetype: 'image/png' | 'image/jpeg'
}) => {
    try {
        const url = `/file/${type}?filename=${filename}&filetype=${filetype}`
        return await axiosClient.get<PresignURLResponse>(url)
    } catch (e) {
        console.error(e)
        return null
    }
}
