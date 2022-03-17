import type { AppContext, AppInitialProps, AppProps } from 'next/app'
import { Global, css } from '@emotion/react'
import Layout from '../components/Layout'
import { Article } from '../types/article'
import App from 'next/app'
import 'open-color/open-color.css'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import NetworkOfflineTemplate from '../components/NetworkOfflineTemplate'

function MyApp({ Component, pageProps }: AppProps) {
    const { categories, article } = pageProps
    const [isOnline, setIsOnline] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.navigator.onLine
        } else {
            return true
        }
    })
    useEffect(() => {
        if (!window.navigator.onLine) {
            setIsOnline(false)
        }

        const onOnline = () => {
            setIsOnline(true)
        }

        const onOffline = () => {
            setIsOnline(false)
        }

        window.addEventListener('online', onOnline)
        window.addEventListener('offline', onOffline)

        return () => {
            window.removeEventListener('online', onOnline)
            window.removeEventListener('offline', onOffline)
        }
    }, [])
    return (
        <>
            <Head>
                <title>Surf.Log</title>
                <link
                    rel="apple-touch-icon"
                    sizes="57x57"
                    href="/favicons/apple-icon-57x57.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="60x60"
                    href="/favicons/apple-icon-60x60.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="72x72"
                    href="/favicons/apple-icon-72x72.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="76x76"
                    href="/favicons/apple-icon-76x76.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="114x114"
                    href="/favicons/apple-icon-114x114.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="120x120"
                    href="/favicons/apple-icon-120x120.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="144x144"
                    href="/favicons/apple-icon-144x144.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="152x152"
                    href="/favicons/apple-icon-152x152.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/favicons/apple-icon-180x180.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="192x192"
                    href="/favicons/android-icon-192x192.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicons/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="96x96"
                    href="/favicons/favicon-96x96.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicons/favicon-16x16.png"
                />
                <link rel="manifest" href="/favicons/manifest.json" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta
                    name="msapplication-TileImage"
                    content="/favicons/ms-icon-144x144.png"
                />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            {isOnline ? (
                <Layout categories={categories} currentArticle={article}>
                    <Component {...pageProps} />
                </Layout>
            ) : (
                <NetworkOfflineTemplate />
            )}
            <Global
                styles={css`
                    @import url('//fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,100;1,200;1,300;1,400;1,500;1,600&display=swap');
                    html {
                        background-color: var(--oc-gray-0);
                    }
                    body {
                        font-family: 'Fira Sans', sans-serif;
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
