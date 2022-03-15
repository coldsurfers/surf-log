import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { Article } from '../../types/article'

interface ServerProps {
    articles: Article[]
}

const Category: NextPage<ServerProps> = (props) => {
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
                        <a>{article.data.title}</a>
                    </Link>
                )
            })}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<
    ServerProps,
    {
        category: string
    }
> = async (ctx) => {
    if (!ctx.params) {
        return {
            props: {
                articles: [],
            },
        }
    }
    const { category } = ctx.params
    const articleMeta = (await import('../../../public/article-meta.json')) as {
        articles: {
            [key: string]: Article
        }
    }
    const articles = Object.entries(articleMeta.articles)
        .map(([key, content]) => {
            return content
        })
        .filter((article) => article.data.category === category)
    return {
        props: {
            articles,
        },
    }
}

export default Category
