# AGENTS.md

# BowChat AI Development Guide

이 문서는 BowChat 프로젝트에서 AI 코딩 에이전트가 따라야 할 개발 원칙, 구조 규칙, 검증 절차를 정의한다.

목표는 단순히 코드를 빠르게 생성하는 것이 아니라,
**문제 정의 → 기술적 의사결정 → 구조 설계 → 구현 → 생성 코드 검증**
순서로 개발 품질을 유지하는 것이다.

---

## 1. Project Overview

BowChat은 중고 상품 기반의 실시간 경매 서비스다.

핵심 사용자 흐름:

1. 경매 목록 탐색
2. 경매 상세 확인
3. 입찰 전용 방 입장
4. 실시간 입찰
5. 경매 종료 및 낙찰
6. 낙찰자와 판매자의 1:1 거래 채팅

일반 중고 판매 기능보다 **실시간 경매 경험**을 중심으로 한다.

---

## 2. Tech Stack

현재 프로젝트의 기본 기술 스택:

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod
- Axios
- MSW
- Sonner
- WebSocket

새 라이브러리는 기존 스택으로 해결하기 어려운 경우에만 제안한다.

라이브러리 추가가 필요한 경우:

- 왜 필요한지
- 기존 코드로 해결할 수 없는 이유
- 대안
- 번들/유지보수 영향

을 먼저 설명하고, 사용자 승인 전에는 임의로 설치하거나 구조에 반영하지 않는다.

---

## 3. Architecture

FSD를 기반으로 하되 프로젝트 규모에 맞게 과도하게 세분화하지 않는다.

