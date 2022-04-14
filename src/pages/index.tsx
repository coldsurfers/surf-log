import type { GetServerSideProps, NextPage } from 'next'
import ArticleListTemplate from '../components/templates/ArticleListTemplate'
import fetcher from '../lib/fetcher'
import { Article } from '../types/article'
import Head from 'next/head'
import { useQuery } from 'react-query'
import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_PAGINATION_COUNT } from '../lib/constants'

interface ServerProps {
    initialArticles: Article[]
}

const Home: NextPage<ServerProps> = (props) => {
    const { initialArticles } = props
    const [articles, setArticles] = useState<Article[]>(initialArticles)
    const [page, setPage] = useState<number>(1)
    const [isLastPage, setIsLastPage] = useState<boolean>(false)
    const { data, isFetching, isPreviousData } = useQuery(
        ['getArticleList', page],
        async (params) => {
            const [key, page] = params.queryKey as [string, number]
            const res = await fetcher.articleList({
                page,
            })
            return res.list
        },
        {
            initialData: page === 1 && initialArticles,
            keepPreviousData: true,
        }
    )

    const onLoadMore = useCallback(() => {
        if (isFetching || isLastPage) return
        setPage((prev) => prev + 1)
    }, [isFetching, isLastPage])

    useEffect(() => {
        if (!data) return
        if (!isPreviousData && data.length < DEFAULT_PAGINATION_COUNT) {
            setIsLastPage(true)
        }
        if (!isPreviousData) {
            setArticles((prev) => {
                if (page === 1) return prev
                return prev.concat(data)
            })
        }
    }, [data, isPreviousData, page])

    return (
        <>
            <Head>
                <meta property="og:title" content="Surf.Log" />
                <meta
                    property="og:description"
                    content="Welcome to ColdSurf blog"
                />
            </Head>
            <ArticleListTemplate
                articles={articles}
                onLoadMore={onLoadMore}
                isLoading={isFetching}
            />
        </>
    )
}

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
    ctx
) => {
    const { list } = await fetcher.articleList({ page: 1 })

    return {
        props: {
            initialArticles: list,
        },
    }
}

export default Home
