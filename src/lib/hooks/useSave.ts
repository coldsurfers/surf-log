import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { EditorSaveModalValues } from '../../types/modal'
import fetcher from '../fetcher'

function useSave({ editorText }: { editorText: string }) {
    const router = useRouter()
    const { excerpt } = router.query
    const save = useCallback(
        async (modalValues: EditorSaveModalValues) => {
            const res = await fetcher.saveArticle({
                excerpt: excerpt as string,
                modalValues,
                editorText,
            })
            const json = await res.json()
            if (json.error === null) {
                router.push('/')
            } else {
                console.error(json.error)
            }
        },
        [excerpt, editorText, router]
    )

    return {
        save,
    }
}

export default useSave
