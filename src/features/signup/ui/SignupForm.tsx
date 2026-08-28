import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { type SignupFormValues, signupSchema } from "@/features/signup/model/signupSchema";
import { useSignupMutation } from "@/features/signup/model/useSignupMutation";
import NicknameField from "@/features/signup/ui/NicknameField";
import { Button } from "@/shared/ui/Button";
import CheckBox from "@/shared/ui/CheckBox";
import ErrorMessage from "@/shared/ui/ErrorMessage";
import { PasswordInput } from "@/shared/ui/Input";

import EmailField from "./EmailField";

const SIGNUP_DEFAULT_VALUES = {
  email: "",
  verifiedEmail: "",
  password: "",
  passwordConfirm: "",
  nickname: "",
  verifiedNickname: "",
  agree: false,
};

const SignupForm = () => {
  const methods = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: SIGNUP_DEFAULT_VALUES,
  });
  const navigate = useNavigate();

  const signupMutation = useSignupMutation();

  const onSubmit = (data: SignupFormValues) => {
    if (data.email !== data.verifiedEmail) {
      methods.setError("email", {
        type: "server",
        message: "이메일 중복확인을 해주세요.",
      });

      return;
    }

    if (data.nickname !== data.verifiedNickname) {
      methods.setError("nickname", {
        type: "server",
        message: "닉네임 중복확인을 해주세요.",
      });

      return;
    }

    const payload = {
      email: data.email,
      password: data.password,
      nickName: data.nickname,
    };

    signupMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("회원가입이 완료되었습니다.");
        navigate("/login");
      },
      onError: (error) => {
        console.log(error);
        if (error instanceof Error) {
          toast.error("회원가입에 실패했습니다.");
        }
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <EmailField />

        <div className="mt-[1.6rem]">
          <label
            htmlFor="password"
            className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium"
          >
            비밀번호
          </label>

          <PasswordInput
            {...methods.register("password")}
            id="password"
            placeholder="8자 이상 입력해주세요"
            aria-invalid={!!methods.formState.errors.password}
          />
          <ErrorMessage message={methods.formState.errors.password?.message} />
        </div>

        <div className="mt-[1.6rem]">
          <label
            htmlFor="passwordConfirm"
            className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium"
          >
            비밀번호 확인
          </label>

          <PasswordInput
            {...methods.register("passwordConfirm")}
            id="passwordConfirm"
            placeholder="다시 한 번 입력해주세요"
            aria-invalid={!!methods.formState.errors.passwordConfirm}
          />
          <ErrorMessage message={methods.formState.errors.passwordConfirm?.message} />
        </div>

        <NicknameField />

        <div className="mt-[1.6rem]">
          <div className="text-gray flex items-center gap-[0.8rem] text-[1.3rem] font-medium">
            <CheckBox
              id="agree"
              aria-invalid={!!methods.formState.errors.agree}
              {...methods.register("agree")}
            />

            <label htmlFor="agree">[필수] 이용약관 및 개인정보처리방침에 동의합니다</label>
          </div>
          <ErrorMessage message={methods.formState.errors.agree?.message} />
        </div>

        <Button
          type="submit"
          variant="black"
          size="md"
          className="mt-[2.4rem] w-full"
          isLoading={signupMutation.isPending}
        >
          가입하기
        </Button>
      </form>
    </FormProvider>
  );
};

export default SignupForm;
