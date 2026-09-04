import { isAxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useChatMessagesQuery } from "@/features/chat/api/useChatMessagesQuery";
import { useChatRoomAccessQuery } from "@/features/chat/api/useChatRoomAccessQuery";
import { useChatRoomQuery } from "@/features/chat/api/useChatRoomQuery";
import Countdown from "@/features/products/detail/ui/Countdown";
import { Button } from "@/shared/ui/Button";

// 아무나 입장금지 : 입장가능한 사람인지 확인 후 > 확인 시 상품 api+이전 대화내용 요청
// 입찰가 등록시 : 웹소켓으로 보내기.
// 실시간 : 현재 내가 최고입찰자인지,
// 입찰버튼컴포넌트 : 실시간 최고가, 실시간 입찰자, 순위 필요
// 입찰 시간 종료 시 : 입찰이 종료되었습니다. 알럿뜨고 입력창 막기.

const BiddingRoom = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();

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

  if (!roomId || (isAxiosError(accessError) && accessError.response?.status === 403)) {
    toast.error("입찰방에 입장할 권한이 없습니다.");
    navigate(-1);

    return;
  }

  if (isAccessPending || (canEnterRoom && (isRoomPending || isMessagesPending))) {
    return <div className="py-[10rem] text-center">입찰방 정보를 불러오는 중...</div>;
  }

  if (accessError || !canEnterRoom || isRoomError || isMessagesError || !room || !messageHistory) {
    return <div className="py-[10rem] text-center">입찰방 정보를 불러오지 못했습니다.</div>;
  }

  const { product, auction } = room;
  const { messages } = messageHistory;

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

      <div className="flex min-h-[56rem]">
        <section className="flex flex-1 flex-col bg-[#FCFCFA] px-[3rem] py-[2.6rem]">
          <div className="rounded-[1.3rem] bg-[#F1F0EC] px-[1.6rem] py-[1.5rem] text-[1.2rem] text-[#69707D]">
            🔒 입찰방에서는 자유로운 대화 없이 입찰가 등록만 가능해요.
          </div>

          <div className="mt-[2.4rem] flex flex-1 flex-col">
            {messages.map((message) => {
              const amount = Number(message.content);
              const isBidAmount = Number.isFinite(amount);

              return (
                <div key={message.id} className="mb-[1.5rem]">
                  <div className="inline-flex rounded-[1.4rem] border border-[#E3E2DD] bg-white px-[1.6rem] py-[1.3rem] text-[1.4rem]">
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

        {/* 우측 입찰 패널 */}
        <aside className="w-[36rem] shrink-0 border-l border-[#E5E3DE] bg-[#F7F6F3] px-[2.8rem] py-[2.6rem]">
          {auction.isHighestBidder && (
            <div className="mb-[2.4rem] rounded-[1.4rem] bg-[#DDF3EF] px-[1.4rem] py-[1.6rem] text-center text-[1.3rem] font-semibold text-[#108577]">
              지금 내가 최고 입찰자예요 🎉
            </div>
          )}

          <dl className="text-[1.25rem]">
            <div className="flex items-center justify-between border-b border-[#DFDED9] py-[1.2rem]">
              <dt className="text-[#777C85]">현재 최고가</dt>

              <dd className="font-bold">{auction.highestBid.toLocaleString()}원</dd>
            </div>

            <div className="flex items-center justify-between border-b border-[#DFDED9] py-[1.2rem]">
              <dt className="text-[#777C85]">참여 입찰자</dt>

              <dd className="font-bold">{auction.participantCount}명</dd>
            </div>

            <div className="flex items-center justify-between py-[1.2rem]">
              <dt className="text-[#777C85]">내 순위</dt>

              <dd className="font-bold text-[#078B7A]">{auction.myRank}위</dd>
            </div>
          </dl>

          <div className="mt-[1.8rem] grid grid-cols-3 gap-[.8rem]">
            <button
              type="button"
              className="h-[4rem] rounded-[1rem] border border-[#DDDCD7] bg-white text-[1.25rem] font-semibold transition-colors hover:bg-[#F1F0EC]"
            >
              +1,000원
            </button>

            <button
              type="button"
              className="h-[4rem] rounded-[1rem] border border-[#DDDCD7] bg-white text-[1.25rem] font-semibold transition-colors hover:bg-[#F1F0EC]"
            >
              +5,000원
            </button>

            <button
              type="button"
              className="bg-dark h-[4rem] rounded-[1rem] text-[1.25rem] font-semibold text-white"
            >
              +10,000원
            </button>
          </div>

          <input
            type="text"
            inputMode="numeric"
            defaultValue="760,000"
            aria-label="입찰가"
            className="mt-[1rem] h-[4.8rem] w-full rounded-[1rem] border border-[#DDDCD7] bg-white px-[1.6rem] text-[1.45rem] transition-colors outline-none focus:border-[#B9B7B1]"
          />

          <Button className="mt-[1.2rem] h-[5rem] w-full rounded-[1rem]">입찰하기</Button>
        </aside>
      </div>
    </article>
  );
};

export default BiddingRoom;
