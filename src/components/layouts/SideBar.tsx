import { FC } from 'react'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import mediaQuery from '../../lib/mediaQuery'
import { themedPalette } from '../../lib/theme'

const Container = styled.nav`
    width: 230px;
    height: 100vh;
    background-color: transparent;
    margin-top: 90px;

    ${mediaQuery.medium} {
        width: 100%;
        height: auto;
    }
`

const NavItemList = styled.ul`
    list-style: none;
    margin-block-start: 0px;
    margin-block-end: 0px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0px;
    width: 100%;

    overflow: auto;

    ${mediaQuery.medium} {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
`
const NavItem = styled.li`
    display: flex;
    align-items: center;

    ${mediaQuery.medium} {
        margin-left: 1rem;
        margin-right: 1rem;
        & + & {
            margin-left: 2vw;
        }
    }
`

const NavLink = styled.a<{ matched?: boolean }>`
    transition: all 0.1s ease;
    width: 100%;
    height: 33px;
    line-height: 38px;
    margin-bottom: 3px;

    padding-top: 7px;
    padding-bottom: 7px;

    position: relative;
    padding-left: 25px;

    border-radius: 9px;
    background: ${(p) =>
        p.matched
            ? `${themedPalette['sidebar-nav-item-highlighted-background']}`
            : 'transparent'};

    &:after {
        background: ${themedPalette['sidebar-nav-item-highlighted-background']};
        border-radius: 9px;
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        transition: all 0.15s ease;
        z-index: -1;
        transform: scale3d(0.85, 1, 1);
    }

    &:hover {
        padding-left: 50px;
    }

    &:hover:after {
        transform: scale3d(1, 1, 1);
        opacity: 1;
    }

    ${mediaQuery.medium} {
        height: 28px;
        line-height: 28px;
        padding-right: 1rem;
        padding-left: 1rem;
    }

    ${mediaQuery.small} {
    }
`

const NavLinkText = styled.span`
    text-transform: uppercase;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    color: ${themedPalette['sidebar-nav-item-text-color']};
`

interface Props {
    categories: string[]
    currentArticleCategory?: string
}

const SideBar: FC<Props> = (props) => {
    const { categories, currentArticleCategory } = props
    const router = useRouter()
    if (router.pathname === '/editor') {
        return null
    }
    return (
        <Container>
            <NavItemList>
                <NavItem>
                    <Link href={`/`} passHref>
                        <NavLink matched={router.pathname === '/'}>
                            <NavLinkText>All</NavLinkText>
                        </NavLink>
                    </Link>
                </NavItem>
                {categories.map((category) => (
                    <NavItem key={category}>
                        <Link href={`/category/${category}`} passHref>
                            <NavLink
                                matched={
                                    category === router.query.category ||
                                    category === currentArticleCategory
                                }
                            >
                                <NavLinkText>{category}</NavLinkText>
                            </NavLink>
                        </Link>
                    </NavItem>
                ))}
            </NavItemList>
        </Container>
    )
}

export default SideBar
