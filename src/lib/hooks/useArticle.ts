import { useQuery } from 'react-query'
import { UseArticle } from '../../types/hooks/useArticle'
import { fetchArticleByExcerpt } from '../fetcher/articleByExcerpt'
import { Article } from '../fetcher/types'

const useArticle: UseArticle = ({ initialData, excerpt }) => {
    const { data, isFetching } = useQuery<Article | undefined>(
        ['getArticle', excerpt],
        async () => {
            if (!excerpt) return undefined
            const article = await fetchArticleByExcerpt(excerpt)
            return article ?? undefined
        },
        {
            initialData,
        }
    )

    return {
        article: data,
        isFetching,
    }
}

export default useArticle
