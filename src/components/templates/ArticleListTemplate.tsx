import styled from '@emotion/styled'
import { FC, memo, useEffect, useRef } from 'react'
import mediaQuery from '../../lib/mediaQuery'
import { Article } from '../../types/article'
import { DEFAULT_PAGINATION_COUNT } from '../../lib/constants'
import { RotatingLines } from 'react-loader-spinner'
import { css } from '@emotion/css'
import ArticleItem from '../items/ArticleItem'

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
                return <ArticleItem key={article.excerpt} article={article} />
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

export default memo(ArticleListTemplate)
