import { useCallback } from 'react'
import { useInfiniteQuery } from 'react-query'
import { UseArticles } from '../../types/hooks/useArticles'
import { DEFAULT_PAGINATION_COUNT } from '../constants'
import fetchArticleList from '../fetcher/articleList'
import { Article } from '../fetcher/types'

const useArticles: UseArticles = ({
    category,
    tag,
    isPublic = true,
    initialData,
}) => {
    const {
        data,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery<Article[]>(
        ['getArticleList', category, tag, isPublic],
        async ({ pageParam = 0, queryKey }) => {
            const [, category, tag] = queryKey as [
                string,
                string | undefined,
                string | undefined
            ]
            const articleList = await fetchArticleList({
                page: pageParam,
                category,
                tag,
                isPublic,
            })
            return articleList
        },
        {
            initialData: initialData
                ? {
                      pageParams: [1],
                      pages: [initialData],
                  }
                : undefined,
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length < DEFAULT_PAGINATION_COUNT) return undefined
                return allPages.length + 1
            },
        }
    )

    const loadMore = useCallback(() => {
        if (isLoading || isFetching || !hasNextPage || isFetchingNextPage)
            return
        fetchNextPage()
    }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading])

    return {
        data: data?.pages.flatMap((v) => v) ?? [],
        isLoading: isFetching || isFetchingNextPage || isLoading,
        loadMore,
    }
}

export default useArticles
