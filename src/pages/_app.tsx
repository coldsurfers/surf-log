import type { AppContext, AppInitialProps, AppProps } from 'next/app'
import { Global, css } from '@emotion/react'
import Layout from '../components/Layout'
import { Article } from '../types/article'
import App from 'next/app'
import 'open-color/open-color.css'

function MyApp({ Component, pageProps }: AppProps) {
    const { categories, article } = pageProps
    return (
        <>
            <Layout categories={categories} currentArticle={article}>
                <Component {...pageProps} />
            </Layout>
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
