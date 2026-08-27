import { delay, http, HttpResponse } from "msw";

const duplicatedEmails = ["test@example.com", "admin@example.com"];
const duplicatedNicknames = ["관리자", "테스트"];

export const handlers = [
  http.post("*/auth/login", async ({ request }) => {
    await delay(400);

    const { autoLogin } = (await request.json()) as { autoLogin: boolean };

    return HttpResponse.json({
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      refreshTokenExpiresIn: 60 * 60 * 24 * (autoLogin ? 7 : 1),
      userInfo: {
        id: 1,
        email: "test@example.com",
        nickname: "테스트 사용자",
      },
    });
  }),

  // 토큰 재발급 성공 응답
  http.post("*/auth/refresh", async () => {
    await delay(400);

    return HttpResponse.json({
      accessToken: "mock-refreshed-access-token",
    });
  }),

  // 토큰 재발급 실패 응답을 테스트할 때 위 성공 핸들러를 주석 처리하고 사용하세요.
  // http.post("*/auth/refresh", async () => {
  //   await delay(400);
  //
  //   return HttpResponse.json(
  //     { message: "유효하지 않거나 만료된 리프레시 토큰입니다." },
  //     { status: 401 },
  //   );
  // }),

  http.get("*/user/check-email", async ({ request }) => {
    await delay(400);

    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return HttpResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
    }

    return HttpResponse.json({
      available: !duplicatedEmails.includes(email),
    });
  }),

  http.get("*/user/check-nickname", async ({ request }) => {
    await delay(400);

    const url = new URL(request.url);
    const nickname = url.searchParams.get("nickname");

    if (!nickname) {
      return HttpResponse.json({ message: "닉네임을 입력해주세요." }, { status: 400 });
    }

    return HttpResponse.json({
      available: !duplicatedNicknames.includes(nickname),
    });
  }),
];
