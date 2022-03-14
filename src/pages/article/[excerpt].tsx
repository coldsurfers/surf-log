import { GetServerSideProps, NextPage } from 'next'
import { Article } from '../../types/article'
import { marked } from 'marked'

const Excerpt: NextPage<{ article?: Article | null }> = (props) => {
    const { article } = props

    if (!article) {
        return null
    }
    return (
        <div>
            <div
                dangerouslySetInnerHTML={{
                    __html: marked.parse(article.content),
                }}
            />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<
    {
        article: Article | null
    },
    {
        excerpt: string
    }
> = async (ctx) => {
    if (!ctx.params) {
        return {
            props: {
                article: null,
            },
        }
    }
    const { excerpt } = ctx.params
    const articleMeta = (await import('../../../public/article-meta.json')) as {
        articles: {
            [key: string]: Article
        }
    }
    const article = articleMeta.articles[encodeURI(excerpt)]
    return {
        props: {
            article: article,
        },
    }
}

export default Excerpt
