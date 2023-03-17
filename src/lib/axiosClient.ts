import axios from 'axios'

const axiosClient = axios.create({
    baseURL: process.env.SERVER_HOST,
    withCredentials: true,
})

export default axiosClient
