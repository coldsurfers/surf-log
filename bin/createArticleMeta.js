const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function main() {
    const sample = fs.readFileSync(
        path.resolve(__dirname, '../articles/Sample.md'),
        'utf8'
    )
    const meta = path.resolve(__dirname, '../public/article-meta.json')
    fs.writeFileSync(
        meta,
        JSON.stringify({
            articles: [matter(sample)],
        })
    )
}

main()
