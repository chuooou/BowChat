import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email({ error: "유효한 이메일 주소를 입력해주세요." }),
    password: z.string().min(8, { error: "비밀번호는 최소 8자 이상이어야 합니다." }),
    passwordConfirm: z.string().min(1, { error: "비밀번호를 다시 입력해주세요." }),
    nickname: z
      .string()
      .min(2, { error: "닉네임은 최소 2자 이상이어야 합니다." })
      .max(20, { error: "닉네임은 최대 20자까지 가능합니다." }),
    agree: z
      .boolean()
      .refine((value) => value, { error: "이용약관 및 개인정보처리방침에 동의해야 합니다." }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
