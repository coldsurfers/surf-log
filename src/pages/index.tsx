import type { GetServerSideProps, NextPage } from 'next'
import ArticleListTemplate from '../components/templates/ArticleListTemplate'
import fetcher from '../lib/fetcher'
import { Article } from '../types/article'
import Head from 'next/head'
import useArticles from '../lib/hooks/useArticles'

interface InitialProps {
    initialData: Article[]
}

const Home: NextPage<InitialProps> = ({ initialData }) => {
    const { articles, loadMore, isFetching } = useArticles({
        initialData,
    })

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
                onLoadMore={loadMore}
                isLoading={isFetching}
            />
        </>
    )
}

export const getServerSideProps: GetServerSideProps<InitialProps> = async (
    ctx
) => {
    const { list } = await fetcher.articleList({ page: 1 })

    return {
        props: {
            initialData: list,
        },
    }
}

export default Home
