import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/oceanic-next.css'
import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react'
import MarkdownRenderer from '../../components/templates/MarkdownRenderer'
import type { Editor, EditorConfiguration, Position } from 'codemirror'
import { css } from '@emotion/css'
import { useRouter } from 'next/router'
import FloatingButton from '../../components/buttons/FloatingButton'
import { Article } from '../../types/article'
import { EditorSaveModalValues } from '../../types/modal'
import EditorSaveModal from '../../components/modal/EditorSaveModal'

let CodeMirror: any = null

if (typeof window !== 'undefined') {
    CodeMirror = require('codemirror')
    require('codemirror/mode/markdown/markdown')
    require('codemirror/mode/javascript/javascript')
    require('codemirror/mode/jsx/jsx')
    require('codemirror/mode/css/css')
    require('codemirror/mode/shell/shell')
    require('codemirror/mode/clike/clike')
}

const Container = styled.div`
    display: flex;
    height: calc(100vh - var(--header-height));
`

const EditorPanel = styled.section`
    flex: 1;
    background-color: #343a40;
    display: flex;
    flex-direction: column;
    overflow: auto;
`

const EditorContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`

const PreviewPanel = styled.section`
    flex: 1;
    background-color: #ffffff;
    overflow: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 120px;
`

let codeMirror: Editor | null = null
let codeMirrorCursor: Position | null = null

const EditorPage: NextPage = () => {
    const router = useRouter()
    const { excerpt } = router.query
    const [text, setText] = useState<string>('')
    const editorRef = useRef<HTMLDivElement>(null)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [defaultModalValues, setDefaultModalValues] = useState<
        EditorSaveModalValues | undefined
    >(undefined)
    const intervalTimerRef: { current: NodeJS.Timer | null } = useRef(null)

    const onClickSaveButton = useCallback(() => {
        setModalOpen(true)
    }, [])

    const checkIsTempFileExists = useCallback(async () => {
        const res = await fetch('http://localhost:3000/api/save/temp', {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
        })
        const json = await res.json()
        return json as {
            error: string | null
            tempArticleText: string | null
        }
    }, [])

    const getExistingData = useCallback(async () => {
        if (!excerpt) {
            return null
        }
        const encodedExcerpt = encodeURIComponent(excerpt as string)
        const res = await fetch(
            `http://localhost:3000/api/article/${encodedExcerpt}`,
            {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }),
            }
        )
        const json = (await res.json()) as {
            data: Article | null
        }
        return json.data
    }, [excerpt])

    const onClickSave = useCallback(
        async (modalValues: EditorSaveModalValues) => {
            if (intervalTimerRef.current) {
                clearInterval(intervalTimerRef.current)
            }
            const res = await fetch('http://localhost:3000/api/save', {
                method: excerpt ? 'PATCH' : 'POST',
                body: JSON.stringify({
                    ...modalValues,
                    text,
                }),
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }),
            })
            const json = await res.json()
            if (json.error === null) {
                setModalOpen(false)
                router.push('/')
            }
        },
        [excerpt, router, text]
    )

    const temporarilySave = useCallback(async () => {
        return await fetch('http://localhost:3000/api/save/temp', {
            method: 'POST',
            body: JSON.stringify({
                text,
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
        })
    }, [text])

    useEffect(() => {
        if (!codeMirror) {
            codeMirror = CodeMirror(editorRef.current, {
                mode: {
                    name: 'markdown',
                },
                theme: 'oceanic-next',
                lineNumbers: true,
                lineWrapping: true,
            } as EditorConfiguration)
        }

        if (!codeMirror) return
        codeMirror.on('change', (editor, changeObj) => {
            const value = editor.getValue()
            const cursor = editor.getCursor()
            codeMirrorCursor = cursor
            setText(value)
        })

        return () => {
            if (codeMirror) {
                codeMirror = null
            }
            if (codeMirrorCursor) {
                codeMirrorCursor = null
            }
        }
    }, [])

    useEffect(() => {
        const check = async () => {
            const { error, tempArticleText } = await checkIsTempFileExists()
            if (!error && tempArticleText) {
                setText(tempArticleText)
                if (!codeMirror) {
                    codeMirror = CodeMirror(editorRef.current, {
                        mode: {
                            name: 'markdown',
                        },
                        theme: 'oceanic-next',
                        lineNumbers: true,
                        lineWrapping: true,
                    } as EditorConfiguration)
                }
                codeMirror?.setValue(tempArticleText)
            }
        }
        const getExisting = async () => {
            const data = await getExistingData()
            if (data) {
                const {
                    content,
                    data: { title, category, excerpt, thumbnail, createdAt },
                } = data
                setText(content)
                setDefaultModalValues({
                    title: title ?? '',
                    category: category ?? '',
                    excerpt: excerpt ?? '',
                    thumbnail: thumbnail ?? '',
                    createdAt: createdAt ?? '',
                })
                if (!codeMirror) {
                    codeMirror = CodeMirror(editorRef.current, {
                        mode: {
                            name: 'markdown',
                        },
                        theme: 'oceanic-next',
                        lineNumbers: true,
                        lineWrapping: true,
                    } as EditorConfiguration)
                }
                codeMirror?.setValue(content)
            }
        }
        if (excerpt) {
            getExisting()
        } else {
            check()
        }
    }, [checkIsTempFileExists, excerpt, getExistingData])

    useEffect(() => {
        if (!excerpt) {
            if (intervalTimerRef.current) {
                clearInterval(intervalTimerRef.current)
            }
            intervalTimerRef.current = setInterval(() => {
                temporarilySave()
            }, 3500)
        }

        return () => {
            if (!excerpt) {
                if (intervalTimerRef.current) {
                    clearInterval(intervalTimerRef.current)
                }
            }
        }
    }, [temporarilySave, excerpt])

    useEffect(() => {
        if (codeMirrorCursor && codeMirror) {
            codeMirror.setCursor(codeMirrorCursor)
        }
    }, [text])

    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    return (
        <Container>
            <EditorPanel
                className={css`
                    .CodeMirror {
                        flex: 1;
                        font-family: 'Fira Sans', sans-serif;
                        padding: 1rem;
                    }
                `}
            >
                <EditorContent ref={editorRef}></EditorContent>
            </EditorPanel>
            <PreviewPanel>
                <MarkdownRenderer text={text} />
            </PreviewPanel>
            <FloatingButton onClick={onClickSaveButton}>Save</FloatingButton>
            <EditorSaveModal
                open={modalOpen}
                onClickBackground={() => setModalOpen(false)}
                defaultModalValues={defaultModalValues}
                onClickSave={onClickSave}
            />
        </Container>
    )
}

export default EditorPage
