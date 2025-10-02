import axios from "axios"

export const apiBaseUrl = "http://localhost:5128/api"

const axiosApi = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json"
    }
})

export default axiosApi;