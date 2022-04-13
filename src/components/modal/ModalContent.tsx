import styled from '@emotion/styled'
import { CSSProperties, FC } from 'react'

const Container = styled.div`
    padding: 1rem;
`

interface Props {
    className?: string
    style?: CSSProperties
}

const ModalContent: FC<Props> = ({ children, className, style }) => {
    return (
        <Container className={className} style={style}>
            {children}
        </Container>
    )
}

export default ModalContent
