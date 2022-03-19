import { FC } from 'react'

interface Props {
    htmlId: string
}

const ModalRootPortalTag: FC<Props> = ({ htmlId }) => {
    return <div id={htmlId} />
}

export default ModalRootPortalTag
