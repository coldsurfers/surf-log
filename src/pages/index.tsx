import type { GetStaticProps, NextPage } from 'next'
import { Article } from '../types/article'

const Home: NextPage<{ articles: Article[] }> = (props) => {
    const { articles } = props
    return (
        <div>
            {articles.map((article, index) => {
                return (
                    <div key={index}>
                        {article.data.title} / {article.data.createdAt}
                    </div>
                )
            })}
        </div>
    )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const res = await fetch('http://localhost:3000/article-meta.json')
    const articleMeta = (await res.json()) as {
        articles: Article[]
    }
    return {
        props: {
            ...articleMeta,
        },
    }
}

export default Home
