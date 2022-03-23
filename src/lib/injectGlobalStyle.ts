import { injectGlobal } from '@emotion/css'
import { themedPalette } from './theme'

const lightTheme = `
    --body-background: var(--oc-gray-1);
    --article-container-background: #ffffff;
`
const darkTheme = `
    --body-background: var(--oc-gray-6);
    --article-container-background: var(--oc-gray-8);
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
