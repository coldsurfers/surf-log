import type { AppContext, AppInitialProps, AppProps } from 'next/app'
import { Global, css } from '@emotion/react'
import Layout from '../components/Layout'
import { Article } from '../types/article'
import App from 'next/app'
import 'open-color/open-color.css'

function MyApp({ Component, pageProps }: AppProps) {
    const { categories } = pageProps
    return (
        <>
            <Layout categories={categories}>
                <Component {...pageProps} />
            </Layout>
            <Global
                styles={css`
                    html {
                        background-color: var(--oc-gray-0);
                    }
                    body {
                        font-family: ui-monospace, SFMono-Regular, SF Mono,
                            Menlo, Consolas, Liberation Mono, monospace !important;
                        margin: 0px;
                    }
                    a {
                        text-decoration: none;
                        color: inherit;
                    }
                `}
            />
        </>
    )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
    const appProps = await App.getInitialProps(appContext)
    const articleMeta = (await import('../../public/article-meta.json')) as {
        articles: {
            [key: string]: Article
        }
        categories: string[]
    }

    appProps.pageProps = {
        categories: articleMeta.categories,
    }

    return {
        ...appProps,
    }
}

export default MyApp
