import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ArticleListTemplate from '../../components/templates/ArticleListTemplate'
import fetcher from '../../lib/fetcher'
import useArticles from '../../lib/hooks/useArticles'
import { Article } from '../../types/article'

interface InitialProps {
    initialData: Article[]
}

const Category: NextPage<InitialProps> = ({ initialData }) => {
    const router = useRouter()
    const { category } = router.query
    const { articles, isFetching, loadMore } = useArticles({
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
                articles={articles}
                onLoadMore={loadMore}
                isLoading={isFetching}
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
    const { list } = await fetcher.articleList({ page: 1, category })

    return {
        props: {
            initialData: list,
        },
    }
}

export default Category
