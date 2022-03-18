import { NextApiHandler } from 'next'
import path from 'path'
import fs from 'fs'

const TempSaveAPI: NextApiHandler = (req, res) => {
    if (req.method === 'POST') {
        const temporaryArticleDirPathString =
            '../../../../../articles/temporary'
        const temporaryArticleFilenames = fs.readdirSync(
            path.resolve(__dirname, temporaryArticleDirPathString)
        )
        if (temporaryArticleFilenames.length > 0) {
            temporaryArticleFilenames.forEach((filename) => {
                if (filename === '.gitinclude') {
                    return
                }
                fs.unlinkSync(
                    path.resolve(
                        __dirname,
                        `${temporaryArticleDirPathString}/${filename}`
                    )
                )
            })
        }

        const { text } = req.body
        let articlePath = path.resolve(
            __dirname,
            `${temporaryArticleDirPathString}/temp-${new Date().toISOString()}.md`
        )
        let content = `${text}`
        fs.writeFileSync(articlePath, content)
        return res.status(200).json({
            error: null,
        })
    }
    return res.status(501).json({
        error: 'not implemented',
    })
}

export default TempSaveAPI
