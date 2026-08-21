import { Link } from "react-router-dom";

import LoginForm from "@/features/login/ui/LoginForm";

const Login = () => {
  return (
    <section className="bg-background flex h-full w-full flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-xl">
        <h2 className="text-[2rem] font-bold">로그인</h2>

        <LoginForm />

        <p className="text-gray mt-[2.4rem] text-center text-[1.3rem]">
          아직 계정이 없으신가요?{" "}
          <Link to="/signup" className="text-danger font-bold">
            회원가입
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
