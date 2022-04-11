import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import ArticleListTemplate from '../../components/templates/ArticleListTemplate'
import fetcher from '../../lib/fetcher'
import { Article } from '../../types/article'

interface ServerProps {
    articles: Article[]
    error?: string
    category: string
}

const Category: NextPage<ServerProps> = (props) => {
    const { articles, error, category } = props
    useEffect(() => {
        if (error) {
            console.error(error)
        }
    }, [error])
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
            <ArticleListTemplate articles={articles} />
        </>
    )
}

export const getServerSideProps: GetServerSideProps<
    ServerProps,
    {
        category: string
    }
> = async (ctx) => {
    if (!ctx.params) {
        return {
            props: {
                articles: [],
                category: '',
            },
        }
    }
    const { category } = ctx.params
    const { list } = await fetcher.articleList({ page: 1, category })

    return {
        props: {
            articles: list,
            category,
        },
    }
}

export default Category
