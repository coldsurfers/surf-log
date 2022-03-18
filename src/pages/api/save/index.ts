import { NextApiHandler } from 'next'
import fs from 'fs'
import path from 'path'

function generateUniqSerial() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, (c) => {
        const r = Math.floor(Math.random() * 16)
        return r.toString(16)
    })
}

const SaveAPI: NextApiHandler = (req, res) => {
    if (req.method === 'POST') {
        const articlesPathString = `../../../../articles`
        const temporaryArticlesPathString = `${articlesPathString}/temporary`
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
        const { title, excerpt, category, thumbnail, text } = req.body
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
---
${text}`
        fs.writeFileSync(articlePath, content)
        return res.status(200).json({
            error: null,
        })
    }
    return res.status(501).json({
        error: 'not implemented',
    })
}

export default SaveAPI
