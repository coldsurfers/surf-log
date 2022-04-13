import styled from '@emotion/styled'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import mediaQuery from '../../lib/mediaQuery'
import { Article } from '../../types/article'
import { themedPalette } from '../../lib/theme'
import { DEFAULT_PAGINATION_COUNT } from '../../lib/constants'
import { RotatingLines } from 'react-loader-spinner'
import { css } from '@emotion/css'

const ArticleListContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: -1rem;

    ${mediaQuery.small} {
        flex-direction: column;
        justify-content: unset;
    }
`

const ArticleContainer = styled.a`
    width: calc(100% / 3 - 1rem * 2);
    margin: 1rem;
    height: 280px;
    border-radius: 12px;
    background-color: ${themedPalette['article-container-background']};
    box-shadow: 10px 20px 20px 0 rgb(92 95 112 / 8%);

    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-7px);
        transition: all 0.15s;
    }

    ${mediaQuery.small} {
        width: calc(100% - 1rem * 2);
        margin-left: 1rem;
        margin-right: 1rem;
        margin-bottom: 0px;
    }
`

const ThumbnailWrapper = styled.div`
    width: 100%;
    min-height: 120px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    overflow: hidden;
    position: relative;

    background-color: #dee2e6;
`

const ArticleDescWarpper = styled.div`
    padding: 13px;
`

const ArticleTitle = styled.h1`
    font-size: 17px;
    font-weight: 600;
    line-height: 1.4;
    margin-block-start: 0px;
    margin-block-end: 0px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-wrap: break-word;
    word-break: keep-all;

    color: ${themedPalette['article-title-text-color']};
`

const ArticleSubTitle = styled.p`
    color: ${themedPalette['article-subtitle-text-color']};
    display: block;
    font-size: 13.5px;
    font-weight: 400;
    line-height: 1.6;
    transition: all 0.15s;
    word-break: break-word;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-wrap: break-word;
    word-break: keep-all;

    margin-block-start: 8px;
    margin-block-end: 0px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
`

const ArticleDate = styled.div`
    border-top: 1px solid ${themedPalette['article-date-border-top-color']};
    color: ${themedPalette['article-subtitle-text-color']};
    font-size: 12px;
    font-weight: 400;
    line-height: 25px;
    height: 25px;
    text-align: right;
    margin-top: auto;
    padding-right: 1rem;
`

interface Props {
    articles: Article[]
    onLoadMore?: () => void
    isLoading?: boolean
}

const ArticleListTemplate: FC<Props> = ({
    articles,
    onLoadMore,
    isLoading,
}) => {
    const loadingIndicatorElementRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        let observer: IntersectionObserver
        observer = new IntersectionObserver(
            (
                entries: IntersectionObserverEntry[],
                observer: IntersectionObserver
            ) => {
                const [entry] = entries
                if (
                    !entry.isIntersecting ||
                    articles.length < DEFAULT_PAGINATION_COUNT
                ) {
                    return
                }
                onLoadMore && onLoadMore()
                observer.unobserve(
                    loadingIndicatorElementRef.current as Element
                )
            },
            {
                threshold: 0.5,
            }
        )

        if (loadingIndicatorElementRef.current) {
            observer.observe(loadingIndicatorElementRef.current as Element)
        }

        return () => {
            if (observer) {
                observer.disconnect()
            }
        }
    }, [articles.length, onLoadMore])

    return (
        <ArticleListContainer>
            {articles.map((article) => {
                return (
                    <Link
                        key={article.excerpt}
                        href={`/article/${article.excerpt}`}
                        passHref
                    >
                        <ArticleContainer>
                            <ThumbnailWrapper>
                                {article.thumbnailBase64 ? (
                                    <Image
                                        src={`${article.thumbnailBase64}`}
                                        alt="thumbnail"
                                        layout="fill"
                                        objectFit="fill"
                                    />
                                ) : (
                                    <div />
                                )}
                            </ThumbnailWrapper>
                            <ArticleDescWarpper>
                                <ArticleTitle>
                                    {article.data.title}
                                </ArticleTitle>
                                <ArticleSubTitle>
                                    {article.data.excerpt}
                                </ArticleSubTitle>
                            </ArticleDescWarpper>
                            {article.data.createdAt && (
                                <ArticleDate>
                                    {format(
                                        new Date(article.data.createdAt),
                                        'yyyy-MM-dd HH:mm',
                                        {
                                            locale: ko,
                                        }
                                    )}
                                </ArticleDate>
                            )}
                        </ArticleContainer>
                    </Link>
                )
            })}
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    margin-top: 10px;
                    margin-bottom: 10px;
                `}
                ref={loadingIndicatorElementRef}
            >
                {isLoading && <RotatingLines width="100" />}
            </div>
        </ArticleListContainer>
    )
}

export default ArticleListTemplate
