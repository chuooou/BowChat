import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  [
    "text-[1.3rem]",
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
        primary: "bg-primary text-background hover:bg-primary-hover",
        black: "bg-dark text-background hover:bg-dark-soft",
        gray: "bg-surface text-gray hover:bg-muted hover:text-background",
        white: "bg-background text-gray border border-muted hover:bg-dark-soft hover:text-white",
        green: "bg-[#DBEFEC] text-[#0B6E64] border-[#0B6E64] hover:opacity-90",
      },
      size: {
        sm: "h-[3.6rem] py-[1.1rem]",
        md: "h-[4.2rem] px-[1.3rem]",
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
    asChild?: boolean;
  };

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className,
  type = "button",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {isLoading ? "..." : children}
    </Comp>
  );
}

// * 버튼에 아이콘만 표시할 경우 aria-label="관심 경매" 속성 추가
