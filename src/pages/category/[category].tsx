import { GetServerSideProps, NextPage } from 'next'
import ArticleListTemplate from '../../components/templates/ArticleListTemplate'
import { Article } from '../../types/article'

interface ServerProps {
    articles: Article[]
}

const Category: NextPage<ServerProps> = (props) => {
    const { articles } = props
    return <ArticleListTemplate articles={articles} />
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
