import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  type ProductRegisterFormValues,
  productRegisterSchema,
} from "@/features/products/model/productsSchema";
import { useProductRegisterMutation } from "@/features/products/register/api/useProductRegisterMutation";
import ProductImageUploader from "@/features/products/register/ui/ProductImageUploader";
import { Button } from "@/shared/ui/Button";
import ErrorMessage from "@/shared/ui/ErrorMessage";
import { Input } from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";

const PRODUCT_REGISTER_DEFAULT_VALUES: ProductRegisterFormValues = {
  name: "",
  description: "",
  price: "",
  images: [],
  saleType: "AUCTION",
};

const Register = () => {
  const navigate = useNavigate();
  const methods = useForm({
    resolver: zodResolver(productRegisterSchema),
    defaultValues: PRODUCT_REGISTER_DEFAULT_VALUES,
  });

  const mutation = useProductRegisterMutation();

  const onSubmit = async (data: ProductRegisterFormValues) => {
    console.log(data);

    // 추후 이미지 저장 api 생기면 주석 해제
    // const imageUrls = await uploadImages(values.images.map((image) => image.file));
    const imageUrls = data.images.map((image) => image.file.name);

    mutation.mutate(
      {
        name: data.name,
        description: data.description,
        price: Number(data.price.replaceAll(",", "")),
        imageUrls,
        saleType: "AUCTION",
      },
      {
        onSuccess: () => {
          toast.success("상품 등록에 성공하였습니다.");

          navigate("/");
        },
        onError: (error) => {
          toast.error(error.message ?? "상품 등록을 실패했습니다. 잠시 후 다시 시도해주세요.");
        },
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, (error, data) => {
          console.log(error, data);
        })}
        className="py-[3.6rem]"
      >
        <div>
          <ProductImageUploader />
          <ErrorMessage message={methods.formState.errors.images?.message} />
        </div>
        <div className="max-w-[70%]">
          <div className="mt-[2rem]">
            <label className="text-gray text-[1.3rem] font-bold">상품명</label>
            <div className="mt-[7px]">
              <Input id="name" {...methods.register("name")} />
              <ErrorMessage message={methods.formState.errors.name?.message} />
            </div>
          </div>
          <div className="mt-[2rem]">
            <label className="text-gray text-[1.3rem] font-bold">상품 설명</label>
            <div className="mt-[7px]">
              <Textarea {...methods.register("description")} />
              <ErrorMessage message={methods.formState.errors.description?.message} />
            </div>
          </div>
          <div className="mt-[2rem]">
            <label className="text-gray text-[1.3rem] font-bold">시작가격</label>
            <div className="mt-[7px]">
              <Input
                {...methods.register("price")}
                inputMode="numeric"
                onChange={(event) => {
                  const numbers = event.target.value.replace(/\D/g, "");

                  event.target.value = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                  methods.register("price").onChange(event);
                }}
              />
              <ErrorMessage message={methods.formState.errors.price?.message} />
            </div>
          </div>
        </div>

        <div className="mt-[2rem]">
          <Button type="submit" variant="gray" className="mr-[1rem] px-[4.5rem]">
            저장하기
          </Button>
          <Button className="px-[4.5rem]">경매 바로 시작하기</Button>
          <p className="text-light-gray mt-[1.5rem] text-[1.3rem]">
            저장하기는 임시 보관, 경매 바로 시작하기는 즉시 입찰을 엽니다.
          </p>
        </div>
      </form>
    </FormProvider>
  );
};

export default Register;
