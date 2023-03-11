/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        PAGE_API_PRE_URL: process.env.PAGE_API_PRE_URL,
        SERVER_HOST: process.env.SERVER_HOST,
        HOST_URL: process.env.HOST_URL,
    },
}

module.exports = nextConfig
