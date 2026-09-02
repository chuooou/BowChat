import { Button } from "@/shared/ui/Button";

type ProductDetailActionProps = {
  auctionStatus: "BEFORE_START" | "IN_PROGRESS" | "ENDED";
  isWinner: boolean;
  onClick: () => void;
};

const ProductDetailActionButton = ({
  auctionStatus,
  isWinner,
  onClick,
}: ProductDetailActionProps) => {
  if (isWinner) {
    return (
      <Button className="mt-[1.8rem] w-full" onClick={onClick}>
        채팅하기
      </Button>
    );
  }

  switch (auctionStatus) {
    case "BEFORE_START":
      return null;

    case "IN_PROGRESS":
      return (
        <Button className="mt-[1.8rem] w-full" onClick={onClick}>
          입찰방 입장하기
        </Button>
      );

    case "ENDED":
      return (
        <Button disabled variant="gray" className="mt-[1.8rem] w-full">
          경매가 종료되었습니다
        </Button>
      );
  }
};

export default ProductDetailActionButton;
