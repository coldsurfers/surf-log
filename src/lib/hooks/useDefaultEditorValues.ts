import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { EditorSaveModalValues } from '../../types/modal'
import fetcher from '../fetcher'
import { fetchArticleByExcerpt } from '../fetcher/articleByExcerpt'

function useDefaultEditorValues() {
    const router = useRouter()
    const { excerpt } = router.query
    const [defaultEditorValue, setDefaultEditorValue] = useState<
        string | undefined
    >(undefined)
    const [defaultModalValues, setDefaultModalValues] = useState<
        EditorSaveModalValues | undefined
    >(undefined)

    const getTempFileText = useCallback(async () => {
        const data = await fetcher.getTempSaved()
        const { error, tempArticleText } = data
        if (!error && tempArticleText) {
            setDefaultEditorValue(tempArticleText)
        }
    }, [])

    const getExistingFile = useCallback(async () => {
        if (!excerpt) {
            return null
        }
        const article = await fetchArticleByExcerpt(excerpt as string)
        if (article) {
            const {
                content,
                title,
                blogArticleCategory,
                excerpt,
                thumbnail,
                createdAt,
            } = article
            setDefaultEditorValue(content)
            setDefaultModalValues({
                title: title ?? '',
                category: blogArticleCategory.name ?? '',
                excerpt: excerpt ?? '',
                thumbnail: thumbnail ?? '',
                createdAt: createdAt ?? '',
            })
        }
    }, [excerpt])

    useEffect(() => {
        const initialize = async () => {
            if (excerpt) {
                getExistingFile()
            } else {
                await getTempFileText()
            }
        }
        initialize()
    }, [excerpt, getExistingFile, getTempFileText])

    return {
        defaultEditorValue,
        defaultModalValues,
    }
}

export default useDefaultEditorValues
