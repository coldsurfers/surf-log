import styled from '@emotion/styled'
import { FC } from 'react'

const Container = styled.div`
    margin-left: auto;
    position: fixed;
    right: 10px;
    bottom: 10px;
`

const Float: FC = ({ children }) => {
    return <Container>{children}</Container>
}

export default Float
