import { Article } from '../article'
import { WithInitialDataHooksProps } from './withInitialDataHooksProps'

export interface UseArticleProps
    extends WithInitialDataHooksProps<Article | undefined> {
    excerpt?: string
}

export interface UseArticleReturnType {
    article?: Article
    isFetching: boolean
}

export type UseArticle = (props: UseArticleProps) => UseArticleReturnType
