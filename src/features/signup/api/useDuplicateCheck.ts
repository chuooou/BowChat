import { useMutation } from "@tanstack/react-query";
import { useFormContext, useFormState, useWatch } from "react-hook-form";

import type { SignupFormValues } from "@/features/signup/model/signupSchema";

type DuplicateCheckResponse = {
  available: boolean;
};

type DuplicateField = "email" | "nickname";

type VerifiedField = "verifiedEmail" | "verifiedNickname";

type DuplicateCheckFn = (value: string) => Promise<DuplicateCheckResponse>;

type UseDuplicateCheckParams = {
  name: DuplicateField;
  verifiedName: VerifiedField;
  mutationFn: DuplicateCheckFn;
  duplicateMessage: string;
  requestErrorMessage: string;
};

export const useDuplicateCheck = ({
  name,
  verifiedName,
  mutationFn,
  duplicateMessage,
  requestErrorMessage,
}: UseDuplicateCheckParams) => {
  const form = useFormContext<SignupFormValues>();

  const [value, verifiedValue] = useWatch({
    name: [name, verifiedName],
  });

  const { errors } = useFormState<SignupFormValues>({
    name,
  });

  const mutation = useMutation({
    mutationFn,
  });

  const isVerified = value !== "" && value === verifiedValue;

  const handleDuplicateCheck = async () => {
    const isValid = await form.trigger(name);

    if (!isValid) return;

    mutation.mutate(value, {
      onSuccess: (data) => {
        if (form.getValues(name) !== value) return;

        if (!data.available) {
          form.setError(name, {
            type: "server",
            message: duplicateMessage,
          });

          return;
        }
        form.clearErrors(name);
        form.setValue(verifiedName, value);
      },
      onError: () => {
        form.setError(name, {
          type: "server",
          message: requestErrorMessage,
        });
      },
    });
  };

  return {
    error: errors[name],
    isVerified,
    isPending: mutation.isPending,
    handleDuplicateCheck,
  };
};
