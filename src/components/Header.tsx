import { FC } from 'react'
import styled from '@emotion/styled'
import Link from 'next/link'

const Container = styled.header`
    height: 56px;
    width: 100%;
    background-color: #000000;
`

const ContainerInner = styled.div`
    padding-left: 24px;
    padding-right: 24px;
    display: inline-flex;
    align-items: center;
    height: 100%;
`

const Logo = styled.a`
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
            <ContainerInner>
                <Link href="/" passHref>
                    <Logo>
                        <LogoText>Surf.Log</LogoText>
                    </Logo>
                </Link>
            </ContainerInner>
        </Container>
    )
}

export default Header
