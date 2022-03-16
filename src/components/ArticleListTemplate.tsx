import styled from '@emotion/styled'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import mediaQuery from '../lib/mediaQuery'
import { Article } from '../types/article'

const ArticleListContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;

    ${mediaQuery.medium} {
        justify-content: space-between;
    }
    ${mediaQuery.small} {
        flex-direction: column;
        justify-content: unset;
    }
`

const ArticleContainer = styled.a`
    width: calc(100% / 3 - 2vw * 2);
    height: 280px;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 10px 20px 20px 0 rgb(92 95 112 / 8%);
    margin-top: 2vw;

    display: flex;
    flex-direction: column;

    margin-left: 2vw;
    &:nth-child(3n + 1) {
        margin-left: none;
    }

    &:hover {
        transform: translateY(-7px);
        transition: all 0.15s;
    }

    ${mediaQuery.medium} {
        width: calc(100% / 3 - 1vw);
        margin-left: unset;
        &:nth-child(3n + 1) {
            margin-left: unset;
        }
    }

    ${mediaQuery.small} {
        width: 100%;
        margin-top: 3vw;
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
                            <ArticleDate>{article.data.createdAt}</ArticleDate>
                        </ArticleContainer>
                    </Link>
                )
            })}
        </ArticleListContainer>
    )
}

export default ArticleListTemplate
