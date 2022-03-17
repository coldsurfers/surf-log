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
        const { title, excerpt, category, thumbnail, text } = req.body
        let articlePath = path.resolve(
            __dirname,
            `../../../../articles/${title}.md`
        )
        if (fs.existsSync(articlePath)) {
            articlePath = path.resolve(
                __dirname,
                `../../../../articles/${`${title}-${generateUniqSerial()}`}.md`
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
