import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import styled from '@emotion/styled'
import mediaQuery from '../../lib/mediaQuery'
import MarkdownRenderer from '../../components/templates/MarkdownRenderer'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import Head from 'next/head'
import MenuFloatingButton from '../../components/buttons/MenuFloatIngButton'
import ArticleRemoveModal from '../../components/modal/ArticleRemoveModal'
import Error from 'next/error'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import TagBadge from '../../components/badges/TagBadge'
import Link from 'next/link'
import useRemoveArticle from '../../lib/hooks/useRemoveArticle'
import { Article } from '../../lib/fetcher/types'
import { fetchArticleMeta } from '../../lib/fetcher/articleMeta'
import { themedPalette } from '../../lib/theme'

const ContentContainer = styled.div`
    background: ${themedPalette['markdown-background']};
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0px -5px 20px 10px rgb(92 95 112 / 8%);
    margin-bottom: ${process.env.NODE_ENV === 'development' ? '100px' : '1rem'};

    ${mediaQuery.small} {
        padding: 1.25rem;
    }
`

const ArticleMetaInfoWrapper = styled.div`
    text-align: right;
`

const CategoryText = styled.p`
    font-weight: bold;
    font-size: 20px;
    margin: 0px;
    color: ${themedPalette['markdown-text-color']};
`

const CreatedDateText = styled.p`
    margin: 0px;
    margin-top: 4px;
    color: ${themedPalette['markdown-text-color']};
`

const TagsWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
`

interface InitialProps {
    initialData?: Article
}

const Excerpt: NextPage<InitialProps> = ({ initialData }) => {
    const article = initialData
    const router = useRouter()
    const [removeModalOpen, setRemoveModalOpen] = useState<boolean>(false)
    const { mutateAsync: removeArticleByExcerpt } = useRemoveArticle()

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
        const { excerpt } = article
        if (!excerpt) return
        await removeArticleByExcerpt({ excerpt })
        router.push('/')
    }, [article, removeArticleByExcerpt, router])

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

    if (typeof article === 'undefined') {
        return <Error statusCode={404} />
    }

    return (
        <>
            <Head>
                <title>{article.excerpt} | Surf.Log</title>
                <meta name="description" content={article.excerpt} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt} />
            </Head>
            <ContentContainer>
                <ArticleMetaInfoWrapper>
                    {article.blogArticleCategory?.name && (
                        <CategoryText>
                            {article.blogArticleCategory.name.toUpperCase()}
                        </CategoryText>
                    )}
                    {article.createdAt && (
                        <CreatedDateText>
                            {format(
                                new Date(article.createdAt),
                                'yyyy-MM-dd HH:mm',
                                {
                                    locale: ko,
                                }
                            )}
                        </CreatedDateText>
                    )}
                    {article.blogArticleTags && (
                        <TagsWrapper>
                            {article.blogArticleTags.map(
                                ({ blogArticleTag }, index) => {
                                    return (
                                        <Link
                                            key={`${blogArticleTag.name}-${index}`}
                                            href={`/tags/${blogArticleTag.name}`}
                                            passHref
                                        >
                                            <TagBadge>
                                                #{blogArticleTag.name}
                                            </TagBadge>
                                        </Link>
                                    )
                                }
                            )}
                        </TagsWrapper>
                    )}
                </ArticleMetaInfoWrapper>
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

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const data = await fetchArticleMeta()
    if (!data) {
        return {
            paths: [],
            fallback: false,
        }
    }
    const { articles } = data
    return {
        paths: Object.keys(articles).map(
            (excerpt) => `/article/${encodeURIComponent(excerpt)}`
        ),
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps<
    InitialProps,
    { excerpt: string }
> = async (ctx) => {
    if (!ctx.params)
        return {
            props: {
                initialData: undefined,
            },
        }
    const { excerpt } = ctx.params

    const data = await fetchArticleMeta()
    if (!data) {
        return {
            props: {
                initialData: undefined,
            },
        }
    }
    const { articles } = data
    return {
        props: {
            initialData: articles[excerpt as keyof typeof articles],
        },
    }
}

export default Excerpt
