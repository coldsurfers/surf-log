import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef } from 'react'
import fetcher from '../fetcher'

function useTempSave({ editorText }: { editorText: string }) {
    const router = useRouter()
    const { excerpt } = router.query
    const intervalTimerRef: { current: NodeJS.Timer | null } = useRef(null)
    const fetchTempSave = useCallback(async () => {
        return await fetcher.temporarySaveArticle({ editorText })
    }, [editorText])

    useEffect(() => {
        if (!excerpt) {
            if (intervalTimerRef.current) {
                clearInterval(intervalTimerRef.current)
            }
            intervalTimerRef.current = setInterval(() => {
                fetchTempSave()
            }, 3500)
        }

        return () => {
            if (intervalTimerRef.current) {
                clearInterval(intervalTimerRef.current)
            }
        }
    }, [fetchTempSave, excerpt])
}

export default useTempSave