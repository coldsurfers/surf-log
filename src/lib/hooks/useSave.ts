import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { EditorSaveModalValues } from '../../types/modal'
import { useMutation } from 'react-query'
import { fetchSaveArticle } from '../fetcher/saveArticle'

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
            const { title, excerpt, thumbnail, category, isPublic } =
                modalValues
            return await fetchSaveArticle({
                title,
                excerpt,
                thumbnail,
                category,
                editorText,
                tags,
                isPublic,
            })
        }
    )

    useEffect(() => {
        if (data) {
            router.push('/')
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
