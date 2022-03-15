import styled from '@emotion/styled'
import type { GetStaticProps, NextPage } from 'next'
import ArticleListTemplate from '../components/ArticleListTemplate'
import { Article } from '../types/article'

interface ServerProps {
    articles: Article[]
}

const Home: NextPage<ServerProps> = (props) => {
    const { articles } = props

    return <ArticleListTemplate articles={articles} />
}

export const getStaticProps: GetStaticProps<ServerProps> = async (ctx) => {
    const articleMeta = (await import('../../public/article-meta.json')) as {
        articles: {
            [key: string]: Article
        }
        categories: string[]
    }
    return {
        props: {
            articles: Object.entries(articleMeta.articles).map(
                ([key, content]) => content
            ),
        },
    }
}

export default Home
