import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/cn";

const inputVariants = cva(
  [
    "w-full text-[#757575]",
    "rounded-[1rem] border border-[#E3E2DD]",
    "outline-none",
    "placeholder:text-gray",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ],
  {
    variants: {
      inputSize: {
        md: "h-[4.2rem] px-[1.5rem] text-sm",
      },
      error: {
        true: ["border-danger", "focus:ring-danger"],
      },
    },
    defaultVariants: {
      inputSize: "md",
      error: false,
    },
  },
);

type InputProps = ComponentPropsWithoutRef<"input"> & VariantProps<typeof inputVariants>;

const Input = ({ inputSize = "md", error = false, className, ...props }: InputProps) => {
  return (
    <input
      className={cn(
        inputVariants({
          inputSize,
          error,
        }),
        className,
      )}
      aria-invalid={error || undefined}
      {...props}
    />
  );
};

export default Input;
