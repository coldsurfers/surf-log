import { FC, MouseEventHandler } from 'react'
import Float from '../common/Float'
import CircledButton from './CircledButton'

interface Props {
    onClick?: MouseEventHandler<HTMLButtonElement>
}

const FloatingButton: FC<Props> = ({ onClick, children }) => {
    return (
        <Float>
            <CircledButton onClick={onClick}>{children}</CircledButton>
        </Float>
    )
}

export default FloatingButton
