import { Article } from '../types/article'
import { EditorSaveModalValues } from '../types/modal'
import { LOCAL_API_HEADERS, LOCAL_API_HOST } from './constants'

const fetcher = {
    fetch: (input: RequestInfo, init?: RequestInit | undefined) => {
        return fetch(input, init)
    },
    getTempSaved: function () {
        return this.fetch(`${LOCAL_API_HOST}/save/temp`, {
            method: 'GET',
            headers: LOCAL_API_HEADERS,
        })
    },
    getArticleByExcerpt: function ({
        encodedExcerpt,
    }: {
        encodedExcerpt: string
    }) {
        return this.fetch(`${LOCAL_API_HOST}/article/${encodedExcerpt}`, {
            method: 'GET',
            headers: LOCAL_API_HEADERS,
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
        return this.fetch(`${LOCAL_API_HOST}/save`, {
            method: excerpt ? 'PATCH' : 'POST',
            body: JSON.stringify({
                ...modalValues,
                text: editorText,
            }),
            headers: LOCAL_API_HEADERS,
        })
    },
    temporarySaveArticle: function ({ editorText }: { editorText: string }) {
        return this.fetch(`${LOCAL_API_HOST}/save/temp`, {
            method: 'POST',
            body: JSON.stringify({
                text: editorText,
            }),
            headers: LOCAL_API_HEADERS,
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
        error?: string
    }> {
        let url = `${LOCAL_API_HOST}/article/list?page=${page}`
        if (category) {
            url += `&category=${category}`
        }
        const res = await this.fetch(url, {
            method: 'GET',
            headers: LOCAL_API_HEADERS,
        })

        return await res.json()
    },
}

export default fetcher