현재 기본 구조:

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
│
├─ shared/
│  ├─ api/
│  ├─ auth/
│  ├─ lib/
│  └─ ui/
│
└─ mocks/
```

현재 필요하지 않은 layer나 segment를 형식적으로 만들지 않는다.

예:

- 파일 하나를 위해 `hooks/`, `types/`, `utils/` 폴더를 만들지 않는다.
- hook이라는 이유만으로 무조건 `hooks/`에 두지 않는다.
- 역할에 따라 `api`, `model`, `ui`에 둔다.

### Dependency Rules

가능하면 다음 의존 방향을 유지한다.

```text
app
↓
pages
↓
features
↓
entities
↓
shared
```

특히:

- `shared`에서 `features`를 import하지 않는다.
- 범용 UI는 `shared/ui`에 둔다.
- 도메인 지식이 포함되면 feature 내부에 둔다.
- app은 router/provider/interceptor wiring 등 앱 전체 조립을 담당할 수 있다.
- API 호출 방식과 UI 상태 로직을 불필요하게 섞지 않는다.

구조를 변경해야 하는 경우 바로 변경하지 말고 먼저 이유와 영향을 설명한다.

---

## 4. Development Workflow

기능 요청을 받으면 바로 코드를 작성하지 않는다.

다음 순서로 진행한다.

### Step 1. 문제 정의

먼저 아래를 확인한다.

- 사용자가 실제로 해결하려는 문제
- 필요한 기능
- 입력/출력
- 사용자 흐름
- 예외 상황
- 기존 코드와 연결되는 지점

요청에 없는 기능을 임의로 추가하지 않는다.

### Step 2. 기존 구조 확인

관련 코드를 먼저 확인한다.

- 기존 component
- API
- schema
- query
- router
- shared UI
- 이미 존재하는 helper/util

이미 있는 기능을 중복 구현하지 않는다.

### Step 3. 기술적 의사결정

구현 방식이 여러 개라면 최소한 다음을 비교한다.

- 구현 복잡도
- 재사용성
- 유지보수성
- 현재 프로젝트 규모에 적합한지
- 라이브러리 의존 여부
- React/TypeScript 관점의 안정성

구조에 영향을 주는 결정은 임의로 확정하지 않는다.

다음과 같은 결정은 구현 전에 사용자에게 선택지를 제시한다.

- Context vs Zustand 등 전역 상태 도입
- 새로운 라이브러리 추가
- API 계약 변경
- 폴더 구조 변경
- shared/feature 책임 이동
- 인증 방식 변경
- 상태의 source of truth 변경

### Step 4. 구현

승인된 방향을 기준으로 최소 변경으로 구현한다.

원칙:

- 기존 코드 스타일을 유지한다.
- 불필요한 추상화를 만들지 않는다.
- 지나치게 미래를 가정한 설계를 하지 않는다.
- 같은 상태를 여러 곳에서 중복 관리하지 않는다.
- 파생 가능한 값은 별도 state로 만들지 않는다.
- 불필요한 `useEffect`를 만들지 않는다.
- 단순한 UI 문제에 과도한 architecture를 도입하지 않는다.

### Step 5. 검증

구현 후 반드시 생성 코드를 다시 검토한다.

가능한 경우 다음을 실행한다.

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

프로젝트에 해당 script가 없다면 존재하지 않는 명령을 임의로 실행하지 않는다.

오류가 발생하면:

1. 원인 분석
2. 최소 수정
3. 재검증

순서로 처리한다.

---

## 5. Code Review Checklist

AI가 생성하거나 수정한 코드는 아래를 확인한다.

### React

- 불필요한 state가 없는가
- 같은 값을 두 state에서 중복 관리하지 않는가
- `useEffect` 없이 계산 가능한 값을 effect로 처리하지 않는가
- effect cleanup이 필요한 리소스를 정리하는가
- render 중 side effect가 발생하지 않는가
- hook dependency가 올바른가
- controlled/uncontrolled input을 불필요하게 섞지 않는가

### TypeScript

- `any`를 불필요하게 사용하지 않는가
- API request/response 타입이 실제 계약과 맞는가
- props 타입이 실제 사용 방식과 일치하는가
- 파일 내부에서만 쓰는 type은 과도하게 분리하지 않는다
- 재사용되는 타입만 적절한 위치로 분리한다

### UI / Accessibility

- 버튼에 적절한 `type`이 있는가
- 아이콘 버튼에 `aria-label`이 있는가
- form error에는 필요 시 `role="alert"`을 사용한다
- invalid 상태는 가능하면 `aria-invalid`와 연결한다
- keyboard 사용을 방해하지 않는다

### Error Handling

- 사용자에게 필요한 오류와 개발자용 오류를 구분한다
- 서버 오류를 무조건 전역 toast로 처리하지 않는다
- form field 오류는 RHF/Zod 흐름과 연결한다
- 인증 오류, 네트워크 오류, validation 오류를 동일하게 취급하지 않는다

---

## 6. React Hook Form + Zod

폼은 기본적으로 React Hook Form + Zod를 사용한다.

원칙:

- schema는 validation 책임을 가진다.
- `defaultValues`는 RHF에서 관리한다.
- UI용 임시 state와 form state를 불필요하게 중복하지 않는다.
- 자식 form component는 필요하면 `FormProvider` + `useFormContext`를 사용한다.
- 특정 필드를 구독해야 할 때는 `useWatch`를 사용한다.
- 일회성 값 조회는 `getValues()`를 사용할 수 있다.
- 서버 전송 DTO와 form value 타입이 반드시 같을 필요는 없다.

예:

```text
Form
- price: "100,000"
- images: File[]

API Request
- price: 100000
- imageUrls: string[]
```

UI 표시를 위한 값과 서버 DTO를 억지로 동일하게 만들지 않는다.

### Error UI

범용 에러 컴포넌트는 RHF에 직접 종속시키기보다 가능하면:

```tsx
<ErrorMessage message={errors.name?.message} />
```

처럼 문자열을 받아 렌더링하도록 만든다.

---

## 7. TanStack Query

서버 상태는 TanStack Query를 우선 사용한다.

### Query Keys

feature별 query key factory를 사용한다.

예:

```ts
export const authQueryKeys = {
  all: ["auth"] as const,
  me: () => [...authQueryKeys.all, "me"] as const,
};
```

### QueryClient

`QueryClient`는 앱에서 하나만 생성한다.

컴포넌트 내부에서:

```ts
new QueryClient();
```

를 생성하지 않는다.

컴포넌트에서는:

```ts
const queryClient = useQueryClient();
```

를 사용한다.

### Current User

현재 로그인 사용자 정보는 `/auth/me` query를 source of truth로 사용할 수 있다.

Header, AuthGuard 등 여러 컴포넌트가 같은 query key를 구독하도록 하고,
별도의 `isLoggedIn` boolean state를 중복 생성하지 않는다.

로그인 성공 응답에 `userInfo`가 있다면:

```ts
queryClient.setQueryData(authQueryKeys.me(), data.userInfo);
```

로 cache를 seed할 수 있다.

---

## 8. Authentication

현재 인증 구조의 기본 방향:

```text
accessToken
→ localStorage

