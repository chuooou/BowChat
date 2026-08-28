import { useEffect, useRef } from "react";

const ImagePreview = ({ file }: { file: File }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const previewUrl = URL.createObjectURL(file);

    if (imageRef.current) {
      imageRef.current.src = previewUrl;
    }

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [file]);

  return <img ref={imageRef} alt="업로드 이미지" className="h-full w-full object-cover" />;
};

export default ImagePreview;
