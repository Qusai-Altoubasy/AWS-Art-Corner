import {ReactNode} from "react";

interface ReportStatCardProps {
    icon: ReactNode;
    iconBg?: string;
    iconColor?: string;
    label: string;
    value: string | number;
    subLabel?: string;
    subValue?: string | number;
    className?: string;
}

export const ReportStatCard = ({
                                   icon,
                                   iconBg = "bg-indigo-500/15",
                                   iconColor = "text-indigo-300",
                                   label,
                                   value,
                                   subLabel,
                                   subValue,
                                   className = "",
                               }: ReportStatCardProps) => {
    return (
        <div
            className={`
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-5
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-500/20
                hover:bg-white/8
                hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]
                ${className}
            `}
        >
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                    {label}
                </p>
                <div
                    className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${iconBg}
                        ${iconColor}
                    `}
                >
                    {icon}
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <p className="text-3xl font-black tracking-tight text-white">
                    {value}
                </p>
                {subLabel && subValue !== undefined && (
                    <p className="text-xs text-white/40">
                        <span className="text-white/60 font-semibold">{subValue}</span>
                        {" "}{subLabel}
                    </p>
                )}
            </div>
        </div>
    );
};