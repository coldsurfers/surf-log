import { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import multer from 'multer'
import nextConnect from 'next-connect'

export const config: PageConfig = {
    api: {
        bodyParser: false,
    },
}

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1]
            return cb(null, `${new Date().getTime()}.${ext}`)
        },
    }),
})

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError: (error, req, res) => {
        res.status(501).json({
            error: `Sorry something Happened! ${error.message}`,
        })
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
    },
})
    .use(upload.single('editorFile'))
    .post((req, res) => {
        return res.status(200).json({
            ...(req as any).file,
        })
    })

export default apiRoute
