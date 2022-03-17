import styled from '@emotion/styled'
import { FC } from 'react'
import breakpoints from '../lib/breakpoints'
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
    flex-direction: row;
    margin-left: auto;
    margin-right: auto;
    width: ${breakpoints.large}px;

    ${mediaQuery.large} {
        width: 100%;
    }

    ${mediaQuery.medium} {
        flex-direction: column;
    }

    ${mediaQuery.small} {
        margin-left: 0px;
        margin-right: 0px;
    }
`

const ChildrenWrapper = styled.div`
    flex: 1;
    padding-left: 2.5rem;
    margin-top: 90px;

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
