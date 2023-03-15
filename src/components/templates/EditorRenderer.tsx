import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/oceanic-next.css'
import styled from '@emotion/styled'
import { Editor, EditorChange, EditorConfiguration, Position } from 'codemirror'
import { DragEventHandler, FC, useCallback, useEffect, useRef } from 'react'
import { css } from '@emotion/css'
import useSaveFile from '../../lib/hooks/useSaveFile'

let CodeMirror: any = null

if (typeof window !== 'undefined') {
    CodeMirror = require('codemirror')
    require('codemirror/mode/markdown/markdown')
    require('codemirror/mode/javascript/javascript')
    require('codemirror/mode/jsx/jsx')
    require('codemirror/mode/css/css')
    require('codemirror/mode/shell/shell')
    require('codemirror/mode/clike/clike')
    require('codemirror/mode/rust/rust')
    require('codemirror/mode/toml/toml')
    require('codemirror/mode/ruby/ruby')
}

const EditorContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`

interface Props {
    defaultValue?: string
    onCodeMirrorChange: (editor: Editor, changeObj: EditorChange) => void
}

const EditorRenderer: FC<Props> = ({ defaultValue, onCodeMirrorChange }) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const codeMirrorRef = useRef<Editor | null>(null)
    const codeMirrorCursorRef = useRef<Position | null>(null)
    const { mutate: mutateSaveFile, data: uploadedS3URL } = useSaveFile()

    const onDragOverEnd: DragEventHandler<HTMLElement> = useCallback((e) => {
        e.preventDefault()
    }, [])

    const onDrop: DragEventHandler<HTMLElement> = useCallback(
        async (e) => {
            e.preventDefault()
            const { items } = e.dataTransfer
            if (items.length === 0) return
            const targetItem = items[0]
            const file = targetItem.getAsFile()
            if (file !== null) {
                mutateSaveFile({ file, type: 'content-images' })
            }
        },
        [mutateSaveFile]
    )

    useEffect(() => {
        if (codeMirrorCursorRef.current && codeMirrorRef.current) {
            codeMirrorRef.current.setCursor(codeMirrorCursorRef.current)
        }
    }, [])

    useEffect(() => {
        if (defaultValue) {
            if (!codeMirrorRef.current) {
                codeMirrorRef.current = CodeMirror(editorRef.current, {
                    mode: {
                        name: 'markdown',
                    },
                    theme: 'oceanic-next',
                    lineNumbers: true,
                    lineWrapping: true,
                } as EditorConfiguration)
            }
            codeMirrorRef.current?.setValue(defaultValue)
        }
    }, [defaultValue])

    useEffect(() => {
        if (codeMirrorRef.current === null) {
            codeMirrorRef.current = CodeMirror(editorRef.current, {
                mode: {
                    name: 'markdown',
                },
                theme: 'oceanic-next',
                lineNumbers: true,
                lineWrapping: true,
            } as EditorConfiguration)
        }

        if (!codeMirrorRef.current) return
        codeMirrorRef.current.on('change', (editor, changeObj) => {
            const cursor = editor.getCursor()
            codeMirrorCursorRef.current = cursor
            onCodeMirrorChange(editor, changeObj)
        })
    }, [onCodeMirrorChange])

    useEffect(() => {
        return () => {
            if (codeMirrorRef.current) {
                codeMirrorRef.current = null
            }
            if (codeMirrorCursorRef.current) {
                codeMirrorCursorRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        if (uploadedS3URL) {
            const { current: ref } = codeMirrorRef
            if (!ref) return
            const existingCodeMirrorValue = ref.getValue()
            if (existingCodeMirrorValue) {
                codeMirrorRef.current?.setValue(
                    `${existingCodeMirrorValue}\n![${uploadedS3URL}](${uploadedS3URL})`
                )
            } else {
                codeMirrorRef.current?.setValue(
                    `${existingCodeMirrorValue}![${uploadedS3URL}](${uploadedS3URL})`
                )
            }
        }
    }, [uploadedS3URL])

    return (
        <EditorContent
            onDragOver={onDragOverEnd}
            onDragEnd={onDragOverEnd}
            onDrop={onDrop}
            className={css`
                .CodeMirror {
                    font-family: 'Fira Sans', sans-serif;
                }
            `}
            ref={editorRef}
        />
    )
}

export default EditorRenderer
