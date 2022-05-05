import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const TagTitle = styled.h1`
    margin: 0px;
`

const TagsTagPage: NextPage = () => {
    const router = useRouter()
    const { tag } = router.query
    return (
        <>
            <TagTitle>#{tag}</TagTitle>
        </>
    )
}

export default TagsTagPage
