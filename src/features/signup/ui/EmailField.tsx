import { useFormContext, useFormState, useWatch } from "react-hook-form";

import { useCheckEmailMutation } from "@/features/signup/api/useCheckEmailMutation";
import type { SignupFormValues } from "@/features/signup/model/signupSchema";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

const EmailField = () => {
  const form = useFormContext<SignupFormValues>();
  const verifiedEmail = form.getValues("verifiedEmail");
  const email = useWatch({
    name: "email",
  });
  const isEmailVerified = email !== "" && email === verifiedEmail;
  const { errors } = useFormState<SignupFormValues>({
    name: "email",
  });

  const emailCheckMutation = useCheckEmailMutation();

  const handleEmailDuplicateCheck = async () => {
    const isValid = await form.trigger("email");

    if (!isValid) return;

    emailCheckMutation.mutate(email, {
      onSuccess: (data) => {
        if (form.getValues("email") !== email) return;

        if (!data.available) {
          form.setError("email", {
            type: "server",
            message: "이미 사용 중인 이메일입니다.",
          });

          return;
        }

        form.clearErrors("email");
        form.setValue("verifiedEmail", email);
      },
      onError: () => {
        form.setError("email", {
          type: "server",
          message: "이메일 중복확인 요청에 실패했습니다. 잠시 후 다시 시도해주세요.",
        });
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
          {...form.register("email")}
        />

        <Button
          size="md"
          variant={isEmailVerified ? "green" : "white"}
          className="shrink-0"
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
