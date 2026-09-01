import { Link, Navigate, useParams } from "react-router-dom";

import { useProductDetailQuery } from "@/features/products/detail/api/useProductDetailQuery";
import LiveBidStatus from "@/features/products/detail/ui/LiveBidStatus";
import ProductDetailSkeleton from "@/features/products/detail/ui/ProductDetailSkeleton";
import ThumbnailWrapper from "@/features/products/detail/ui/ThumbnailWrapper";
import { AUCTION_STATUS_LABEL } from "@/features/products/model/constants";
import { formatRemainingTime } from "@/shared/lib/formatTime";
import { Button } from "@/shared/ui/Button";

const ProductDetail = () => {
  const { id } = useParams();
  const productId = Number(id);
  const isValidProductId = Number.isInteger(productId) && productId > 0;

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
    return (
      <div className="py-[10rem] text-center">
        <p>상품 정보를 불러오지 못했습니다.</p>

        <Button type="button" onClick={() => refetch()}>
          다시 시도
        </Button>
      </div>
    );
  }

  //  판매자 , 구매자 정책 확인
  //   마감까지 카운트다운 아이콘 반짝반짝

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
            🔴 마감까지 {formatRemainingTime(product.endAt)}
          </span>
          <span className="bg-surface text-gray ml-[.8rem] inline-block rounded-full px-[1rem] py-[.5rem]">
            경매 {AUCTION_STATUS_LABEL[product.auctionStatus]}
          </span>
        </div>
        <p className="mt-[1.3rem] text-[1.3rem]">{product.description}</p>
        {!product.isSeller && (
          <div className="mt-[1rem] text-[1.3rem]">
            내 입찰 상태
            <span className="bg-primary-light text-primary ml-[.8rem] inline-block rounded-full px-[1.2rem] py-[.8rem]">
              입찰중 · 750,000원
            </span>
          </div>
        )}

        <LiveBidStatus productId={productId} />

        {/* 츄 - 버튼 안에 링크 변경하기 */}
        <Button className="mt-[1.8rem] w-full" variant="primary" size="md">
          <Link to={`/products/${productId}/bidding`} className="">
            입찰방 입장하기
          </Link>
        </Button>
        <p className="text-light-gray mt-[1rem] text-center text-[1.2rem]">
          🔒 낙찰되면 이 버튼이 그대로 [채팅하기]로 바뀌어요
        </p>
      </section>
    </article>
  );
};

export default ProductDetail;
