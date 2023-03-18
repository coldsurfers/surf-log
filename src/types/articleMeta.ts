import { Article } from '../lib/fetcher/types'

export interface ArticleMeta {
    articles: {
        [key: string]: Article
    }
    categories: string[]
    tags: string[]
}
