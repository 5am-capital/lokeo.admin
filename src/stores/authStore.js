import {defineStore} from "pinia";
import http from "src/http";


export const useAuthStore = defineStore({
  id: 'auth',

  state: () => ({
    accessToken: localStorage.getItem('access-token'),
    refreshToken: localStorage.getItem('refresh-token'),
  }),

  getters: {
    isAuthorized: (state) => !!state.accessToken,
    getAccessToken: (state) => state.accessToken,
    getRefreshToken: (state) => state.refreshToken,
  },

  actions: {

    updateRefreshToken(token) {
      this.refreshToken = token;
      localStorage.setItem('refresh-token', this.refreshToken);
    },
    updateAccessToken(token) {
      this.accessToken = token;
      localStorage.setItem('access-token', this.accessToken);
    },
    removeTokens() {
      this.accessToken = null;
      this.refreshToken = null;

      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
    },
    async login(phoneNumber, password) {

      try {
        const phoneNumberAsLogin = true
        const {data} = await http.post('/authentication/login',
          {
            login: phoneNumber,
            password: password,
            usePhoneNumberAsLogin: phoneNumberAsLogin
          });

        this.updateAccessToken(data.accessToken)
        this.updateRefreshToken(data.refreshToken)

      } catch (e) {
        return Promise.reject(e);
      }
    },
    logout() {
      this.removeTokens();
    },
  }
})
