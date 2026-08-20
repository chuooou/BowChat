import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.email({ error: "유효한 이메일 주소를 입력해주세요." }),
    verifiedEmail: z.string(),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
    passwordConfirm: z.string(),
    nickname: z
      .string()
      .min(2, "닉네임은 최소 2자 이상이어야 합니다.")
      .max(20, "닉네임은 최대 20자까지 가능합니다."),
    verifiedNickname: z.string(),
    agree: z.boolean().refine((value) => value, "이용약관 및 개인정보처리방침에 동의해야 합니다."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    error: "비밀번호가 일치하지 않습니다.",
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
