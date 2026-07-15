type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button disabled={disabled || isLoading} data-variant={variant} data-size={size} {...props}>
      {isLoading ? "처리 중..." : children}
    </button>
  );
}
