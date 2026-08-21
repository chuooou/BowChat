import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useLoginMutaion } from "@/features/login/api/useLoginMutaion";
import { type LoginFormValues, loginSchema } from "@/features/login/model/loginSchema";
import { authStorage } from "@/shared/auth/authStorage";
import { tokenStore } from "@/shared/auth/tokenStore";
import { Button } from "@/shared/ui/Button";
import CheckBox from "@/shared/ui/CheckBox";
import { Input, PasswordInput } from "@/shared/ui/Input";

// 로그아웃 처리 - 라우터에서 접근 가능 불가능 페이지.
// 액세스토큰 - 로컬스토리지,

// - 내 정보 조회
//   - `GET /auth/me`
//   - 로그인 토큰 필요

// - 토큰 재발급
//   - `POST /auth/refresh`

const LOGIN_DEFAULT_VALUES = {
  email: "",
  password: "",
  autoLogin: false,
};

const LoginForm = () => {
  const queryClient = new QueryClient();
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: LOGIN_DEFAULT_VALUES,
  });
  const navigate = useNavigate();

  const login = useLoginMutaion();
  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data, {
      onSuccess: (data) => {
        tokenStore.setAccessToken(data.accessToken);
        authStorage.setRefreshToken(data.refreshToken, data.refreshTokenExpiresIn);

        queryClient.setQueryData(["auth", "me"], data.userInfo);

        navigate("/");
      },
      onError: ({ message }) => {
        toast.error(message ?? "로그인에 실패했습니다. 다시 시도해주세요.");
      },
    });
  };

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="mt-[2.4rem]">
        <label htmlFor="email" className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium">
          이메일
        </label>
        <Input
          type="email"
          id="email"
          placeholder="이메일을 입력해주세요"
          {...methods.register("email")}
        />
        {methods.formState.errors.email && (
          <p className="text-danger mt-[0.6rem] text-[1.2rem]">
            {methods.formState.errors.email.message}
          </p>
        )}
      </div>
      <div className="mt-[1.6rem]">
        <label
          htmlFor="password"
          className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium"
        >
          비밀번호
        </label>
        <PasswordInput
          id="password"
          placeholder="비밀번호를 입력해주세요"
          {...methods.register("password")}
        />
        {methods.formState.errors.password && (
          <p className="text-danger mt-[0.6rem] text-[1.2rem]">
            {methods.formState.errors.password.message}
          </p>
        )}
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
      <Button
        type="submit"
        variant="black"
        size="md"
        className="mt-[2.4rem] w-full"
        isLoading={login.isPending}
      >
        로그인
      </Button>
    </form>
  );
};

export default LoginForm;
