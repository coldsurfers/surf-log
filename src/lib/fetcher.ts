import { EditorSaveModalValues } from '../types/modal'

const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
})

const { PAGE_API_PRE_URL: preURL } = process.env

interface GetTempSavedData {
    error: string | null
    tempArticleText: string
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
}

export default fetcher
