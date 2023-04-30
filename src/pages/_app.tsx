import '../lib/ga/initialize'
import '@coldsurfers/design-tokens/dist/css/color/variables.css'
import type { AppContext, AppProps as NextAppProps } from 'next/app'
import Layout from '../components/layouts/PageLayout'
import App from 'next/app'
import NetworkOfflineTemplate from '../components/templates/NetworkOfflineTemplate'
import Error from 'next/error'
import HtmlHead from '../components/layouts/HtmlHead'
import ModalRootPortalTag from '../components/modal/ModalRootPortalTag'
import {
    MODAL_ROOT_PORTAL_TAG_HTML_ID,
    THEME_UNIQUE_KEY,
} from '../lib/constants'
import useNetworkStatus from '../lib/hooks/useNetworkStatus'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { pageView } from '../lib/ga/utils'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { fetchArticleMeta } from '../lib/fetcher/articleMeta'
import extractFromCookie from '../lib/extractFromCookie'
import { Article } from '../lib/fetcher/types'
import { globalStyles } from '../lib/injectGlobalStyle'

declare global {
    interface Window {
        __theme: string
        __setPreferredTheme: (theme: string) => void
    }
}

const queryClient = new QueryClient()

type AppProps<P = any> = {
    pageProps: P
} & Omit<NextAppProps<P>, 'pageProps'>

function MyApp({
    Component,
    pageProps,
}: AppProps<{
    categories: string[]
    statusCode: number
    article?: Article
}>) {
    const { categories, article, statusCode } = pageProps
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const loadingBarRef = useRef<LoadingBarRef>(null)
    const { isOnline } = useNetworkStatus()
    const router = useRouter()

    useEffect(() => setTheme(window.__theme as 'light' | 'dark'), [])

    useEffect(() => {
        pageView(router.asPath)
    }, [router.asPath])

    useEffect(() => {
        const onRouteChangeStart = () => {
            loadingBarRef.current?.continuousStart(0, 100)
        }
        const onRouteChangeComplete = (pathname: string) => {
            loadingBarRef.current?.complete()
            pageView(pathname)
        }
        router.events.on('routeChangeStart', onRouteChangeStart)
        router.events.on('routeChangeComplete', onRouteChangeComplete)

        return () => {
            router.events.off('routeChangeStart', onRouteChangeStart)
            router.events.off('routeChangeComplete', onRouteChangeComplete)
        }
    }, [router.events])

    const handleToggleTheme = useCallback(() => {
        setTheme((prev) => {
            const theme = prev === 'light' ? 'dark' : 'light'
            window.__setPreferredTheme(theme)
            return theme
        })
    }, [])

    if (statusCode === 404) {
        return <Error statusCode={statusCode} />
    }

    return (
        <>
            {globalStyles}
            <QueryClientProvider client={queryClient}>
                <HtmlHead />
                <LoadingBar ref={loadingBarRef} color="#f1f3f5" />
                <Layout
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                    categories={categories}
                    currentArticle={article}
                >
                    <Component {...pageProps} />
                </Layout>
                <ModalRootPortalTag htmlId={MODAL_ROOT_PORTAL_TAG_HTML_ID} />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
    const appProps = await App.getInitialProps(appContext)
    const data = await fetchArticleMeta()

    const { res } = appContext.ctx

    const { query } = appContext.router

    let currentArticle: Article | undefined

    if (data !== null && query.excerpt) {
        const { excerpt } = query
        const { articles } = data
        currentArticle = data.articles[excerpt as keyof typeof articles]
    }

    let isNotFound = false
    if (res?.statusCode === 404) {
        isNotFound = true
    }
    if (
        appContext.router.pathname === '/editor' ||
        appContext.router.pathname === '/article/temp'
    ) {
        if (process.env.NODE_ENV !== 'development') {
            isNotFound = true
        }
    }

    appProps.pageProps = {
        categories: data ? data.categories.map((category) => category) : [],
        statusCode: isNotFound ? 404 : res?.statusCode ?? 200,
        theme: extractFromCookie(
            appContext.ctx.req?.headers.cookie,
            THEME_UNIQUE_KEY
        ),
        article: currentArticle,
    }

    return {
        ...appProps,
    }
}

export default MyApp
