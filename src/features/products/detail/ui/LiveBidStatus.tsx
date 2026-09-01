import { useEffect, useState } from "react";

import { formatRelativeTime } from "@/shared/lib/formatTime";

type Bid = {
  bidderNickname: string;
  amount: number;
  bidAt: string;
};

type BidPlacedMessage = {
  type: "BID_PLACED";
  productId: number;
  bidderNickname: string;
  amount: number;
  bidAt: string;
};

type AuctionSnapshotMessage = {
  type: "AUCTION_SNAPSHOT";
  productId: number;
  highestBid: number;
  highestBidder: string;
  bids: Bid[];
};

type AuctionSocketMessage = AuctionSnapshotMessage | BidPlacedMessage;

// 츄 - 추후 소켓 훅이나 클래스로 분리

const LiveBidStatus = ({ productId }: { productId: number }) => {
  const [auction, setAuction] = useState<AuctionSnapshotMessage | null>(null);

  useEffect(() => {
    const socket = new WebSocket(`${import.meta.env.VITE_API_BASE_URL}/ws/products/${productId}`);

    socket.addEventListener("open", () => {
      console.log("웹소켓 연결 성공");
    });

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data) as AuctionSocketMessage;

      switch (data.type) {
        case "AUCTION_SNAPSHOT":
          setAuction(data);
          break;

        case "BID_PLACED":
          setAuction((prev) => {
            if (!prev) return prev;

            return {
              ...prev,

              highestBid: data.amount,

              highestBidder: data.bidderNickname,

              bids: [
                {
                  bidderNickname: data.bidderNickname,
                  amount: data.amount,
                  bidAt: data.bidAt,
                },
                ...prev.bids,
              ],
            };
          });

          break;
      }
    });

    socket.addEventListener("error", (error) => {
      console.error("웹소켓 에러", error);
    });

    return () => {
      socket.close();
    };
  }, [productId]);

  if (!auction) {
    return <div>실시간 경매 정보 연결 중...</div>;
  }

  return (
    <article className="text-light-gray mt-[1.8rem] min-h-[190px] w-full rounded-[1.6rem] bg-[#1D2230] px-[1.2rem] py-[1.8rem] text-[1.3rem]">
      {!auction ? (
        <p>실시간 경매 정보 연결 중...</p>
      ) : (
        <>
          <p className="text-primary text-[1.2rem] font-bold">실시간 입찰 현황 · 미리보기</p>
          <div className="mt-[.7rem]">
            <span className="text-[2.8rem] font-bold text-white">
              {auction.highestBid.toLocaleString()}원
            </span>
            <span className="ml-[.8rem] text-[1.3rem]">
              최고 입찰자 <b>{auction.highestBidder}</b>
            </span>
          </div>
          {auction.bids.slice(0, 3).map((bid, index) => (
            <p key={index} className="border-gray border-t py-[.5rem]">
              {bid.bidderNickname}님이 {bid.amount.toLocaleString()}원으로 입찰했어요 ·{" "}
              {formatRelativeTime(bid.bidAt)}
            </p>
          ))}
        </>
      )}
    </article>
  );
};

export default LiveBidStatus;
