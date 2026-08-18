import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-button font-semibold transition-colors",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-primary",
    "focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-hover",
        black: "bg-dark text-white hover:bg-dark-soft",
        gray: "bg-gray text-gray hover:bg-dark-soft",
        white: "bg-white text-gray",
        danger: "bg-danger text-white hover:opacity-90",
      },
      size: {
        sm: "px-[1.6rem] py-[1.1rem] text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    loadingText?: string;
  };

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {isLoading ? "..." : children}
    </button>
  );
}

// * 버튼에 아이콘만 표시할 경우 아래와 같은 속성 추가
// <Button aria-label="관심 경매">
//   <HeartIcon aria-hidden="true" />
// </Button>
