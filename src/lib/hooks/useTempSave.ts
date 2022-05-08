import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import fetcher from '../fetcher'
import { useMutation } from 'react-query'

function useTempSave({ editorText }: { editorText: string }) {
    const router = useRouter()
    const { excerpt } = router.query
    const intervalTimerRef: { current: NodeJS.Timer | null } = useRef(null)
    const { mutate: fetchTempSave } = useMutation(
        ['temporarySaveArticle', editorText],
        async () => {
            return await fetcher.temporarySaveArticle({ editorText })
        }
    )

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
