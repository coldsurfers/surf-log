import { useMutation } from 'react-query'
import { removeArticleByExcerpt } from '../fetcher/articleByExcerpt'
import { Article } from '../fetcher/types'

export default function useRemoveArticle() {
    return useMutation<void, unknown, { excerpt: string }>(
        async ({ excerpt }) => {
            await removeArticleByExcerpt(excerpt)
        }
    )
}
