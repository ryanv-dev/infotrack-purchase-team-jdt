import axios from "axios"

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const axiosApi = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json"
    }
})

export default axiosApi;