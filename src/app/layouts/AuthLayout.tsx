import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-1">
      <div className="flex w-1/2 flex-col justify-between bg-black text-white">
        <h1 className="text-4xl font-bold text-white">BowChat</h1>
        <div>
          <p>
            실시간 입찰로 만나는
            <br />
            가장 정직한 거래
          </p>
          <p>
            입찰방에서 투명하게 경쟁하고, <br />
            낙찰 후에는 1:1로 안전하게 거래하세요.
          </p>
        </div>
        <p className="text-muted text-[1.15rem]">@ BowChat</p>
      </div>
      <div className="w-1/2">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
