import styled from '@emotion/styled'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { Article } from '../types/article'

const ArticleListContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`

const ArticleContainer = styled.a`
    width: calc(100% / 3 - 2vw * 2);
    height: 150px;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 10px 20px 20px 0 rgb(92 95 112 / 8%);
    margin-top: 2vw;

    margin-left: 2vw;
    &:nth-child(3n + 1) {
        margin-left: none;
    }
`

const ArticleInner = styled.div`
    padding: 20px;
`

const ArticleTitle = styled.h1`
    font-size: 17px;
    font-weight: 600;
    line-height: 1.4;
    margin-block-start: 0px;
    margin-block-end: 0px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    height: 30px;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

const ArticleSubTitle = styled.p`
    width: 100%;
    height: 60px;
    text-overflow: ellipsis;
    overflow: hidden;

    color: #7a7c85;
    display: block;
    font-size: 13.5px;
    font-weight: 400;
    line-height: 1.6;
    transition: all 0.15s;
    word-break: break-word;
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
