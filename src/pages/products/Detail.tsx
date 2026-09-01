import { Navigate, useParams } from "react-router-dom";

import { useProductDetailQuery } from "@/features/products/detail/api/useProductDetailQuery";
import ProductDetailSkeleton from "@/features/products/detail/ui/ProductDetailSkeleton";
import ThumbnailWrapper from "@/features/products/detail/ui/ThumbnailWrapper";
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
  } = useProductDetailQuery(id, isValidProductId);

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
            🔴 마감까지 00:15:20
          </span>
          <span className="bg-surface text-gray ml-[.8rem] inline-block rounded-full px-[1rem] py-[.5rem]">
            경매 진행중
          </span>
        </div>
        <div className="text-light-gray mt-[1rem] text-[1.3rem]">
          내 입찰 상태
          <span className="bg-primary-light text-primary ml-[.8rem] inline-block rounded-full px-[1.2rem] py-[.8rem]">
            입찰중 · 750,000원
          </span>
        </div>
        {/* TODO: webSocket 연동 */}
        <article className="text-light-gray mt-[1.8rem] w-full rounded-[1.6rem] bg-[#1D2230] px-[1.2rem] py-[1.8rem] text-[1.3rem]">
          <p className="text-primary text-[1.2rem] font-bold">실시간 입찰 현황 · 미리보기</p>
          <div className="mt-[.7rem]">
            <span className="text-[2.8rem] font-bold text-white">
              {product.price.toLocaleString()}원
            </span>
            <span className="ml-[.8rem] text-[1.3rem]">최고 입찰자 user01</span>
          </div>
          <p className="border-gray border-t py-[.5rem]">
            user01님이 750,000원으로 입찰했어요 · 방금
          </p>
          <p className="border-gray border-t py-[.5rem]">
            user02님이 730,000원으로 입찰했어요 · 1분 전
          </p>
          <p className="mt-[.5rem] text-[1.2rem]">
            전체 로그와 입찰은 입찰방에서 확인할 수 있어요 →
          </p>
        </article>

        <Button className="mt-[1.8rem] w-full">입찰방 입장하기</Button>
        <p className="text-light-gray mt-[1rem] text-center text-[1.2rem]">
          🔒 낙찰되면 이 버튼이 그대로 [채팅하기]로 바뀌어요
        </p>
      </section>
    </article>
  );
};

export default ProductDetail;
