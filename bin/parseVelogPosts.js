const https = require('https')
const fs = require('fs')
const path = require('path')
const StringDecoder = require('string_decoder').StringDecoder

const postList = []
const postDetailList = []

function fetchVelogPostBySlug(slug) {
    let jsonString = ''
    const decoder = new StringDecoder()

    return new Promise((resolve, reject) => {
        const req = https.request(
            {
                method: 'POST',
                hostname: 'v2cdn.velog.io',
                path: '/graphql',
                port: 443,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
            (res) => {
                res.on('data', (chunk) => {
                    const textChunk = decoder.write(chunk)
                    jsonString += textChunk
                })
                res.on('close', () => {
                    const {
                        data: { post },
                    } = JSON.parse(jsonString)
                    resolve(post)
                })
            }
        )
        req.on('error', (error) => {
            reject(error)
        })
        req.write(
            JSON.stringify({
                operationName: 'ReadPost',
                query: 'query ReadPost($username: String, $url_slug: String) {\n  post(username: $username, url_slug: $url_slug) {\n    id\n    title\n    released_at\n    updated_at\n    tags\n    body\n    short_description\n    is_markdown\n    is_private\n    is_temp\n    thumbnail\n    comments_count\n    url_slug\n    likes\n    liked\n    user {\n      id\n      username\n      profile {\n        id\n        display_name\n        thumbnail\n        short_bio\n        profile_links\n        __typename\n      }\n      velog_config {\n        title\n        __typename\n      }\n      __typename\n    }\n    comments {\n      id\n      user {\n        id\n        username\n        profile {\n          id\n          thumbnail\n          __typename\n        }\n        __typename\n      }\n      text\n      replies_count\n      level\n      created_at\n      level\n      deleted\n      __typename\n    }\n    series {\n      id\n      name\n      url_slug\n      series_posts {\n        id\n        post {\n          id\n          title\n          url_slug\n          user {\n            id\n            username\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    linked_posts {\n      previous {\n        id\n        title\n        url_slug\n        user {\n          id\n          username\n          __typename\n        }\n        __typename\n      }\n      next {\n        id\n        title\n        url_slug\n        user {\n          id\n          username\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
                variables: {
                    url_slug: slug,
                    username: 'killi8n',
                },
            })
        )
        req.end()
    })
}

function fetchVelogPosts(cursor) {
    let jsonString = ''
    const decoder = new StringDecoder()

    return new Promise((resolve, reject) => {
        const req = https.request(
            {
                method: 'POST',
                hostname: 'v2cdn.velog.io',
                path: '/graphql',
                port: 443,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
            (res) => {
                res.on('data', (chunk) => {
                    const textChunk = decoder.write(chunk)
                    jsonString += textChunk
                })
                res.on('close', () => {
                    const {
                        data: { posts },
                    } = JSON.parse(jsonString)
                    resolve(posts)
                })
            }
        )
        req.on('error', (error) => {
            reject(Error(error))
        })

        req.write(
            JSON.stringify({
                operationName: 'Posts',
                query: 'query Posts($cursor: ID, $username: String, $temp_only: Boolean, $tag: String, $limit: Int) {\n  posts(cursor: $cursor, username: $username, temp_only: $temp_only, tag: $tag, limit: $limit) {\n    id\n    title\n    short_description\n    thumbnail\n    user {\n      id\n      username\n      profile {\n        id\n        thumbnail\n        __typename\n      }\n      __typename\n    }\n    url_slug\n    released_at\n    updated_at\n    comments_count\n    tags\n    is_private\n    likes\n    __typename\n  }\n}\n',
                variables: {
                    username: 'killi8n',
                    tag: null,
                    cursor,
                },
            })
        )
        req.end()
    })
}

async function main() {
    let shouldRepeat = true
    let cursor
    while (shouldRepeat) {
        const posts = await fetchVelogPosts(cursor)
        if (posts.length === 0) {
            shouldRepeat = false
        } else {
            cursor = posts[posts.length - 1].id
            posts.forEach((post) => postList.push(post))
        }
    }

    const postDetails = await Promise.all(
        postList.map((post) => {
            return fetchVelogPostBySlug(post.url_slug)
        })
    )

    postDetails.forEach((postDetail) => {
        postDetailList.push(postDetail)
    })

    postDetailList.forEach((postDetail) => {
        fs.writeFileSync(
            path.resolve(
                __dirname,
                `../articles/${postDetail.title.split('/').join('&')}.md`
            ),
            `---
title: ${postDetail.title.split('[').join('').split(']').join('')}
excerpt: ${postDetail.title.split('[').join('').split(']').join('')}
category: velog
thumbnail: Velog.png
createdAt: ${postDetail.released_at}
---
${postDetail.body}
`,
            'utf8'
        )
    })
}

main()
