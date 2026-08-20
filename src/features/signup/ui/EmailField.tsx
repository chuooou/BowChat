import { useFormContext } from "react-hook-form";

import { checkEmailDuplicate } from "@/features/signup/api/signupApi";
import { useDuplicateCheck } from "@/features/signup/api/useDuplicateCheck";
import type { SignupFormValues } from "@/features/signup/model/signupSchema";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

const EmailField = () => {
  const form = useFormContext<SignupFormValues>();
  const { error, isVerified, isPending, handleDuplicateCheck } = useDuplicateCheck({
    name: "email",
    verifiedName: "verifiedEmail",
    mutationFn: checkEmailDuplicate,
    duplicateMessage: "이미 사용 중인 이메일입니다.",
    requestErrorMessage: "이메일 중복확인 요청에 실패했습니다. 잠시 후 다시 시도해주세요.",
  });

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
          aria-invalid={!!error}
          {...form.register("email")}
        />

        <Button
          size="md"
          variant={isVerified ? "green" : "white"}
          className="shrink-0"
          disabled={isPending || isVerified}
          isLoading={isPending}
          onClick={handleDuplicateCheck}
        >
          {isVerified ? "확인완료" : "중복확인"}
        </Button>
      </div>

      {error && <p className="text-danger mt-[0.6rem] text-[1.2rem]">{error.message}</p>}
    </div>
  );
};

export default EmailField;
