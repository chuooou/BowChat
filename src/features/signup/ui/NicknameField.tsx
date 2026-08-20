import { useFormContext, useFormState, useWatch } from "react-hook-form";

import { useCheckNicknameMutation } from "@/features/signup/api/useCheckNicknameMutation";
import type { SignupFormValues } from "@/features/signup/model/signupSchema";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

const NicknameField = () => {
  const form = useFormContext<SignupFormValues>();
  const nickname = useWatch({ name: "nickname" });
  const isNicknameVerified = nickname !== "" && nickname === form.getValues("verifiedNickname");
  const { errors } = useFormState<SignupFormValues>({
    name: "nickname",
  });

  const nicknameCheckMutation = useCheckNicknameMutation();

  const handleNicknameDuplicateCheck = async () => {
    const isValid = await form.trigger("nickname");

    if (!isValid) return;

    nicknameCheckMutation.mutate(nickname, {
      onSuccess: (data) => {
        if (form.getValues("nickname") !== nickname) return;

        if (!data.available) {
          form.setError("nickname", {
            type: "server",
            message: "이미 사용 중인 닉네임입니다.",
          });

          return;
        }

        form.clearErrors("nickname");
        form.setValue("verifiedNickname", nickname);
      },
      onError: () => {
        form.setError("nickname", {
          type: "server",
          message: "닉네임 중복확인 요청에 실패했습니다. 잠시 후 다시 시도해주세요.",
        });
      },
    });
  };

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
          aria-invalid={!!errors.nickname}
        />

        <Button
          size="md"
          variant={isNicknameVerified ? "green" : "white"}
          className="shrink-0"
          disabled={nicknameCheckMutation.isPending || isNicknameVerified}
          isLoading={nicknameCheckMutation.isPending}
          onClick={handleNicknameDuplicateCheck}
        >
          {isNicknameVerified ? "확인완료" : "중복확인"}
        </Button>
      </div>

      {errors.nickname && (
        <p className="text-danger mt-[0.6rem] text-[1.2rem]">{errors.nickname.message}</p>
      )}
    </div>
  );
};

export default NicknameField;
