import { GetServerSideProps, NextPage } from 'next'
import { Article } from '../../types/article'
import styled from '@emotion/styled'
import mediaQuery from '../../lib/mediaQuery'
import MarkdownRenderer from '../../components/templates/MarkdownRenderer'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import Head from 'next/head'
import MenuFloatingButton from '../../components/buttons/MenuFloatIngButton'
import ArticleRemoveModal from '../../components/modal/ArticleRemoveModal'
import fetcher from '../../lib/fetcher'

const ContentContainer = styled.div`
    background: #ffffff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0px -5px 20px 10px rgb(92 95 112 / 8%);
    margin-bottom: ${process.env.NODE_ENV === 'development' ? '100px' : '1rem'};

    ${mediaQuery.small} {
        padding: 1.25rem;
    }
`

const Excerpt: NextPage<{ article?: Article | null }> = (props) => {
    const { article } = props
    const [removeModalOpen, setRemoveModalOpen] = useState<boolean>(false)
    const router = useRouter()
    const onClickEdit = useCallback(() => {
        if (!article) return
        router.push(`/editor?excerpt=${article.excerpt}`)
    }, [article, router])
    const onClickRemove = useCallback(() => {
        setRemoveModalOpen(true)
    }, [])
    const onClickRemoveModalBackground = useCallback(() => {
        setRemoveModalOpen(false)
    }, [])
    const onClickRemoveModalRemove = useCallback(async () => {
        if (!article) return
        const { excerpt } = article.data
        if (!excerpt) return
        await fetcher.removeArticle({
            excerpt,
        })
        router.push('/')
    }, [article, router])
    const menu = useMemo(
        () => [
            {
                title: 'Edit',
                onClick: onClickEdit,
            },
            {
                title: 'Remove',
                onClick: onClickRemove,
            },
        ],
        [onClickEdit, onClickRemove]
    )

    if (!article) {
        return null
    }
    return (
        <>
            <Head>
                <title>{article.data.excerpt} | Surf.Log</title>
                <meta name="description" content={article.data.excerpt} />
                <meta property="og:title" content={article.data.title} />
                <meta
                    property="og:description"
                    content={article.data.excerpt}
                />
            </Head>
            <ContentContainer>
                <MarkdownRenderer text={article.content} />
                {process.env.NODE_ENV === 'development' && (
                    <MenuFloatingButton menu={menu}>Menu</MenuFloatingButton>
                )}
            </ContentContainer>
            <ArticleRemoveModal
                open={removeModalOpen}
                onClickBackground={onClickRemoveModalBackground}
                onClickRemove={onClickRemoveModalRemove}
            />
        </>
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
