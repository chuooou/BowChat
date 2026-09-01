import { useState } from "react";

const ThumbnailWrapper = ({ images }: { images: string[] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section className="w-full max-w-[630px] flex-2">
      <img
        src={images[selectedIndex]}
        alt="상품 이미지"
        className="w-full rounded-[1.8rem] object-cover"
      />

      {images.length > 1 && (
        <div className="mt-[1.2rem] flex gap-[1rem]">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => setSelectedIndex(index)}
            >
              <img src={url} alt="상품 이미지" className="size-[6.4rem] rounded-xl object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default ThumbnailWrapper;
