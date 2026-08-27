type SetTokensParams = {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresIn: number;
};

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const REFRESH_TOKEN_EXPIRES_AT_KEY = "refreshTokenExpiresAt";

export const authStorage = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  setTokens({ accessToken, refreshToken, refreshTokenExpiresIn }: SetTokensParams) {
    const refreshTokenExpiresAt = Date.now() + refreshTokenExpiresIn * 1000;

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    localStorage.setItem(REFRESH_TOKEN_EXPIRES_AT_KEY, String(refreshTokenExpiresAt));
  },

  isRefreshTokenExpired() {
    const expiresAt = localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY);

    if (!expiresAt) {
      return true;
    }

    return Date.now() >= Number(expiresAt);
  },

  hasStoredToken() {
    return Boolean(
      localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY),
    );
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);

    window.location.replace("/");
  },
};
