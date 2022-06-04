import styled from '@emotion/styled'
import { NextPage } from 'next'
import {
    ChangeEvent,
    KeyboardEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import MarkdownRenderer from '../../components/templates/MarkdownRenderer'
import { css } from '@emotion/css'
import FloatingButton from '../../components/buttons/FloatingButton'
import EditorSaveModal from '../../components/modal/EditorSaveModal'
import EditorRenderer from '../../components/templates/EditorRenderer'
import useTempSave from '../../lib/hooks/useTempSave'
import useSave from '../../lib/hooks/useSave'
import useDefaultEditorValues from '../../lib/hooks/useDefaultEditorValues'
import { EditorSaveModalValues } from '../../types/modal'
import TagBadge from '../../components/badges/TagBadge'

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

const TagsWrapper = styled.div`
    display: flex;
    align-items: center;
    padding-top: 1rem;
    padding-left: 1rem;
    flex-wrap: wrap;
`

const TagInput = styled.input`
    max-width: 150px;
    background-color: transparent;
    outline: none;
    border: none;
    color: #ffffff;
    margin-bottom: 1rem;
`

const EditorPage: NextPage = () => {
    const [editorText, setEditorText] = useState<string>('')
    useTempSave({ editorText })
    const { save } = useSave({ editorText })
    const { defaultEditorValue, defaultModalValues } = useDefaultEditorValues()
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const keydownMemoRef = useRef<{
        [key: string]: boolean
    }>({})
    const [tagValue, setTagValue] = useState<string>('')
    const [tags, setTags] = useState<string[]>([])
    const [fileDestinations, setFileDestinations] = useState<string[]>([])

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

    const onChangeTagInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setTagValue(value)
    }, [])

    const onChangeTagInputKeyDown: KeyboardEventHandler<HTMLInputElement> =
        useCallback(
            (e) => {
                if (e.key === 'Enter') {
                    setTags((prevState) => [
                        ...new Set(prevState.concat(tagValue)),
                    ])
                    setTagValue('')
                }
                if (e.key === 'Backspace' && tagValue === '') {
                    setTags((prevState) => prevState.slice(0, -1))
                }
            },
            [tagValue]
        )

    const onClickSave = useCallback(
        (modalValues: EditorSaveModalValues) => {
            save({ modalValues, tags })
        },
        [save, tags]
    )

    const onFileUploaded = useCallback(
        (path: string) => setFileDestinations((prev) => prev.concat(path)),
        []
    )

    useEffect(() => {
        return () => {
            if (modalOpen) {
                setModalOpen(false)
            }
        }
    }, [modalOpen])

    useEffect(() => {
        const onKeydown = (e: KeyboardEvent) => {
            keydownMemoRef.current[e.key] = true
            if (keydownMemoRef.current['Meta'] && keydownMemoRef.current['s']) {
                e.preventDefault()
                setModalOpen(true)
            }
            if (e.key === 'Escape') {
                if (modalOpen) {
                    setModalOpen(false)
                }
            }
        }
        const onKeyup = (e: KeyboardEvent) => {
            keydownMemoRef.current = {}
        }
        document.addEventListener('keydown', onKeydown)
        document.addEventListener('keyup', onKeyup)

        return () => {
            document.removeEventListener('keydown', onKeydown)
            document.removeEventListener('keyup', onKeyup)
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
                <TagsWrapper>
                    {tags.map((tag, index) => {
                        const onClick = () => {
                            setTags(
                                tags.filter((_, tagIndex) => tagIndex !== index)
                            )
                        }
                        return (
                            <TagBadge key={index} onClick={onClick}>
                                {tag}
                            </TagBadge>
                        )
                    })}
                    <TagInput
                        placeholder="태그 입력란"
                        onChange={onChangeTagInput}
                        value={tagValue}
                        onKeyDown={onChangeTagInputKeyDown}
                    />
                </TagsWrapper>
                <EditorRenderer
                    defaultValue={defaultEditorValue}
                    onCodeMirrorChange={onCodeMirrorChange}
                    onFileUploaded={onFileUploaded}
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
                onClickSave={onClickSave}
            />
        </Container>
    )
}

export default EditorPage
