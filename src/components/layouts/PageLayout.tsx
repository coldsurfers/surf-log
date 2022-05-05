import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import breakpoints from '../../lib/breakpoints'
import mediaQuery from '../../lib/mediaQuery'
import { Article } from '../../types/article'
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
        width: calc(100% - 8rem * 2);
    }

    ${mediaQuery.medium} {
        margin-left: 2rem;
        margin-right: 2rem;
        width: calc(100% - 2rem * 2);
        flex-direction: column;
    }

    ${mediaQuery.small} {
        margin-left: 0px;
        margin-right: 0px;
        width: 100%;
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
    theme: 'light' | 'dark' | 'default'
    onToggleTheme: () => void
}

const sideBarBlackListRoutes = ['/editor', '/about']

const PageLayout: FC<Props> = ({
    children,
    categories,
    currentArticle,
    theme,
    onToggleTheme,
}) => {
    const router = useRouter()
    return (
        <Container>
            {router.pathname !== '/editor' && (
                <Header theme={theme} onToggleTheme={onToggleTheme} />
            )}
            {sideBarBlackListRoutes.some((v) => v === router.pathname) ? (
                children
            ) : (
                <ChildrenWithSideBar>
                    <SideBar
                        categories={categories}
                        currentArticleCategory={currentArticle?.data.category}
                    />
                    <ChildrenWrapper>{children}</ChildrenWrapper>
                </ChildrenWithSideBar>
            )}
        </Container>
    )
}

export default PageLayout
