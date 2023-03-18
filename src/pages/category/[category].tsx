import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ArticleListTemplate from '../../components/templates/ArticleListTemplate'
import { fetchArticleMeta } from '../../lib/fetcher/articleMeta'
import { Article } from '../../lib/fetcher/types'

interface InitialProps {
    initialData: Article[]
}

const Category: NextPage<InitialProps> = ({ initialData }) => {
    const router = useRouter()
    const { category } = router.query
    const data = initialData

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
                onLoadMore={() => {}}
                isLoading={false}
            />
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const data = await fetchArticleMeta()
    if (!data) {
        return {
            paths: [],
            fallback: false,
        }
    }
    const { categories } = data
    return {
        paths: categories.map((category) => `/category/${category}`),
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps<
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
    const data = await fetchArticleMeta()
    if (!data) {
        return {
            props: {
                initialData: [],
            },
        }
    }
    const { articles } = data

    return {
        props: {
            initialData: Object.keys(articles)
                .map((excerpt) => articles[excerpt as keyof typeof articles])
                .filter(
                    (blogArticle) =>
                        blogArticle.blogArticleCategory?.name === category
                ),
        },
    }
}

export default Category
