import styled from '@emotion/styled'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import ArticleListTemplate from '../../components/templates/ArticleListTemplate'
import fetchArticleList from '../../lib/fetcher/articleList'
import { Article } from '../../lib/fetcher/types'
import useArticles from '../../lib/hooks/useArticles'
import { themedPalette } from '../../lib/theme'

const TagTitle = styled.h1`
    margin: 0px;
    margin-bottom: 10px;
    margin-left: 14px;
    color: ${themedPalette['tag-page-title-text-color']};
`

interface InitialProps {
    initialData: Article[]
}

const TagsTagPage: NextPage<InitialProps> = ({ initialData }) => {
    const router = useRouter()
    const { tag } = router.query
    const { data, loadMore, isLoading } = useArticles({
        tag: tag as string | undefined,
        initialData,
    })
    return (
        <>
            <TagTitle>#{tag}</TagTitle>
            <ArticleListTemplate
                articles={data}
                onLoadMore={loadMore}
                isLoading={isLoading}
            />
        </>
    )
}

export const getServerSideProps: GetServerSideProps<InitialProps> = async (
    ctx
) => {
    if (!ctx.params?.tag) {
        return {
            props: {
                initialData: [],
            },
        }
    }
    const { tag } = ctx.params
    const articleList = await fetchArticleList({ page: 1, tag: tag as string })

    return {
        props: {
            initialData: articleList,
        },
    }
}

export default TagsTagPage
