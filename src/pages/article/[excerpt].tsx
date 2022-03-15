import { GetServerSideProps, NextPage } from 'next'
import { Article } from '../../types/article'
import { marked } from 'marked'
import { css } from '@emotion/css'
import { useEffect } from 'react'
import 'prismjs/themes/prism-tomorrow.css'

let prism: any = null
const isBrowser = typeof window !== 'undefined'
if (isBrowser) {
    prism = require('prismjs')
    require('prismjs/components/prism-bash.min.js')
    require('prismjs/components/prism-javascript.min.js')
    require('prismjs/components/prism-jsx.min.js')
    require('prismjs/components/prism-css.min.js')
}

const Excerpt: NextPage<{ article?: Article | null }> = (props) => {
    const { article } = props

    useEffect(() => {
        prism.highlightAll()
    }, [])

    if (!article) {
        return null
    }
    return (
        <div
            style={{
                background: '#ffffff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0px -5px 20px 10px rgb(92 95 112 / 8%)',
                marginBottom: '1rem',
            }}
        >
            <div
                className={css`
                    blockquote {
                        border-left: 4px solid var(--oc-blue-6);
                        padding: 1rem;
                        background: var(--oc-gray-1);
                        margin-left: 0;
                        margin-right: 0;
                        p {
                            margin: 0;
                        }
                    }

                    h1,
                    h2,
                    h3,
                    h4 {
                        font-weight: 500;
                    }

                    // 텍스트 사이의 코드
                    h1,
                    h2,
                    h3,
                    h4,
                    h5,
                    p {
                        code {
                            /* font-family: 'D2 Coding'; */
                            background: var(--oc-gray-0);
                            padding: 0.25rem;
                            color: var(--oc-blue-6);
                            border: 1px solid var(--oc-gray-2);
                            border-radius: 2px;
                        }
                    }

                    // 코드 블록
                    code[class*='language-'],
                    pre[class*='language-'] {
                        /* font-family: 'D2 Coding'; */
                    }

                    a {
                        color: var(--oc-blue-6);
                        &:hover {
                            color: var(--oc-blue-5);
                            text-decoration: underline;
                        }
                    }

                    // 표 스타일
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }

                    table,
                    th,
                    td {
                        border: 1px solid var(--oc-gray-4);
                    }

                    th,
                    td {
                        font-size: 0.9rem;
                        padding: 0.25rem;
                        text-align: left;
                    }

                    // 이미지 최대사이즈 설정 및 중앙정렬
                    img {
                        max-width: 100%;
                        margin: 0 auto;
                        display: block;
                    }
                `}
                dangerouslySetInnerHTML={{
                    __html: marked.parse(article.content, {
                        breaks: true, // 일반 엔터로 새 줄 입력
                        sanitize: true, // 마크다운 내부 html 무시
                    }),
                }}
            />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<
    {
        article: Article | null
    },
    {
        excerpt: string
    }
> = async (ctx) => {
    if (!ctx.params) {
        return {
            props: {
                article: null,
            },
        }
    }
    const { excerpt } = ctx.params
    const articleMeta = (await import('../../../public/article-meta.json')) as {
        articles: {
            [key: string]: Article
        }
    }
    const article = articleMeta.articles[encodeURI(excerpt)]
    return {
        props: {
            article: article,
        },
    }
}

export default Excerpt
