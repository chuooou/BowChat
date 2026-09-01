## 아키텍처 : Feature-based Modular Monolith

### app : 애플리케이션 전체 설정

- router
- TanStack Query Provider
- 전역 스타일
- 전역 에러 처리
- 전역 Provider 조립

### pages : URL에 대응하는 최종 페이지

```
export function AuctionDetailPage() {
  const { auctionId } = useAuctionParams();

  return (
    <main>
      <AuctionInfo auctionId={auctionId} />
      <BidHistory auctionId={auctionId} />
      <BidEntryButton auctionId={auctionId} />
    </main>
  );
}
```

### features : 서비 스의 실제 기능 코드

- auth
  - api
  - hooks
  - ui
  - model : 타입, 검증, 상태, 도메인 규칙
- auction
- bid
- chat

### shared : 특정 기능을 몰라도 되는 공통 코드 (비즈니스 지식 x)
