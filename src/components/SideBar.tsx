import { FC } from 'react'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Container = styled.nav`
    width: 230px;
    height: 100vh;
    background-color: transparent;
    margin-top: 90px;
`

const NavItemList = styled.ul`
    list-style: none;
    margin-block-start: 0px;
    margin-block-end: 0px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0px;
    width: 100%;
`
const NavItem = styled.li`
    height: 48px;
    display: flex;
    align-items: center;
`

const NavLink = styled.a<{ matched?: boolean }>`
    transition: all 0.1s ease;
    width: 100%;
    margin-bottom: 3px;

    padding-top: 7px;
    padding-bottom: 7px;
    padding-left: 12px;
    padding-right: 12px;

    position: relative;

    &:after {
        background: #ffffff;
        border-radius: 9px;
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        opacity: ${(p) => (p.matched ? 1 : 0)};
        position: absolute;
        top: 0;
        left: 0;
        transition: all 0.15s ease;
        z-index: -1;
        transform: scale3d(0.85, 1, 0.5);
    }

    &:hover:after {
        transform: scale3d(1, 1, 0.5);
        opacity: 1;
    }
`

const NavLinkText = styled.span`
    padding-left: 25px;
    text-transform: uppercase;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
`

interface Props {
    categories: string[]
    currentArticleCategory?: string
}

const SideBar: FC<Props> = (props) => {
    const { categories, currentArticleCategory } = props
    const router = useRouter()
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
