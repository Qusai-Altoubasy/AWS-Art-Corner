import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div
      {...props}
      className={`
        glass
        rounded-3xl
        border
        border-white/10
        shadow-2xl
        ${className}
      `}
    >
      {children}
    </div>
  );
};

type CardContentProps = HTMLAttributes<HTMLDivElement>;

export function CardContent({
  children,
  className = "",
  ...props
}: CardContentProps) {
  return (
    <div
      {...props}
      className={`
        p-8
        ${className}
      `}
    >
      {children}
    </div>
  );
}
