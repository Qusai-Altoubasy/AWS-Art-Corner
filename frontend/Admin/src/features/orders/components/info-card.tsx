import { ReactNode } from "react";

interface InfoCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    className?: string;
    valueClassName?: string;
}

export const InfoCard = ({
                             icon,
                             label,
                             value,
                             className = "",
                             valueClassName = "",
                         }: InfoCardProps) => {
    return (
        <div
            className={`
        flex
        items-center
        gap-2
        rounded-2xl
        border
        border-white/8
        bg-white/5
        px-3
        py-2.5
        ${className}
      `}
        >
            {icon}

            <div className="min-w-0">
                <p className="text-muted text-[10px] uppercase tracking-[0.15em]">
                    {label}
                </p>

                <p
                    className={`
            truncate
            text-sm
            font-bold
            text-white
            ${valueClassName}
          `}
                >
                    {value}
                </p>
            </div>
        </div>
    );
};