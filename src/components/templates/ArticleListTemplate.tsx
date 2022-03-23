import styled from '@emotion/styled'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import mediaQuery from '../../lib/mediaQuery'
import { Article } from '../../types/article'

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
    background-color: var(--article-container-background);
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
`

const ArticleSubTitle = styled.p`
    color: #7a7c85;
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
    border-top: 1px solid #eff0f5;
    color: #7a7c85;
    font-size: 12px;
    font-weight: 400;
    line-height: 25px;
    height: 25px;
    text-align: right;
    margin-top: auto;
    padding-right: 1rem;
`

const ArticleListTemplate: FC<{ articles: Article[] }> = ({ articles }) => {
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
                                        src={`data:image/png;base64, ${article.thumbnailBase64}`}
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
        </ArticleListContainer>
    )
}

export default ArticleListTemplate
