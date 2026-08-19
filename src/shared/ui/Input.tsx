import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/cn";

const inputVariants = cva(
  [
    "text-dark w-full text-[1.4rem]",
    "rounded-[1rem] border border-[#E3E2DD]",
    "outline-none",
    "placeholder:text-muted placeholder:text-[1.4rem]",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "aria-invalid:border-danger",
  ],
  {
    variants: {
      inputSize: {
        md: "h-[4.2rem] px-[1.5rem]",
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

const Input = ({
  inputSize = "md",
  error = false,
  className,
  type = "text",
  ...props
}: InputProps) => {
  return (
    <input
      className={cn(
        inputVariants({
          inputSize,
          error,
        }),
        className,
      )}
      type={type}
      aria-invalid={error || undefined}
      {...props}
    />
  );
};

export default Input;
