import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react'
import MarkdownRenderer from '../../components/templates/MarkdownRenderer'
import { css } from '@emotion/css'
import FloatingButton from '../../components/buttons/FloatingButton'
import EditorSaveModal from '../../components/modal/EditorSaveModal'
import EditorRenderer from '../../components/templates/EditorRenderer'
import useTempSave from '../../lib/hooks/useTempSave'
import useSave from '../../lib/hooks/useSave'
import useDefaultEditorValues from '../../lib/hooks/useDefaultEditorValues'

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

const PreviewPanel = styled.section`
    flex: 1;
    background-color: #ffffff;
    overflow: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 120px;
`

const EditorPage: NextPage = () => {
    const [editorText, setEditorText] = useState<string>('')
    useTempSave({ editorText })
    const { save } = useSave({ editorText })
    const { defaultEditorValue, defaultModalValues } = useDefaultEditorValues()
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const onClickSaveButton = useCallback(() => {
        setModalOpen(true)
    }, [])

    const onClickModalBackground = useCallback(() => setModalOpen(false), [])

    const onCodeMirrorChange = useCallback(
        (
            editor: CodeMirror.Editor,
            changeObj: CodeMirror.EditorChange
        ): void => {
            const value = editor.getValue()
            setEditorText(value)
        },
        []
    )

    useEffect(() => {
        return () => {
            if (modalOpen) {
                setModalOpen(false)
            }
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
                        padding: 1rem;
                    }
                `}
            >
                <EditorRenderer
                    defaultValue={defaultEditorValue}
                    onCodeMirrorChange={onCodeMirrorChange}
                />
            </EditorPanel>
            <PreviewPanel>
                <MarkdownRenderer text={editorText} />
            </PreviewPanel>
            <FloatingButton onClick={onClickSaveButton}>Save</FloatingButton>
            <EditorSaveModal
                open={modalOpen}
                onClickBackground={onClickModalBackground}
                defaultModalValues={defaultModalValues}
                onClickSave={save}
            />
        </Container>
    )
}

export default EditorPage
