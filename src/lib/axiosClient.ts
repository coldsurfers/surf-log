import axios from 'axios'

const axiosClient = axios.create({
    baseURL: process.env.SERVER_HOST,
})

export default axiosClient
