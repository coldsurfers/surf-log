const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function main() {
    const articlesPath = path.resolve(__dirname, '../articles')
    const articles = fs.readdirSync(articlesPath, 'utf8')
    const read = articles.map((article) => {
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
    const meta = path.resolve(__dirname, '../public/article-meta.json')
    fs.writeFileSync(
        meta,
        JSON.stringify({
            articles: read.reduce((prev, curr) => {
                if (prev[curr.excerpt]) {
                    prev[`${curr.excerpt}-`] = {
                        ...curr,
                    }
                } else {
                    prev[curr.excerpt] = {
                        ...curr,
                    }
                }
                return prev
            }, {}),
        })
    )
}

main()
