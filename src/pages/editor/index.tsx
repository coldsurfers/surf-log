import styled from '@emotion/styled'
import { NextPage } from 'next'

const Container = styled.div`
    display: flex;
    width: 100%;
    height: calc(100vh - var(--header-height));
`

const EditorPanel = styled.section`
    flex: 1;
    background-color: #343a40;
`

const PreviewPanel = styled.section`
    flex: 1;
    background-color: #ffffff;
`

const Editor: NextPage = () => {
    if (process.env.NODE_ENV !== 'development') {
        return null
    }
    return (
        <Container>
            <EditorPanel></EditorPanel>
            <PreviewPanel></PreviewPanel>
        </Container>
    )
}

export default Editor
