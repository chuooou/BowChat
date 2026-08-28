import { useFormContext } from "react-hook-form";

import { checkNicknameDuplicate } from "@/features/signup/api/signupApi";
import { useDuplicateCheck } from "@/features/signup/api/useDuplicateCheck";
import type { SignupFormValues } from "@/features/signup/model/signupSchema";
import { Button } from "@/shared/ui/Button";
import ErrorMessage from "@/shared/ui/ErrorMessage";
import { Input } from "@/shared/ui/Input";

const NicknameField = () => {
  const form = useFormContext<SignupFormValues>();
  const { error, isVerified, isPending, handleDuplicateCheck } = useDuplicateCheck({
    name: "nickname",
    verifiedName: "verifiedNickname",
    mutationFn: checkNicknameDuplicate,
    duplicateMessage: "이미 사용 중인 닉네임입니다.",
    requestErrorMessage: "닉네임 중복확인 요청에 실패했습니다. 잠시 후 다시 시도해주세요.",
  });

  return (
    <div className="mt-[1.6rem]">
      <label htmlFor="nickname" className="text-gray mb-[0.65rem] block text-[1.3rem] font-medium">
        닉네임
      </label>

      <div className="flex items-center gap-[0.8rem]">
        <Input
          {...form.register("nickname")}
          id="nickname"
          placeholder="닉네임을 입력해주세요"
          aria-invalid={!!error}
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

      <ErrorMessage message={error?.message} />
    </div>
  );
};

export default NicknameField;
