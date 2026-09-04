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

type EnterChatRoomRequest =
  { roomType: "DIRECT" | "AUCTION"; productId: number } | { roomType: "GROUP"; roomName: string };

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
        highestBidder: "왈왈",
        bids: [
          {
            bidderNickname: "왈왈",
            amount: 710000,
            bidAt: new Date(now - 60000).toISOString(),
          },
          {
            bidderNickname: "tester",
            amount: 730000,
            bidAt: new Date(now - 240_000).toISOString(),
          },
          {
            bidderNickname: "아이패드좋아",
            amount: 735000,
            bidAt: new Date(now - 240_000).toISOString(),
          },
        ],
      }),
    );

    setTimeout(() => {
      client.send(
        JSON.stringify({
          type: "BID_PLACED",
          productId: Number(params.productId),
          bidderNickname: "당근",
          amount: 760000,
          bidAt: new Date().toISOString(),
        }),
      );
    }, 2000);

    setTimeout(() => {
      client.send(
        JSON.stringify({
          type: "BID_PLACED",
          productId: Number(params.productId),
          bidderNickname: "아이패드좋아",
          amount: 765000,
          bidAt: new Date().toISOString(),
        }),
      );
    }, 5000);
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

  http.post("*/api/chat/rooms/enter", async ({ request }) => {
    await delay(400);

    const body = (await request.json()) as EnterChatRoomRequest;

    switch (body.roomType) {
      case "DIRECT":
        return HttpResponse.json({
          roomId: 100,
          roomType: body.roomType,
          roomName: "상품 채팅방",
        });

      case "AUCTION":
        return HttpResponse.json({
          roomId: 100,
          roomType: body.roomType,
          roomName: "상품 경매방",
        });

      case "GROUP":
        return HttpResponse.json({
          roomId: 100,
          roomType: body.roomType,
          roomName: body.roomName,
        });

      default:
        return HttpResponse.json({ message: "지원하지 않는 채팅방 타입입니다." }, { status: 400 });
    }
  }),

  http.get("*/api/auctions/:productId", async ({ params, request }) => {
    await delay(400);

    const authorization = request.headers.get("Authorization");
    const hasAccessToken =
      authorization?.startsWith("Bearer ") && Boolean(authorization.slice(7).trim());

    return HttpResponse.json({
      id: Number(params.productId),
      name: "아이패드 프로 11인치",
      description:
        "깨끗하게 사용한 아이패드 프로입니다. 풀박스!! 구성품 모두 포함되어 있습니다. 상태 A+++++급입니다",
      price: 700000,
      imageUrls: [
        "https://dimg.donga.com/wps/NEWS/IMAGE/2024/07/04/125768056.1.jpg",
        "https://www.itworld.co.kr/wp-content/uploads/2025/11/4097142-0-84964800-1764209702-iPad-Accessories-Hero-3.jpg?quality=50&strip=all&w=1024",
      ],
      sellerNickname: "츄츄",
      saleType: "AUCTION" as const,
      // "BEFORE_START" | "IN_PROGRESS" | "ENDED";
      auctionStatus: "IN_PROGRESS" as const,
      startAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      isSeller: Boolean(hasAccessToken),
      isWinner: false,
      hasBid: true,
      myBidAmount: 750000,
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

  http.get("*/api/chat/rooms/:roomId", async ({ params, request }) => {
    await delay(400);

    const authorization = request.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ") || !authorization.slice(7).trim()) {
      return HttpResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    return HttpResponse.json({
      roomId: Number(params.roomId),
      roomType: "AUCTION" as const,
      roomName: "아이패드 프로 11인치 · 입찰방",
      product: {
        productId: 1,
        name: "아이패드 프로 11인치",
        imageUrl: "https://placehold.co/80x80",
        endAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      },
      auction: {
        highestBid: 750000,
        highestBidder: "user01",
        participantCount: 6,
        myRank: 1,
        isHighestBidder: true,
      },
      messages: [
        {
          id: "6610f8f86a4d632b52f68cb1",
          senderId: 7,
          senderName: "user02",
          amount: 730000,
          messageType: "AUCTION_BID" as const,
          createdAt: "2026-09-04T10:31:00+09:00",
        },
        {
          id: "6610f90a6a4d632b52f68cb2",
          senderId: 1,
          senderName: "츄츄",
          amount: 750000,
          messageType: "AUCTION_BID" as const,
          createdAt: "2026-09-04T10:33:00+09:00",
        },
      ],
    });
  }),

  http.get("*/api/chat/messages/:roomId", async ({ request }) => {
    await delay(400);

    const authorization = request.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ") || !authorization.slice(7).trim()) {
      return HttpResponse.json({ status: 401 });
    }

    return HttpResponse.json({
      messages: [
        {
          id: "6610f8f86a4d632b52f68cb1",
          roomId: 100,
          senderId: 4,
          senderName: "츄츄",
          content: "730000",
          messageType: "AUCTION_BID",
          createDate: "2026-09-04T14:10:00",
        },
        {
          id: "6610f90a6a4d632b52f68cb2",
          roomId: 100,
          senderId: 7,
          senderName: "판매자",
          content: "네, 안녕하세요!",
          messageType: "AUCTION_BID",
          createDate: "2026-09-04T14:11:20",
        },
      ],
    });
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
