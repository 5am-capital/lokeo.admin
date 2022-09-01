import axios from 'axios';
import {useAuthStore} from "stores/authStore";


const API_URL = `${import.meta.env.VITE_HTTP_PROTOCOL}${import.meta.env.VITE_BACKEND_HOSTNAME}/web`;

axios.defaults.baseURL = API_URL;
axios.defaults.responseType = 'json';
axios.defaults.headers = {
  'Content-Type': 'application/json',
};

axios.interceptors.request.use((config) => {
    const authStore = useAuthStore();

    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    return response;
  },
  async (error) => {
    const authStore = useAuthStore();
    const originalConfig = error.config;
    if (originalConfig.url !== "/authentication/login" && error.response) {
      // Access Token was expired
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await axios.post("/token/refresh", {
            accessToken: authStore.getAccessToken,
            refreshToken: authStore.getRefreshToken,
          });
          console.log(rs)
          const { accessToken, refreshToken } = rs.data;

          authStore.updateAccessToken(accessToken);
          authStore.updateRefreshToken(refreshToken);
          return axios(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
