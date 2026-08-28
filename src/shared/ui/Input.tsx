import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentPropsWithoutRef, useState } from "react";

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
    "bg-white",
  ],
  {
    variants: {
      inputSize: {
        md: "h-[4.2rem] px-[1.5rem]",
      },
    },
    defaultVariants: {
      inputSize: "md",
    },
  },
);

type InputProps = ComponentPropsWithoutRef<"input"> & VariantProps<typeof inputVariants>;

const Input = ({ inputSize, className, type = "text", ...props }: InputProps) => {
  return (
    <input
      className={cn(
        inputVariants({
          inputSize,
        }),
        className,
      )}
      type={type}
      {...props}
    />
  );
};

type PasswordInputProps = Omit<InputProps, "type">;

const PasswordInput = ({ className, ...props }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        {...props}
        type={isVisible ? "text" : "password"}
        className={cn("pr-[4.5rem]", className)}
      />

      <button
        type="button"
        aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
        aria-pressed={isVisible}
        onClick={() => setIsVisible((prev) => !prev)}
        className="text-muted absolute top-1/2 right-[1.5rem] -translate-y-1/2"
      >
        {isVisible ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M10.6 10.6A2 2 0 0 0 13.4 13.4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M9.9 4.24A10.7 10.7 0 0 1 12 4C17 4 20.5 8 22 12A15.4 15.4 0 0 1 19.6 15.8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.6 6.6C4.4 8 2.9 10 2 12C3.5 16 7 20 12 20C13.3 20 14.5 19.7 15.5 19.2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M2 12C3.5 8 7 4 12 4C17 4 20.5 8 22 12C20.5 16 17 20 12 20C7 20 3.5 16 2 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </button>
    </div>
  );
};

export { Input, PasswordInput };
