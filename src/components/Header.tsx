import { FC } from 'react'
import styled from '@emotion/styled'

const Container = styled.header`
    height: 56px;
    width: 100%;
    background-color: #000000;
    display: inline-flex;
    align-items: center;

    padding-left: 24px;
    padding-right: 24px;
`

const Logo = styled.button`
    width: auto;
    height: 38px;
    border-radius: 13px;
    background-color: #343a40;
    padding-left: 0.8rem;
    padding-right: 0.8rem;
    border: none;

    cursor: pointer;
`

const LogoText = styled.p`
    margin: unset;
    font-size: 18px;
    line-height: 38px;
    font-weight: bold;
    color: #ffffff;
`

const Header: FC = () => {
    return (
        <Container>
            <Logo>
                <LogoText>Surf.log</LogoText>
            </Logo>
        </Container>
    )
}

export default Header
