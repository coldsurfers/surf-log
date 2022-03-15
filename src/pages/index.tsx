import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { Article } from '../types/article'

interface ServerProps {
    articles: Article[]
}

const Home: NextPage<ServerProps> = (props) => {
    const { articles } = props
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {articles.map((article) => {
                return (
                    <Link
                        key={article.excerpt}
                        href={`/article/${article.excerpt}`}
                        passHref
                    >
                        <a>
                            {article.data.title} / {article.data.createdAt}
                        </a>
                    </Link>
                )
            })}
        </div>
    )
}

export const getStaticProps: GetStaticProps<ServerProps> = async (ctx) => {
    const articleMeta = (await import('../../public/article-meta.json')) as {
        articles: {
            [key: string]: Article
        }
        categories: string[]
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
