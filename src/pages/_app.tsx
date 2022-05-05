import '../lib/injectGlobalStyle'
import '../lib/ga/initialize'
import 'open-color/open-color.css'
import type { AppContext, AppProps } from 'next/app'
import Layout from '../components/layouts/PageLayout'
import { Article } from '../types/article'
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
import fetcher from '../lib/fetcher'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
    const [theme, setTheme] = useState<'light' | 'dark' | 'default'>('default')
    const loadingBarRef = useRef<LoadingBarRef>(null)
    const { categories, article, statusCode } = pageProps
    const { isOnline } = useNetworkStatus()
    const router = useRouter()

    const handleToggleTheme = useCallback(() => {
        setTheme((prev) => {
            const theme = prev === 'light' ? 'dark' : 'light'
            localStorage.setItem(THEME_UNIQUE_KEY, theme)
            document.cookie = `${THEME_UNIQUE_KEY}=${theme}; path=/;`
            return theme
        })
    }, [])

    useEffect(() => {
        const storedTheme = localStorage.getItem(THEME_UNIQUE_KEY)
        if (storedTheme === 'dark') {
            setTheme('dark')
        } else if (storedTheme === 'light') {
            setTheme('light')
        } else {
            const systemPrefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches
            if (systemPrefersDark) {
                setTheme('dark')
            } else {
                setTheme('light')
            }
        }
    }, [])

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

    useEffect(() => {
        const onPrefersColorSchemeChanged = (e: MediaQueryListEvent) => {
            if (localStorage.getItem(THEME_UNIQUE_KEY) === null) {
                setTheme(e.matches ? 'dark' : 'light')
            }
        }
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addListener(onPrefersColorSchemeChanged)

        return () => {
            window
                .matchMedia('(prefers-color-scheme: dark)')
                .addListener(onPrefersColorSchemeChanged)
        }
    }, [])

    useEffect(() => {
        if (theme !== 'default') {
            document.body.dataset.theme = theme
        }
    }, [theme])

    if (statusCode === 404) {
        return <Error statusCode={statusCode} />
    }

    return (
        <QueryClientProvider client={queryClient}>
            <HtmlHead />
            <LoadingBar ref={loadingBarRef} color="#f1f3f5" />
            {isOnline ? (
                <Layout
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                    categories={categories}
                    currentArticle={article}
                >
                    <Component {...pageProps} />
                </Layout>
            ) : (
                <NetworkOfflineTemplate />
            )}
            <ModalRootPortalTag htmlId={MODAL_ROOT_PORTAL_TAG_HTML_ID} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
    const appProps = await App.getInitialProps(appContext)
    const { articleMeta } = fetcher.getArticleMeta()

    const { res } = appContext.ctx

    let isNotFound = false
    if (res?.statusCode === 404) {
        isNotFound = true
    }
    if (appContext.router.pathname === '/editor') {
        if (process.env.NODE_ENV !== 'development') {
            isNotFound = true
        }
    }

    appProps.pageProps = {
        categories: articleMeta.categories,
        statusCode: isNotFound ? 404 : res?.statusCode ?? 200,
    }

    return {
        ...appProps,
    }
}

export default MyApp
