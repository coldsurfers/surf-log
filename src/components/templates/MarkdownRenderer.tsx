import 'prismjs/themes/prism-tomorrow.css'
import { css } from '@emotion/css'
import { FC, useEffect } from 'react'
import { marked } from 'marked'

let prism: any = null
const isBrowser = typeof window !== 'undefined'
if (isBrowser) {
    prism = require('prismjs')
    require('prismjs/components/prism-bash.min.js')
    require('prismjs/components/prism-javascript.min.js')
    require('prismjs/components/prism-typescript.min.js')
    require('prismjs/components/prism-jsx.min.js')
    require('prismjs/components/prism-css.min.js')
    require('prismjs/components/prism-c.min.js')
    require('prismjs/components/prism-rust.min.js')
    require('prismjs/components/prism-json.min.js')
    require('prismjs/components/prism-toml.min.js')
}

interface Props {
    text: string
}

const MarkdownRenderer: FC<Props> = ({ text }) => {
    useEffect(() => {
        prism.highlightAll()
    }, [text])

    return (
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
                li,
                p {
                    line-height: 1.5em;
                    word-break: break-word;
                    code {
                        font-family: ui-monospace, SFMono-Regular, SF Mono,
                            Menlo, Consolas, Liberation Mono, monospace;
                        background: var(--oc-gray-0);
                        padding: 0.25rem;
                        font-size: 0.8em;
                        color: var(--oc-blue-6);
                        border: 1px solid var(--oc-gray-2);
                        border-radius: 2px;
                    }
                }

                // 코드 블록
                code[class*='language-'],
                pre[class*='language-'] {
                    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo,
                        Consolas, Liberation Mono, monospace;
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
                __html: marked.parse(text, {
                    breaks: true, // 일반 엔터로 새 줄 입력
                    sanitize: true, // 마크다운 내부 html 무시
                }),
            }}
        />
    )
}

export default MarkdownRenderer
