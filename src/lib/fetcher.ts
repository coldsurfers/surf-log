import { Article } from '../types/article'
import { ArticleMeta } from '../types/articleMeta'
import { EditorSaveModalValues } from '../types/modal'
import { DEFAULT_PAGINATION_COUNT } from './constants'

const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
})

const { PAGE_API_PRE_URL: preURL } = process.env

interface GetTempSavedData {
    error: string | null
    tempArticleText: string
}

interface GetArticleByExcerptData {
    data: Article | null
}

interface SaveArticleData {
    error: string | null
}

interface RemoveArticleData {}

interface TemporarySaveArticleData {
    error: string | null
}

export interface FetchSaveFileResponseData {
    destination: string
    encoding: string
    fieldname: string
    filename: string
    mimetype: string
    originalname: string
    path: string
    size: number
}

const fetcher = {
    fetch: (input: RequestInfo, init?: RequestInit | undefined) => {
        return fetch(input, init)
    },
    getTempSaved: async function () {
        const res = await this.fetch(`${preURL}/save/temp`, {
            method: 'GET',
            headers,
        })
        const data = (await res.json()) as GetTempSavedData
        return data
    },
    getArticleByExcerpt: async function ({ excerpt }: { excerpt: string }) {
        const res = await this.fetch(
            `${preURL}/article/${encodeURIComponent(excerpt)}`,
            {
                method: 'GET',
                headers,
            }
        )
        const data = (await res.json()) as GetArticleByExcerptData
        return data
    },
    saveArticle: async function ({
        excerpt,
        modalValues,
        editorText,
        tags,
    }: {
        excerpt?: string
        modalValues: EditorSaveModalValues
        editorText: string
        tags: string[]
    }) {
        const res = await this.fetch(`${preURL}/save`, {
            method: excerpt ? 'PATCH' : 'POST',
            body: JSON.stringify({
                ...modalValues,
                text: editorText,
                tags,
            }),
            headers,
        })
        const data = (await res.json()) as SaveArticleData
        return data
    },
    removeArticle: async function ({ excerpt }: { excerpt: string }) {
        const res = await this.fetch(`${preURL}/article/${excerpt}`, {
            method: 'DELETE',
        })
        const data = (await res.json()) as RemoveArticleData
        return data
    },
    temporarySaveArticle: async function ({
        editorText,
    }: {
        editorText: string
    }) {
        const res = await this.fetch(`${preURL}/save/temp`, {
            method: 'POST',
            body: JSON.stringify({
                text: editorText,
            }),
            headers,
        })
        const data = (await res.json()) as TemporarySaveArticleData
        return data
    },
    articleList: async function ({
        page,
        category,
        tag,
    }: {
        page: number
        category?: string
        tag?: string
    }): Promise<{
        list: Article[]
    }> {
        const { articles } =
            require('../../public/article-meta.json') as ArticleMeta
        let list = Object.entries(articles).map(([key, data]) => data)
        if (category) {
            list = list.filter((data) => {
                return data.data.category === category
            })
        }
        if (tag) {
            list = list.filter((data) => {
                return data.data.tags?.includes(tag)
            })
        }
        list = list.slice(
            (page - 1) * DEFAULT_PAGINATION_COUNT,
            page * DEFAULT_PAGINATION_COUNT
        )
        return {
            list,
        }
    },
    getArticleMeta: function (): { articleMeta: ArticleMeta } {
        const articleMeta =
            require('../../public/article-meta.json') as ArticleMeta
        return {
            articleMeta,
        }
    },
    saveFile: async function ({ file }: { file: File }) {
        const formData = new FormData()
        formData.append('editorFile', file, file.name)
        const res = await fetch('/api/save/file', {
            method: 'POST',
            body: formData,
        })
        const data = (await res.json()) as FetchSaveFileResponseData

        return data
    },
}

export default fetcher
