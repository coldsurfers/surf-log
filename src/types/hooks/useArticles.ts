import { Article } from '../article'
import { WithInitialDataHooksProps } from './withInitialDataHooksProps'

export interface UseArticlesProps
    extends WithInitialDataHooksProps<Article[] | undefined> {
    category?: string
    tag?: string
}

export interface UseArticlesReturnType {
    data: Article[]
    isLoading: boolean
    loadMore: () => void
}

export type UseArticles = (props: UseArticlesProps) => UseArticlesReturnType
