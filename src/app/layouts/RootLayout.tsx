import { Link, Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth/model/useAuth";
import { useLogout } from "@/features/auth/model/useLogout";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

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
          <div className="text-gray mx-auto flex items-center justify-between px-[4rem] text-[1.4rem]">
            <div className="flex items-center gap-[2rem]">
              <h1 className="text-black">
                <Link to="/" className="text-[1.9rem] font-bold">
                  BowChat
                </Link>
              </h1>

              <nav className="flex items-center gap-[1.4rem]">
                <Link to="/" className="shrink-0">
                  경매홈
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/chats" className="shrink-0">
                      채팅
                    </Link>
                    <Link to="/mypage" className="shrink-0">
                      마이페이지
                    </Link>
                  </>
                )}
              </nav>

              <div className="ml-[8px]">
                <Input
                  placeholder="검색어를 입력하세요"
                  className="bg-surface h-[3.5rem] rounded-full text-[1.4rem] placeholder:text-[1.4rem]"
                />
              </div>
            </div>

            <div className="flex items-center gap-[1.4rem]">
              {isAuthenticated ? (
                <>
                  <p>{user?.nickname}님</p>
                  <button onClick={logout} className="">
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">로그인</Link>
                </>
              )}
              <Button asChild>
                <Link to="/products/register">상품 등록</Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full px-[4rem]">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default RootLayout;
