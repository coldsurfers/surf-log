import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { EditorSaveModalValues } from '../../types/modal'
import fetcher from '../fetcher'

function useSave({ editorText }: { editorText: string }) {
    const router = useRouter()
    const { excerpt } = router.query
    const save = useCallback(
        async ({
            modalValues,
            tags,
        }: {
            modalValues: EditorSaveModalValues
            tags: string[]
        }) => {
            const data = await fetcher.saveArticle({
                excerpt: excerpt as string,
                modalValues,
                editorText,
                tags,
            })
            const { error } = data
            if (error === null) {
                router.push('/')
            } else {
                console.error(error)
            }
        },
        [excerpt, editorText, router]
    )

    return {
        save,
    }
}

export default useSave
