import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import {
    CONTAINER_WIDTH,
    MEDIA_QUERY_LARGE_HORIZONTAL_SPACE,
    SIDEBAR_WIDTH,
} from '../../lib/constants'
import { Article } from '../../lib/fetcher/types'
import mediaQuery from '../../lib/mediaQuery'
import { SurfLogColorScheme } from '../../types/colorScheme'
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
    width: ${CONTAINER_WIDTH};

    ${mediaQuery.large} {
        width: calc(100% - ${MEDIA_QUERY_LARGE_HORIZONTAL_SPACE} * 2);
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
    margin-top: 90px;

    width: calc(100% - ${SIDEBAR_WIDTH});

    ${mediaQuery.large} {
        width: calc(
            100% - ${SIDEBAR_WIDTH} -
                (${MEDIA_QUERY_LARGE_HORIZONTAL_SPACE} * 2)
        );
    }

    ${mediaQuery.medium} {
        width: 100%;
        margin-top: 15px;
        padding-left: 0px;
    }
`

interface Props {
    categories: string[]
    currentArticle?: Article
    theme: SurfLogColorScheme
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
                        currentArticleCategory={
                            currentArticle?.blogArticleCategory?.name
                        }
                    />
                    <ChildrenWrapper>{children}</ChildrenWrapper>
                </ChildrenWithSideBar>
            )}
        </Container>
    )
}

export default PageLayout
