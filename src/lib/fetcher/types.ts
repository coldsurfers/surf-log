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
    blogArticleCategory?: {
        name: string
    }
    blogArticleTags?: {
        blogArticleTag: {
            name: string
        }
    }[]
    isPublic: boolean
    createdAt: string
}

export interface Tag {
    id: number
    name: string
    createdAt: string
}

export interface PresignURLResponse {
    url: string
    fields: {
        acl: string
        'Content-Type': string
        bucket: string
        'X-Amz-Algorithm': string
        'X-Amz-Credential': string
        'X-Amz-Date': string
        key: string
        Policy: string
        'X-Amz-Signature': string
    }
}

export interface SaveArticleBody {
    title: string
    excerpt: string
    thumbnail: string
    category: string
    editorText: string
    tags: string[]
    isPublic: boolean
}
