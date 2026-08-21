import axios from "axios";

import { tokenStore } from "@/shared/auth/tokenStore";

const config = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
};

const publicHttp = axios.create(config);
const http = axios.create(config);

http.interceptors.request.use(
  (config) => {
    const accessToken = tokenStore.getAccessToken();

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
      // refresh token으로 재발급 요청
      // 성공 → 새 access token 저장 → 기존 요청 한 번 재시도 / 다시 401이면 실패 처리
      // 실패 → 저장 정보 제거 → /login 이동
      //       if (error.response?.status === 401 && !originalRequest._retry) {
      //   originalRequest._retry = true;
      //   const newAccessToken = await refreshAccessToken();
      //   originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      //   return http(originalRequest);
      // }
    }

    return Promise.reject(error);
  },
);

// export { http, publicHttp };

//   async (error: AxiosError) => {
//     const originalRequest =
//       error.config as
//         | RetryRequestConfig
//         | undefined;

//     if (
//       error.response?.status !== 401 ||
//       !originalRequest ||
//       originalRequest._retry
//     ) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     try {
//       if (!refreshPromise) {
//         refreshPromise =
//           refreshTokenRequest().finally(
//             () => {
//               refreshPromise = null;
//             },
//           );
//       }

//       const accessToken =
//         await refreshPromise;

//       originalRequest.headers.Authorization =
//         `Bearer ${accessToken}`;

//       return http(originalRequest);
//     } catch {
//       tokenStore.clearAccessToken();
//       authStorage.clear();

//       return Promise.reject(error);
//     }
//   },
