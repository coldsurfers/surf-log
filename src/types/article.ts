export interface Article {
    content: string
    data: {
        title?: string
        category?: string
        createdAt?: string
        excerpt?: string
        thumbnail?: string
    }
    excerpt: string
    isEmpty: boolean
    thumbnailBase64?: string
}
