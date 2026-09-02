# BowChat

> ### **실시간 입찰과 낙찰 후 1:1 거래 채팅을 제공하는 중고·리셀 경매 서비스**

BowChat은 중고·리셀 상품을 실시간 입찰 방식으로 거래하는 프론트엔드 사이드 프로젝트입니다.

사용자는 상품을 탐색한 뒤 상세 화면에서 **입찰 전용 방**에 참여할 수 있습니다. 입찰방에서는 자유 채팅 대신 **입찰가 입력과 실시간 입찰 로그 확인**에 집중하며, 경매 종료 후 낙찰자가 확정되면 판매자와 낙찰자에게만 **1:1 거래 채팅**을 제공합니다.

📄 [기획 및 화면설계서](./docs/bowchat-screen-spec.pdf)

> AI를 요구사항 정리와 설계 검토를 위한 보조 도구로 활용했습니다.  
> 최종 서비스 정책과 화면 구조, 구현 방향은 프로젝트 요구사항에 맞게 직접 검토·수정했습니다.

---

## Preview

> 개발 진행에 따라 추가할 예정입니다.

### 상품 상세

![상품 상세](/src/docs/images/product-detail.png)

### 실시간 입찰방

![실시간 입찰](/src/docs/images/bidding-room.png)
<!-- ### 낙찰 후 거래 채팅
![거래 채팅](./docs/images/chat-room.png)

### Realtime Demo
![실시간 입찰](./docs/images/auction-demo.gif) -->

---

## Core User Flow

```text
경매 목록
   ↓
경매 상세
   ↓
입찰 전용 방
   ↓
실시간 입찰
   ↓
경매 종료
   ↓
낙찰자 확정
   ↓
판매자 ↔ 낙찰자 1:1 거래 채팅
```

### 서비스 정책

- 비회원은 상품을 탐색하고 상세 정보를 확인할 수 있습니다.
- 입찰방은 로그인 사용자만 참여할 수 있습니다.
- 입찰방에서는 자유 텍스트 채팅 없이 입찰가만 입력합니다.
- 현재 최고가보다 높은 금액만 입찰할 수 있도록 설계합니다.
- 경매 종료 시점의 최고 입찰자가 낙찰자가 됩니다.
- 입찰자가 없는 경우 유찰 처리합니다.
- 낙찰 이후 판매자와 낙찰자에게만 거래 채팅을 제공합니다.

---

# 핵심 기술 설계

## 1. 실시간 경매 상태 동기화

상품 정보와 경매 기본 데이터는 REST API로 조회하고,
진행 중 발생하는 입찰 변화는 WebSocket 이벤트를 통해 UI에 반영했습니다.

```text
상품 상세 REST 조회
↓
경매 정보 렌더링
↓
WebSocket 연결
↓
AUCTION_SNAPSHOT 수신
↓
현재 최고가 / 최고 입찰자 / 최근 입찰 내역 표시
↓
BID_PLACED 수신
↓
실시간 입찰 정보 갱신
```

현재는 `AUCTION_SNAPSHOT`, `BID_PLACED` 이벤트를 수신해
최고가, 최고 입찰자, 최근 입찰 내역을 UI에 반영하는 흐름까지 구현했습니다.

실제 입찰 전송과 Backend WebSocket 연동은 진행 중입니다.

---

## 2. 동시 401 요청에서 Refresh 중복 방지

Access Token이 만료된 상태에서 여러 API 요청이 동시에 발생하면,
각 요청이 개별적으로 Refresh API를 호출하는 문제가 발생할 수 있습니다.

이를 방지하기 위해 진행 중인 Refresh 요청을 refreshPromise로 공유하도록 구성했습니다.

```text
Request A ─┐
Request B ─┼─ 401
Request C ─┘
           ↓
      Refresh 1회
           ↓
     새 Access Token
           ↓
   각 원 요청 다시 실행
```

Axios Request Interceptor에서는 Access Token을 요청에 추가하고,
Response Interceptor에서는 401 발생 시 Token Refresh 후 기존 요청을 다시 실행합니다.

Refresh 요청 자체는 인증 Interceptor의 영향을 받지 않도록
별도의 Axios Instance인 publicHttp를 사용합니다.

이를 통해 인증 복구 로직을 개별 API나 컴포넌트에 중복 작성하지 않고
HTTP Client 계층에서 공통 처리하도록 구성했습니다.

---

## 3. 상태와 UI의 책임 분리

하나의 상태 관리 도구나 Page Component에 모든 책임을 모으기보다,
데이터와 UI의 성격에 따라 관리 책임을 분리했습니다.

```text
Server State   → TanStack Query
Form State     → React Hook Form
Validation     → Zod
Local UI State → React State
Real-time      → WebSocket
```

Page는 데이터 조회, 상태 분기, 사용자 액션을 조율하고
세부 UI는 역할에 따라 별도 컴포넌트로 분리했습니다.

```
ProductDetail
│
├─ 상품 데이터 조회
├─ Loading / Error 상태 분기
├─ 입찰방 / 채팅방 진입 처리
│
├─ ThumbnailWrapper
├─ Countdown
├─ LiveBidStatus
└─ ProductDetailActionButton
```

