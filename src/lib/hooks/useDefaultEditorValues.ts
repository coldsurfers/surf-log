import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Article } from '../../types/article'
import { EditorSaveModalValues } from '../../types/modal'
import fetcher from '../fetcher'

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
        const res = await fetcher.getTempSaved()
        const json = (await res.json()) as {
            error: string | null
            tempArticleText: string | null
        }
        const { error, tempArticleText } = json
        if (!error && tempArticleText) {
            setDefaultEditorValue(tempArticleText)
        }
    }, [])

    const getExistingFile = useCallback(async () => {
        if (!excerpt) {
            return null
        }
        const encodedExcerpt = encodeURIComponent(excerpt as string)
        const res = await fetcher.getArticleByExcerpt({ encodedExcerpt })
        const json = (await res.json()) as {
            data: Article | null
        }
        const { data } = json
        if (data) {
            const {
                content,
                data: { title, category, excerpt, thumbnail, createdAt },
            } = data
            setDefaultEditorValue(content)
            setDefaultModalValues({
                title: title ?? '',
                category: category ?? '',
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