refreshToken
→ localStorage

/auth/me
→ 현재 로그인 사용자 확인

Axios interceptor
→ accessToken 첨부
→ 401 시 refresh
→ 원 요청 재시도
```

이 구조는 현재 백엔드 API 계약을 기준으로 한 현실적인 선택이며,
가장 강한 보안 구조라는 의미는 아니다.

실서비스 보안 관점에서는 refresh token의 HttpOnly/Secure cookie 또는 BFF 구조를 우선 검토한다.

### Axios

가능하면 instance를 역할별로 구분한다.

```text
publicHttp
→ login
→ signup
→ refresh
→ 인증 interceptor 없음

http
→ 인증이 필요한 요청
→ Authorization header
→ 401 refresh 처리
```

`/auth/refresh` 요청이 같은 401 interceptor를 다시 타서 무한 refresh loop가 생기지 않도록 주의한다.

### 401 Retry

각 요청의 `_retry`와 전역 `refreshPromise` 역할을 구분한다.

```text
_retry
→ 같은 요청의 무한 재시도 방지

refreshPromise
→ 동시에 여러 401이 발생했을 때 refresh 요청 중복 방지
```

401 복구는 Axios interceptor가 담당하고,
TanStack Query의 `retry`와 동일한 기능으로 취급하지 않는다.

---

## 9. Routing

React Router를 사용한다.

상품 route는 리소스 기준의 복수형 URL을 선호한다.

예:

```text
/products/register
/products/:id
```

불필요한 `detail` segment는 사용하지 않는다.

```text
/products/detail/:id   ❌
/products/:id          ✅
```

인증 route는 하나의 `AuthGuard`에서 mode로 처리할 수 있다.

예:

```tsx
<AuthGuard mode="guest" />
<AuthGuard mode="protected" />
```

- `guest`: 로그인/회원가입
- `protected`: 마이페이지, 채팅 등 인증 필수 화면

Guard는 가능하면 인증 구현 세부사항보다 `useAuth` 또는 `/auth/me` query 결과를 이용해 접근 여부만 판단한다.

---

## 10. Image Upload

범용 이미지 선택 UI와 상품 도메인 로직을 분리한다.

```text
shared/ui/ImageUploader
→ File 선택
→ 다중 선택
→ 삭제
→ 최대 개수 제한
→ 범용 UI

features/products/register/ui/ProductImageUploader
→ "상품 이미지"라는 도메인 의미
→ RHF 연결
→ 상품별 최대 개수
→ validation 연결
```

### Preview

로컬 이미지 미리보기에는 `URL.createObjectURL(file)`을 사용할 수 있다.

생성한 object URL은 이미지 삭제 또는 component unmount 시:

```ts
URL.revokeObjectURL(url);
```

로 정리한다.

blob preview URL을 서버의 `imageUrls`로 보내지 않는다.

### Upload Flow

서버가 최종적으로 `imageUrls: string[]`를 받는 경우:

```text
File[]
↓
Image Upload API
↓
imageUrls: string[]
↓
Product Register API
```

순서로 처리한다.

---

## 11. Input Conventions

일반 input은 RHF `register`를 우선 사용한다.

`Controller`는 다음과 같은 controlled third-party/custom input에서 필요할 때 사용한다.

- Select library
- DatePicker
- value/onChange 제어가 필수인 UI

native input 기반 컴포넌트에 불필요하게 `Controller`를 사용하지 않는다.

### Price Input

가격은 화면에서는 문자열로 관리할 수 있다.

예:

```text
UI / RHF
"100,000"

