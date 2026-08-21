import z from "zod";

export const loginSchema = z.object({
  email: z.email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  autoLogin: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
