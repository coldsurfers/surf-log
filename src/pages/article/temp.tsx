import { NextPage } from 'next'
import useArticles from '../../lib/hooks/useArticles'

interface InitialProps {}

const ArticleTempPage: NextPage<InitialProps> = () => {
    const { data: tempArticles, isLoading } = useArticles({
        isPublic: false,
        initialData: undefined,
    })
    if (isLoading) return null
    return (
        <div>
            {tempArticles.map((article) => (
                <h1 key={article.id}>{article.title}</h1>
            ))}
        </div>
    )
}

export default ArticleTempPage
