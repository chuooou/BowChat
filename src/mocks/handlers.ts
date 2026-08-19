import { delay, http, HttpResponse } from "msw";

const duplicatedEmails = ["test@example.com", "admin@example.com"];
const duplicatedNicknames = ["관리자", "테스트"];

export const handlers = [
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
