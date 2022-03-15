const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function main() {
    const articlesPath = path.resolve(__dirname, '../articles')
    const articles = fs.readdirSync(articlesPath, 'utf8')
    const read = articles
        .map((article) => {
            const read = fs.readFileSync(
                path.resolve(__dirname, `../articles/${article}`),
                'utf8'
            )
            const mattered = matter(read, {
                excerpt: function (file, options) {
                    file.excerpt = encodeURI(file.data.excerpt)
                },
            })
            return mattered
        })
        .sort((a, b) => {
            return new Date(a.data.createdAt) - new Date(b.data.createdAt)
        })
        .reduce((prev, curr) => {
            if (prev.find((prevItem) => prevItem.excerpt === curr.excerpt)) {
                curr.excerpt = `${curr.excerpt}-`
            }
            return prev.concat(curr)
        }, [])
        .sort((a, b) => {
            return new Date(b.data.createdAt) - new Date(a.data.createdAt)
        })

    const meta = path.resolve(__dirname, '../public/article-meta.json')
    fs.writeFileSync(
        meta,
        JSON.stringify({
            articles: read.reduce((prev, curr) => {
                prev[curr.excerpt] = curr
                return prev
            }, {}),
        })
    )
}

main()
