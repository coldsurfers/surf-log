import { useCallback, useEffect, useState } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
import { Article } from '../../types/article'
import { UseArticles } from '../../types/hooks/useArticles'
import { DEFAULT_PAGINATION_COUNT } from '../constants'
import fetcher from '../fetcher'

const useArticles: UseArticles = ({ category, tag, initialData }) => {
    const {
        data,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery<Article[]>(
        ['getArticleList', category, tag],
        async ({ pageParam = 0, queryKey }) => {
            const [, category, tag] = queryKey as [
                string,
                string | undefined,
                string | undefined
            ]
            const res = await fetcher.articleList({
                page: pageParam,
                category,
                tag,
            })
            return res.list
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
