import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { useCheckEmailMutation } from "@/features/auth/signup/api/useCheckEmailMutation";
import { type SignupFormValues, signupSchema } from "@/features/auth/signup/model/signupSchema";
import { Button } from "@/shared/ui/Button";
import CheckBox from "@/shared/ui/CheckBox";
import Input from "@/shared/ui/Input";

// 2. 중복확인 연동
// 4. api 연동

const signupDefaultValues: SignupFormValues = {
  email: "",
  password: "",
  passwordConfirm: "",
  nickname: "",
  agree: false,
};

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setError,
    clearErrors,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",

    defaultValues: signupDefaultValues,
  });

  const email = useWatch({ name: "email" });
  const emailCheckMutation = useCheckEmailMutation();

  const isEmailVerified =
    emailCheckMutation.isSuccess &&
    emailCheckMutation.data?.available === true &&
    emailCheckMutation.variables === email;

  const handleEmailDuplicateCheck = async () => {
    const isValid = await trigger("email");

    if (!isValid) {
      return;
    }

    const emailToCheck = getValues("email");

    emailCheckMutation.mutate(emailToCheck, {
      onSuccess: (data) => {
        // 요청 중 사용자가 이메일을 바꿨다면
        // 이전 요청 결과는 현재 값에 적용하지 않음
        if (getValues("email") !== emailToCheck) {
          return;
        }

        if (!data.available) {
          setError("email", {
            type: "server",
            message: "이미 사용 중인 이메일입니다.",
          });

          return;
        }

        clearErrors("email");
      },
    });
  };

  const onSubmit = (data: SignupFormValues) => {
    if (!isEmailVerified) {
      setError("email", {
        type: "manual",
        message: "이메일 중복확인을 해주세요.",
      });

      return;
    }

    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-[2.4rem]">
        <label htmlFor="email" className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium">
          이메일
        </label>
        <div className="flex items-center gap-[.8rem]">
          <Input
            type="email"
            id="email"
            placeholder="name@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <Button
            className="shrink-0"
            size="md"
            variant="black"
            disabled={emailCheckMutation.isPending}
            onClick={handleEmailDuplicateCheck}
            isLoading={emailCheckMutation.isPending}
          >
            {emailCheckMutation.isSuccess ? "확인완료" : "중복확인"}
          </Button>
        </div>
        {errors.email && (
          <p className="text-danger mt-[0.6rem] text-[1.2rem]">{errors.email.message}</p>
        )}
      </div>

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
          <p className="text-danger mt-[0.6rem] text-[1.2rem]">{errors.passwordConfirm.message}</p>
        )}
      </div>

      <div className="mt-[1.6rem]">
        <label
          htmlFor="nickname"
          className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium"
        >
          닉네임
        </label>
        <div className="flex items-center gap-[.8rem]">
          <Input
            {...register("nickname")}
            type="text"
            id="nickname"
            placeholder="닉네임을 입력해주세요"
          />
          <Button className="shrink-0" size="md" variant="white">
            중복확인
          </Button>
        </div>
        {errors.nickname && (
          <p className="text-danger mt-[0.6rem] text-[1.2rem]">{errors.nickname.message}</p>
        )}
      </div>

      <div className="mt-[1.6rem] flex items-center justify-between">
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
  );
};

export default SignupForm;
