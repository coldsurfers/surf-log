import styled from '@emotion/styled'
import { FC } from 'react'
import { BaseModalProps } from '../../types/modal'
import Modal from './Modal'
import ModalContent from './ModalContent'

const RemoveButton = styled.button`
    width: 100%;
    height: 2.5rem;
    background-color: #000000;
    color: #ffffff;
`

interface Props extends BaseModalProps {
    onClickRemove?: () => void
}

const ArticleRemoveModal: FC<Props> = ({
    open,
    onClickBackground,
    onClickRemove,
}) => {
    return (
        <Modal open={open} onClickBackground={onClickBackground}>
            <ModalContent>이 글을 삭제하시겠습니까?</ModalContent>
            <RemoveButton onClick={onClickRemove}>예</RemoveButton>
        </Modal>
    )
}

export default ArticleRemoveModal
