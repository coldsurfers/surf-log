import { useMutation } from 'react-query'
import fetcher, { FetchSaveFileResponseData } from '../fetcher'

function useSaveFile() {
    return useMutation<FetchSaveFileResponseData, unknown, { file: File }>(
        async ({ file }: { file: File }) => {
            return await fetcher.saveFile({ file })
        }
    )
}

export default useSaveFile
