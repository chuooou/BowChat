const ProductDetailSkeleton = () => {
  return (
    <article className="flex justify-between gap-[3.6rem] py-[3rem]">
      <div className="aspect-video w-full max-w-[630px] animate-pulse rounded-[1.8rem] bg-gray-200" />

      <section className="w-[45%]">
        <div className="h-[3rem] w-[60%] animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-[2rem] w-[40%] animate-pulse rounded bg-gray-200" />{" "}
        <div className="mt-4 h-[3rem] w-[70%] animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-[3rem] w-[60%] animate-pulse rounded bg-gray-200" />
        <div className="mt-6 h-[15rem] w-full animate-pulse rounded rounded-xl bg-gray-200" />
      </section>
    </article>
  );
};

export default ProductDetailSkeleton;
