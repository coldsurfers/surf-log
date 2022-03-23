import '../lib/injectGlobalStyle'
import ReactGA from 'react-ga'
import 'open-color/open-color.css'
import type { AppContext, AppProps } from 'next/app'
import Layout from '../components/layouts/PageLayout'
import { Article } from '../types/article'
import App from 'next/app'
import NetworkOfflineTemplate from '../components/templates/NetworkOfflineTemplate'
import Error from 'next/error'
import HtmlHead from '../components/layouts/HtmlHead'
import ModalRootPortalTag from '../components/modal/ModalRootPortalTag'
import { MODAL_ROOT_PORTAL_TAG_HTML_ID } from '../lib/constants'
import useNetworkStatus from '../lib/hooks/useNetworkStatus'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const { GA_TRACKING_ID } = process.env
if (GA_TRACKING_ID) {
    ReactGA.initialize(GA_TRACKING_ID, {
        debug: process.env.NODE_ENV === 'development',
    })
}

function MyApp({ Component, pageProps }: AppProps) {
    const loadingBarRef = useRef<LoadingBarRef>(null)
    const { categories, article, statusCode } = pageProps
    const { isOnline } = useNetworkStatus()
    const router = useRouter()

    useEffect(() => {
        const onRouteChangeStart = () => {
            loadingBarRef.current?.continuousStart(0, 100)
        }
        const onRouteChangeComplete = () => {
            loadingBarRef.current?.complete()
        }
        router.events.on('routeChangeStart', onRouteChangeStart)
        router.events.on('routeChangeComplete', onRouteChangeComplete)

        return () => {
            router.events.off('routeChangeStart', onRouteChangeStart)
            router.events.off('routeChangeComplete', onRouteChangeComplete)
        }
    }, [router.events])

    if (statusCode === 404) {
        return <Error statusCode={statusCode} />
    }

    return (
        <>
            <HtmlHead />
            <LoadingBar ref={loadingBarRef} color="#f1f3f5" />
            {isOnline ? (
                <Layout categories={categories} currentArticle={article}>
                    <Component {...pageProps} />
                </Layout>
            ) : (
                <NetworkOfflineTemplate />
            )}
            <ModalRootPortalTag htmlId={MODAL_ROOT_PORTAL_TAG_HTML_ID} />
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
