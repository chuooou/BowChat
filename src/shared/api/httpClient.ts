import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
});

http.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 만료 공통 처리
      // 예: 토큰 갱신 요청 ->
      // 1. 토큰 발급 -> 정상 동작
      // 2. 토큰 미발급 -> 로그인 페이지로 리다이렉트
    }

    return Promise.reject(error);
  },
);

export default http;
