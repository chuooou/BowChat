import { Link, Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <h1>
            <Link to="/" className="text-xl font-bold">
              BowChat
            </Link>
          </h1>

          <nav className="flex items-center gap-4">
            <Link to="/">경매</Link>
            <Link to="/chats">채팅</Link>
            <Link to="/mypage">마이페이지</Link>
            <Link to="/login">로그인</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
