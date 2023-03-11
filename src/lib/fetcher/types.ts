export interface Category {
    id: number
    name: string
    createdAt: string
}

export interface Article {
    id: number
    title: string
    content: string
    thumbnail: string
    excerpt: string
    blogArticleCategoryId: number
    blogArticleCategory: {
        name: string
    }
    blogArticleTags: {
        blogArticleTag: {
            name: string
        }
    }[]
    createdAt: string
}
