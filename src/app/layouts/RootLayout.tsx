import { Link, Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth/model/useAuth";
import { useLogout } from "@/features/auth/model/useLogout";
import { Button } from "@/shared/ui/Button";

const RootLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const logout = useLogout();

  if (isLoading) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-background border-b border-gray-200 py-[2.15rem]">
          <div className="mx-auto flex items-center justify-between px-[4rem]">
            <div className="flex items-center gap-[2rem]">
              <h1>
                <Link to="/" className="text-[1.9rem] font-bold">
                  BowChat
                </Link>
              </h1>

              <nav className="flex items-center gap-[1.4rem]">
                <Link to="/">경매홈</Link>
                {isAuthenticated && (
                  <>
                    <Link to="/chats">채팅</Link>
                    <Link to="/mypage">마이페이지</Link>
                  </>
                )}
              </nav>

              <div className="ml-[8px]">검색바</div>
            </div>

            <div className="flex items-center gap-[1rem]">
              {isAuthenticated ? (
                <>
                  <p>{user?.nickname}</p>
                  <button onClick={logout}>로그아웃</button>
                </>
              ) : (
                <>
                  <Link to="/login">로그인</Link>
                </>
              )}
              <Button>
                <Link to="/products/register">상품 등록</Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default RootLayout;
