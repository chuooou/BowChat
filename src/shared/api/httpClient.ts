import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})

http.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("accessToken");

        if(accessToken){config.headers.Authorization = `Bearer ${accessToken}`;}
        
        return config;
    }, 
    (error)=>{
        return Promise.reject(error);
    }   
)

export default http;