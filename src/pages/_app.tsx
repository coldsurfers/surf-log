import type { AppProps } from 'next/app'
import { Global, css } from '@emotion/react'
import Header from '../components/Header'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Header />
            <Component {...pageProps} />
            <Global
                styles={css`
                    body {
                        font-family: ui-monospace, SFMono-Regular, SF Mono,
                            Menlo, Consolas, Liberation Mono, monospace !important;
                        margin: 0px;
                    }
                `}
            />
        </>
    )
}

export default MyApp
