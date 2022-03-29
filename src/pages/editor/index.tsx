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

const LOCAL_API_HOST = 'http://localhost:3000/api'
const LOCAL_API_HEADERS = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
})

const EditorPage: NextPage = () => {
    const router = useRouter()
    const { excerpt } = router.query
    const [editorText, setEditorText] = useState<string>('')
    const [defaultEditorValue, setDefaultEditorValue] = useState<
        string | undefined
    >(undefined)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [defaultModalValues, setDefaultModalValues] = useState<
        EditorSaveModalValues | undefined
    >(undefined)
    const intervalTimerRef: { current: NodeJS.Timer | null } = useRef(null)

    const onClickSaveButton = useCallback(() => {
        setModalOpen(true)
    }, [])

    const checkIsTempFileExists = useCallback(async () => {
        const res = await fetch(`${LOCAL_API_HOST}/save/temp`, {
            method: 'GET',
            headers: LOCAL_API_HEADERS,
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
        const res = await fetch(`${LOCAL_API_HOST}/article/${encodedExcerpt}`, {
            method: 'GET',
            headers: LOCAL_API_HEADERS,
        })
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
            const res = await fetch(`${LOCAL_API_HOST}/save`, {
                method: excerpt ? 'PATCH' : 'POST',
                body: JSON.stringify({
                    ...modalValues,
                    text: editorText,
                }),
                headers: LOCAL_API_HEADERS,
            })
            const json = await res.json()
            if (json.error === null) {
                setModalOpen(false)
                router.push('/')
            }
        },
        [excerpt, router, editorText]
    )

    const temporarilySave = useCallback(async () => {
        return await fetch(`${LOCAL_API_HOST}/save/temp`, {
            method: 'POST',
            body: JSON.stringify({
                text: editorText,
            }),
            headers: LOCAL_API_HEADERS,
        })
    }, [editorText])

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
                onClickSave={onClickSave}
            />
        </Container>
    )
}

export default EditorPage
