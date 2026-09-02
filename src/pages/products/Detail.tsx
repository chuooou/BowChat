import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/model/useAuth";
import { useProductDetailQuery } from "@/features/products/detail/api/useProductDetailQuery";
import Countdown from "@/features/products/detail/ui/Countdown";
import LiveBidStatus from "@/features/products/detail/ui/LiveBidStatus";
import ProductDetailAction from "@/features/products/detail/ui/ProductDetailAction";
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

  const handleBidButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.info("입찰방은 로그인 후 이용할 수 있어요.");

      navigate("/login", {
        state: {
          from: `/products/${productId}/bidding`,
        },
      });

      return;
    }
  };

  const {
    data: product,
    isPending,
    isError,
    refetch,
  } = useProductDetailQuery(productId, isValidProductId);

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
          <span className="bg-dark inline-block rounded-full px-[1.2rem] py-[.8rem] text-white">
            <span className="relative mr-[.8rem] inline-flex size-[1rem]">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex size-[1rem] rounded-full bg-red-500" />
            </span>
            마감까지 <Countdown endAt={product.endAt} />
          </span>
          <span className="bg-surface text-gray ml-[.8rem] inline-block rounded-full px-[1rem] py-[.5rem]">
            경매 {AUCTION_STATUS_LABEL[product.auctionStatus]}
          </span>
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

        <LiveBidStatus productId={productId} />

        <ProductDetailAction
          productId={productId}
          auctionStatus={product.auctionStatus}
          isWinner={product.isWinner}
          onBidClick={handleBidButtonClick}
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
