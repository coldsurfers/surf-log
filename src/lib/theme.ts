const cssVar = (name: string) => `var(--${name})`

export const themedPalette = {
    'body-background': cssVar('body-background'),
    'article-container-background': cssVar('article-container-background'),
    'article-title-text-color': cssVar('article-title-text-color'),
    'article-subtitle-text-color': cssVar('article-subtitle-text-color'),
    'article-date-border-top-color': cssVar('article-date-border-top-color'),
    'sidebar-nav-item-text-color': cssVar('sidebar-nav-item-text-color'),
    'sidebar-nav-item-highlighted-background': cssVar(
        'sidebar-nav-item-highlighted-background'
    ),
}
