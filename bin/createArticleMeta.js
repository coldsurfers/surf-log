const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function main() {
    const articlesPath = path.resolve(__dirname, '../articles')
    const articles = fs.readdirSync(articlesPath, 'utf8')
    const read = articles.map((article) => {
        const read = fs.readFileSync(
            path.resolve(__dirname, `../articles/${article}`)
        )
        return matter(read)
    })
    const meta = path.resolve(__dirname, '../public/article-meta.json')
    fs.writeFileSync(
        meta,
        JSON.stringify({
            articles: read,
        })
    )
}

main()
