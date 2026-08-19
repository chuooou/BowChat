import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/cn";

type CheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "type">;

const CheckBox = ({ className, disabled, ...props }: CheckboxProps) => {
  return (
    <label
      className={cn(
        "relative inline-flex cursor-pointer",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input type="checkbox" disabled={disabled} className="peer sr-only" {...props} />

      <span
        className={cn(
          "flex size-[1.9rem] items-center justify-center",
          "rounded-[0.6rem]",
          "bg-background border border-gray-300",
          "transition-colors",
          "peer-checked:border-dark",
          "peer-checked:bg-dark",
          "peer-focus-visible:ring-2",
          "peer-focus-visible:ring-primary",
          "peer-focus-visible:ring-offset-2",
          "[&_svg]:opacity-0",
          "peer-checked:[&_svg]:opacity-100",
        )}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="text-background size-[2.8rem] transition-opacity"
        >
          <path
            d="M5 12.5L9.5 17L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
};

export default CheckBox;
