import { Button } from "@/shared/ui/Button";

type ProductDetailErrorProps = {
  onRetry: () => void;
};

const ProductDetailError = ({ onRetry }: ProductDetailErrorProps) => {
  return (
    <div className="py-[10rem] text-center">
      <p>상품 정보를 불러오지 못했습니다.</p>

      <Button onClick={onRetry}>다시 시도</Button>
    </div>
  );
};

export default ProductDetailError;
