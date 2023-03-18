import fs from 'fs'
import path from 'path'
import * as dateFns from 'date-fns'

const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml')

const sitemapXmlStringPre = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
const sitemapXmlStringPost = `</urlset>`
const urlHost = 'https://blog.coldsurf.io'

async function generateSitemap() {
    const exist = fs.existsSync(sitemapPath)
    if (exist) {
        fs.rmSync(sitemapPath)
    }

    let sitemapString = ``
    sitemapString += sitemapXmlStringPre

    // root route
    const routes: {
        pathname: string
        lastmod?: string
    }[] = [
        {
            pathname: '/',
        },
        {
            pathname: '/about',
        },
    ]
    const articleMeta = (await import('../public/article-meta.json')).default
    const { articles } = articleMeta
    const categories = [
        ...new Set(
            Object.entries(articles).map(
                ([key, data]) => data.blogArticleCategory.name
            )
        ),
    ].sort()
    const tags = [
        ...new Set(
            Object.entries(articles).flatMap(([key, data]) =>
                data.blogArticleTags.map((tag) => tag.blogArticleTag.name)
            )
        ),
    ].filter((tag) => tag !== undefined)

    // category route
    categories.forEach((category) => {
        routes.push({
            pathname: `/category/${category}`,
        })
    })
    const articlesArray = Object.entries(articles).map(([key, data]) => {
        return data
    })
    // tag route
    tags.forEach((tag) => {
        if (tag) {
            routes.push({
                pathname: `/tags/${encodeURIComponent(tag)}`,
            })
        }
    })
    // article route
    articlesArray.forEach((article, index) => {
        routes.push({
            pathname: `/article/${encodeURIComponent(article.excerpt)}`,
            lastmod: article.createdAt
                ? dateFns.format(new Date(article.createdAt), 'yyyy-MM-dd')
                : undefined,
        })
    })
    routes.forEach(({ pathname, lastmod }) => {
        sitemapString += `    <url>
        <loc>${urlHost}${pathname}</loc>`
        if (typeof lastmod !== 'undefined') {
            sitemapString += `\n        <lastmod>${lastmod}</lastmod>
    </url>\n`
        } else {
            sitemapString += `\n    </url>\n`
        }
    })
    sitemapString += sitemapXmlStringPost
    fs.writeFileSync(sitemapPath, sitemapString, 'utf8')
}

generateSitemap()
