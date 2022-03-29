/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        PAGE_API_PRE_URL: process.env.PAGE_API_PRE_URL,
    },
}

module.exports = nextConfig
