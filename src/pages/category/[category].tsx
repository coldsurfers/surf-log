import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ArticleListTemplate from '../../components/templates/ArticleListTemplate'
import fetchArticleList from '../../lib/fetcher/articleList'
import { Article } from '../../lib/fetcher/types'
import useArticles from '../../lib/hooks/useArticles'

interface InitialProps {
    initialData: Article[]
}

const Category: NextPage<InitialProps> = ({ initialData }) => {
    const router = useRouter()
    const { category } = router.query
    const { data, isLoading, loadMore } = useArticles({
        category: category as string | undefined,
        initialData,
    })

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
                articles={data}
                onLoadMore={loadMore}
                isLoading={isLoading}
            />
        </>
    )
}

export const getServerSideProps: GetServerSideProps<
    InitialProps,
    {
        category: string
    }
> = async (ctx) => {
    if (!ctx.params?.category) {
        return {
            props: {
                initialData: [],
            },
        }
    }
    const { category } = ctx.params
    const articleList = await fetchArticleList({ page: 1, category })

    return {
        props: {
            initialData: articleList,
        },
    }
}

export default Category
