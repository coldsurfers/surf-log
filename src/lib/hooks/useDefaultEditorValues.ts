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
        const { data } = await fetcher.getArticleByExcerpt({
            excerpt: excerpt as string,
        })
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
