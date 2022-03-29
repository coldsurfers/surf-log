import type { GetStaticProps, NextPage } from 'next'
import { useEffect } from 'react'
import ArticleListTemplate from '../components/templates/ArticleListTemplate'
import fetcher from '../lib/fetcher'
import { Article } from '../types/article'

interface ServerProps {
    articles: Article[]
    error?: string
}

const Home: NextPage<ServerProps> = (props) => {
    const { articles, error } = props

    useEffect(() => {
        if (error) {
            console.error(error)
        }
    }, [error])

    return <ArticleListTemplate articles={articles} />
}

export const getStaticProps: GetStaticProps<ServerProps> = async (ctx) => {
    const { list, error } = await fetcher.articleList({ page: 1 })
    if (error) {
        return {
            props: {
                error,
                articles: [],
            },
        }
    }

    return {
        props: {
            articles: list,
        },
    }
}

export default Home
