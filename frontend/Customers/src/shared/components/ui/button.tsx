import { ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;

  children: React.ReactNode;
};

export const Button = ({
  loading,
  children,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={loading}
      className={`
        gradient-primary
        shadow-primary
        flex
        items-center
        justify-center
        gap-2
        rounded-2xl
        py-3.5
        px-4
        text-sm
        font-semibold
        text-white
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:opacity-95
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      {loading ? (
        <>
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
