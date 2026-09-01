import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/cn";

const inputVariants = cva(
  [
    "text-dark text-[1.4rem]",
    "w-full p-[1rem] min-h-[7rem]",
    "rounded-[1rem] border border-[#E3E2DD]",
    "outline-none",
    "placeholder:text-muted placeholder:text-[1.4rem]",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "aria-invalid:border-primary",
    "bg-white",
  ],
  {
    variants: {
      textareaSize: {
        md: "",
      },
    },
    defaultVariants: {
      textareaSize: "md",
    },
  },
);

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & VariantProps<typeof inputVariants>;

const Textarea = ({ textareaSize, className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        inputVariants({
          textareaSize,
        }),
        className,
      )}
      {...props}
    />
  );
};

export default Textarea;
