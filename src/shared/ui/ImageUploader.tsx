import { useRef } from "react";
import { toast } from "sonner";

import ImagePreview from "@/shared/ui/ImagePreview";

export type UploadImage = {
  id: string;
  file: File;
};

type ImageUploaderProps = {
  images: UploadImage[];
  onChange: (images: UploadImage[]) => void;
  maxCount?: number;
};

const ImageUploader = ({ images = [], onChange, maxCount = 10 }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    const remaining = maxCount - images.length;

    if (selectedFiles.length > remaining) {
      toast.error(`이미지는 ${remaining}장 더 등록할 수 있습니다.`);
      event.target.value = "";

      return;
    }

    const newImages = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));

    onChange([...images, ...newImages]);

    event.target.value = "";
  };

  const handleRemoveImage = (id: string) => {
    onChange(images.filter((image) => image.id !== id));
  };

  return (
    <div className="flex flex-wrap gap-[1rem]">
      {images.length < maxCount && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleSelectImages}
          />

          <button
            type="button"
            aria-label="파일 업로드"
            onClick={() => inputRef.current?.click()}
            className="border-light-gray flex size-[7rem] items-center justify-center rounded-xl border border-dashed"
          >
            +
          </button>
        </>
      )}

      {images.map((image) => (
        <div
          key={image.id}
          className="bg-light-gray relative size-[7rem] overflow-hidden rounded-xl"
        >
          <ImagePreview file={image.file} />

          <button
            type="button"
            aria-label="사진 삭제"
            onClick={() => handleRemoveImage(image.id)}
            className="absolute top-0 right-[7px]"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageUploader;
