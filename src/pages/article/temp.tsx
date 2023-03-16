import { NextPage } from 'next'
import ArticleListTemplate from '../../components/templates/ArticleListTemplate'
import useArticles from '../../lib/hooks/useArticles'

interface InitialProps {}

const ArticleTempPage: NextPage<InitialProps> = () => {
    const {
        data: tempArticles,
        loadMore,
        isLoading,
    } = useArticles({
        isPublic: false,
        initialData: undefined,
    })
    if (isLoading) return null
    return (
        <ArticleListTemplate
            articles={tempArticles}
            onLoadMore={loadMore}
            isLoading={isLoading}
        />
    )
}

export default ArticleTempPage
