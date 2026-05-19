import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;

  icon?: React.ReactNode;

  error?: string;
};

export const Input = ({
  label,
  icon,
  error,
  className = "",
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={props.id}
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-white/60
          "
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-white/40
            "
          >
            {icon}
          </div>
        )}

        <input
          {...props}
          className={`
            w-full
            rounded-2xl
            border
            border-white/10
            bg-white/5
            py-3.5
            pr-4
            text-sm
            text-white
            outline-none
            transition-all
            duration-200
            placeholder:text-white/30
            focus:border-indigo-500/60
            focus:bg-indigo-500/5
            focus:ring-4
            focus:ring-indigo-500/20
            ${icon ? "pl-12" : "pl-4"}
            ${error ? "border-red-500/60" : ""}
            ${className}
          `}
        />
      </div>

      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
};
