import { css, Global } from '@emotion/react'
import { generateCssVar, themeVariables } from '@coldsurfers/ocean-road'

const lightTheme = `
    --body-background: var(--oc-gray-1);
    --article-container-background: #ffffff;
    --article-title-text-color: #000000;
    --article-subtitle-text-color: #7a7c85;
    --article-date-border-top-color: #eff0f5;
    --sidebar-nav-item-text-color: #000000;
    --sidebar-nav-item-highlighted-background: #ffffff;
    --header-background: #ffffff;
    --header-logo-background: var(--oc-gray-3);
    --header-logo-text-color: #000000;
    --tag-page-title-text-color: #000000;

    --markdown-background: #ffffff;
    --markdown-text-color: #000000;
    --markdown-blockquote-background-color: var(--oc-gray-1);
    --markdown-code-fragment-border: 1px solid var(--oc-gray-2);

    --tag-badge-background-color: var(--oc-gray-2);
    --tag-badge-text-color: var(--oc-gray-9);
`
const darkTheme = `
    --body-background: var(--oc-gray-9);
    --article-container-background: var(--oc-gray-8);
    --article-title-text-color: var(--oc-gray-1);
    --article-subtitle-text-color: var(--oc-gray-2);
    --article-date-border-top-color: var(--oc-gray-9);
    --sidebar-nav-item-text-color: var(--oc-gray-0);
    --sidebar-nav-item-highlighted-background: var(--oc-gray-7);
    --header-background: #000000;
    --header-logo-background: var(--oc-gray-8);
    --header-logo-text-color: #ffffff;
    --tag-page-title-text-color: #ffffff;

    --markdown-background: var(--oc-gray-8);
    --markdown-text-color: #ffffff;
    --markdown-blockquote-background-color: var(--oc-gray-9);
    --markdown-code-fragment-border: 1px solid var(--oc-gray-7);

    --tag-badge-background-color: var(--oc-gray-7);
    --tag-badge-text-color: var(--oc-gray-2);
`

export const globalStyles = (
    <Global
        styles={css`
            @import url('//cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

            :root {
                --header-height: 56px;
                --common-font-family: Pretendard, -apple-system,
                    BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue',
                    'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR',
                    'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji',
                    'Segoe UI Symbol', sans-serif;
            }
            /** scrollbar unset */
            ::-webkit-scrollbar {
                background-color: rgba(0, 0, 0, 0);
                -webkit-border-radius: 80px;
            }
            ::-webkit-scrollbar:hover {
                background-color: rgba(0, 0, 0, 0.09);
            }
            ::-webkit-scrollbar-thumb:vertical {
                background-color: rgba(0, 0, 0, 0.61);
                -webkit-border-radius: 80px;
            }
            ::-webkit-scrollbar-thumb:vertical:active {
                background-color: rgba(0, 0, 0, 0.61);
                -webkit-border-radius: 80px;
            }
            /** scrollbar unset end */
            html {
                background: ${themeVariables['color-background-4']};
                font-family: var(--common-font-family);
                color-scheme: light;
                ${generateCssVar('lightMode')};
                ${lightTheme};
                overflow-y: overlay;
            }

            html.dark {
                color-scheme: dark;
                ${generateCssVar('darkMode')};
                ${darkTheme};
            }

            html,
            body {
                margin: 0;
                padding: 0;
            }

            a {
                text-decoration: none;
                color: inherit;
            }
            button {
                font-family: var(--common-font-family);
            }
        `}
    />
)
