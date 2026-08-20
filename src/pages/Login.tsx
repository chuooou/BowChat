import { Link } from "react-router-dom";

import { Button } from "@/shared/ui/Button";
import CheckBox from "@/shared/ui/CheckBox";
import { Input, PasswordInput } from "@/shared/ui/Input";

// 로그인 api 호출 -> 성공 후 메인 -> 실패시 에러 토스트
// 자동 로그인 체크: 두 토큰을 localStorage
// 자동 로그인 미체크: 두 토큰을 sessionStorage
// userInfo:  React Query

const Login = () => {
  return (
    <section className="bg-background flex h-full w-full flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-xl">
        <h2 className="text-[2rem] font-bold">로그인</h2>

        <div className="mt-[2.4rem]">
          <label htmlFor="email" className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium">
            이메일
          </label>
          <Input type="email" id="email" name="email" placeholder="이메일을 입력해주세요" />
        </div>
        <div className="mt-[1.6rem]">
          <label
            htmlFor="password"
            className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium"
          >
            비밀번호
          </label>
          <PasswordInput id="password" name="password" placeholder="비밀번호를 입력해주세요" />
        </div>
        <div className="mt-[1.6rem] flex items-center justify-between">
          <div className="text-gray flex items-center gap-[0.8rem] text-[1.3rem] font-medium">
            <CheckBox id="autoLogin" name="autoLogin" />
            <label htmlFor="autoLogin">자동 로그인</label>
          </div>
          <p className="text-light-gray text-[1.3rem] font-medium">
            <Link to="/forgot-password">비밀번호를 잊으셨나요?</Link>
          </p>
        </div>
        <Button type="submit" variant="black" size="md" className="mt-[2.4rem] w-full">
          로그인
        </Button>
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
