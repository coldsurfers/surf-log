import styled from '@emotion/styled'
import { FC } from 'react'
import Modal from './Modal'

const Content = styled.div`
    padding: 1rem;
`

const RemoveButton = styled.button`
    width: 100%;
    height: 2.5rem;
    background-color: #000000;
    color: #ffffff;
`

interface Props {
    open: boolean
    onClickBackground?: () => void
    onClickRemove?: () => void
}

const ArticleRemoveModal: FC<Props> = ({
    open,
    onClickBackground,
    onClickRemove,
}) => {
    return (
        <Modal open={open} onClickBackground={onClickBackground}>
            <Content>이 글을 삭제하시겠습니까?</Content>
            <RemoveButton onClick={onClickRemove}>예</RemoveButton>
        </Modal>
    )
}

export default ArticleRemoveModal
