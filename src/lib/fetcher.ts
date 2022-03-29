import { Article } from '../types/article'
import { EditorSaveModalValues } from '../types/modal'

const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
})

const { PAGE_API_PRE_URL: preURL } = process.env

const fetcher = {
    fetch: (input: RequestInfo, init?: RequestInit | undefined) => {
        return fetch(input, init)
    },
    getTempSaved: function () {
        return this.fetch(`${preURL}/save/temp`, {
            method: 'GET',
            headers,
        })
    },
    getArticleByExcerpt: function ({
        encodedExcerpt,
    }: {
        encodedExcerpt: string
    }) {
        return this.fetch(`${preURL}/article/${encodedExcerpt}`, {
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
        error?: string
    }> {
        let url = `${preURL}/article/list?page=${page}`
        if (category) {
            url += `&category=${category}`
        }
        const res = await this.fetch(url, {
            method: 'GET',
            headers,
        })

        return await res.json()
    },
}

export default fetcher
