import type { GetStaticProps, NextPage } from 'next'

const Home: NextPage = (props) => {
    console.log(props)
    return null
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const res = await fetch('http://localhost:3000/article-meta.json')
    const articles = await res.json()
    return {
        props: {
            articles,
        },
    }
}

export default Home
