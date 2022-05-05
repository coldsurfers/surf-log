import styled from '@emotion/styled'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import fetcher from '../../lib/fetcher'
import { Article } from '../../types/article'

const TagTitle = styled.h1`
    margin: 0px;
`

interface InitialProps {
    initialData: Article[]
}

const TagsTagPage: NextPage<InitialProps> = ({ initialData }) => {
    const router = useRouter()
    const { tag } = router.query
    return (
        <>
            <TagTitle>#{tag}</TagTitle>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<InitialProps> = async (
    ctx
) => {
    if (!ctx.params?.tag) {
        return {
            props: {
                initialData: [],
            },
        }
    }
    const { tag } = ctx.params
    const { list } = await fetcher.articleList({ page: 1, tag: tag as string })

    return {
        props: {
            initialData: list,
        },
    }
}

export default TagsTagPage
