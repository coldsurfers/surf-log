import { useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Article } from '../../types/article'
import { DEFAULT_PAGINATION_COUNT } from '../constants'
import fetcher from '../fetcher'

function useArticles({
    category,
    initialData,
}: {
    category?: string
    initialData?: Article[]
}) {
    const [articles, setArticles] = useState<Article[]>(initialData ?? [])
    const [page, setPage] = useState<number>(1)
    const [isLastPage, setIsLastPage] = useState<boolean>(false)

    const { data, isFetching, isPreviousData } = useQuery(
        ['getArticleList', page, category],
        async (params) => {
            const [key, page, category] = params.queryKey as [
                string,
                number,
                string
            ]
            const res = await fetcher.articleList({
                page,
                category,
            })
            return res.list
        },
        {
            initialData: page === 1 && initialData,
            keepPreviousData: true,
        }
    )

    const loadMore = useCallback(() => {
        if (isFetching || isLastPage) return
        setPage((prev) => prev + 1)
    }, [isFetching, isLastPage])

    useEffect(() => {
        if (!data) return
        if (!isPreviousData) {
            setArticles((prev) => {
                if (page === 1) {
                    return data
                }
                return prev.concat(data)
            })
            if (data.length < DEFAULT_PAGINATION_COUNT) {
                setIsLastPage(true)
            }
        }
    }, [data, isPreviousData, page])

    useEffect(() => {
        setPage(1)
        setIsLastPage(false)
    }, [category])

    return {
        articles,
        isFetching,
        isLastPage,
        page,
        loadMore,
    }
}

export default useArticles
