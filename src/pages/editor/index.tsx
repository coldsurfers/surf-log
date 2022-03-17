import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import { Editor, EditorConfiguration, Position } from 'codemirror'
import { css } from '@emotion/css'

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

const SaveButton = styled.button`
    margin-left: auto;
    border: 1px solid #ffffff;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    box-shadow: 10px 20px 20px 20px rgb(92 95 112 / 8%);
    background-color: #ffffff;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 4px;
    padding-bottom: 4px;
    cursor: pointer;

    font-size: 13px;
    font-weight: bold;

    position: fixed;
    right: 10px;
    bottom: 10px;

    transition: all 0.5s linear;

    &:hover {
        background-color: rgba(0, 0, 0, 0.9);
        color: #ffffff;
    }
`

let codeMirror: Editor | null = null
let codeMirrorCursor: Position | null = null

const Editor: NextPage = () => {
    const [text, setText] = useState<string>('')
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        codeMirror = CodeMirror(editorRef.current, {
            mode: 'markdown',
            theme: 'monokai',
            lineNumbers: true,
            lineWrapping: true,
        } as EditorConfiguration)
        if (!codeMirror) return
        codeMirror.on('change', (editor, changeObj) => {
            const value = editor.getValue()
            const cursor = editor.getCursor()
            codeMirrorCursor = cursor
            setText(value)
        })
    }, [])

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
            <SaveButton>Save</SaveButton>
        </Container>
    )
}

export default Editor