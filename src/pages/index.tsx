import type { GetStaticProps, NextPage } from 'next'
import ArticleListTemplate from '../components/templates/ArticleListTemplate'
import Head from 'next/head'
import { Profiler } from 'react'
import { Article } from '../lib/fetcher/types'
import { fetchArticleMeta } from '../lib/fetcher/articleMeta'

interface InitialProps {
    initialData: Article[]
}

const Home: NextPage<InitialProps> = ({ initialData }) => {
    return (
        <>
            <Head>
                <meta property="og:title" content="Surf.Log" />
                <meta
                    property="og:description"
                    content="Welcome to ColdSurf blog"
                />
            </Head>
            <Profiler
                id="ArticleListTemplate"
                onRender={(
                    id, // 방금 커밋된 Profiler 트리의 "id"
                    phase, // "mount" (트리가 방금 마운트가 된 경우) 혹은 "update"(트리가 리렌더링된 경우)
                    actualDuration, // 커밋된 업데이트를 렌더링하는데 걸린 시간
                    baseDuration, // 메모이제이션 없이 하위 트리 전체를 렌더링하는데 걸리는 예상시간
                    startTime, // React가 언제 해당 업데이트를 렌더링하기 시작했는지
                    commitTime, // React가 해당 업데이트를 언제 커밋했는지
                    interactions // 이 업데이트에 해당하는 상호작용들의 집합
                ) => {
                    console.log(id, phase, actualDuration)
                }}
            >
                <ArticleListTemplate
                    articles={initialData}
                    onLoadMore={() => {}}
                    isLoading={false}
                />
            </Profiler>
        </>
    )
}

export const getStaticProps: GetStaticProps<InitialProps> = async (ctx) => {
    const data = await fetchArticleMeta()
    if (!data) {
        return {
            props: {
                initialData: [],
            },
        }
    }
    const { articles } = data
    return {
        props: {
            initialData: Object.keys(articles).map(
                (excerpt) => articles[excerpt as keyof typeof articles]
            ),
        },
    }
}

export default Home
