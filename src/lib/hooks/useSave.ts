import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { EditorSaveModalValues } from '../../types/modal'
import fetcher from '../fetcher'
import { useMutation } from 'react-query'

function useSave({ editorText }: { editorText: string }) {
    const router = useRouter()
    const { excerpt } = router.query
    const {
        mutate: save,
        data,
        error,
    } = useMutation(
        ['saveArticle', excerpt, editorText],
        async ({
            modalValues,
            tags,
        }: {
            modalValues: EditorSaveModalValues
            tags: string[]
        }) => {
            return await fetcher.saveArticle({
                excerpt: excerpt as string,
                modalValues,
                editorText,
                tags,
            })
        }
    )

    useEffect(() => {
        if (!data) {
            return
        }
        const { error } = data
        if (error === null) {
            router.push('/')
        } else {
            console.error(error)
        }
    }, [data, router])

    useEffect(() => {
        if (error) {
            console.error(error)
        }
    }, [error])

    return {
        save,
    }
}

export default useSave
