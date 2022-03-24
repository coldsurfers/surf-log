import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import Link from 'next/link'
import breakpoints from '../../lib/breakpoints'
import mediaQuery from '../../lib/mediaQuery'
import Toggle from 'react-toggle'
import { css } from '@emotion/css'
import SunIcon from '../icons/SunIcon'
import DoNotDisturbIcon from '../icons/DoNotDisturbIcon'

const Container = styled.header`
    height: var(--header-height);
    width: 100%;
    background-color: #000000;
    display: flex;
`

const ContainerInner = styled.div`
    padding-left: 24px;
    padding-right: 24px;
    display: inline-flex;
    align-items: center;
    height: 100%;

    width: ${breakpoints.large}px;
    margin-left: auto;
    margin-right: auto;

    ${mediaQuery.large} {
        width: 100%;
    }
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
    const [theme, setTheme] = useState<'light' | 'dark' | 'default'>('default')
    const onChangeToggle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    }, [])
    useEffect(() => {
        const systemPrefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches
        if (systemPrefersDark) {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    }, [])

    useEffect(() => {
        const onPrefersColorSchemeChanged = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? 'dark' : 'light')
        }
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', onPrefersColorSchemeChanged)

        return () => {
            window
                .matchMedia('(prefers-color-scheme: dark)')
                .removeEventListener('change', onPrefersColorSchemeChanged)
        }
    }, [])

    useEffect(() => {
        document.body.dataset.theme = theme
    }, [theme])

    console.log(theme)

    return (
        <Container>
            <ContainerInner
                className={css`
                    .react-toggle {
                        margin-left: auto;
                        touch-action: pan-x;

                        display: inline-block;
                        position: relative;
                        cursor: pointer;
                        background-color: transparent;
                        border: 0;
                        padding: 0;

                        -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -khtml-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;

                        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                        -webkit-tap-highlight-color: transparent;
                    }

                    .react-toggle-screenreader-only {
                        border: 0;
                        clip: rect(0 0 0 0);
                        height: 1px;
                        margin: -1px;
                        overflow: hidden;
                        padding: 0;
                        position: absolute;
                        width: 1px;
                    }

                    .react-toggle--disabled {
                        cursor: not-allowed;
                        opacity: 0.5;
                        -webkit-transition: opacity 0.25s;
                        transition: opacity 0.25s;
                    }

                    .react-toggle-track {
                        width: 50px;
                        height: 24px;
                        padding: 0;
                        border-radius: 30px;
                        background-color: #4d4d4d;
                        -webkit-transition: all 0.2s ease;
                        -moz-transition: all 0.2s ease;
                        transition: all 0.2s ease;
                    }

                    .react-toggle:hover:not(.react-toggle--disabled)
                        .react-toggle-track {
                        background-color: #ffffff;
                    }

                    .react-toggle--checked .react-toggle-track {
                        background-color: #4d4d4d;
                    }

                    .react-toggle--checked:hover:not(.react-toggle--disabled)
                        .react-toggle-track {
                        background-color: #000000;
                    }

                    .react-toggle-track-check {
                        position: absolute;
                        width: 14px;
                        height: 10px;
                        top: 0px;
                        bottom: 0px;
                        margin-top: auto;
                        margin-bottom: auto;
                        line-height: 0;
                        left: 8px;
                        opacity: 0;
                        -webkit-transition: opacity 0.25s ease;
                        -moz-transition: opacity 0.25s ease;
                        transition: opacity 0.25s ease;
                    }

                    .react-toggle--checked .react-toggle-track-check {
                        opacity: 1;
                        -webkit-transition: opacity 0.25s ease;
                        -moz-transition: opacity 0.25s ease;
                        transition: opacity 0.25s ease;
                    }

                    .react-toggle-track-x {
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        top: 0px;
                        bottom: 0px;
                        margin-top: auto;
                        margin-bottom: auto;
                        line-height: 0;
                        right: 10px;
                        opacity: 1;
                        -webkit-transition: opacity 0.25s ease;
                        -moz-transition: opacity 0.25s ease;
                        transition: opacity 0.25s ease;
                    }

                    .react-toggle--checked .react-toggle-track-x {
                        opacity: 0;
                    }

                    .react-toggle-thumb {
                        transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
                        position: absolute;
                        top: 1px;
                        left: 1px;
                        width: 22px;
                        height: 22px;
                        border: 1px solid #4d4d4d;
                        border-radius: 50%;
                        background-color: #fafafa;

                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;

                        -webkit-transition: all 0.25s ease;
                        -moz-transition: all 0.25s ease;
                        transition: all 0.25s ease;
                    }

                    .react-toggle--checked .react-toggle-thumb {
                        left: 27px;
                        border-color: #19ab27;
                    }

                    .react-toggle--focus .react-toggle-thumb {
                        -webkit-box-shadow: 0px 0px 3px 2px #0099e0;
                        -moz-box-shadow: 0px 0px 3px 2px #0099e0;
                        box-shadow: 0px 0px 2px 3px #0099e0;
                    }

                    .react-toggle:active:not(.react-toggle--disabled)
                        .react-toggle-thumb {
                        -webkit-box-shadow: 0px 0px 5px 5px #0099e0;
                        -moz-box-shadow: 0px 0px 5px 5px #0099e0;
                        box-shadow: 0px 0px 5px 5px #0099e0;
                    }
                `}
            >
                <Link href="/" passHref>
                    <Logo>
                        <LogoText>Surf.Log</LogoText>
                    </Logo>
                </Link>
                {theme !== 'default' && (
                    <Toggle
                        checked={theme === 'dark'}
                        icons={{
                            unchecked: <DoNotDisturbIcon />,
                            checked: (
                                <SunIcon
                                    viewBox="0 0 30 30"
                                    width={15}
                                    height={15}
                                    style={{
                                        marginTop: '-2.5px',
                                    }}
                                    fill="#ffffff"
                                />
                            ),
                        }}
                        onChange={onChangeToggle}
                    />
                )}
            </ContainerInner>
        </Container>
    )
}

export default Header
