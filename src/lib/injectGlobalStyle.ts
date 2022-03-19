import { injectGlobal } from '@emotion/css'

injectGlobal`
    @import url('//fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,100;1,200;1,300;1,400;1,500;1,600&display=swap');
    :root {
        --header-height: 56px;
    }
    html {
        background-color: var(--oc-gray-1);
    }
    body {
        font-family: 'Fira Sans', sans-serif;
        margin: 0px;
    }
    a {
        text-decoration: none;
        color: inherit;
    }
    button {
        font-family: 'Fira Sans', sans-serif;
    }
`
