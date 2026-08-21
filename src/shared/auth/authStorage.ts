const REFRESH_TOKEN_KEY = "refreshToken";
const REFRESH_TOKEN_EXPIRES_AT_KEY = "refreshTokenExpiresAt";

export const authStorage = {
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(refreshToken: string, refreshTokenExpiresIn: number) {
    const expiresAt = Date.now() + refreshTokenExpiresIn * 1000;

    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    localStorage.setItem(REFRESH_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
  },

  isRefreshTokenExpired() {
    const expiresAt = localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY);

    if (!expiresAt) {
      return true;
    }

    return Date.now() >= Number(expiresAt);
  },

  clear() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
  },
};
