import styled from '@emotion/styled'
import { FC } from 'react'

const Container = styled.main`
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Inner = styled.section`
    margin-left: 2.5rem;
    margin-right: 2.5rem;
    text-align: center;
`

const TitleText = styled.h1`
    margin: 0px;
`
const SubText = styled.p``

const NetworkOfflineTemplate: FC = () => {
    return (
        <Container>
            <Inner>
                <TitleText>Network connection lost!</TitleText>
                <SubText>Seems like your network is offline</SubText>
            </Inner>
        </Container>
    )
}

export default NetworkOfflineTemplate
