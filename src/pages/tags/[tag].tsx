import { themeVariables } from '@coldsurfers/ocean-road'
import styled from '@emotion/styled'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import ArticleListTemplate from '../../components/templates/ArticleListTemplate'
import { fetchArticleMeta } from '../../lib/fetcher/articleMeta'
import { Article } from '../../lib/fetcher/types'

const TagTitle = styled.h1`
    margin: 0px;
    margin-bottom: 10px;
    margin-left: 14px;
    color: ${themeVariables['color-foreground-1']};
`

interface InitialProps {
    initialData: Article[]
}

const TagsTagPage: NextPage<InitialProps> = ({ initialData }) => {
    const router = useRouter()
    const { tag } = router.query
    const data = initialData
    return (
        <>
            <TagTitle>#{tag}</TagTitle>
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
    const { tags } = data

    return {
        paths: tags.map((tag) => `/tags/${tag}`),
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps<
    InitialProps,
    { tag: string }
> = async (ctx) => {
    if (!ctx.params?.tag) {
        return {
            props: {
                initialData: [],
            },
        }
    }
    const { tag } = ctx.params
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
                .filter((article) =>
                    article.blogArticleTags?.some(
                        (blogArticleTag) =>
                            blogArticleTag.blogArticleTag.name === tag
                    )
                ),
        },
    }
}

export default TagsTagPage
