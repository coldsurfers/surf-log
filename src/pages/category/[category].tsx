import { GetServerSideProps, NextPage } from 'next'
import { useEffect } from 'react'
import ArticleListTemplate from '../../components/templates/ArticleListTemplate'
import fetcher from '../../lib/fetcher'
import { Article } from '../../types/article'

interface ServerProps {
    articles: Article[]
    error?: string
}

const Category: NextPage<ServerProps> = (props) => {
    const { articles, error } = props
    useEffect(() => {
        if (error) {
            console.error(error)
        }
    }, [error])
    return <ArticleListTemplate articles={articles} />
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
            },
        }
    }
    const { category } = ctx.params
    const { list } = await fetcher.articleList({ page: 1, category })

    return {
        props: {
            articles: list,
        },
    }
}

export default Category
