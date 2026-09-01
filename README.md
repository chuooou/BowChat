# BowChat

> 실시간 입찰과 낙찰 후 1:1 거래 채팅을 중심으로 한 중고·리셀 경매 서비스

BowChat은 중고·리셀 상품을 **실시간 입찰 방식으로 거래하는 경매 서비스**입니다.

사용자는 경매 상품을 탐색하고 상세 정보를 확인한 뒤 **입찰 전용 방**에 참여해 입찰할 수 있습니다.  
입찰방에서는 자유로운 대화 대신 **입찰가 입력과 실시간 입찰 로그 확인에 집중**하도록 설계했습니다.

경매 종료 후 낙찰자가 확정되면 판매자와 낙찰자에게만 **1:1 거래 채팅**이 제공되며,  
배송·결제·거래 일정 등을 조율할 수 있습니다.

📄 [기획 및 화면설계서](./docs/bowchat-screen-spec.pdf)

---

## Preview

> 실제 구현 화면과 실시간 입찰 Demo는 개발 진행에 따라 추가할 예정입니다.

[상품 상세](./docs/images/product-detail.png)
<!-- 예시
![실시간 입찰 Demo](./docs/images/auction-demo.gif)
-->

---

## Core User Flow

```text
경매 목록
   ↓
경매 상세
   ↓
입찰방 입장
   ↓
실시간 입찰
   ↓
경매 종료
   ↓
낙찰자 확정
   ↓
판매자 ↔ 낙찰자 1:1 거래 채팅
```

### 비회원

```text
경매 탐색
→ 상품 상세 조회
→ 입찰방 입장 시 로그인 유도
→ 로그인 / 회원가입
```

### 구매자

```text
로그인
→ 경매 탐색
→ 상품 상세
→ 입찰방 입장
→ 입찰
→ 낙찰 / 미낙찰 확인
→ 낙찰 시 거래 채팅
```

### 판매자

```text
로그인
→ 상품 등록
→ 경매 시작
→ 입찰 현황 확인
→ 경매 종료
→ 낙찰자와 거래 채팅
```

---

## Main Features

### Authentication

- 회원가입
- 로그인
- 이메일 / 닉네임 중복 확인
- 로그인 사용자 조회 (`GET /auth/me`)
- Access Token 기반 인증 요청
- Refresh Token 기반 Access Token 재발급
- 401 발생 시 Token Refresh 후 기존 요청 재시도
- 자동 로그인 여부에 따른 인증 유지 정책

#### Authentication Flow

```text
로그인
↓
accessToken / refreshToken 저장

인증 API 요청
↓
Authorization: Bearer {accessToken}

401
↓
refreshToken으로 Access Token 재발급

성공
↓
기존 요청 재시도

실패
↓
인증 정보 제거
```

현재 인증의 핵심 구조는 구현되어 있으며, 로그아웃 흐름은 보완 중입니다.

---

### Products

- 상품 등록 Form
- 상품명 / 설명 / 시작가 입력
- 상품 이미지 다중 선택
- 이미지 미리보기 / 삭제
- 최대 이미지 개수 검증
- 상품 상세 REST 조회
- 상품 이미지 썸네일 탐색
- 상품 상세 Loading / Error / Retry UI

#### Product Image Flow

현재는 실제 이미지 업로드 API가 연결된 상태가 아니라, **로컬 이미지 선택·미리보기 UI**까지 구현되어 있습니다.

```text
File 선택
↓
RHF images 필드에 { id, file }[] 저장
↓
ImagePreview
↓
URL.createObjectURL(file)
↓
화면 미리보기
```

상품 등록 요청 시에는 현재 파일명을 임시 `imageUrls` 값으로 변환합니다.

```text
Form
images: { id, file }[]
price: "750,000"

        ↓

Submit 변환

        ↓

API DTO
imageUrls: string[]
price: 750000
```

실제 이미지 업로드 API는 추후 연동 예정입니다.

---

### Auction

기획상 다음 기능을 목표로 합니다.

- 경매 시작
- 경매 상태 표시
  - 시작 전
  - 진행 중
  - 종료
- 현재 최고 입찰가
- 최고 입찰자
- 내 입찰 상태
- 내 입찰가
- 경매 마감 Countdown
- 최근 입찰 로그
- 입찰방 진입
- 실시간 입찰 상태 반영
- 낙찰 / 미낙찰 상태 처리

#### Auction Policy

