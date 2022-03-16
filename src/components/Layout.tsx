import styled from '@emotion/styled'
import { FC } from 'react'
import mediaQuery from '../lib/mediaQuery'
import { Article } from '../types/article'
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

    ${mediaQuery.medium} {
        flex-direction: column;
    }
`

const ChildrenWrapper = styled.div`
    flex: 1;
    padding-left: 2.5rem;
    margin-top: calc(90px - 2vw);

    ${mediaQuery.medium} {
        margin-top: 15px;
        padding-left: 0px;
    }
`

interface Props {
    categories: string[]
    currentArticle?: Article
}

const Layout: FC<Props> = ({ children, categories, currentArticle }) => {
    return (
        <Container>
            <Header />
            <ChildrenWithSideBar>
                <SideBar
                    categories={categories}
                    currentArticleCategory={currentArticle?.data.category}
                />
                <ChildrenWrapper>{children}</ChildrenWrapper>
            </ChildrenWithSideBar>
        </Container>
    )
}

export default Layout
