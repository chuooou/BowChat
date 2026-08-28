import { useState } from "react";
import { useFormContext } from "react-hook-form";

import type { UploadImage } from "@/shared/ui/ImageUploader";
import ImageUploader from "@/shared/ui/ImageUploader";

const MAX_IMAGE_COUNT = 10;

const ProductImageUploader = () => {
  const form = useFormContext();
  const [images, setImages] = useState<UploadImage[]>([]);

  const onChange = (uploadImages: UploadImage[]) => {
    setImages(uploadImages);

    form.setValue("images", uploadImages, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      <label className="text-gray mb-[7px] text-[1.3rem] font-bold">
        상품 이미지{" "}
        <span className="text-light-gray font-normal">
          · <span>{images.length}</span>/{MAX_IMAGE_COUNT}장
        </span>
      </label>

      <ImageUploader images={images} onChange={onChange} maxCount={MAX_IMAGE_COUNT} />
    </>
  );
};

export default ProductImageUploader;
