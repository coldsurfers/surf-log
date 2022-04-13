import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import ArticleListTemplate from '../../components/templates/ArticleListTemplate'
import { DEFAULT_PAGINATION_COUNT } from '../../lib/constants'
import fetcher from '../../lib/fetcher'
import { Article } from '../../types/article'

interface ServerProps {
    initialArticles: Article[]
}

const Category: NextPage<ServerProps> = ({ initialArticles }) => {
    const router = useRouter()
    const { category } = router.query
    const [articles, setArticles] = useState<Article[]>(initialArticles)
    const [page, setPage] = useState<number>(1)
    const [mounted, setMounted] = useState<boolean>(false)
    const [isLastPage, setIsLastPage] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
    }, [])

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
            initialData: !mounted ? initialArticles : [],
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
                if (page === 1) {
                    if (!mounted) {
                        return prev
                    } else {
                        return data
                    }
                }
                return prev.concat(data)
            })
        }
    }, [data, isPreviousData, mounted, page])

    useEffect(() => {
        setPage(1)
        setIsLastPage(false)
    }, [category])

    return (
        <>
            <Head>
                <title>{category} | Surf.Log</title>
                <meta property="og:title" content={`Surf.Log - ${category}`} />
                <meta
                    property="og:description"
                    content={`${category} category of ColdSurf blog`}
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

export const getServerSideProps: GetServerSideProps<
    ServerProps,
    {
        category: string
    }
> = async (ctx) => {
    if (!ctx.params?.category) {
        return {
            props: {
                initialArticles: [],
            },
        }
    }
    const { category } = ctx.params
    const { list } = await fetcher.articleList({ page: 1, category })

    return {
        props: {
            initialArticles: list,
        },
    }
}

export default Category
