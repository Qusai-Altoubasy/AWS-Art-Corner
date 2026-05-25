import {ReactNode} from "react";

interface ReportChartCardProps {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
    height?: number;
}

export const ReportChartCard = ({
                                    title,
                                    description,
                                    children,
                                    className = "",
                                    height = 300,
                                }: ReportChartCardProps) => {
    return (
        <div
            className={`
                flex
                flex-col
                gap-5
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-6
                backdrop-blur-xl
                ${className}
            `}
        >
            <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-white">{title}</h3>
                {description && (
                    <p className="text-xs text-white/50">{description}</p>
                )}
            </div>

            <div style={{height}}>
                {children}
            </div>
        </div>
    );
};