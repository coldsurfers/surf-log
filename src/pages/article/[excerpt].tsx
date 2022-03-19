import { GetServerSideProps, NextPage } from 'next'
import { Article } from '../../types/article'
import styled from '@emotion/styled'
import mediaQuery from '../../lib/mediaQuery'
import MarkdownRenderer from '../../components/templates/MarkdownRenderer'

const ContentContainer = styled.div`
    background: #ffffff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0px -5px 20px 10px rgb(92 95 112 / 8%);
    margin-bottom: 1rem;

    ${mediaQuery.small} {
        padding: 1.25rem;
    }
`

const Excerpt: NextPage<{ article?: Article | null }> = (props) => {
    const { article } = props

    if (!article) {
        return null
    }
    return (
        <ContentContainer>
            <MarkdownRenderer text={article.content} />
        </ContentContainer>
    )
}

export const getServerSideProps: GetServerSideProps<
    {
        article: Article | null
    },
    {
        excerpt: string
    }
> = async (ctx) => {
    if (!ctx.params) {
        return {
            props: {
                article: null,
            },
        }
    }
    const { excerpt } = ctx.params
    const articleMeta = (await import('../../../public/article-meta.json')) as {
        articles: {
            [key: string]: Article
        }
    }
    const article = articleMeta.articles[encodeURIComponent(excerpt)]
    return {
        props: {
            article,
        },
    }
}

export default Excerpt
