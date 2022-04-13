export type EditorSaveModalValues = {
    title: string
    excerpt: string
    thumbnail: string
    category: string
    createdAt?: string
}

export interface BaseModalProps {
    open: boolean
    onClickBackground?: () => void
}
