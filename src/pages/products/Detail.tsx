import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/model/useAuth";
import { useChatEnterMutation } from "@/features/chat/api/useChatEnterMutation";
import { CHAT_TYPE } from "@/features/chat/model/constants";
import { useProductDetailQuery } from "@/features/products/detail/api/useProductDetailQuery";
import Countdown from "@/features/products/detail/ui/Countdown";
import LiveBidStatus from "@/features/products/detail/ui/LiveBidStatus";
import ProductDetailActionButton from "@/features/products/detail/ui/ProductDetailActionButton";
import ProductDetailError from "@/features/products/detail/ui/ProductDetailError";
import ProductDetailSkeleton from "@/features/products/detail/ui/ProductDetailSkeleton";
import ThumbnailWrapper from "@/features/products/detail/ui/ThumbnailWrapper";
import { AUCTION_STATUS_LABEL } from "@/features/products/model/constants";

const ProductDetail = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);
  const isValidProductId = Number.isInteger(productId) && productId > 0;

  const {
    data: product,
    isPending,
    isError,
    refetch,
  } = useProductDetailQuery(productId, isValidProductId);

  const { mutate: enterChat } = useChatEnterMutation();

  const handleEnterRoom = () => {
    if (!product || product.auctionStatus === "BEFORE_START") {
      return;
    }

    if (!isAuthenticated) {
      toast.info("로그인 후 이용할 수 있어요.");

      navigate("/login", {
        state: {
          from: `/products/${productId}`,
        },
      });

      return;
    }

    enterChat(
      {
        roomType: CHAT_TYPE[product.auctionStatus],
        productId,
      },
      {
        onSuccess: (data) => {
          if (data.roomType === "AUCTION") {
            navigate(`/products/bidding/${data.roomId}`);
          }
          if (data.roomType === "DIRECT") {
            navigate(`/products/chat/${data.roomId}`);
          }
        },
        onError: (error) => {
          toast.error(error?.message ?? "입찰방 입장에 실패했어요. 잠시 후 다시 시도해주세요.");
        },
      },
    );
  };

  if (!isValidProductId) {
    return <Navigate to="/" replace />;
  }

  if (isPending) {
    return <ProductDetailSkeleton />;
  }

  if (isError && !product) {
    return <ProductDetailError onRetry={() => refetch()} />;
  }

  return (
    <article className="flex justify-between gap-[3.6rem] py-[3rem]">
      <ThumbnailWrapper images={product.imageUrls} />

      <section className="flex-1">
        <h2 className="text-[2.2rem] font-bold">{product.name}</h2>
        <div className="text-gray mt-[3px] text-[1.3rem]">
          <span>시작가 {product.price.toLocaleString()}원</span>
          <span> · </span>
          <span>판매자 {product.sellerNickname}</span>
        </div>
        <div className="mt-[1.3rem] text-[1.3rem]">
          {product.auctionStatus !== "ENDED" && (
            <>
              <span className="bg-dark mr-[.8rem] inline-block rounded-full px-[1.2rem] py-[.8rem] text-white">
                <span className="relative mr-[.8rem] inline-flex size-[1rem]">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex size-[1rem] rounded-full bg-red-500" />
                </span>
                {product.auctionStatus === "IN_PROGRESS" && "마감까지 "}
                {product.auctionStatus === "BEFORE_START" && "시작까지 "}
                <Countdown
                  targetDate={
                    product.auctionStatus === "IN_PROGRESS" ? product.endAt : product.startAt
                  }
                />
              </span>
              <span className="bg-surface text-gray inline-block rounded-full px-[1rem] py-[.5rem]">
                경매 {AUCTION_STATUS_LABEL[product.auctionStatus]}
              </span>
            </>
          )}
        </div>
        <p className="mt-[1.3rem] text-[1.3rem]">{product.description}</p>
        {isAuthenticated && !product.isSeller && product.hasBid && (
          <div className="mt-[1rem] text-[1.3rem]">
            내 입찰 상태
            <span className="bg-primary-light text-primary ml-[.8rem] inline-block rounded-full px-[1.2rem] py-[.8rem]">
              입찰중 · {product.myBidAmount.toLocaleString()}원
            </span>
          </div>
        )}

        {product.auctionStatus === "IN_PROGRESS" && <LiveBidStatus productId={productId} />}

        <ProductDetailActionButton
          auctionStatus={product.auctionStatus}
          isWinner={product.isWinner}
          onClick={handleEnterRoom}
        />
        {product.auctionStatus === "IN_PROGRESS" && (
          <p className="text-light-gray mt-[1rem] text-center text-[1.2rem]">
            🔒 낙찰되면 이 버튼이 그대로 [채팅하기]로 바뀌어요
          </p>
        )}
      </section>
    </article>
  );
};

export default ProductDetail;
