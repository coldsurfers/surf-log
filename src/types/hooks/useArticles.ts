import { Article } from '../../lib/fetcher/types'
import { WithInitialDataHooksProps } from './withInitialDataHooksProps'

export interface UseArticlesProps
    extends WithInitialDataHooksProps<Article[] | undefined> {
    category?: string
    tag?: string
    isPublic?: boolean
}

export interface UseArticlesReturnType {
    data: Article[]
    isLoading: boolean
    loadMore: () => void
}

export type UseArticles = (props: UseArticlesProps) => UseArticlesReturnType
