import axios from 'axios'

const axiosClient = axios.create({
    baseURL: 'https://api.coldsurf.io',
})

export default axiosClient
