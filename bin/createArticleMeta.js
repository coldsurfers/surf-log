const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function generateUniqSerial() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, (c) => {
        const r = Math.floor(Math.random() * 16)
        return r.toString(16)
    })
}

function main() {
    const mdFilesDirectoryPath = path.resolve(__dirname, '../articles')
    const mdFileNames = fs.readdirSync(mdFilesDirectoryPath, 'utf8')
    const mdFilesMetaArray = mdFileNames
        .map((fileName) => {
            const mdFilePath = path.resolve(
                __dirname,
                `../articles/${fileName}`
            )
            const mdFileContent = fs.readFileSync(mdFilePath, 'utf8')
            const mdFileMeta = matter(mdFileContent, {
                excerpt: function (file, options) {
                    file.excerpt = encodeURI(file.data.excerpt)
                },
            })
            return mdFileMeta
        })
        .sort((a, b) => {
            return new Date(a.data.createdAt) - new Date(b.data.createdAt)
        })
        .reduce((prev, curr) => {
            if (prev.find((prevItem) => prevItem.excerpt === curr.excerpt)) {
                curr.excerpt = `${curr.excerpt}-${generateUniqSerial()}`
            }
            return prev.concat(curr)
        }, [])
        .sort((a, b) => {
            return new Date(b.data.createdAt) - new Date(a.data.createdAt)
        })

    const categories = mdFilesMetaArray
        .map((meta) => meta.data.category)
        .filter((value, index, self) => self.indexOf(value) === index)

    const mdFilesMeta = mdFilesMetaArray.reduce((prev, curr) => {
        prev[curr.excerpt] = curr
        return prev
    }, {})

    const metaFilePath = path.resolve(__dirname, '../public/article-meta.json')

    const meta = {
        articles: mdFilesMeta,
        categories,
    }
    fs.writeFileSync(metaFilePath, JSON.stringify(meta))
}

main()
