export interface Article {
    content: string
    data: {
        title?: string
        category?: string
        createdAt?: string
        excerpt?: string
    }
    excerpt: string
    isEmpty: boolean
}
