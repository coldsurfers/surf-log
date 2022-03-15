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
`

const ChildrenWrapper = styled.div`
    flex: 1;
    padding-left: 2.5rem;
    margin-top: calc(90px - 2vw);
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
