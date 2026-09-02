import { Link } from "react-router-dom";

import { Button } from "@/shared/ui/Button";

type ProductDetailActionProps = {
  productId: number;
  auctionStatus: "BEFORE_START" | "IN_PROGRESS" | "ENDED";
  isWinner: boolean;
  onBidClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const ProductDetailAction = ({
  productId,
  auctionStatus,
  isWinner,
  onBidClick,
}: ProductDetailActionProps) => {
  let label = "";
  let to: string | null = null;
  let onClick: ProductDetailActionProps["onBidClick"] | undefined;

  if (isWinner) {
    label = "채팅하기";
    to = `/products/${productId}/chatting`;
  } else {
    switch (auctionStatus) {
      case "BEFORE_START":
        label = "경매 시작 전입니다";
        break;

      case "IN_PROGRESS":
        label = "입찰방 입장하기";
        to = `/products/${productId}/bidding`;
        onClick = onBidClick;
        break;

      case "ENDED":
        label = "경매가 종료되었습니다";
        break;
    }
  }

  if (to) {
    return (
      <Button asChild className="mt-[1.8rem] w-full">
        <Link to={to} onClick={onClick}>
          {label}
        </Link>
      </Button>
    );
  }

  return (
    <Button disabled variant="gray" className="mt-[1.8rem] w-full">
      {label}
    </Button>
  );
};

export default ProductDetailAction;
