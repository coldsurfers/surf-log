import styled from '@emotion/styled'
import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Article } from '../types/article'

const ArticleListContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
`

const ArticleContainer = styled.a`
    width: calc(100% / 3 - 2vw * 2);
    max-height: 250px;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 10px 20px 20px 0 rgb(92 95 112 / 8%);
    margin-top: 2vw;

    margin-left: 2vw;
    &:nth-child(3n + 1) {
        margin-left: none;
    }

    &:hover {
        transform: translateY(-7px);
        transition: all 0.15s;
    }
`

const ThumbnailWrapper = styled.div`
    width: 100%;
    height: 120px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    overflow: hidden;
    position: relative;

    background-color: #dee2e6;
`

const ArticleInner = styled.div`
    padding: 13px;
    height: 120px;
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
    -webkit-line-clamp: 3;
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

interface ServerProps {
    articles: Article[]
}

const Home: NextPage<ServerProps> = (props) => {
    const { articles } = props

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
                            <ArticleInner>
                                <ArticleTitle>
                                    {article.data.title}
                                </ArticleTitle>
                                <ArticleSubTitle>
                                    {article.data.excerpt}
                                </ArticleSubTitle>
                            </ArticleInner>
                        </ArticleContainer>
                    </Link>
                )
            })}
        </ArticleListContainer>
    )
}

export const getStaticProps: GetStaticProps<ServerProps> = async (ctx) => {
    const articleMeta = (await import('../../public/article-meta.json')) as {
        articles: {
            [key: string]: Article
        }
        categories: string[]
    }
    return {
        props: {
            articles: Object.entries(articleMeta.articles).map(
                ([key, content]) => content
            ),
        },
    }
}

export default Home
