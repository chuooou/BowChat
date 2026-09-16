import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

const BID_INCREMENT_OPTIONS = [
  {
    label: "+1,000원",
    amount: 1000,
  },
  {
    label: "+5,000원",
    amount: 5000,
  },
  {
    label: "+10,000원",
    amount: 10000,
  },
] as const;

type BidPriceFormProps = {
  highestBid: number;
  isConnected: boolean;
  isBidPending: boolean;
  onBid: (amount: number) => boolean;
};

const BidPriceForm = ({ highestBid, onBid, isConnected, isBidPending }: BidPriceFormProps) => {
  const [bidAmount, setBidAmount] = useState(highestBid + 1000);

  const handleAddBidAmount = (amount: number) => {
    setBidAmount(highestBid + amount);
  };

  const handleChangeBidAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    setBidAmount(Number(value));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (bidAmount <= highestBid) {
      toast.error("현재 최고 입찰가보다 높은 금액을 입력해주세요.");
      return;
    }

    onBid(bidAmount);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-[1.8rem] grid grid-cols-3 gap-[.8rem]">
        {BID_INCREMENT_OPTIONS.map((option) => (
          <Button
            key={option.amount}
            variant="white"
            className="border-gray-300"
            onClick={() => handleAddBidAmount(option.amount)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Input
        type="text"
        inputMode="numeric"
        value={bidAmount.toLocaleString()}
        onChange={handleChangeBidAmount}
        aria-label="입찰가"
        className="mt-[1rem]"
      />

      <Button type="submit" disabled={!isConnected || isBidPending} className="mt-[1.2rem] w-full">
        {isBidPending ? "입찰 처리 중..." : "입찰하기"}
      </Button>
    </form>
  );
};

export default BidPriceForm;
