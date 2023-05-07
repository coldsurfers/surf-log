import styled from '@emotion/styled'
import Link from 'next/link'
import { FC, memo, Profiler } from 'react'
import mediaQuery from '../../lib/mediaQuery'
import { themedPalette } from '../../lib/theme'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Article } from '../../lib/fetcher/types'
import Image from 'next/image'
import { themeVariables } from '@coldsurfers/ocean-road'

const ArticleContainer = styled(Link)`
    width: calc((100% / 3) - 1rem * 2);
    margin: 1rem;
    height: 280px;
    border-radius: 12px;
    background-color: ${themeVariables['color-background-3']};
    box-shadow: 10px 20px 20px 0 rgb(92 95 112 / 8%);

    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-7px);
        transition: all 0.15s;
    }

    ${mediaQuery.medium} {
        margin: 0.5rem;
        width: calc((100% / 3) - 0.5rem * 2);
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
    article: Article
}

const ArticleItem: FC<Props> = ({ article }) => {
    return (
        <Profiler
            id="ArticleItem"
            onRender={(...props) => {
                console.log(...props)
            }}
        >
            <ArticleContainer href={`/article/${article.excerpt}`} passHref>
                <ThumbnailWrapper>
                    {article.thumbnail ? (
                        <Image
                            src={`${process.env.HOST_URL}/thumbnails/${article.thumbnail}`}
                            alt="thumbnail"
                            fill
                            style={{
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <div />
                    )}
                </ThumbnailWrapper>
                <ArticleDescWarpper>
                    <ArticleTitle>{article.title}</ArticleTitle>
                    <ArticleSubTitle>{article.excerpt}</ArticleSubTitle>
                </ArticleDescWarpper>
                {article.createdAt && (
                    <ArticleDate>
                        {format(
                            new Date(article.createdAt),
                            'yyyy-MM-dd HH:mm',
                            {
                                locale: ko,
                            }
                        )}
                    </ArticleDate>
                )}
            </ArticleContainer>
        </Profiler>
    )
}

export default memo(ArticleItem)
