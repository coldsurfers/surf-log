import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/oceanic-next.css'
import styled from '@emotion/styled'
import { NextPage } from 'next'
import {
    ChangeEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import MarkdownRenderer from '../../components/templates/MarkdownRenderer'
import type { Editor, EditorConfiguration, Position } from 'codemirror'
import { css } from '@emotion/css'
import Modal from '../../components/modal/Modal'
import { useRouter } from 'next/router'
import FloatingButton from '../../components/buttons/FloatingButton'

let CodeMirror: any = null

if (typeof window !== 'undefined') {
    CodeMirror = require('codemirror')
    require('codemirror/mode/markdown/markdown')
    require('codemirror/mode/javascript/javascript')
    require('codemirror/mode/jsx/jsx')
    require('codemirror/mode/css/css')
    require('codemirror/mode/shell/shell')
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

const SaveModal = styled.div`
    width: 500px;
    height: auto;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 10px 20px 20px 20px rgb(92 95 112 / 8%);
    padding: 1rem;
    display: flex;
    flex-direction: column;
`

let codeMirror: Editor | null = null
let codeMirrorCursor: Position | null = null

const EditorPage: NextPage = () => {
    const router = useRouter()
    const [text, setText] = useState<string>('')
    const editorRef = useRef<HTMLDivElement>(null)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalValues, setModalValues] = useState<{
        title: string
        excerpt: string
        thumbnail: string
        category: string
    }>({
        title: '',
        excerpt: '',
        thumbnail: '',
        category: '',
    })
    const intervalTimerRef: { current: NodeJS.Timer | null } = useRef(null)

    const onClickSaveButton = useCallback(() => {
        setModalOpen(true)
    }, [])

    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            const { name, value } = e.target
            setModalValues((prevState) => ({
                ...prevState,
                [name]: value,
            }))
        },
        []
    )

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

    const handleClickSaveModalSave = useCallback(async () => {
        if (intervalTimerRef.current) {
            clearInterval(intervalTimerRef.current)
        }
        const res = await fetch('http://localhost:3000/api/save', {
            method: 'POST',
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
    }, [modalValues, router, text])

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
        check()
    }, [checkIsTempFileExists])

    useEffect(() => {
        if (intervalTimerRef.current) {
            clearInterval(intervalTimerRef.current)
        }
        intervalTimerRef.current = setInterval(() => {
            temporarilySave()
        }, 3500)

        return () => {
            if (intervalTimerRef.current) {
                clearInterval(intervalTimerRef.current)
            }
        }
    }, [temporarilySave])

    useEffect(() => {
        if (codeMirrorCursor && codeMirror) {
            codeMirror.setCursor(codeMirrorCursor)
        }
    }, [text])

    useEffect(() => {
        if (!modalOpen) {
            setModalValues({
                title: '',
                excerpt: '',
                thumbnail: '',
                category: '',
            })
        }
    }, [modalOpen])

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
            <Modal
                open={modalOpen}
                onClickBackground={() => setModalOpen(false)}
            >
                <SaveModal
                    className={css`
                        label {
                            font-weight: bold;
                        }
                        input {
                            height: 1.5rem;
                            margin-top: 0.5rem;
                        }

                        input + label {
                            margin-top: 0.8rem;
                        }

                        button {
                            margin-top: 1rem;
                            font-weight: bold;
                            background-color: #000000;
                            border: 1px solid #000000;
                            border-radius: 3px;
                            color: #ffffff;
                            cursor: pointer;
                            height: 1.95rem;

                            &:active {
                                background-color: #ffffff;
                                color: #000000;
                            }
                        }
                    `}
                >
                    <label>Title</label>
                    <input
                        name="title"
                        value={modalValues.title}
                        onChange={handleChange}
                    />
                    <label>Excerpt</label>
                    <input
                        name="excerpt"
                        value={modalValues.excerpt}
                        onChange={handleChange}
                    />
                    <label>Category</label>
                    <input
                        name="category"
                        value={modalValues.category}
                        onChange={handleChange}
                    />
                    <label>Thumbnail</label>
                    <input
                        name="thumbnail"
                        value={modalValues.thumbnail}
                        onChange={handleChange}
                    />
                    <button onClick={handleClickSaveModalSave}>save</button>
                </SaveModal>
            </Modal>
        </Container>
    )
}

export default EditorPage
