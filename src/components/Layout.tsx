import styled from '@emotion/styled'
import { FC } from 'react'
import Header from './Header'
import SideBar from './SideBar'

const Container = styled.main`
    width: 100vw;
    display: flex;
    flex-direction: column;
`

const ChildrenWithSideBar = styled.div`
    display: flex;
    padding-left: 20px;
    padding-right: 20px;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    margin-top: 90px;
`

const ChildrenWrapper = styled.div`
    flex: 1;
    padding-left: 2.5rem;
`

interface Props {
    categories: string[]
}

const Layout: FC<Props> = ({ children, categories }) => {
    return (
        <Container>
            <Header />
            <ChildrenWithSideBar>
                <SideBar categories={categories} />
                <ChildrenWrapper>{children}</ChildrenWrapper>
            </ChildrenWithSideBar>
        </Container>
    )
}

export default Layout
