import { NextApiHandler } from 'next'
import fs from 'fs'
import path from 'path'

function generateUniqSerial() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, (c) => {
        const r = Math.floor(Math.random() * 16)
        return r.toString(16)
    })
}

const articlesPathString = `../../../../articles`
const temporaryArticlesPathString = `${articlesPathString}/temporary`

const SaveAPI: NextApiHandler = (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(400).json({
            error: 'this api only works in development mode',
        })
    }
    if (req.method === 'POST') {
        const tempFilenames = fs.readdirSync(
            path.resolve(__dirname, temporaryArticlesPathString)
        )
        if (tempFilenames.length > 0) {
            tempFilenames.forEach((filename) => {
                if (filename === '.gitinclude') {
                    return
                }
                fs.unlinkSync(
                    path.resolve(
                        __dirname,
                        `${temporaryArticlesPathString}/${filename}`
                    )
                )
            })
        }
        const { title, excerpt, category, thumbnail, text, tags } = req.body
        let articlePath = path.resolve(
            __dirname,
            `${articlesPathString}/${title}.md`
        )
        if (fs.existsSync(articlePath)) {
            articlePath = path.resolve(
                __dirname,
                `${articlesPathString}/${`${title}-${generateUniqSerial()}`}.md`
            )
        }
        let content = `---
title: ${title}
excerpt: ${excerpt}
category: ${category}
thumbnail: ${thumbnail}
createdAt: ${new Date().toISOString()}
tags: ${JSON.stringify(tags)}
---
${text}`
        fs.writeFileSync(articlePath, content)
        return res.status(200).json({
            error: null,
        })
    }
    if (req.method === 'PATCH') {
        const { title, excerpt, category, thumbnail, text, createdAt, tags } =
            req.body
        let content = `---
title: ${title}
excerpt: ${excerpt}
category: ${category}
thumbnail: ${thumbnail}
createdAt: ${createdAt}
updatedAt: ${new Date().toISOString()}
tags: ${JSON.stringify(tags)}
---
${text}`
        let articlePath = path.resolve(
            __dirname,
            `${articlesPathString}/${title}.md`
        )
        fs.writeFileSync(articlePath, content)
        return res.status(200).json({
            error: null,
        })
    }
    return res.status(405).json({
        error: `${req.method} method is not supported`,
    })
}

export default SaveAPI
