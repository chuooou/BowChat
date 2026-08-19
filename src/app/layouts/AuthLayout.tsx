import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex h-dvh flex-1">
      <div className="bg-dark text-background flex h-full w-1/2 flex-col justify-between p-[4rem]">
        <h1 className="text-background text-4xl font-bold">BowChat</h1>
        <div>
          <p className="text-[2.6rem] font-bold">
            실시간 입찰로 만나는
            <br />
            가장 정직한 거래
          </p>
          <p className="text-muted mt-[1rem] text-[1.3rem]">
            입찰방에서 투명하게 경쟁하고, <br />
            낙찰 후에는 1:1로 안전하게 거래하세요.
          </p>
        </div>
        <p className="text-light-gray text-[1.15rem]">@ BowChat</p>
      </div>
      <div className="h-full w-1/2 p-[4rem]">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
