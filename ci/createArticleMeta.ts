import { Article, Category, Tag } from '../src/lib/fetcher/types'
import fs from 'fs'
import path from 'path'
import { ArticleMeta } from '../src/types/articleMeta'
import axios from 'axios'

const { CI_KEY, SERVER_HOST } = process.env

const axiosClient = axios.create({
    baseURL: SERVER_HOST,
    withCredentials: true,
    headers: {
        'ci-key': CI_KEY,
    },
})

async function main() {
    const [{ data: articles }, { data: categories }, { data: tags }] =
        await Promise.all([
            axiosClient.get<Article[]>('/ci/articles'),
            axiosClient.get<Category[]>('/ci/categories'),
            axiosClient.get<Tag[]>('/ci/tags'),
        ])

    const articleMetaJSONLocation = path.resolve(
        __dirname,
        '../public/article-meta.json'
    )
    const articleMeta: ArticleMeta = {
        articles: {},
        categories: [...new Set(categories.map((item) => item.name))],
        tags: tags.map((item) => item.name),
    }

    articles.forEach((item) => {
        const key = item.excerpt
        articleMeta.articles[key] = item
    })

    fs.writeFileSync(articleMetaJSONLocation, JSON.stringify(articleMeta))
}

main()
