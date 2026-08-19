import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { type SignupFormValues, signupSchema } from "@/features/auth/signup/model/signupSchema";
import { Button } from "@/shared/ui/Button";
import CheckBox from "@/shared/ui/CheckBox";
import Input from "@/shared/ui/Input";

import EmailField from "./EmailField";

const signupDefaultValues: SignupFormValues = {
  email: "",
  password: "",
  passwordConfirm: "",
  nickname: "",
  agree: false,
};

const SignupForm = () => {
  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: signupDefaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: SignupFormValues) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <EmailField />

        <div className="mt-[1.6rem]">
          <label
            htmlFor="password"
            className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium"
          >
            비밀번호
          </label>

          <Input
            {...register("password")}
            type="password"
            id="password"
            placeholder="8자 이상 입력해주세요"
            aria-invalid={!!errors.password}
          />

          {errors.password && (
            <p className="text-danger mt-[0.6rem] text-[1.2rem]">{errors.password.message}</p>
          )}
        </div>

        <div className="mt-[1.6rem]">
          <label
            htmlFor="passwordConfirm"
            className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium"
          >
            비밀번호 확인
          </label>

          <Input
            {...register("passwordConfirm")}
            type="password"
            id="passwordConfirm"
            placeholder="다시 한 번 입력해주세요"
            aria-invalid={!!errors.passwordConfirm}
          />

          {errors.passwordConfirm && (
            <p className="text-danger mt-[0.6rem] text-[1.2rem]">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        <div className="mt-[1.6rem]">
          <label
            htmlFor="nickname"
            className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium"
          >
            닉네임
          </label>

          <div className="flex items-center gap-[0.8rem]">
            <Input
              {...register("nickname")}
              type="text"
              id="nickname"
              placeholder="닉네임을 입력해주세요"
              aria-invalid={!!errors.nickname}
            />

            <Button type="button" className="shrink-0" size="md" variant="white">
              중복확인
            </Button>
          </div>

          {errors.nickname && (
            <p className="text-danger mt-[0.6rem] text-[1.2rem]">{errors.nickname.message}</p>
          )}
        </div>

        <div className="mt-[1.6rem]">
          <div className="text-gray flex items-center gap-[0.8rem] text-[1.3rem] font-medium">
            <CheckBox id="agree" aria-invalid={!!errors.agree} {...register("agree")} />

            <label htmlFor="agree">[필수] 이용약관 및 개인정보처리방침에 동의합니다</label>
          </div>

          {errors.agree && (
            <p className="text-danger mt-[0.6rem] text-[1.2rem]">{errors.agree.message}</p>
          )}
        </div>

        <Button type="submit" variant="black" size="md" className="mt-[2.4rem] w-full">
          가입하기
        </Button>
      </form>
    </FormProvider>
  );
};

export default SignupForm;
