import type { GetStaticProps, NextPage } from 'next'
import ArticleListTemplate from '../components/templates/ArticleListTemplate'
import fetcher from '../lib/fetcher'
import { Article } from '../types/article'

interface ServerProps {
    articles: Article[]
}

const Home: NextPage<ServerProps> = (props) => {
    const { articles } = props

    return <ArticleListTemplate articles={articles} />
}

export const getStaticProps: GetStaticProps<ServerProps> = async (ctx) => {
    const { list } = await fetcher.articleList({ page: 1 })

    return {
        props: {
            articles: list,
        },
    }
}

export default Home