- 판매자는 상품 등록 시 시작가를 설정합니다.
- 시작가는 판매자가 수락 가능한 최소 판매 금액입니다.
- 구매자는 현재 최고가보다 높은 금액으로 입찰합니다.
- 경매 종료 시점의 최고 입찰자가 낙찰자가 됩니다.
- 입찰자가 없는 경우 유찰 처리합니다.
- 입찰이 1건 이상 발생한 경매는 판매자가 임의로 취소할 수 없도록 설계했습니다.

---

## Real-time Auction

BowChat의 실시간 경매는 **브라우저 네이티브 WebSocket API**를 사용합니다.

모든 데이터를 WebSocket으로 처리하지 않고,  
**최초 상태 조회는 REST API**, **이후 실시간 변화는 WebSocket**이 담당하도록 역할을 분리합니다.

```text
REST API
│
├─ 상품 상세 최초 조회
├─ 기존 경매 상태
├─ 현재 입찰 정보
└─ 종료 시간

WebSocket
│
├─ 새로운 입찰 발생
├─ 최고 입찰가 갱신
├─ 최고 입찰자 변경
├─ 입찰 로그 갱신
└─ 경매 종료 이벤트
```

### Current WebSocket Prototype

현재 `LiveBidStatus` 컴포넌트에서 WebSocket을 직접 연결하고 있습니다.

처리 중인 이벤트:

```text
AUCTION_SNAPSHOT
BID_PLACED
```

현재 표시 데이터:

- 최고 입찰가
- 최고 입찰자
- 최근 입찰 내역 최대 3개
- 상대 시간

현재 Lifecycle:

```text
Component Mount
↓
WebSocket 연결
↓
open / message / error listener 등록
↓
실시간 데이터 반영
↓
Component Unmount
↓
socket.close()
```

현재 단계는 **MSW 기반 실시간 입찰 현황 수신 프로토타입**입니다.

아직 다음 항목은 구현되지 않았습니다.

- 실제 입찰 메시지 전송
- WebSocket 인증
- 연결 끊김 UI
- 자동 재연결
- 메시지 Runtime Validation
- 실제 WebSocket 서버 연동 검증

---

## Auction Room

입찰방은 일반 채팅방과 달리 자유 텍스트 입력을 제공하지 않습니다.

```text
사용자
→ 입찰 금액 입력
→ 서버 입찰 검증
→ 입찰 확정
→ 참여자에게 실시간 입찰 로그 전달
```

경매 진행 중에는 **가격 경쟁과 입찰 행위에 집중**하고,  
실제 거래 관련 대화는 낙찰 이후 별도의 거래 채팅에서 수행하도록 역할을 분리했습니다.

> 현재 입찰방 페이지와 실제 입찰 전송 기능은 구현 예정입니다.

---

## Transaction Chat

경매 종료 후 낙찰이 확정되면 판매자와 낙찰자에게만 1:1 거래 채팅을 제공합니다.

기획 범위:

- 거래 채팅방 목록
- 이전 메시지 조회
- 메시지 입력 / 전송
- WebSocket 기반 실시간 메시지
- 판매자 / 낙찰자만 참여 가능

```text
경매 진행 중

입찰방
→ 입찰 전용


경매 종료 + 낙찰

판매자
   ↕
1:1 거래 채팅
   ↕
낙찰자
```

> 거래 채팅은 현재 구현 예정 단계입니다.

---

## Tech Stack

### Frontend

- React `19.2.7`
- React DOM `19.2.7`
- TypeScript `6.0.2`
- Vite `8.1.1`
- React Router DOM `7.18.1`
- Tailwind CSS `4.3.2`
- Pretendard `1.3.9`

### Server State / Data Fetching

- TanStack Query `5.101.2`
- Axios `1.18.1`

### Form / Validation

- React Hook Form `7.85.0`
- Zod `4.4.3`
- `@hookform/resolvers` `5.9.1`

### Real-time

- Browser Native WebSocket API

### Mocking

- MSW `2.15.0`

### UI Utilities

- Sonner `2.0.8`
- class-variance-authority `0.7.1`
- clsx `2.1.1`
- tailwind-merge `3.6.0`

### Development

- ESLint `10.6.0`
- Prettier `3.9.5`
- typescript-eslint
- simple-import-sort

---

## Architecture

현재 프로젝트는 **FSD 개념을 참고해 단순화한 Feature-based 구조**를 사용합니다.

