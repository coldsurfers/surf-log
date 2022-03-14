import type { GetStaticProps, NextPage } from 'next'
import { Article } from '../types/article'

const Home: NextPage<{ articles: Article[] }> = (props) => {
    console.log(props.articles)
    return null
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const res = await fetch('http://localhost:3000/article-meta.json')
    const articleMeta = (await res.json()) as Article[]
    return {
        props: {
            ...articleMeta,
        },
    }
}

export default Home
