import { useFormContext, useFormState, useWatch } from "react-hook-form";

import { useCheckEmailMutation } from "@/features/auth/signup/api/useCheckEmailMutation";
import type { SignupFormValues } from "@/features/auth/signup/model/signupSchema";
import { Button } from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";

const EmailField = () => {
  const { register, control, trigger, getValues, setError, clearErrors } =
    useFormContext<SignupFormValues>();

  const email = useWatch({
    name: "email",
  });

  const { errors } = useFormState({
    control,
    name: "email",
  });

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

  return (
    <div className="mt-[2.4rem]">
      <label htmlFor="email" className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium">
        이메일
      </label>

      <div className="flex items-center gap-[0.8rem]">
        <Input
          type="email"
          id="email"
          placeholder="name@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />

        <Button
          type="button"
          className="shrink-0"
          size="md"
          variant="black"
          disabled={emailCheckMutation.isPending || isEmailVerified}
          isLoading={emailCheckMutation.isPending}
          onClick={handleEmailDuplicateCheck}
        >
          {isEmailVerified ? "확인완료" : "중복확인"}
        </Button>
      </div>

      {errors.email && (
        <p className="text-danger mt-[0.6rem] text-[1.2rem]">{errors.email.message}</p>
      )}
    </div>
  );
};

export default EmailField;
