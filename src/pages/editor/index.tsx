import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react'
import MarkdownRenderer from '../../components/templates/MarkdownRenderer'
import { css } from '@emotion/css'
import { useRouter } from 'next/router'
import FloatingButton from '../../components/buttons/FloatingButton'
import { Article } from '../../types/article'
import { EditorSaveModalValues } from '../../types/modal'
import EditorSaveModal from '../../components/modal/EditorSaveModal'
import EditorRenderer from '../../components/templates/EditorRenderer'
import fetcher from '../../lib/fetcher'
import useTempSave from '../../lib/hooks/useTempSave'
import useSave from '../../lib/hooks/useSave'

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
    const router = useRouter()
    const { excerpt } = router.query
    const [editorText, setEditorText] = useState<string>('')
    useTempSave({ editorText, excerpt: excerpt as string })
    const { save } = useSave({ editorText, excerpt: excerpt as string })
    const [defaultEditorValue, setDefaultEditorValue] = useState<
        string | undefined
    >(undefined)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [defaultModalValues, setDefaultModalValues] = useState<
        EditorSaveModalValues | undefined
    >(undefined)

    const onClickSaveButton = useCallback(() => {
        setModalOpen(true)
    }, [])

    const checkIsTempFileExists = useCallback(async () => {
        const res = await fetcher.getTempSaved()
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
        const res = await fetcher.getArticleByExcerpt({ encodedExcerpt })
        const json = (await res.json()) as {
            data: Article | null
        }
        return json.data
    }, [excerpt])

    useEffect(() => {
        const check = async () => {
            const { error, tempArticleText } = await checkIsTempFileExists()
            if (!error && tempArticleText) {
                setDefaultEditorValue(tempArticleText)
            }
        }
        const getExisting = async () => {
            const data = await getExistingData()
            if (data) {
                const {
                    content,
                    data: { title, category, excerpt, thumbnail, createdAt },
                } = data
                setDefaultEditorValue(content)
                setDefaultModalValues({
                    title: title ?? '',
                    category: category ?? '',
                    excerpt: excerpt ?? '',
                    thumbnail: thumbnail ?? '',
                    createdAt: createdAt ?? '',
                })
            }
        }
        if (excerpt) {
            getExisting()
        } else {
            check()
        }
    }, [checkIsTempFileExists, excerpt, getExistingData])

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
                    onCodeMirrorChange={(editor, changeObj) => {
                        const value = editor.getValue()
                        setEditorText(value)
                    }}
                />
            </EditorPanel>
            <PreviewPanel>
                <MarkdownRenderer text={editorText} />
            </PreviewPanel>
            <FloatingButton onClick={onClickSaveButton}>Save</FloatingButton>
            <EditorSaveModal
                open={modalOpen}
                onClickBackground={() => setModalOpen(false)}
                defaultModalValues={defaultModalValues}
                onClickSave={save}
            />
        </Container>
    )
}

export default EditorPage
