import styled from '@emotion/styled'
import { FC, MouseEventHandler, useCallback, useRef } from 'react'
import ModalPortal from './ModalPortal'

const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);

    display: flex;
    align-items: center;
    justify-content: center;
`

interface Props {
    open: boolean
    onClickBackground?: () => void
}

const Modal: FC<Props> = ({ open, children, onClickBackground }) => {
    const childrenRef = useRef<HTMLDivElement | null>(null)
    const handleClickBackground: MouseEventHandler<HTMLDivElement> =
        useCallback(
            (e) => {
                const node = e.target as Node
                if (childrenRef.current?.contains(node)) {
                    return
                }
                if (onClickBackground) {
                    onClickBackground()
                }
            },
            [onClickBackground]
        )
    return open ? (
        <ModalPortal>
            <ModalBackground onClick={handleClickBackground}>
                <div ref={childrenRef}>{children}</div>
            </ModalBackground>
        </ModalPortal>
    ) : null
}

export default Modal
