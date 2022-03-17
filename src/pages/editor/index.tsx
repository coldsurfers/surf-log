import { NextPage } from 'next'

const Editor: NextPage = () => {
    if (process.env.NODE_ENV !== 'development') {
        return null
    }
    return null
}

export default Editor
