export type PlaceBidMessage = {
  type: "PLACE_BID";
  requestId: string;
  roomId: string;
  amount: number;
};

export type BidPlacedMessage = {
  type: "BID_PLACED";
  requestId: string;
  roomId: string;
  highestBid: number;
  highestBidder: string;
  message: {
    id: string;
    senderName: string;
    content: string;
    createDate: string;
  };
};

export type BidRejectedMessage = {
  type: "BID_REJECTED";
  requestId: string;
  roomId: string;
  reason: string;
  currentHighestBid: number;
};

export type ChatRoomResponse = {
  product: {
    name: string;
    imageUrl: string;
    endAt: string;
  };

  auction: {
    highestBid: number;
    highestBidder: string;
    participantCount: number;
    myRank: number;
    isHighestBidder: boolean;
  };
};

export type BiddingRoomSocketMessage = BidPlacedMessage | BidRejectedMessage;
