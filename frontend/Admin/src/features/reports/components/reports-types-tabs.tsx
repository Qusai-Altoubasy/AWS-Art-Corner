import { useCallback } from "react";
import { ReportsTypes } from "../types/ReportsTypes";
import {REPORT_TYPES, REPORT_TYPES_STYLES} from "../constants/ReportsTypesStyle.ts";

interface ReportTypesTabsProps {
    activeType: ReportsTypes;
    onTypeChange: (type: ReportsTypes) => void;
}

export const ReportTypesTabs = ({
                                    activeType,
                                    onTypeChange,
                                }: ReportTypesTabsProps) => {
    const handleClick = useCallback(
        (type: ReportsTypes) => {
            if (type !== activeType) {
                onTypeChange(type);
            }
        },
        [activeType, onTypeChange],
    );

    return (
        <div
            className="
        w-max
        mx-auto
        relative
        overflow-x-auto
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-2
        backdrop-blur-xl
        flex
        justify-center
      "
        >
            <div className="flex min-w-max gap-1 justify-center sm:min-w-0 sm:flex-wrap">
                {REPORT_TYPES.map((type) => {
                    const isActive = type === activeType;
                    const meta = REPORT_TYPES_STYLES[type];

                    return (
                        <button
                            key={type}
                            onClick={() => handleClick(type)}
                            className={`
                relative
                flex
                items-center
                gap-2
                rounded-2xl
                px-4
                py-2.5
                text-sm
                font-semibold
                transition-all
                duration-200
                whitespace-nowrap
                ${
                                isActive
                                    ? "gradient-primary shadow-primary text-white"
                                    : "text-white/60 hover:bg-white/8 hover:text-white"
                            }
              `}
                        >
              <span
                  className={`
                  h-2
                  w-2
                  rounded-full
                  shrink-0
                  transition-all
                  duration-200
                  ${isActive ? "bg-white/80" : meta.dotColor}
                `}
              />
                            {meta.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};