import Document, {
    DocumentContext,
    DocumentInitialProps,
    Html,
    Head,
    Main,
    NextScript,
} from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import { cache } from '@emotion/css'
import { Fragment } from 'react'
import extractFromCookie from '../lib/extractFromCookie'
import { THEME_UNIQUE_KEY } from '../lib/constants'

const renderStatic = async (html: string) => {
    if (html === undefined) {
        throw new Error('did you forget to return html from renderToString?')
    }
    const { extractCritical } = createEmotionServer(cache)
    const { ids, css } = extractCritical(html)

    return { html, ids, css }
}

export default class AppDocument extends Document<{ theme: string | null }> {
    static async getInitialProps(ctx: DocumentContext): Promise<
        DocumentInitialProps & {
            theme: string | null
        }
    > {
        const page = await ctx.renderPage()
        const { css, ids } = await renderStatic(page.html)
        const initialProps = await Document.getInitialProps(ctx)
        return {
            ...initialProps,
            styles: (
                <Fragment>
                    {initialProps.styles}
                    <style
                        data-emotion={`css ${ids.join(' ')}`}
                        dangerouslySetInnerHTML={{ __html: css }}
                    />
                </Fragment>
            ),
            theme: extractFromCookie(ctx.req?.headers.cookie, THEME_UNIQUE_KEY),
        }
    }

    render() {
        const { theme } = this.props
        return (
            <Html>
                <Head />
                <body data-theme={theme}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
