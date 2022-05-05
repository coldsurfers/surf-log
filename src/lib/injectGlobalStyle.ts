import { injectGlobal } from '@emotion/css'
import { themedPalette } from './theme'

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
`

injectGlobal`
    @import url('//fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,100;1,200;1,300;1,400;1,500;1,600&display=swap');
    :root {
        --header-height: 56px;
        --common-font-family: 'Fira Sans', sans-serif;
    }
    body {
        ${lightTheme}
        background: ${themedPalette['body-background']};
        font-family: var(--common-font-family);
        margin: 0px;
    }
    @media (prefers-color-scheme: dark) {
        body {
            ${darkTheme}
        }
    }
    body[data-theme='light'] {
        ${lightTheme}
    }
    body[data-theme='dark'] {
        ${darkTheme}
    }
    a {
        text-decoration: none;
        color: inherit;
    }
    button {
        font-family: 'Fira Sans', sans-serif;
    }
`
