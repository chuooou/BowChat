import z from "zod";

export const productRegisterSchema = z.object({
  name: z.string().min(1, "상품명을 입력해주세요.").max(64, "상품명은 64자 이하로 입력해주세요."),
  description: z
    .string()
    .min(1, "상품 설명을 입력해주세요.")
    .max(500, "상품 설명은 500자 이하로 입력해주세요."),
  price: z
    .string()
    .min(1, "가격을 입력해주세요.")
    .refine((value) => Number(value.replaceAll(",", "")) > 0, "시작 가격은 0원보다 커야 합니다."),
  images: z
    .array(
      z.object({
        id: z.string(),
        file: z.instanceof(File),
      }),
    )
    .min(1, "상품 이미지를 1장 이상 등록해주세요.")
    .max(10, "상품 이미지는 최대 10장까지 등록할 수 있습니다."),
  saleType: z.enum(["AUCTION", "DIRECT"]),
});

export type ProductRegisterFormValues = z.infer<typeof productRegisterSchema>;
