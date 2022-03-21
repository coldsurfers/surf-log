import { NextApiHandler } from 'next'
import path from 'path'
import fs from 'fs'

const temporaryArticleDirPathString = '../../../../../articles/temporary'

const TempSaveAPI: NextApiHandler = (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(400).json({
            error: 'this api only works in development mode',
        })
    }
    if (req.method === 'GET') {
        const temporaryArticleFileNames = fs.readdirSync(
            path.resolve(__dirname, temporaryArticleDirPathString)
        )
        let tempArticleText: string | null = null
        if (temporaryArticleFileNames.length > 0) {
            temporaryArticleFileNames.forEach((filename) => {
                if (tempArticleText !== null) {
                    return
                }
                if (filename === '.gitinclude') {
                    return
                }
                tempArticleText = fs.readFileSync(
                    path.resolve(
                        __dirname,
                        `${temporaryArticleDirPathString}/${filename}`
                    ),
                    'utf8'
                )
            })
        }
        return res.json({
            error: null,
            tempArticleText,
        })
    }
    if (req.method === 'POST') {
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
    return res.status(405).json({
        error: `${req.method} method is not supported`,
    })
}

export default TempSaveAPI
