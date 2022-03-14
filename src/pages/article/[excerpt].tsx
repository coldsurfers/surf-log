import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
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

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const res = await fetch('http://localhost:3000/article-meta.json')
    const articleMeta = (await res.json()) as {
        articles: {
            [key: string]: Article
        }
    }
    return {
        paths: Object.entries(articleMeta.articles).map(([key, content]) => ({
            params: {
                excerpt: content.excerpt,
            },
        })),
        fallback: true, // false or 'blocking'
    }
}

export const getStaticProps: GetStaticProps<
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
    const res = await fetch('http://localhost:3000/article-meta.json')
    const articleMeta = (await res.json()) as {
        articles: {
            [key: string]: Article
        }
    }
    return {
        props: {
            article: articleMeta.articles[encodeURI(excerpt)],
        },
    }
}

export default Excerpt