API
100000
```

가격 표시 포맷은 UI에서 처리하고,
submit 시 comma를 제거해 number로 변환한다.

---

## 12. Shared UI Rules

`shared/ui` 컴포넌트는 특정 도메인 이름이나 비즈니스 로직을 최대한 포함하지 않는다.

좋은 예:

```text
ImageUploader
Input
Textarea
Button
ErrorMessage
```

피해야 하는 예:

```text
ProductAuctionImageUploader
ProductPriceErrorMessage
```

도메인 조합 컴포넌트는 feature 내부에 둔다.

공통 컴포넌트를 수정할 때 기존 사용처에 미치는 영향을 확인한다.

---

## 13. API Rules

API 함수는 서버 호출 방법만 최대한 명확하게 표현한다.

예:

```ts
export const getMe = async () => {
  const { data } = await http.get<UserInfo>("/auth/me");
  return data;
};
```

UI 전용 동작을 API 함수 안에 넣지 않는다.

예:

- navigate
- toast
- form.setError
- modal open/close

이런 동작은 호출부 또는 feature model/ui 계층에서 처리한다.

API 계약이 명확하지 않으면 추측해서 필드명을 만들지 않는다.

반드시:

- 기존 API 문서
- 실제 response
- mock handler
- 현재 코드

를 확인한다.

---

## 14. MSW

MSW는 개발/테스트용 API mocking에 사용한다.

- mock handler는 `mocks`에 둔다.
- 실제 API module에서 MSW를 import하지 않는다.
- mock과 production API 코드를 섞지 않는다.
- unhandled request 정책은 프로젝트 설정을 따른다.

---

## 15. WebSocket

실시간 입찰과 거래 채팅은 WebSocket을 사용한다.

원칙:

- 연결 lifecycle을 명확히 관리한다.
- component unmount 시 listener/connection cleanup을 확인한다.
- REST server state와 WebSocket event state의 책임을 구분한다.
- 동일 데이터를 TanStack Query와 local state에 중복 저장하기 전에 필요성을 검토한다.
- 실시간 이벤트로 server cache를 갱신해야 할 경우 query cache update/invalidation 전략을 먼저 설계한다.

---

## 16. AI Behavior Rules

AI는 다음 행동을 하지 않는다.

### 금지

- 사용자의 기존 결정을 이유 없이 뒤집지 않는다.
- 기존 코드에 없는 helper를 갑자기 사용하지 않는다.
- 존재하지 않는 API contract를 가정하지 않는다.
- 필요하지 않은 library를 추가하지 않는다.
- 작은 기능에 지나치게 복잡한 architecture를 도입하지 않는다.
- "실무에서는 무조건 이렇게 한다"처럼 근거 없는 일반화를 하지 않는다.
- 동작하지 않는 코드를 자신 있게 확정하지 않는다.
- 사용자의 코드 스타일을 무시하고 전체를 재작성하지 않는다.

### 권장

- 변경 이유를 설명한다.
- 새로운 helper/type/file을 만들면 왜 필요한지 설명한다.
- 코드가 동작하는 흐름을 짧게 설명한다.
- 이전 제안에서 잘못된 부분이 발견되면 명확히 수정한다.
- 가능한 경우 기존 코드의 최소 수정안을 먼저 제시한다.
- 사용자 질문이 개념 질문이면 바로 코드부터 작성하지 않는다.

---

## 17. Decision Policy

다음 기준으로 판단한다.

### 단순한 구현을 우선

둘 다 충분히 좋은 방법이라면:

- 파일 수가 적고
- 상태 중복이 없고
- React lifecycle이 단순하고
- 설명하기 쉬운

방식을 우선한다.

### 재사용성은 실제 필요 기준

"나중에 쓸 수도 있음"만으로 과도하게 공통화하지 않는다.

2개 이상의 실제 사용처가 있거나,
명확히 범용 역할인 경우 shared로 이동한다.

### 최적화는 측정 후

성능 최적화는 추측보다 측정을 우선한다.

- Lighthouse
- React DevTools
- Network
- 실제 request count
- bundle 결과

등을 확인한 뒤 최적화한다.

---

## 18. Completion Format

작업 완료 후 AI는 가능하면 다음 순서로 보고한다.

1. 무엇을 변경했는지
2. 왜 이 구조를 선택했는지
3. 변경된 파일
4. 검증 결과
   - lint
   - typecheck
   - test
   - build
5. 남은 이슈 또는 백엔드 확인이 필요한 부분

불필요하게 장황한 보고는 피한다.

---

## 19. Core Principle

이 프로젝트에서 AI는 코드를 대신 책임지는 주체가 아니다.

AI는:

- 문제를 구조화하고
- 대안을 비교하고
- 구현 초안을 만들고
- 반복 검증을 돕는 도구다.

최종 기술적 의사결정과 코드 품질 책임은 개발자에게 있다.

**코드 생성 속도보다 문제 정의, 구조적 일관성, 검증 가능성을 우선한다.**
