import styled from '@emotion/styled'
import { FC, MouseEventHandler, useCallback, useRef } from 'react'
import { BaseModalProps } from '../../types/modal'
import ModalPortal from './ModalPortal'

const ModalBackground = styled.div<{ open: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);

    display: ${(p) => (p.open ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
`

const Dialog = styled.dialog`
    padding: 0px;
    border: unset;
`

const Modal: FC<BaseModalProps> = ({ open, children, onClickBackground }) => {
    const dialogRef = useRef<HTMLDivElement | null>(null)
    const handleClickBackground: MouseEventHandler<HTMLDivElement> =
        useCallback(
            (e) => {
                const node = e.target as Node
                if (dialogRef.current?.contains(node)) {
                    return
                }
                if (onClickBackground) {
                    onClickBackground()
                }
            },
            [onClickBackground]
        )
    return (
        <ModalPortal>
            <ModalBackground open={open} onClick={handleClickBackground}>
                <Dialog open={open} ref={dialogRef}>
                    {children}
                </Dialog>
            </ModalBackground>
        </ModalPortal>
    )
}

export default Modal
