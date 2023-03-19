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
    static async getInitialProps(
        ctx: DocumentContext
    ): Promise<DocumentInitialProps> {
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
        }
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function () {
                                function setTheme(newTheme) {
                                    window.__theme = newTheme;
                                    if (newTheme === 'dark') {
                                    document.documentElement.classList.add('dark');
                                    } else if (newTheme === 'light') {
                                    document.documentElement.classList.remove('dark');
                                    }
                                }
                                var preferredTheme;
                                try {
                                    preferredTheme = localStorage.getItem('${THEME_UNIQUE_KEY}');
                                } catch (err) { }
                                window.__setPreferredTheme = function(newTheme) {
                                    preferredTheme = newTheme;
                                    setTheme(newTheme);
                                    try {
                                    localStorage.setItem('${THEME_UNIQUE_KEY}', newTheme);
                                    } catch (err) { }
                                };
                                var initialTheme = preferredTheme;
                                var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
                                if (!initialTheme) {
                                    initialTheme = darkQuery.matches ? 'dark' : 'light';
                                }
                                setTheme(initialTheme);
                                darkQuery.addEventListener('change', function (e) {
                                    if (!preferredTheme) {
                                    setTheme(e.matches ? 'dark' : 'light');
                                    }
                                });
                                // Detect whether the browser is Mac to display platform specific content
                                // An example of such content can be the keyboard shortcut displayed in the search bar
                                document.documentElement.classList.add(
                                    window.navigator.platform.includes('Mac')
                                    ? "platform-mac"
                                    : "platform-win"
                                );
                                })();
                            `,
                        }}
                    />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
