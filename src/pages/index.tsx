import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { Article } from '../types/article'

const Home: NextPage<{ articles: Article[] }> = (props) => {
    const { articles } = props
    return (
        <div>
            {articles.map((article) => {
                return (
                    <Link
                        key={article.excerpt}
                        href={`/article/${article.excerpt}`}
                        passHref
                    >
                        <p>
                            {article.data.title} / {article.data.createdAt}
                        </p>
                    </Link>
                )
            })}
        </div>
    )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const res = await fetch('http://localhost:3000/article-meta.json')
    const articleMeta = (await res.json()) as {
        articles: {
            [key: string]: Article
        }
    }
    return {
        props: {
            articles: Object.entries(articleMeta.articles).map(
                ([key, content]) => content
            ),
        },
    }
}

export default Home
