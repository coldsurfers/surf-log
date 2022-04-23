import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Article } from '../../types/article'
import { UseArticle } from '../../types/hooks/useArticle'
import fetcher from '../fetcher'

const useArticle: UseArticle = ({ initialData, excerpt }) => {
    const [article, setArticle] = useState<Article | undefined>(initialData)
    const { data, isFetching } = useQuery<Article | undefined>(
        'getArticle',
        async () => {
            if (!excerpt) return undefined
            const { data } = await fetcher.getArticleByExcerpt({ excerpt })
            return data ?? undefined
        },
        {
            initialData,
        }
    )

    useEffect(() => {
        if (!data || typeof initialData !== 'undefined') return
        setArticle(data)
    }, [data, initialData])

    return {
        article,
        isFetching,
    }
}

export default useArticle
