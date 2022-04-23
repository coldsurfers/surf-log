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
    getArticleByExcerpt: function ({ excerpt }: { excerpt: string }) {
        return this.fetch(`${preURL}/article/${encodeURIComponent(excerpt)}`, {
            method: 'GET',
            headers,
        })
    },
    saveArticle: function ({
        excerpt,
        modalValues,
        editorText,
    }: {
        excerpt?: string
        modalValues: EditorSaveModalValues
        editorText: string
    }) {
        return this.fetch(`${preURL}/save`, {
            method: excerpt ? 'PATCH' : 'POST',
            body: JSON.stringify({
                ...modalValues,
                text: editorText,
            }),
            headers,
        })
    },
    removeArticle: function ({ excerpt }: { excerpt: string }) {
        return this.fetch(`${preURL}/article/${excerpt}`, {
            method: 'DELETE',
        })
    },
    temporarySaveArticle: function ({ editorText }: { editorText: string }) {
        return this.fetch(`${preURL}/save/temp`, {
            method: 'POST',
            body: JSON.stringify({
                text: editorText,
            }),
            headers,
        })
    },
    articleList: async function ({
        page,
        category,
    }: {
        page: number
        category?: string
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
        list = list.slice(
            (page - 1) * DEFAULT_PAGINATION_COUNT,
            page * DEFAULT_PAGINATION_COUNT
        )
        return {
            list,
        }
    },
}

export default fetcher
