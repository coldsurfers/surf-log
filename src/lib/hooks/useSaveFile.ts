import { useMutation } from 'react-query'
import { getPresigned, uploadToS3 } from '../fetcher/upload'

function useSaveFile() {
    return useMutation<
        string | null,
        unknown,
        { type: 'thumbnail' | 'content-images'; file: File }
    >(
        async ({
            type,
            file,
        }: {
            type: 'thumbnail' | 'content-images'
            file: File
        }) => {
            const response = await getPresigned({
                type,
                filename: file.name,
                filetype: file.type as 'image/png' | 'image/jpeg',
            })
            if (!response) return null
            return await uploadToS3(response.data, file)
        }
    )
}

export default useSaveFile
