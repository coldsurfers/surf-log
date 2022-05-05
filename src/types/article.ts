export interface Article {
    content: string
    data: ArticleData
    excerpt: string
    isEmpty: boolean
    thumbnailBase64?: string
}

export interface ArticleData {
    title?: string
    category?: string
    createdAt?: string
    excerpt?: string
    thumbnail?: string | null
    tags?: string[]
}
