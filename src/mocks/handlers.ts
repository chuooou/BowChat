import { delay, http, HttpResponse, ws } from "msw";

const duplicatedEmails = ["test@example.com", "admin@example.com"];
const duplicatedNicknames = ["관리자", "테스트"];

type CreateProductRequest = {
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  saleType: "AUCTION" | "DIRECT";
};

const productAuctionSocket = ws.link("*/ws/products/:productId");

const productAuctionSocketHandler = productAuctionSocket.addEventListener(
  "connection",
  ({ client, params }) => {
    const now = Date.now();

    client.send(
      JSON.stringify({
        type: "AUCTION_SNAPSHOT",
        productId: Number(params.productId),
        highestBid: 750000,
        highestBidder: "user01",
        bids: [
          {
            bidderNickname: "user01",
            amount: 750000,
            bidAt: new Date(now).toISOString(),
          },
          {
            bidderNickname: "user02",
            amount: 730000,
            bidAt: new Date(now - 60_000).toISOString(),
          },
        ],
      }),
    );
  },
);

export const handlers = [
  productAuctionSocketHandler,

  http.get("*/auth/me", async ({ request }) => {
    await delay(400);

    const authorization = request.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ") || !authorization.slice(7).trim()) {
      return HttpResponse.json({ message: "액세스 토큰이 필요합니다." }, { status: 401 });
    }

    return HttpResponse.json({
      id: 1,
      email: "test@example.com",
      nickname: "츄츄",
    });
  }),

  // http.post("*/auth/login", async ({ request }) => {
  //   await delay(400);

  //   const { autoLogin } = (await request.json()) as { autoLogin: boolean };

  //   return HttpResponse.json({
  //     accessToken: "mock-access-token",
  //     refreshToken: "mock-refresh-token",
  //     refreshTokenExpiresIn: 60 * 60 * 24 * (autoLogin ? 7 : 1),
  //     userInfo: {
  //       id: 1,
  //       email: "test@example.com",
  //       nickname: "보경츄츄",
  //     },
  //   });
  // }),

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

  //   return HttpResponse.json(
  //     { message: "유효하지 않거나 만료된 리프레시 토큰입니다." },
  //     { status: 401 },
  //   );
  // }),

  http.get("*/api/products/:productId", async ({ params, request }) => {
    await delay(400);

    const authorization = request.headers.get("Authorization");
    const hasAccessToken =
      authorization?.startsWith("Bearer ") && Boolean(authorization.slice(7).trim());

    return HttpResponse.json({
      id: Number(params.productId),
      name: "아이패드 프로 11인치",
      description: "깨끗하게 사용한 아이패드 프로입니다. 구성품을 모두 포함합니다.",
      price: 700000,
      imageUrls: [
        "https://dimg.donga.com/wps/NEWS/IMAGE/2024/07/04/125768056.1.jpg",
        "https://www.itworld.co.kr/wp-content/uploads/2025/11/4097142-0-84964800-1764209702-iPad-Accessories-Hero-3.jpg?quality=50&strip=all&w=1024",
      ],
      sellerNickname: "츄츄",
      saleType: "AUCTION" as const,
      auctionStatus: "IN_PROGRESS" as const,
      remainingSeconds: 36 * 60,
      isSeller: Boolean(hasAccessToken),
    });
  }),

  http.post("*/api/products", async ({ request }) => {
    await delay(400);

    const authorization = request.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ") || !authorization.slice(7).trim()) {
      return HttpResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const product = (await request.json()) as CreateProductRequest;

    if (product.saleType !== "AUCTION" && product.saleType !== "DIRECT") {
      return HttpResponse.json(
        { message: "saleType은 AUCTION 또는 DIRECT여야 합니다." },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        id: 1,
        ...product,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),

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