엄격한 FSD를 그대로 적용하기보다, 현재 프로젝트 규모와 기능에 필요한 책임을 기준으로 구조를 나누고 있습니다.

```text
src/
├─ app/
│  ├─ layouts/
│  ├─ providers/
│  └─ router/
│
├─ pages/
│
├─ features/
│  ├─ auth/
│  ├─ login/
│  ├─ signup/
│  └─ products/
│
├─ shared/
│  ├─ api/
│  ├─ auth/
│  ├─ lib/
│  ├─ types/
│  └─ ui/
│
└─ mocks/
```

### Responsibility

```text
app
→ Router / Layout / Provider / AuthGuard

pages
→ URL에 직접 연결되는 Page Component

features
→ 인증 / 로그인 / 회원가입 / 상품 등록·상세 등 기능 단위

shared
→ Axios Client / Token Storage / 공통 UI / Utility

mocks
→ MSW REST / WebSocket Handler
```

> 현재 `entities` Layer는 사용하지 않으며, `shared → features` 의존이 일부 존재하므로 엄격한 FSD 구조로 설명하지 않습니다.

---

## Server State Management

서버 상태는 **TanStack Query**를 사용해 관리합니다.

전역 `QueryClient`는 한 번 생성하며 기본 설정은 다음과 같습니다.

```text
staleTime: 2분
retry: 1
```

### Query Key

```text
["auth", "me"]

["products", "detail", productId]
```

### Current Queries

- `/auth/me`
- 상품 상세 조회

### Current Mutations

- 로그인
- 회원가입
- 이메일 중복 확인
- 닉네임 중복 확인
- 상품 등록

상품 상세처럼 페이지의 핵심 데이터는 Page Level에서 상태를 처리합니다.

```text
isPending
→ Loading Skeleton

isError + data 없음
→ Error UI + refetch

Success
→ 상품 상세 렌더

기존 data 있음 + Background Refetch 실패
→ 기존 화면 유지
```

---

## Form Management

회원가입 / 로그인 / 상품 등록 Form은 **React Hook Form + Zod** 조합으로 관리합니다.

### Login

- 이메일 형식 검증
- 비밀번호 최소 8자
- 자동 로그인 여부

### Signup

- 이메일
- 비밀번호
- 비밀번호 확인
- 닉네임
- 약관 동의
- 이메일 / 닉네임 중복 확인 완료 상태

회원가입 Form은 `FormProvider`, `useFormContext`, `useWatch`, `useFormState`를 활용합니다.

### Product Registration

- 상품명 1~64자
- 설명 1~500자
- 가격 0원 초과
- 이미지 1~10장
- 판매 방식 타입 `AUCTION | DIRECT`

현재 실제 Submit 값은 `saleType: "AUCTION"`으로 고정되어 있으며, DIRECT 판매 UI는 아직 구현되지 않았습니다.

---

## Authentication Design

### HTTP Client

두 개의 Axios Instance를 사용합니다.

```text
publicHttp
├─ 로그인
├─ 회원가입
└─ Token Refresh

http
├─ /auth/me
├─ 상품 등록
├─ 상품 상세
├─ Request Interceptor
└─ 401 Response Interceptor
```

### Token Storage

현재 Token은 `localStorage`에 저장합니다.

```text
accessToken
refreshToken
refreshTokenExpiresAt
```

### 401 Recovery

```text
API 요청
↓
401
↓
_retry 확인
↓
refreshPromise로 중복 Refresh 방지
↓
refreshAccessToken()
↓
새 Access Token 저장
↓
원래 요청 재시도
```

Refresh 요청은 `publicHttp`를 사용해 401 Interceptor의 재귀 호출을 피합니다.

### Current User

`GET /auth/me`를 TanStack Query로 조회하며,  
응답 존재 여부를 로그인 사용자 상태의 기준으로 사용합니다.

`AuthGuard`와 `RootLayout`은 같은 Query Cache를 구독합니다.

---

## Mocking Strategy

Backend API가 완성되기 전에도 Frontend 흐름을 개발할 수 있도록 **MSW**를 사용합니다.

MSW는 다음 조건에서 활성화됩니다.

```text
DEV
AND
VITE_ENABLE_MSW === "true"
```

처리되지 않은 요청은 `bypass`되어 실제 서버로 전달됩니다.

### Active REST Mock

```text
GET  */auth/me
POST */auth/refresh

GET  */api/products/:productId
POST */api/products

GET  */user/check-email
GET  */user/check-nickname
```

