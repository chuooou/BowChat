import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/model/useAuth";
import { useChatMessagesQuery } from "@/features/chat/api/useChatMessagesQuery";
import { useChatRoomAccessQuery } from "@/features/chat/api/useChatRoomAccessQuery";
import { useChatRoomQuery } from "@/features/chat/api/useChatRoomQuery";
import { useBiddingRoomSocket } from "@/features/chat/model/useBiddingRoomSocket";
import BidPriceForm from "@/features/chat/ui/BidPriceForm";
import Countdown from "@/features/products/detail/ui/Countdown";

// 실시간 : 현재 내가 최고입찰자인지,
// 입찰버튼컴포넌트 : 실시간 최고가, 실시간 입찰자, 순위 필요
// 입찰 시간 종료 시 : 입찰이 종료되었습니다. 알럿뜨고 입력창 막기.

const BiddingRoom = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isValidRoomId = Boolean(roomId);
  const {
    data: access,
    error: accessError,
    isPending: isAccessPending,
  } = useChatRoomAccessQuery(roomId ?? "", isValidRoomId);

  const canEnterRoom = access?.canEnter === true;

  const {
    data: room,
    isPending: isRoomPending,
    isError: isRoomError,
  } = useChatRoomQuery(roomId, canEnterRoom);

  const {
    data: messageHistory,
    isPending: isMessagesPending,
    isError: isMessagesError,
  } = useChatMessagesQuery(roomId, canEnterRoom);

  const socketEnabled = canEnterRoom && !!room && !!messageHistory;

  const { isConnected, isBidPending, sendBid } = useBiddingRoomSocket({
    roomId: roomId ?? "",
    enabled: socketEnabled,
  });

  const isForbidden = isAxiosError(accessError) && accessError.response?.status === 403;

  useEffect(() => {
    if (!roomId || isForbidden) {
      toast.error("입찰방에 입장할 권한이 없습니다.");
      navigate(-1);
    }
  }, [roomId, isForbidden, navigate]);

  if (!roomId || isForbidden) {
    return null;
  }

  if (isAccessPending || (canEnterRoom && (isRoomPending || isMessagesPending))) {
    // 츄 : 스켈레톤으로 변경 필요
    return <div className="py-[10rem] text-center">입찰방 정보를 불러오는 중...</div>;
  }

  if (accessError || !canEnterRoom || isRoomError || isMessagesError || !room || !messageHistory) {
    // 재시도 UI 필요
    return <div className="py-[10rem] text-center">입찰방 정보를 불러오지 못했습니다.</div>;
  }

  const { product, auction } = room;
  const { messages } = messageHistory;
  const isMine = auction.highestBidder === user?.nickname;

  console.log(auction.highestBidder, user);

  return (
    <article className="bg-white">
      <section className="bg-dark flex items-center justify-between px-[3rem] py-[1.8rem] text-white">
        <div className="flex items-center gap-[1.4rem]">
          <div className="bg-dark-soft size-[5.2rem] overflow-hidden rounded-[1rem]">
            <img src={product.imageUrl} alt={product.name} className="size-full object-cover" />
          </div>

          <div>
            <h1 className="text-[1.6rem] font-semibold">
              {product.name}
              <span className="ml-[.6rem]">· 입찰방</span>
            </h1>

            <div className="text-light-gray mt-[.5rem] flex items-center gap-[.8rem] text-[1.15rem]">
              <span className="inline-flex items-center gap-[.5rem]">
                <span className="relative mr-[.3rem] inline-flex size-[1rem]">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex size-[1rem] rounded-full bg-red-500" />
                </span>
                LIVE
              </span>

              <span>·</span>

              <span>
                마감 <Countdown targetDate={product.endAt} />
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-light-gray text-[1.05rem]">현재 최고가</p>

          <p className="mt-[.3rem]">
            <strong className="text-[2.4rem] leading-none font-bold">
              {auction.highestBid.toLocaleString()}
            </strong>
            <span className="text-light-gray ml-[.4rem] text-[1.15rem]">원</span>
          </p>
        </div>
      </section>

      <div className="flex h-[calc(100dvh-88px-86px)]">
        <section className="flex h-full flex-1 flex-col overflow-auto bg-[#FCFCFA] px-[3rem] py-[2.6rem]">
          <div className="rounded-[1.3rem] bg-[#F1F0EC] px-[1.6rem] py-[1.5rem] text-[1.2rem] text-[#69707D]">
            🔒 입찰방에서는 자유로운 대화 없이 입찰가 등록만 가능해요.
          </div>

          <div className="mt-[2.4rem] flex flex-1 flex-col">
            {messages.map((message) => {
              const amount = Number(message.content);
              const isBidAmount = Number.isFinite(amount);

              return (
                <div key={message.id} className="mb-[1.5rem]">
                  <div
                    className={`inline-flex rounded-[1.4rem] border border-[#E3E2DD] bg-white px-[1.6rem] py-[1.3rem] text-[1.4rem] ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    {isBidAmount ? (
                      <>
                        {message.senderName}님이&nbsp;
                        <strong className="text-primary">{amount.toLocaleString()}원</strong>
                        으로 입찰했어요
                      </>
                    ) : (
                      message.content
                    )}
                  </div>

                  <p className="mt-[.7rem] text-[1.1rem] text-[#A5A9B0]">
                    {new Date(message.createDate).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="w-[36rem] shrink-0 border-l border-[#E5E3DE] bg-[#F7F6F3] px-[2.8rem] py-[2.6rem]">
          <div className="mb-[2.4rem] rounded-[1.4rem] bg-[#DDF3EF] px-[1.4rem] py-[1.6rem] text-center text-[1.3rem] font-semibold text-[#108577]">
            현재 최고 입찰자 : {auction.highestBidder}
            {auction.isHighestBidder && (
              <p className="mb-[0.4rem] text-center text-[1.3rem] font-semibold text-[#108577]">
                🎉 지금 내가 최고 입찰자예요 🎉
              </p>
            )}
          </div>

          <dl className="text-[1.25rem]">
            <div className="flex items-center justify-between border-b border-[#DFDED9] py-[1.2rem]">
              <dt className="text-[#777C85]">현재 최고가</dt>

              <dd className="font-bold">{auction.highestBid.toLocaleString()}원</dd>
            </div>

            <div className="flex items-center justify-between py-[1.2rem]">
              <dt className="text-[#777C85]">참여 입찰자</dt>

              <dd className="font-bold">{auction.participantCount}명</dd>
            </div>
          </dl>

          <BidPriceForm
            highestBid={auction.highestBid}
            isConnected={isConnected}
            isBidPending={isBidPending}
            onBid={sendBid}
          />
        </aside>
      </div>
    </article>
  );
};

export default BiddingRoom;
