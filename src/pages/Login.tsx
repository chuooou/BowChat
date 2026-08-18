import { Link } from "react-router-dom";

import Input from "@/shared/ui/Input";

const Login = () => {
  return (
    <section className="flex h-screen w-full flex-col items-center justify-center bg-white">
      <div className="mx-auto max-w-xl">
        <h2>로그인</h2>

        <div>
          <label htmlFor="email">이메일</label>
          <Input type="email" id="email" name="email" />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <Input type="password" id="password" name="password" />
        </div>
        <div>
          <div>
            <input type="checkbox" id="autoLogin" name="autoLogin" />
            <label htmlFor="autoLogin">자동 로그인</label>
          </div>
        </div>
        <button type="submit">로그인</button>
        <p>
          아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