### WebSocket Mock

```text
*/ws/products/:productId
```

WebSocket Mock은 연결 직후 `AUCTION_SNAPSHOT`을 전송하고,  
이후 `BID_PLACED` 이벤트를 발생시켜 실시간 입찰 UI를 테스트합니다.

### Not Mocked Yet

- 회원가입
- 로그아웃
- 이미지 업로드
- 상품 목록
- 경매 시작
- 실제 입찰
- 거래 채팅

---

## Error Handling

오류를 모두 동일하게 처리하지 않고 상황에 따라 사용자 액션을 구분하는 방향으로 설계하고 있습니다.

```text
401
→ Access Token Refresh
→ 실패 시 인증 해제

404
→ 존재하지 않는 리소스 안내

500 / Network Error
→ Error UI
→ 다시 시도(refetch)

WebSocket Disconnect
→ 재연결 / 오류 복구 전략 구현 예정
```

---

## Technical Decisions

### 1. 입찰방과 거래 채팅 분리

입찰 진행 중에는 자유로운 채팅 대신 입찰 기능에만 집중하도록 설계했습니다.

```text
경매
→ 가격 경쟁 / 입찰

거래 채팅
→ 배송 / 결제 / 거래 일정 조율
```

경매 단계와 거래 커뮤니케이션 단계를 분리해 각 화면의 책임을 명확하게 했습니다.

---

### 2. REST API와 WebSocket의 역할 분리

실시간 기능이라고 모든 서버 통신을 WebSocket에 의존하지 않습니다.

```text
REST API
→ 최초 상태 조회

WebSocket
→ 이후 발생한 실시간 변화 전달
```

---

### 3. Server State / Form State / UI State 분리

상태의 성격에 따라 관리 방법을 나눕니다.

```text
Server State
→ TanStack Query

Form State
→ React Hook Form

Local UI Interaction
→ React State
```

---

### 4. Form Model과 API DTO 분리

화면에서 사용하기 편한 데이터 구조와 서버 API가 요구하는 데이터 구조를 동일하게 강제하지 않습니다.

예를 들어 상품 가격은 Form에서 문자열로 관리한 뒤 API 요청 시 숫자로 변환합니다.

```text
"750,000"
↓
750000
```

---

### 5. Authentication Recovery

Access Token 만료를 즉시 로그아웃으로 처리하지 않고,  
Refresh Token을 이용해 인증을 복구한 후 기존 요청을 다시 실행하도록 설계했습니다.

---

### 6. 필요한 시점에 구조 확장

처음부터 모든 기능을 Provider / Manager / 전역 상태로 추상화하지 않습니다.

기능을 먼저 구현하고 실제 재사용과 복잡도가 발생하는 시점에 Hook이나 공통 Layer로 분리하는 방향을 사용합니다.

---

## Development Status

### Implemented

- [x] Vite / React / TypeScript 프로젝트 구성
- [x] Query Provider
- [x] Root / Auth Layout
- [x] Guest / Protected Auth Guard
- [x] 로그인 Form 및 API 호출
- [x] 회원가입 Form 및 API 호출
- [x] 이메일 / 닉네임 중복 확인
- [x] Access / Refresh Token 저장
- [x] Axios Request / 401 Response Interceptor
- [x] `/auth/me` 기반 사용자 조회
- [x] 상품 등록 Form / Validation
- [x] 로컬 이미지 선택 / 삭제 / 미리보기
- [x] 상품 상세 REST 조회
- [x] 상품 상세 Skeleton / Error / Retry UI
- [x] 상품 이미지 Thumbnail UI
- [x] MSW 기반 실시간 입찰 현황 수신 Prototype

### In Progress

- [ ] 상품 목록 API 연동
- [ ] 검색 / Filter 실제 기능
- [ ] 실제 이미지 업로드 API
- [ ] 상품 상세 Buyer / Seller 정책 분기
- [ ] 실시간 마감 Countdown
- [ ] 실제 WebSocket 서버 연동
- [ ] 로그아웃 흐름 보완
- [ ] 경매 시작
- [ ] 입찰방
- [ ] 실제 입찰 전송

### Planned

- [ ] 낙찰 / 미낙찰 상태 처리
- [ ] 거래 채팅
- [ ] 마이페이지
- [ ] WebSocket 재연결 / 인증 / 오류 복구
- [ ] DIRECT 판매 UI
- [ ] 자동화 테스트
- [ ] 주요 사용자 Flow E2E 검증