예를 들어 상품 상세의 서버 데이터는 TanStack Query로 관리하고,
1초마다 상태가 변경되는 Countdown은 별도 컴포넌트의 Local State로 격리해
시간 변경으로 상품 상세 전체가 다시 렌더링되지 않도록 구성했습니다.

또한 재사용 가능성을 예상해 미리 추상화하기보다,
실제 공통 책임과 재사용 범위가 확인된 경우에 공통화를 적용하는 방향으로 개발했습니다.

---

## 4. 실제 Backend와 MSW를 병행한 개발 환경

실제 Backend 서버가 존재하지만,
Frontend 개발 과정에서 경매 Flow와 화면 정책이 변경되면서
일부 API와 실시간 이벤트의 계약을 다시 조정해야 하는 상황이 발생했습니다.

Backend 변경 여부와 관계없이 Frontend 개발 및 검증을 이어갈 수 있도록,
필요한 REST API와 WebSocket 이벤트를 MSW로 선택적으로 Mocking하고
Mock Handler가 없는 요청은 실제 Backend로 전달하도록 구성했습니다.

```text
실제 서버와 연동 가능한 요청
→ 실제 Backend

기획 변경으로 API 조정 필요
→ MSW REST / WebSocket Mock

Mock Handler가 없는 요청
→ 실제 Backend로 bypass
```

이를 통해 실제 Backend 연동을 유지하면서도,
변경 중인 기능의 Frontend 구현과 UI 검증을 병행할 수 있도록 했습니다.

WebSocket 역시 변경된 경매 정책에 맞춰
AUCTION_SNAPSHOT, BID_PLACED 이벤트를 Mock하여
Backend 수정 전에도 실시간 UI와 이벤트 처리 로직을 먼저 개발하고 검증하고 있습니다.

---

# Features

## Authentication

- 로그인, 회원가입 Form / API 호출
- 이메일 / 닉네임 중복 확인
- Axios Request Interceptor
- 401 Response Interceptor
- Refresh Token 기반 Access Token 재발급
- `GET /auth/me` 기반 현재 사용자 조회
- Guest / Protected Route Guard

## Product

- 상품 등록 Form
- 상품명 / 설명 / 시작가 Validation
- 이미지 다중 선택 / 삭제 / 미리보기 / 최대 이미지 개수 검증
- 상품 상세 Skeleton / Error / Retry UI

## Auction

- 경매 상태 표시 (시작 전 / 진행 중 / 종료 상태 분기, 시작 / 마감 시간 표시)
- 현재 최고 입찰가 / 입찰자
- 최근 입찰 내역 실시간 미리보기
- 사용자 입찰 상태 UI
- MSW 기반 실시간 입찰 현황 수신

---

# Architecture

현재 프로젝트는 **FSD 개념을 참고한 단순화된 Feature-based 구조**를 사용합니다.

엄격한 FSD를 그대로 적용하기보다,
프로젝트 규모와 기능에 필요한 책임을 기준으로 구성했습니다.

```text
src/
├─ app/        → Router / Layout / Provider / AuthGuard
├─ pages/      → URL에 직접 연결되는 Page Component
├─ features/   → 인증 / 채팅 / 로그인 / 회원가입 / 상품 기능
├─ shared/     → Axios Client / Token Storage / 공통 UI / Utility
└─ mocks/      → MSW REST / WebSocket Handler
```

---

# Development Status

## Implemented

- [o] Vite / React / TypeScript 프로젝트 구성
- [o] Query Provider
- [o] Root / Auth Layout
- [o] Guest / Protected Auth Guard
- [o] 로그인 Form 및 API 호출
- [o] 회원가입 Form 및 API 호출
- [o] 이메일 / 닉네임 중복 확인
- [o] Access / Refresh Token 저장
- [o] Axios Request / 401 Response Interceptor
- [o] `/auth/me` 기반 사용자 조회
- [o] 상품 등록 Form / Validation
- [o] 로컬 이미지 선택 / 삭제 / 미리보기
- [o] 상품 상세 REST 조회
- [o] 상품 상세 Skeleton / Error / Retry UI
- [o] 상품 이미지 Thumbnail UI
- [o] 경매 상태별 상품 상세 UI
- [o] MSW 기반 실시간 입찰 현황 수신 Prototype

## In Progress

- [ ] 검색 / Filter 실제 기능
- [ ] 경매 시작
- [ ] 입찰방
- [ ] 실제 입찰 전송
- [ ] 실제 WebSocket 서버 연동

## Planned

- [ ] 상품 목록 API 연동
- [ ] 낙찰 / 미낙찰 처리
- [ ] 판매자 / 낙찰자 전용 거래 채팅
- [ ] 마이페이지
- [ ] WebSocket 자동 재연결
- [ ] 재연결 후 최신 상태 동기화
- [ ] 자동화 테스트
- [ ] 주요 사용자 Flow E2E 테스트

---

# Getting Started

```bash
npm install
npm run dev
```

---

# Environment

```env
VITE_API_BASE_URL=
VITE_ENABLE_MSW=true
```

`VITE_ENABLE_MSW=true`인 개발 환경에서 MSW가 활성화됩니다.

> `VITE_WS_BASE_URL`은 현재 선언되어 있으나 실제 WebSocket 연결에는 아직 적용되지 않았습니다.

---

## Tech Stack

React · TypeScript · TanStack Query · React Hook Form · Zod · Axios · WebSocket · MSW · Tailwind CSS
