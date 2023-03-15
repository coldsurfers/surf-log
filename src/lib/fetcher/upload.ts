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

export const uploadToS3 = async (
    params: PresignURLResponse,
    file: File
): Promise<string | null> => {
    try {
        const formdata = new FormData()
        const { url, fields } = params
        Object.keys(fields).forEach((key) => {
            formdata.append(key, fields[key as keyof typeof fields])
        })
        formdata.append('file', file)

        await axiosClient.post(url, formdata)
        const s3URL = `${url}/${fields.key}`
        return s3URL
    } catch (e) {
        console.error(e)
        return null
    }
}
