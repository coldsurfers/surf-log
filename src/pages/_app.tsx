import type { AppProps } from 'next/app'
import { Global, css } from '@emotion/react'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <Global
                styles={css`
                    body {
                        font-family: ui-monospace, SFMono-Regular, SF Mono,
                            Menlo, Consolas, Liberation Mono, monospace !important;
                    }
                `}
            />
        </>
    )
}

export default MyApp
