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
import useArticle from '../../lib/hooks/useArticle'
import Error from 'next/error'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import TagBadge from '../../components/badges/TagBadge'
import Link from 'next/link'

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

const ArticleMetaInfoWrapper = styled.div`
    text-align: right;
`

const CategoryText = styled.p`
    font-weight: bold;
    font-size: 20px;
    margin: 0px;
`

const CreatedDateText = styled.p`
    margin: 0px;
    margin-top: 4px;
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
    const router = useRouter()
    const { article } = useArticle({ initialData })
    const [removeModalOpen, setRemoveModalOpen] = useState<boolean>(false)

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

    if (typeof article === 'undefined') {
        return <Error statusCode={404} />
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
                <ArticleMetaInfoWrapper>
                    {article.data.category && (
                        <CategoryText>
                            {article.data.category.toUpperCase()}
                        </CategoryText>
                    )}
                    {article.data.createdAt && (
                        <CreatedDateText>
                            {format(
                                new Date(article.data.createdAt),
                                'yyyy-MM-dd HH:mm',
                                {
                                    locale: ko,
                                }
                            )}
                        </CreatedDateText>
                    )}
                    {article.data.tags && (
                        <TagsWrapper>
                            {article.data.tags.map((tag, index) => {
                                return (
                                    <Link
                                        key={`${tag}-${index}`}
                                        href={`/tags/${tag}`}
                                        passHref
                                    >
                                        <TagBadge>{tag}</TagBadge>
                                    </Link>
                                )
                            })}
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

export const getServerSideProps: GetServerSideProps<
    InitialProps,
    {
        excerpt: string
    }
> = async (ctx) => {
    if (!ctx.params) {
        return {
            props: {
                initialData: undefined,
            },
        }
    }
    const { excerpt } = ctx.params
    const { articleMeta } = fetcher.getArticleMeta()
    const article = articleMeta.articles[encodeURIComponent(excerpt)]
    return {
        props: {
            initialData: article,
        },
    }
}

export default Excerpt