---

## Known Limitations

현재 Repository 기준으로 다음 항목은 아직 완료되지 않았습니다.

- 상품 목록은 Placeholder 상태입니다.
- 실제 이미지 Upload API는 없습니다.
- WebSocket은 MSW 기반 수신 Prototype 단계입니다.
- 입찰방 Route / Page와 실제 입찰 전송은 구현되지 않았습니다.
- 경매 시작 버튼의 실제 동작은 구현되지 않았습니다.
- 거래 채팅 / 마이페이지는 구현되지 않았습니다.
- 실시간 마감 Countdown은 아직 자동 갱신되지 않습니다.
- WebSocket 재연결 / 인증 / 연결 오류 복구는 구현되지 않았습니다.
- 테스트 Framework / Test Script / Test File은 아직 없습니다.
- 일부 링크(`/products/:id/bidding`, `/chats`, `/mypage`, `/forgot-password`)는 대응 Route가 아직 없습니다.

---

## Getting Started

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

`build` 명령은 내부적으로 TypeScript Build와 Vite Build를 함께 실행합니다.

### Lint

```bash
npm run lint
```

### Preview

```bash
npm run preview
```

현재 별도의 `typecheck`, `test` npm script는 없습니다.

---

## Environment

MSW를 사용하려면 개발 환경에서 다음 값을 사용합니다.

```env
VITE_ENABLE_MSW=true
```

API Base URL은 환경변수로 관리합니다.

```env
VITE_API_BASE_URL=
```

> `VITE_WS_BASE_URL` 환경변수는 현재 선언되어 있으나 실제 WebSocket 연결 코드에는 아직 적용되지 않았습니다. WebSocket 서버 연동 시 정리할 예정입니다.

---

## Validation

현재 Repository 기준 확인 결과:

```text
npm run lint
→ 성공
→ error 0
→ public/mockServiceWorker.js warning 1

TypeScript Build
→ 성공

npm run build
→ 성공
→ 500kB 초과 Bundle Warning 존재
```

현재 자동화 테스트 환경은 구성되어 있지 않습니다.

---

## Documentation

프로젝트의 기획과 구현 의도는 코드 외에도 별도 문서로 관리합니다.

```text
docs/
├─ bowchat-screen-spec.pdf
└─ images/
   ├─ auction-list.png
   ├─ product-detail.png
   └─ auction-demo.gif
```

### Documents

- [기획 및 화면설계서](./docs/bowchat-screen-spec.pdf)
- 사용자 Flow
- 화면 정의
- 경매 정책
- API Mapping
- 향후 개선 계획

---

## Roadmap

### Real-time Auction

- 실제 WebSocket 서버 연동
- 사용자 입찰 메시지 전송
- 경매 종료 이벤트
- WebSocket 인증
- 재연결 처리
- 최신 상태 재동기화

### Transaction

- 낙찰 / 미낙찰 상태
- 판매자 / 낙찰자 전용 거래 채팅
- 이전 메시지 조회
- WebSocket 실시간 채팅

### Product

- 상품 목록 API
- 검색 / Filter
- 실제 이미지 Upload
- 경매 시작

### Quality

- Logout Flow 보완
- Loading / Error / Empty State 정리
- 자동화 테스트 구성
- 주요 사용자 Flow E2E 테스트
- 접근성 개선
- Bundle Size 개선
- 실제 구현 화면 / Demo GIF 추가

---

## What I Focused On

BowChat은 단순한 화면 구현보다 **서비스 상태와 사용자 정책을 Frontend 구조에 어떻게 반영할 것인가**를 중심으로 개발하고 있습니다.

특히 다음을 중요하게 다루고 있습니다.

1. REST API와 WebSocket의 책임 분리
2. 실시간 입찰 상태의 UI 반영
3. Access Token 만료에 대한 인증 복구
4. TanStack Query 기반 Server State 관리
5. React Hook Form / Zod 기반 Form Validation
6. Form Model과 API DTO의 분리
7. MSW를 활용한 Backend 독립 개발 환경
8. 로그인 / 입찰 / 낙찰 상태에 따른 UI 정책 설계

이를 통해 단순 CRUD를 넘어  
**상태 설계, 통신 구조, 인증 흐름, 실시간 데이터 처리와 사용자 경험을 함께 고민하는 Frontend 프로젝트**를 만드는 것을 목표로 합니다.
