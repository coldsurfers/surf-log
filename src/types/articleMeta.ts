import { Article } from './article'

export interface ArticleMeta {
    articles: {
        [key: string]: Article
    }
    categories: string[]
}
